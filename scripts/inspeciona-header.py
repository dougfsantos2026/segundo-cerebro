#!/usr/bin/env python3
"""Inspeciona o cabeçalho em larguras específicas."""

import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

largura = int(sys.argv[1]) if len(sys.argv) > 1 else 375
ud = f"/tmp/chrome-header-{largura}"
subprocess.run(["rm", "-rf", ud], check=False)
os.makedirs(ud, exist_ok=True)
proc = subprocess.Popen(
    ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
     "--disable-dev-shm-usage", f"--user-data-dir={ud}",
     "--remote-debugging-port=9351", "--remote-allow-origins=*",
     "--hide-scrollbars", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(3)
abas = json.load(urllib.request.urlopen("http://127.0.0.1:9351/json"))
ws = websocket.create_connection(
    [a for a in abas if a["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=30)
contador = 0


def call(metodo, params=None):
    global contador
    contador += 1
    ws.send(json.dumps({"id": contador, "method": metodo, "params": params or {}}))
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == contador:
            return r


def ev(expr):
    return call("Runtime.evaluate",
                {"expression": expr, "returnByValue": True})["result"]["result"].get("value")


call("Emulation.setDeviceMetricsOverride",
     {"width": largura, "height": 900, "deviceScaleFactor": 1, "mobile": largura < 768})
call("Page.navigate", {"url": "http://127.0.0.1:3500/"})
time.sleep(4)

print(f"largura emulada: {largura}")
print("innerWidth:", ev("window.innerWidth"))
print("matchMedia(min-width:640px):", ev("window.matchMedia('(min-width: 640px)').matches"))
print("matchMedia(min-width:1024px):", ev("window.matchMedia('(min-width: 1024px)').matches"))
print("\nelementos do cabeçalho realmente visíveis:")
print(ev("""JSON.stringify([...document.querySelectorAll('header a, header button, header nav')]
  .filter(el => el.getBoundingClientRect().width > 0)
  .map(el => ({
    tag: el.tagName.toLowerCase(),
    classe: (el.getAttribute('class')||''),
    largura: Math.round(el.getBoundingClientRect().width),
    texto: (el.textContent||'').trim().slice(0,26),
  })), null, 1)"""))
import base64
captura = call("Page.captureScreenshot", {"format": "png"})
destino = f"/opt/cursor/artifacts/kdiff-v4/header-{largura}.png"
with open(destino, "wb") as f:
    f.write(base64.b64decode(captura["result"]["data"]))
print("\ncaptura:", destino, "bytes:", os.path.getsize(destino))

ws.close()
proc.kill()
