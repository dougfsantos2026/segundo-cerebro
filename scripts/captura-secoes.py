#!/usr/bin/env python3
"""Captura cada seção da home separadamente, para revisão visual."""

import base64
import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

largura = int(sys.argv[1]) if len(sys.argv) > 1 else 1440
SAIDA = f"/opt/cursor/artifacts/kdiff-v4/secoes-{largura}"
os.makedirs(SAIDA, exist_ok=True)

ud = f"/tmp/chrome-sec-{largura}"
subprocess.run(["rm", "-rf", ud], check=False)
os.makedirs(ud, exist_ok=True)
proc = subprocess.Popen(
    ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
     "--disable-dev-shm-usage", f"--user-data-dir={ud}",
     "--remote-debugging-port=9371", "--remote-allow-origins=*",
     "--hide-scrollbars", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(3)
abas = json.load(urllib.request.urlopen("http://127.0.0.1:9371/json"))
ws = websocket.create_connection(
    [a for a in abas if a["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
contador = 0


def call(metodo, params=None):
    global contador
    contador += 1
    ws.send(json.dumps({"id": contador, "method": metodo, "params": params or {}}))
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == contador:
            return r


def ev(expr, promessa=False):
    return call("Runtime.evaluate", {"expression": expr, "returnByValue": True,
                                     "awaitPromise": promessa})["result"]["result"].get("value")


call("Page.enable")
call("Emulation.setDeviceMetricsOverride",
     {"width": largura, "height": 1000, "deviceScaleFactor": 1,
      "mobile": largura < 768})
call("Page.navigate", {"url": "http://127.0.0.1:3500/"})
for _ in range(60):
    time.sleep(0.25)
    if ev("document.readyState") == "complete":
        break
time.sleep(1.5)

# Percorre a página para disparar todas as animações de entrada.
ev("""new Promise((ok) => {
  let y = 0;
  const passo = () => {
    y += window.innerHeight * 0.6;
    window.scrollTo(0, y);
    if (y < document.body.scrollHeight) setTimeout(passo, 80);
    else setTimeout(ok, 600);
  };
  passo();
})""", promessa=True)

blocos = json.loads(ev("""JSON.stringify(
  [...document.querySelectorAll('main > section, footer')].map((s, i) => {
    const r = s.getBoundingClientRect();
    return {
      i,
      nome: s.id || (s.tagName.toLowerCase() + '-' + i),
      topo: Math.round(r.top + window.scrollY),
      altura: Math.round(r.height),
    };
  }))"""))

for b in blocos:
    altura = min(b["altura"], 2400)
    call("Emulation.setDeviceMetricsOverride",
         {"width": largura, "height": altura, "deviceScaleFactor": 1,
          "mobile": largura < 768})
    ev(f"window.scrollTo(0, {b['topo']})")
    time.sleep(0.5)
    c = call("Page.captureScreenshot", {"format": "png"})
    nome = f"{SAIDA}/{b['i']:02d}-{b['nome']}.png"
    with open(nome, "wb") as f:
        f.write(base64.b64decode(c["result"]["data"]))
    print(f"{nome}  ({largura}x{altura})")

ws.close()
proc.kill()
