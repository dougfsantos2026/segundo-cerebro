#!/usr/bin/env python3
"""Percorre a home em viewport de celular capturando tela a tela."""

import base64
import json
import os
import subprocess
import time
import urllib.request

import websocket

L, A = 390, 844
SAIDA = "/opt/cursor/artifacts/kdiff-v4/filmstrip-390"
os.makedirs(SAIDA, exist_ok=True)
ud = "/tmp/chrome-film"
subprocess.run(["rm", "-rf", ud], check=False)
os.makedirs(ud, exist_ok=True)
proc = subprocess.Popen(
    ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
     "--disable-dev-shm-usage", f"--user-data-dir={ud}",
     "--remote-debugging-port=9399", "--remote-allow-origins=*",
     "--hide-scrollbars", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(3)
abas = json.load(urllib.request.urlopen("http://127.0.0.1:9399/json"))
ws = websocket.create_connection(
    [a for a in abas if a["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
n = 0


def call(m, p=None):
    global n
    n += 1
    ws.send(json.dumps({"id": n, "method": m, "params": p or {}}))
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == n:
            return r


def ev(e, promessa=False):
    return call("Runtime.evaluate", {"expression": e, "returnByValue": True,
                                     "awaitPromise": promessa})["result"]["result"].get("value")


call("Page.enable")
call("Emulation.setDeviceMetricsOverride",
     {"width": L, "height": A, "deviceScaleFactor": 1, "mobile": True})
call("Page.navigate", {"url": "http://127.0.0.1:3500/"})
for _ in range(60):
    time.sleep(0.25)
    if ev("document.readyState") == "complete":
        break
time.sleep(1.5)

ev("""new Promise((ok) => {
  let y = 0;
  const passo = () => {
    y += window.innerHeight * 0.7;
    window.scrollTo(0, y);
    if (y < document.body.scrollHeight) setTimeout(passo, 70);
    else { window.scrollTo(0, 0); setTimeout(ok, 700); }
  };
  passo();
})""", promessa=True)

altura_total = ev("document.body.scrollHeight")
passo = int(A * 0.9)
i = 0
y = 0
while y < altura_total and i < 40:
    ev(f"window.scrollTo(0, {y})")
    time.sleep(0.35)
    c = call("Page.captureScreenshot", {"format": "png"})
    with open(f"{SAIDA}/{i:02d}.png", "wb") as f:
        f.write(base64.b64decode(c["result"]["data"]))
    i += 1
    y += passo

print(f"{i} telas em {SAIDA} (página tem {altura_total}px)")
ws.close()
proc.kill()
