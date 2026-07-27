#!/usr/bin/env python3
"""Verifica navegação por teclado, foco visível, semântica e o comportamento
com `prefers-reduced-motion: reduce`."""

import json
import os
import subprocess
import time
import urllib.request

import websocket

PORTA = 9391
falhas = []
ud = "/tmp/chrome-a11y"
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
        raise RuntimeError(json.dumps(d)[:300])
    return r["result"]["result"].get("value")


def abrir(caminho="/"):
    call("Page.navigate", {"url": "http://127.0.0.1:3500" + caminho})
    for _ in range(60):
        time.sleep(0.25)
        if ev("document.readyState") == "complete":
            break
    time.sleep(1.5)


def tab():
    for tipo in ("keyDown", "keyUp"):
        call("Input.dispatchKeyEvent", {"type": tipo, "key": "Tab", "code": "Tab",
                                        "windowsVirtualKeyCode": 9,
                                        "nativeVirtualKeyCode": 9})
    time.sleep(0.08)


def checar(condicao, descricao):
    print(("  OK    " if condicao else "  FALHA ") + descricao)
    if not condicao:
        falhas.append(descricao)


call("Emulation.setDeviceMetricsOverride",
     {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})

# ------------------------------------------------------------ estrutura e ARIA
print("\nSemântica e estrutura")
abrir("/")
checar(ev("document.documentElement.lang") == "pt-BR", "html tem lang=pt-BR")
checar(ev("document.querySelectorAll('h1').length") == 1, "existe exatamente um h1")

hierarquia = ev("""(() => {
  const nomes = [...document.querySelectorAll('h1,h2,h3,h4')]
    .map(h => +h.tagName[1]);
  const saltos = [];
  for (let i = 1; i < nomes.length; i++) {
    if (nomes[i] - nomes[i - 1] > 1) saltos.push(nomes[i - 1] + '->' + nomes[i]);
  }
  return saltos;
})()""")
checar(len(hierarquia) == 0, f"nenhum salto de nível de título ({hierarquia})")

checar(ev("""[...document.images].every(i => i.hasAttribute('alt'))"""),
       "toda imagem tem atributo alt")
checar(ev("""[...document.querySelectorAll('a')].every(a =>
         (a.textContent || '').trim().length > 0
         || a.getAttribute('aria-label')
         || a.querySelector('[class*=sr-only]'))"""),
       "todo link tem nome acessível")
checar(ev("""[...document.querySelectorAll('button')].every(b =>
         (b.textContent || '').trim().length > 0 || b.getAttribute('aria-label'))"""),
       "todo botão tem nome acessível")
checar(ev("""document.querySelectorAll('main').length === 1
         && !!document.querySelector('header') && !!document.querySelector('footer')"""),
       "landmarks main, header e footer presentes")
checar(ev("""[...document.querySelectorAll('nav')].every(n =>
         n.getAttribute('aria-label') || n.getAttribute('aria-labelledby'))"""),
       "toda nav é rotulada")
checar(ev("""document.querySelectorAll('script[type="application/ld+json"]').length >= 2"""),
       "dados estruturados presentes (empresa + FAQ)")

# --------------------------------------------------------------- foco visível
print("\nNavegação por teclado")
ev("document.body.focus()")
primeiro = None
sem_indicador = []
for i in range(14):
    tab()
    dados = ev("""(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        texto: (el.textContent || '').trim().slice(0, 30),
        outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
        temIndicador: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
      };
    })()""")
    if dados is None:
        continue
    if primeiro is None:
        primeiro = dados
    if not dados["temIndicador"]:
        sem_indicador.append(f"{dados['tag']}:{dados['texto']}")

checar(primeiro is not None and "conteúdo" in primeiro["texto"].lower(),
       f"primeiro Tab chega no atalho 'pular para o conteúdo' ({primeiro})")
checar(len(sem_indicador) == 0,
       f"todo elemento focado mostra contorno visível ({sem_indicador})")

alvo = ev("""(() => {
  const a = document.querySelector('a[href="#conteudo"]');
  return !!a && !!document.getElementById('conteudo');
})()""")
checar(alvo, "o atalho aponta para um destino existente")

# ------------------------------------------------------------- movimento reduzido
print("\nprefers-reduced-motion: reduce")
call("Emulation.setEmulatedMedia",
     {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
abrir("/")
checar(ev("window.matchMedia('(prefers-reduced-motion: reduce)').matches") is True,
       "mídia emulada corretamente")
opacidades = ev("""(() => {
  const alvos = [...document.querySelectorAll('#servicos li, #projetos li, #sobre p')];
  return alvos.filter(el => parseFloat(getComputedStyle(el).opacity) < 0.99).length;
})()""")
checar(opacidades == 0,
       f"nenhum conteúdo fica invisível sem animação ({opacidades} escondido(s))")
transformados = ev("""(() => {
  const alvos = [...document.querySelectorAll('#servicos li, #projetos li')];
  return alvos.filter(el => {
    const t = getComputedStyle(el).transform;
    return t && t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
  }).length;
})()""")
checar(transformados == 0, f"nenhum deslocamento residual ({transformados})")
checar(ev("getComputedStyle(document.documentElement).scrollBehavior") == "auto",
       "rolagem suave é desligada")

print("\nRESULTADO:", "TUDO OK" if not falhas else f"{len(falhas)} FALHA(S)")
for f in falhas:
    print("  -", f)

ws.close()
proc.kill()
