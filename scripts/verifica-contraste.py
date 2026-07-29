#!/usr/bin/env python3
"""Mede o contraste real de cada texto renderizado, seguindo a WCAG 2.1.

Percorre a página no navegador, resolve a cor de fundo efetiva de cada nó de
texto (subindo a árvore até achar um fundo opaco) e compara com a cor da
fonte. Texto grande usa o limite 3:1; o restante, 4.5:1.
"""

import json
import os
import subprocess
import time
import urllib.request

import websocket

PORTA = 9381
ud = "/tmp/chrome-contraste"
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


def call(metodo, params=None):
    global contador
    contador += 1
    ws.send(json.dumps({"id": contador, "method": metodo, "params": params or {}}))
    while True:
        r = json.loads(ws.recv())
        if r.get("id") == contador:
            return r


def ev(expr, promessa=False):
    r = call("Runtime.evaluate", {"expression": expr, "returnByValue": True,
                                  "awaitPromise": promessa})
    d = r.get("result", {}).get("exceptionDetails")
    if d:
        raise RuntimeError(json.dumps(d)[:400])
    return r["result"]["result"].get("value")


SCRIPT = r"""
(() => {
  const canal = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const lum = ([r, g, b]) =>
    0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
  const razao = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const rgba = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { c: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const sobrepor = (frente, alfa, fundo) =>
    frente.map((v, i) => v * alfa + fundo[i] * (1 - alfa));

  // Resolve o fundo efetivo empilhando as camadas semitransparentes.
  const fundoDe = (el) => {
    const camadas = [];
    let no = el;
    while (no) {
      const cs = getComputedStyle(no);
      const bg = rgba(cs.backgroundColor);
      if (bg && bg.a > 0) {
        camadas.push(bg);
        if (bg.a >= 0.999) break;
      }
      no = no.parentElement;
    }
    let cor = [255, 255, 255];
    for (let i = camadas.length - 1; i >= 0; i--) {
      cor = sobrepor(camadas[i].c, camadas[i].a, cor);
    }
    return cor;
  };

  const problemas = [];
  const visitados = new Set();
  document.querySelectorAll('body *').forEach((el) => {
    if (visitados.has(el)) return;
    const texto = [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent.trim())
      .join(' ')
      .trim();
    if (!texto) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    if (parseFloat(cs.opacity) < 0.5) return;
    if (el.closest('[aria-hidden="true"], [hidden], .sr-only-focusable')) return;

    const frente = rgba(cs.color);
    if (!frente) return;
    const fundo = fundoDe(el);

    const tamanho = parseFloat(cs.fontSize);
    const peso = parseInt(cs.fontWeight, 10) || 400;
    const grande = tamanho >= 24 || (tamanho >= 18.66 && peso >= 700);
    const minimo = grande ? 3 : 4.5;

    // Texto pintado por gradiente (background-clip: text) tem `color`
    // transparente: mede-se então a pior parada de cor do gradiente.
    let corTexto, valor;
    const recortaTexto = (cs.backgroundClip || cs.webkitBackgroundClip) === 'text';
    if (recortaTexto && frente.a === 0) {
      const paradas = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || [])
        .map(rgba)
        .filter(Boolean)
        .map((p) => (p.a < 1 ? sobrepor(p.c, p.a, fundo) : p.c));
      if (paradas.length === 0) return;
      valor = Math.min(...paradas.map((p) => razao(p, fundo)));
      corTexto = paradas[0];
    } else {
      corTexto = frente.a < 1 ? sobrepor(frente.c, frente.a, fundo) : frente.c;
      valor = razao(corTexto, fundo);
    }

    if (valor < minimo) {
      problemas.push({
        texto: texto.slice(0, 48),
        classe: (el.getAttribute('class') || '').slice(0, 70),
        cor: recortaTexto ? cs.backgroundImage.slice(0, 60) : cs.color,
        fundo: 'rgb(' + fundo.map(Math.round).join(',') + ')',
        tamanho: Math.round(tamanho),
        peso,
        razao: Math.round(valor * 100) / 100,
        minimo,
      });
    }
    visitados.add(el);
  });
  return problemas;
})()
"""

call("Emulation.setDeviceMetricsOverride",
     {"width": 1440, "height": 1000, "deviceScaleFactor": 1, "mobile": False})

total = 0
for caminho in ["/", "/politica-de-privacidade"]:
    call("Page.navigate", {"url": "http://127.0.0.1:3500" + caminho})
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
        else setTimeout(ok, 700);
      };
      passo();
    })""", promessa=True)
    # Abre todo o FAQ para medir também as respostas.
    ev("""document.querySelectorAll('[id^=faq-botao-]').forEach(b => {
      if (b.getAttribute('aria-expanded') === 'false') b.click();
    })""")
    time.sleep(0.6)

    problemas = ev(SCRIPT)
    print(f"\n=== {caminho} — {len(problemas)} problema(s) de contraste ===")
    for p in problemas:
        print(f"  {p['razao']}:1 (mín {p['minimo']}) {p['tamanho']}px/{p['peso']} "
              f"{p['cor']} sobre {p['fundo']}")
        print(f"     texto: {p['texto']!r}")
        print(f"     classe: {p['classe']}")
    total += len(problemas)

print(f"\nTOTAL: {total} problema(s)")
ws.close()
proc.kill()
