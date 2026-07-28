#!/usr/bin/env python3
"""Baixa vários candidatos por termo de busca e monta uma folha de contato,
para escolher a foto olhando antes de gravar no projeto.

    python3 scripts/escolhe-fotos.py advocacia="brazilian law firm office"

Grava em /tmp/candidatos/<rotulo>/ e gera /tmp/candidatos/<rotulo>.png.
Depois de escolher, `fixa-foto.py` move o candidato para o projeto.
"""

import json
import os
import subprocess
import sys
import time
import urllib.parse
import urllib.request

import websocket

PORTA = 9381
BASE = "/tmp/candidatos"
POR_TERMO = 8


class Navegador:
    def __init__(self):
        self.perfil = "/tmp/chrome-candidatos"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "xvfb-run",
                "-a",
                "--server-args=-screen 0 1400x1000x24",
                "google-chrome",
                f"--remote-debugging-port={PORTA}",
                "--remote-allow-origins=*",
                f"--user-data-dir={self.perfil}",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-blink-features=AutomationControlled",
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
            alvo["webSocketDebuggerUrl"], timeout=90, max_size=100 * 1024 * 1024
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
        return r.get("result", {}).get("value")

    def fechar(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.terminate()


COLETA = r"""
(() => {
  const vistos = new Set();
  const out = [];
  for (const fig of document.querySelectorAll('figure')) {
    const img = fig.querySelector('img[srcset*="images.unsplash.com/photo-"]');
    if (!img) continue;
    const m = (img.src || '').match(/photo-[\w-]+/);
    if (!m || vistos.has(m[0])) continue;
    vistos.add(m[0]);
    const link = fig.querySelector('a[href*="/photos/"]');
    const autor = fig.querySelector('a[href^="/@"]');
    out.push({
      id: m[0],
      pagina: link ? link.href : null,
      autor: autor ? autor.textContent.trim() : null,
      perfil: autor ? autor.href : null,
      alt: img.alt || '',
    });
  }
  return out;
})()
"""


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    os.makedirs(BASE, exist_ok=True)
    nav = Navegador()
    nav.cmd("Page.enable")
    nav.cmd("Runtime.enable")

    for arg in sys.argv[1:]:
        rotulo, _, termo = arg.partition("=")
        pasta = os.path.join(BASE, rotulo)
        subprocess.run(["rm", "-rf", pasta], check=False)
        os.makedirs(pasta, exist_ok=True)

        url = (
            "https://unsplash.com/s/photos/"
            + urllib.parse.quote(termo)
            + "?orientation=landscape"
        )
        nav.cmd("Page.navigate", url=url)
        achados = []
        for _ in range(20):
            time.sleep(1.5)
            achados = nav.js(COLETA) or []
            if len(achados) >= POR_TERMO:
                break
        achados = achados[:POR_TERMO]
        print(f"[{rotulo}] “{termo}” → {len(achados)} candidatos")

        meta = {}
        for i, c in enumerate(achados):
            alvo = os.path.join(pasta, f"{i:02d}.jpg")
            src = f"https://images.unsplash.com/{c['id']}?w=1000&q=80&fm=jpg&fit=max"
            try:
                req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=60) as r, open(alvo, "wb") as f:
                    f.write(r.read())
            except Exception as e:
                print(f"  {i:02d} falhou: {e}")
                continue
            meta[f"{i:02d}"] = c
            print(f"  {i:02d} {c['alt'][:70]}")

        with open(os.path.join(pasta, "meta.json"), "w") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

        # Folha de contato numerada, para escolher pelo índice.
        rotulados = []
        for i in sorted(meta):
            src = os.path.join(pasta, f"{i}.jpg")
            dst = os.path.join(pasta, f"rot-{i}.png")
            subprocess.run(
                [
                    "convert", src, "-resize", "420x280^", "-gravity", "center",
                    "-extent", "420x280",
                    "-gravity", "northwest", "-fill", "yellow", "-undercolor", "#000000c0",
                    "-pointsize", "40", "-annotate", "+8+8", i, dst,
                ],
                check=True,
            )
            rotulados.append(dst)
        if rotulados:
            subprocess.run(
                ["montage", *rotulados, "-tile", "4x", "-geometry", "+5+5",
                 "-background", "#111", os.path.join(BASE, f"{rotulo}.png")],
                check=True,
            )
            print(f"  folha: {BASE}/{rotulo}.png")

    nav.fechar()
    return 0


if __name__ == "__main__":
    sys.exit(main())
