#!/usr/bin/env python3
"""Verifica o site em várias larguras: rolagem horizontal, overflow de
elementos, erros de console e captura de tela."""

import base64
import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

BASE = os.environ.get("BASE_URL", "http://127.0.0.1:3500")
SAIDA = os.environ.get("SAIDA", "/opt/cursor/artifacts/kdiff-v4")
LARGURAS = [320, 375, 430, 768, 1024, 1440, 1920]
PORTA_CDP = 9333

os.makedirs(SAIDA, exist_ok=True)


class Navegador:
    def __init__(self, largura, altura):
        self.perfil = f"/tmp/chrome-verifica-{largura}"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "google-chrome",
                "--headless=new",
                "--disable-gpu",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                f"--user-data-dir={self.perfil}",
                f"--remote-debugging-port={PORTA_CDP}",
                "--remote-allow-origins=*",
                f"--window-size={largura},{altura}",
                "--hide-scrollbars",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        self.ws = None
        for _ in range(40):
            time.sleep(0.25)
            try:
                abas = json.load(
                    urllib.request.urlopen(f"http://127.0.0.1:{PORTA_CDP}/json")
                )
                alvo = [a for a in abas if a.get("type") == "page"]
                if alvo:
                    self.ws = websocket.create_connection(
                        alvo[0]["webSocketDebuggerUrl"], timeout=30
                    )
                    break
            except Exception:
                continue
        if self.ws is None:
            raise RuntimeError("Chrome não respondeu no CDP")
        self.id = 0
        self.eventos = []

    def chamar(self, metodo, params=None):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": metodo, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                return msg
            if "method" in msg:
                self.eventos.append(msg)

    def drenar(self, segundos):
        fim = time.time() + segundos
        self.ws.settimeout(0.4)
        while time.time() < fim:
            try:
                msg = json.loads(self.ws.recv())
                if "method" in msg:
                    self.eventos.append(msg)
            except Exception:
                pass
        self.ws.settimeout(30)

    def fechar(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.kill()
        self.proc.wait(timeout=10)


AUDITORIA = """
(() => {
  const doc = document.documentElement;
  const larguraJanela = window.innerWidth;

  // Um elemento só estoura de verdade se nenhum ancestral o recortar.
  const recortadoPorAncestral = (el, r) => {
    let pai = el.parentElement;
    while (pai && pai !== document.body) {
      const cs = getComputedStyle(pai);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        const pr = pai.getBoundingClientRect();
        if (r.right > pr.right - 1 || r.left < pr.left + 1) return true;
      }
      pai = pai.parentElement;
    }
    return false;
  };

  const invisivel = (el) => {
    if (el.closest('[aria-hidden="true"]')) return true;
    if (el.closest('[hidden]')) return true;
    const cs = getComputedStyle(el);
    return cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0';
  };

  const estouros = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right <= larguraJanela + 1.5 && r.left >= -1.5) return;
    if (getComputedStyle(el).position === 'fixed') return;
    if (invisivel(el)) return;
    if (recortadoPorAncestral(el, r)) return;
    estouros.push({
      tag: el.tagName.toLowerCase(),
      classe: (el.getAttribute('class') || '').slice(0, 80),
      esquerda: Math.round(r.left),
      direita: Math.round(r.right),
    });
  });

  // Controles interativos precisam estar inteiramente acessíveis na tela.
  const controles = [...document.querySelectorAll('a,button,input,select,textarea')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return false;
      if (r.right <= larguraJanela + 1.5 && r.left >= -1.5) return false;
      return !invisivel(el) && !recortadoPorAncestral(el, r);
    })
    .map((el) => el.tagName.toLowerCase() + ':' + (el.textContent || '').trim().slice(0, 30));

  // Texto que transborda a própria caixa (indício de corte).
  const textoCortado = [...document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span')]
    .filter((el) => {
      if (invisivel(el)) return false;
      const cs = getComputedStyle(el);
      if (cs.overflow === 'hidden' || cs.textOverflow === 'ellipsis') return false;
      return el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0;
    })
    .map((el) => el.tagName.toLowerCase() + ':' + (el.textContent || '').trim().slice(0, 40));

  return {
    larguraJanela,
    larguraDocumento: doc.scrollWidth,
    rolagemHorizontal: doc.scrollWidth > larguraJanela + 1,
    totalEstouros: estouros.length,
    estouros: estouros.slice(0, 8),
    controlesCortados: controles.slice(0, 8),
    textoCortado: textoCortado.slice(0, 6),
    h1: document.querySelectorAll('h1').length,
    imagensSemAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    titulo: document.title,
  };
})()
"""


def testar(caminho, nome, largura, altura=900, rolar=True):
    nav = Navegador(largura, altura)
    resultado = {"largura": largura, "pagina": nome}
    try:
        nav.chamar("Page.enable")
        nav.chamar("Runtime.enable")
        nav.chamar("Log.enable")
        nav.chamar("Network.enable")
        nav.chamar("Emulation.setDeviceMetricsOverride", {
            "width": largura, "height": altura,
            "deviceScaleFactor": 1, "mobile": largura < 768,
        })
        nav.chamar("Page.navigate", {"url": BASE + caminho})

        for _ in range(60):
            time.sleep(0.25)
            r = nav.chamar("Runtime.evaluate",
                           {"expression": "document.readyState", "returnByValue": True})
            if r["result"]["result"]["value"] == "complete":
                break
        nav.drenar(1.5)

        if rolar:
            # Percorre a página para disparar as animações de entrada e o lazy load.
            nav.chamar("Runtime.evaluate", {"expression": """
                new Promise((ok) => {
                  let y = 0;
                  const passo = () => {
                    y += window.innerHeight * 0.8;
                    window.scrollTo(0, y);
                    if (y < document.body.scrollHeight) setTimeout(passo, 60);
                    else { window.scrollTo(0, 0); setTimeout(ok, 250); }
                  };
                  passo();
                })
            """, "awaitPromise": True, "returnByValue": True})
            nav.drenar(0.8)

        auditoria = nav.chamar("Runtime.evaluate",
                               {"expression": AUDITORIA, "returnByValue": True})
        resultado.update(auditoria["result"]["result"]["value"])

        # O script do Vercel Analytics só é servido pela infraestrutura da
        # Vercel; em execução local ele responde 404 e isso é esperado.
        def esperado(texto):
            return "_vercel/insights" in texto

        erros = []
        pedidos = {}
        for evento in nav.eventos:
            metodo = evento.get("method")
            p = evento.get("params", {})
            if metodo == "Runtime.consoleAPICalled" and p.get("type") in ("error", "warning"):
                textos = [str(a.get("value", a.get("description", "")))
                          for a in p.get("args", [])]
                erros.append(f"console.{p['type']}: {' '.join(textos)[:180]}")
            elif metodo == "Log.entryAdded" and p.get("entry", {}).get("level") == "error":
                entrada = p["entry"]
                erros.append(
                    f"log: {entrada.get('text','')} {entrada.get('url','')}"[:180])
            elif metodo == "Runtime.exceptionThrown":
                det = p.get("exceptionDetails", {})
                erros.append(f"exceção: {det.get('text','')} {det.get('exception',{}).get('description','')}"[:180])
            elif metodo == "Network.requestWillBeSent":
                pedidos[p.get("requestId")] = p.get("request", {}).get("url", "")
            elif metodo == "Network.responseReceived":
                status = p.get("response", {}).get("status", 0)
                if status >= 400:
                    erros.append(
                        f"http {status}: {p.get('response', {}).get('url', '')}"[:180])
            elif metodo == "Network.loadingFailed":
                if p.get("type") not in ("Ping",):
                    url = pedidos.get(p.get("requestId"), "?")
                    erros.append(
                        f"rede: {p.get('errorText','')} {p.get('type','')} {url}"[:180])
        resultado["erros"] = [e for e in erros if not esperado(e)]
        resultado["errosEsperados"] = len(erros) - len(resultado["erros"])

        captura = nav.chamar("Page.captureScreenshot",
                             {"format": "png", "captureBeyondViewport": False})
        arquivo = f"{SAIDA}/{nome}-{largura}.png"
        with open(arquivo, "wb") as f:
            f.write(base64.b64decode(captura["result"]["data"]))
        resultado["captura"] = arquivo
    finally:
        nav.fechar()
    return resultado


def main():
    paginas = [("/", "home")]
    if "--completo" in sys.argv:
        paginas += [
            ("/politica-de-privacidade", "privacidade"),
            ("/demos/clinica", "demo-clinica"),
        ]

    falhou = False
    for caminho, nome in paginas:
        for largura in LARGURAS:
            r = testar(caminho, nome, largura)
            marca = "OK  "
            problemas = []
            if r.get("rolagemHorizontal"):
                problemas.append(
                    f"ROLAGEM HORIZONTAL ({r['larguraDocumento']} > {r['larguraJanela']})")
            if r.get("larguraJanela") != largura:
                problemas.append(
                    f"emulação incorreta: innerWidth={r.get('larguraJanela')}")
            if r.get("controlesCortados"):
                problemas.append(f"controles cortados: {r['controlesCortados']}")
            if r.get("textoCortado"):
                problemas.append(f"texto cortado: {r['textoCortado']}")
            if r.get("imagensSemAlt"):
                problemas.append(f"{r['imagensSemAlt']} imagem(ns) sem alt")
            if r.get("h1") != 1:
                problemas.append(f"{r.get('h1')} elementos h1")
            if r.get("erros"):
                problemas.append(f"{len(r['erros'])} erro(s) de console")
            if problemas:
                marca = "FALHA"
                falhou = True

            print(f"[{marca}] {nome} @ {largura}px  janela={r.get('larguraJanela')}  "
                  f"doc={r.get('larguraDocumento')}  estouros={r.get('totalEstouros')}")
            for p in problemas:
                print(f"        - {p}")
            for e in (r.get("erros") or [])[:4]:
                print(f"        ! {e}")
            for o in (r.get("estouros") or [])[:3]:
                print(f"        > estouro {o['tag']} .{o['classe'][:60]} "
                      f"({o['esquerda']}..{o['direita']})")

    print("\nRESULTADO:", "PROBLEMAS ENCONTRADOS" if falhou else "TUDO OK")
    return 1 if falhou else 0


if __name__ == "__main__":
    sys.exit(main())
