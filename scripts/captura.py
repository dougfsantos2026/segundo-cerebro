#!/usr/bin/env python3
"""Captura telas do site local para revisão visual.

    python3 scripts/captura.py                       # topo em 1440 e 390
    python3 scripts/captura.py --rolagem 2400        # captura já rolado
    python3 scripts/captura.py --completo            # página inteira, em fatias
    python3 scripts/captura.py --rota /demos/clinica

Saída em /opt/cursor/artifacts/kdiff-v5/.
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
SAIDA = os.environ.get("SAIDA", "/opt/cursor/artifacts/kdiff-v5")
PORTA = 9390


class Navegador:
    def __init__(self):
        self.perfil = "/tmp/chrome-captura"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "google-chrome",
                "--headless=new",
                f"--remote-debugging-port={PORTA}",
                "--remote-allow-origins=*",
                f"--user-data-dir={self.perfil}",
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
        self.erros = []

    def cmd(self, metodo, **params):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                if "error" in msg:
                    raise RuntimeError(f"{metodo}: {msg['error']}")
                return msg.get("result", {})
            if msg.get("method") == "Runtime.consoleAPICalled":
                if msg["params"].get("type") == "error":
                    self.erros.append(msg["params"])
            if msg.get("method") == "Runtime.exceptionThrown":
                self.erros.append(msg["params"])

    def js(self, expr):
        r = self.cmd(
            "Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True
        )
        return r.get("result", {}).get("value")

    def tela(self, caminho):
        r = self.cmd("Page.captureScreenshot", format="png")
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
    ap.add_argument("--rota", default="/")
    ap.add_argument("--rolagem", type=int, default=0)
    ap.add_argument("--completo", action="store_true")
    ap.add_argument("--larguras", default="1440,390")
    ap.add_argument("--prefixo", default="tela")
    args = ap.parse_args()

    os.makedirs(SAIDA, exist_ok=True)
    nav = Navegador()
    nav.cmd("Page.enable")
    nav.cmd("Runtime.enable")

    for largura in [int(x) for x in args.larguras.split(",")]:
        altura = 844 if largura < 500 else 900
        nav.cmd(
            "Emulation.setDeviceMetricsOverride",
            width=largura,
            height=altura,
            deviceScaleFactor=1,
            mobile=largura < 500,
        )
        nav.cmd("Page.navigate", url=BASE + args.rota)
        time.sleep(4.5)

        if args.completo:
            total = nav.js("document.body.scrollHeight")
            passo = altura
            for topo in range(0, total, passo):
                nav.js(f"window.scrollTo(0, {topo})")
                time.sleep(0.9)
                nome = f"{args.prefixo}-{largura}-{topo:05d}.png"
                nav.tela(os.path.join(SAIDA, nome))
            print(f"{largura}px: {total // passo + 1} fatias")
        else:
            if args.rolagem:
                nav.js(f"window.scrollTo(0, {args.rolagem})")
                time.sleep(1.4)
            nome = f"{args.prefixo}-{largura}.png"
            nav.tela(os.path.join(SAIDA, nome))
            print(f"{SAIDA}/{nome}")

    if nav.erros:
        print(f"\n{len(nav.erros)} erro(s) de console:")
        for e in nav.erros[:10]:
            print("  ", json.dumps(e)[:220])
    nav.fechar()
    return 0


if __name__ == "__main__":
    sys.exit(main())
