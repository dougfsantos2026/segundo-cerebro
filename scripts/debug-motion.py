#!/usr/bin/env python3
"""Inspeciona o que o Reveal renderiza com prefers-reduced-motion: reduce."""

import json
import os
import subprocess
import time
import urllib.request

import websocket

PORTA = 9395
ud = "/tmp/chrome-motion"
subprocess.run(["rm", "-rf", ud], check=False)
os.makedirs(ud, exist_ok=True)
proc = subprocess.Popen(
    ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
     "--disable-dev-shm-usage", f"--user-data-dir={ud}",
     f"--remote-debugging-port={PORTA}", "--remote-allow-origins=*",
     "--hide-scrollbars", "about:blank"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(3)
abas = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORTA}/json"))
ws = websocket.create_connection(
    [a for a in abas if a["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=60)
contador = 0


def call(m, p=None):
    global contador
    contador += 1
    ws.send(json.dumps({"id": contador, "method": m, "params": p or {}}))
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == contador:
            return r


def ev(e):
    r = call("Runtime.evaluate", {"expression": e, "returnByValue": True})
    d = r.get("result", {}).get("exceptionDetails")
    if d:
        raise RuntimeError(json.dumps(d)[:300])
    return r["result"]["result"].get("value")


call("Emulation.setDeviceMetricsOverride",
     {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})
call("Emulation.setEmulatedMedia",
     {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
call("Page.navigate", {"url": "http://127.0.0.1:3500/"})
for _ in range(60):
    time.sleep(0.25)
    if ev("document.readyState") == "complete":
        break
time.sleep(2.5)

print("matchMedia reduce:", ev("window.matchMedia('(prefers-reduced-motion: reduce)').matches"))
print("\nprimeiros 3 <li> de #servicos:")
print(ev("""JSON.stringify([...document.querySelectorAll('#servicos li')].slice(0,3).map(el => ({
  styleInline: el.getAttribute('style'),
  opacity: getComputedStyle(el).opacity,
  transform: getComputedStyle(el).transform,
})), null, 1)"""))

print("\nprimeiros 2 <li> de #projetos:")
print(ev("""JSON.stringify([...document.querySelectorAll('#projetos li')].slice(0,2).map(el => ({
  styleInline: el.getAttribute('style'),
  opacity: getComputedStyle(el).opacity,
})), null, 1)"""))

print("\nheading do #sobre (Reveal via SectionHeading):")
print(ev("""JSON.stringify((() => {
  const el = document.querySelector('#sobre p');
  return { styleInline: el.getAttribute('style'), opacity: getComputedStyle(el).opacity };
})(), null, 1)"""))

ws.close()
proc.kill()
