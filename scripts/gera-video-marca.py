#!/usr/bin/env python3
"""Grava a cena da marca como MP4, quadro a quadro.

A cena é feita de camadas de HTML animadas por CSS. Para virar vídeo ela é
aberta em `/render/marca`, sem o recorte da letra, e o laço é percorrido à mão:
as animações são pausadas e o relógio delas é posicionado em cada quadro antes
da captura. Gravar assistindo em tempo real produziria quadros irregulares,
porque a captura não acompanha 25 por segundo; posicionando o relógio, cada
quadro cai exatamente onde deveria e o laço fecha sem tranco.

Precisa do servidor de desenvolvimento no ar, porque a rota não responde em
produção:

    cd site && npm run dev -- -p 3600
    python3 scripts/gera-video-marca.py

Sai em site/public/videos/marca-cena.mp4, com o pôster ao lado.
"""

import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request

import websocket

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.environ.get("BASE_URL", "http://127.0.0.1:3600")
PORTA = 9396
TRABALHO = "/tmp/video-marca"

CICLO = 8000  # duração do laço, em milissegundos
FPS = 25

# As animações do laço. As outras da página não entram: têm outra duração e,
# congeladas junto, apareceriam num estado que não existe no uso real.
DO_LACO = (
    "girar-para-perfil",
    "girar-para-costas",
    "acender-aurora",
    "aproximar-cena",
    "cintilar",
    "subir-esfera",
    "respirar",
    "aurora-deriva",
)


class Navegador:
    def __init__(self):
        perfil = "/tmp/chrome-video-marca"
        subprocess.run(["rm", "-rf", perfil], check=False)
        os.makedirs(perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "google-chrome",
                "--headless=new",
                f"--remote-debugging-port={PORTA}",
                "--remote-allow-origins=*",
                f"--user-data-dir={perfil}",
                "--no-sandbox",
                "--disable-gpu",
                "--hide-scrollbars",
                "--force-device-scale-factor=1",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        alvo = None
        for _ in range(60):
            try:
                dados = json.load(
                    urllib.request.urlopen(f"http://127.0.0.1:{PORTA}/json")
                )
                alvo = next(a for a in dados if a["type"] == "page")
                break
            except Exception:
                time.sleep(0.5)
        if not alvo:
            raise RuntimeError("Chrome não subiu")
        self.ws = websocket.create_connection(
            alvo["webSocketDebuggerUrl"], timeout=90, max_size=200 * 1024 * 1024
        )
        self.id = 0

    def cmd(self, metodo, **params):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                if "error" in msg:
                    raise RuntimeError(f"{metodo}: {msg['error']}")
                return msg.get("result", {})

    def js(self, expr):
        r = self.cmd(
            "Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True
        )
        if "exceptionDetails" in r:
            raise RuntimeError(json.dumps(r["exceptionDetails"])[:400])
        return r.get("result", {}).get("value")

    def recorte(self, caminho, caixa):
        r = self.cmd(
            "Page.captureScreenshot",
            format="jpeg",
            quality=88,
            captureBeyondViewport=True,
            clip={**caixa, "scale": 1},
        )
        with open(caminho, "wb") as f:
            f.write(base64.b64decode(r["data"]))

    def fechar(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.terminate()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=int, default=FPS)
    ap.add_argument("--crf", type=int, default=23, help="menor = melhor e maior")
    args = ap.parse_args()

    for prog in ("ffmpeg", "google-chrome"):
        if not shutil.which(prog):
            print(f"faltando: {prog}")
            return 1

    quadros = round(CICLO * args.fps / 1000)
    saida_dir = os.path.join(RAIZ, "site", "public", "videos")
    os.makedirs(saida_dir, exist_ok=True)
    subprocess.run(["rm", "-rf", TRABALHO], check=False)
    os.makedirs(TRABALHO, exist_ok=True)

    nav = Navegador()
    try:
        nav.cmd("Page.enable")
        nav.cmd("Runtime.enable")
        nav.cmd(
            "Emulation.setDeviceMetricsOverride",
            width=1400,
            height=1400,
            deviceScaleFactor=1,
            mobile=False,
        )
        nav.cmd("Page.navigate", url=BASE + "/render/marca")
        time.sleep(5)

        caixa = nav.js(
            """(() => {
              const alvo = document.querySelector('[data-cena-render]');
              if (!alvo) return null;
              const r = alvo.getBoundingClientRect();
              return { x: r.x, y: r.y, width: r.width, height: r.height };
            })()"""
        )
        if not caixa:
            print("cena não encontrada — o servidor de desenvolvimento está no ar?")
            print(f"esperado em {BASE}/render/marca")
            return 1

        # O H.264 exige lados pares; a rota já entrega pares, mas arredondar
        # aqui evita um erro obscuro do ffmpeg se alguém mudar a escala.
        caixa = {k: (round(v) // 2) * 2 if k in ("width", "height") else round(v)
                 for k, v in caixa.items()}
        print(f"cena {caixa['width']}x{caixa['height']}, {quadros} quadros", flush=True)

        nomes = json.dumps(list(DO_LACO))
        total = nav.js(
            f"""(() => {{
              const nomes = {nomes};
              return document.getAnimations().filter(
                (a) => a.animationName && nomes.includes(a.animationName)
              ).length;
            }})()"""
        )
        if not total:
            print("nenhuma animação do laço encontrada")
            return 1
        print(f"{total} animações do laço detectadas")

        def posicionar_laco(t_ms: float) -> None:
            # Não guarda referências em `window`: o Next em modo dev pode
            # recarregar a página no meio da gravação e apagar o array.
            nav.js(
                f"""(() => {{
              const nomes = {nomes};
              document.getAnimations()
                .filter((a) => a.animationName && nomes.includes(a.animationName))
                .forEach((a) => {{
                  a.pause();
                  a.currentTime = {t_ms};
                }});
            }})()"""
            )

        for i in range(quadros):
            # O último quadro não repete o primeiro: em laço ele seria exibido
            # duas vezes seguidas e daria um soluço a cada volta.
            t = CICLO * i / quadros
            posicionar_laco(t)
            time.sleep(0.06)
            nav.recorte(os.path.join(TRABALHO, f"q-{i:04d}.jpg"), caixa)
            if i % 25 == 0:
                print(f"  {i}/{quadros}")
    finally:
        nav.fechar()

    mp4 = os.path.join(saida_dir, "marca-cena.mp4")
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error",
            "-framerate", str(args.fps),
            "-i", os.path.join(TRABALHO, "q-%04d.jpg"),
            "-c:v", "libx264",
            "-preset", "veryslow",
            "-crf", str(args.crf),
            # yuv420p é o que todo navegador e celular decodifica; sem isso o
            # ffmpeg escolhe yuv444p e o Safari não abre o arquivo.
            "-pix_fmt", "yuv420p",
            "-an",
            "-movflags", "+faststart",
            mp4,
        ],
        check=True,
    )

    poster = os.path.join(RAIZ, "site", "public", "images", "marca-cena-poster.webp")
    primeiro = os.path.join(TRABALHO, "q-0000.jpg")
    subprocess.run(
        ["convert", primeiro,
         "-strip", "-quality", "82", "-define", "webp:method=6", poster],
        check=True,
    )

    print(f"{mp4}  {os.path.getsize(mp4) // 1024}KB")
    print(f"{poster}  {os.path.getsize(poster) // 1024}KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
