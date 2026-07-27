#!/usr/bin/env python3
"""Isola qual parte do layout impede a página de encolher até 320px."""

import json
import os
import subprocess
import time
import urllib.request

import websocket

ud = "/tmp/chrome-diag"
subprocess.run(["rm", "-rf", ud], check=False)
os.makedirs(ud, exist_ok=True)
proc = subprocess.Popen(
    [
        "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
        "--disable-dev-shm-usage", f"--user-data-dir={ud}",
        "--remote-debugging-port=9347", "--remote-allow-origins=*",
        "--hide-scrollbars", "about:blank",
    ],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(3)
abas = json.load(urllib.request.urlopen("http://127.0.0.1:9347/json"))
ws = websocket.create_connection(
    [a for a in abas if a["type"] == "page"][0]["webSocketDebuggerUrl"], timeout=30
)
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
    r = call("Runtime.evaluate", {"expression": expr, "returnByValue": True})
    return r["result"]["result"].get("value")


call("Emulation.setDeviceMetricsOverride",
     {"width": 320, "height": 900, "deviceScaleFactor": 1, "mobile": False})
call("Page.navigate", {"url": "http://127.0.0.1:3500/"})
time.sleep(4)

print("largura do documento (alvo 320):", ev("document.documentElement.scrollWidth"))

print("\nLargura mínima de cada seção:")
print(ev("""(() => {
  const saida = [];
  document.querySelectorAll('main > section, header, footer').forEach((s) => {
    const antes = s.getAttribute('style') || '';
    s.style.width = 'min-content';
    saida.push('  ' + (s.id || s.className.split(' ')[0] || s.tagName.toLowerCase())
      + ' = ' + Math.round(s.getBoundingClientRect().width));
    s.setAttribute('style', antes);
  });
  return saida.join('\\n');
})()"""))

testes = {
    "sem white-space:nowrap": "*{white-space:normal !important}",
    "sem selects": "select{display:none !important}",
    "sem rodapé": "footer{display:none !important}",
    "sem cabeçalho": "header{display:none !important}",
    "com quebra de palavra": "*{word-break:break-word !important}",
}
print("\nExperimentos (largura resultante do documento):")
for nome, css in testes.items():
    largura = ev("""(() => {
      const st = document.createElement('style');
      st.textContent = %s;
      document.head.appendChild(st);
      const w = document.documentElement.scrollWidth;
      st.remove();
      return w;
    })()""" % json.dumps(css))
    print(f"  {nome}: {largura}")

ws.close()
proc.kill()
