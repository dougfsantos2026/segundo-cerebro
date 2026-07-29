#!/usr/bin/env python3
"""Fotografa a cena da marca em vários pontos do laço de 8s.

As animações da marca são de CSS puro, então não dá para revisá-las por uma
captura só: cada tela mostra um instante escolhido pelo acaso do carregamento.
Aqui as animações são pausadas e o relógio delas é movido à mão, quadro a
quadro, o que torna o ciclo inteiro visível e comparável entre execuções.

    python3 scripts/amostra-cena.py
    python3 scripts/amostra-cena.py --quadros 16 --largura 1440

Sai uma tira em /opt/cursor/artifacts/cena/tira-marca.png.
"""

import argparse
import base64
import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

BASE = os.environ.get("BASE_URL", "http://127.0.0.1:3500")
SAIDA = os.environ.get("SAIDA", "/opt/cursor/artifacts/cena")
PORTA = 9394
CICLO = 8000  # duração do laço, em milissegundos

# Só as animações do laço entram na amostragem. As de entrada, de rolagem e as
# do mockup têm outra duração e, se fossem congeladas junto, apareceriam presas
# num estado intermediário que não existe no uso real.
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
        perfil = "/tmp/chrome-cena"
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
                "--force-device-scale-factor=2",
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

    def recorte(self, caminho, caixa, escala):
        r = self.cmd(
            "Page.captureScreenshot",
            format="png",
            clip={
                "x": caixa["x"],
                "y": caixa["y"],
                "width": caixa["width"],
                "height": caixa["height"],
                "scale": escala,
            },
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
    ap.add_argument("--quadros", type=int, default=8)
    ap.add_argument("--largura", type=int, default=1440)
    ap.add_argument("--prefixo", default="marca")
    args = ap.parse_args()

    os.makedirs(SAIDA, exist_ok=True)
    nav = Navegador()
    nav.cmd("Page.enable")
    nav.cmd("Runtime.enable")
    nav.cmd(
        "Emulation.setDeviceMetricsOverride",
        width=args.largura,
        height=900,
        deviceScaleFactor=1,
        mobile=args.largura < 500,
    )
    nav.cmd("Page.navigate", url=BASE + "/")
    time.sleep(4.5)

    nomes = json.dumps(list(DO_LACO))
    total = nav.js(
        f"""(() => {{
          const nomes = {nomes};
          window.__laco = document.getAnimations().filter(
            (a) => a.animationName && nomes.includes(a.animationName)
          );
          window.__laco.forEach((a) => a.pause());
          return window.__laco.length;
        }})()"""
    )
    if not total:
        print("nenhuma animação do laço encontrada — o recorte foi renderizado?")
        nav.fechar()
        return 1
    print(f"{total} animações do laço pausadas")

    # A marca do topo é a única grande o bastante para revisão; a do rodapé
    # entra a 7% de opacidade e não mostraria nada.
    caixa = nav.js(
        """(() => {
          const alvo = document.querySelector('[data-marca-cena]');
          if (!alvo) return null;
          const r = alvo.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        })()"""
    )
    if not caixa:
        print("marca não encontrada na página")
        nav.fechar()
        return 1

    arquivos = []
    for i in range(args.quadros):
        t = round(CICLO * i / args.quadros)
        nav.js(f"window.__laco.forEach((a) => (a.currentTime = {t}));")
        time.sleep(0.35)
        nome = os.path.join(SAIDA, f"{args.prefixo}-{t:04d}.png")
        nav.recorte(nome, caixa, 2)
        arquivos.append(nome)
        print(f"  {t}ms")

    tira = os.path.join(SAIDA, f"tira-{args.prefixo}.png")
    colunas = min(args.quadros, 8)
    subprocess.run(
        ["montage", *arquivos, "-tile", f"{colunas}x", "-geometry", "+3+3",
         "-background", "#0b1020", "-resize", "x420", tira],
        check=True,
    )
    print(tira)
    nav.fechar()
    return 0


if __name__ == "__main__":
    sys.exit(main())
