#!/usr/bin/env python3
"""Inspeciona o site de referência: cataloga os recursos carregados, mede as
animações declaradas em CSS e captura a página em fatias.

Serve só para estudo — nada aqui escreve dentro de `site/`.
"""

import base64
import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

ALVO = os.environ.get("ALVO", "https://www.viaagenciadigital.com.br/")
SAIDA = os.environ.get("SAIDA", "/opt/cursor/artifacts/referencia")
PORTA = 9377

os.makedirs(SAIDA, exist_ok=True)


class Navegador:
    """Chrome real dentro de um display virtual.

    O site de referência fica atrás do Cloudflare, que barra `--headless`. Rodar
    a versão normal sob Xvfb passa pela verificação sem intervenção.
    """

    def __init__(self, largura=1440, altura=900):
        self.perfil = "/tmp/chrome-referencia"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "xvfb-run",
                "-a",
                "--server-args=-screen 0 1600x1200x24",
                "google-chrome",
                f"--remote-debugging-port={PORTA}",
                "--remote-allow-origins=*",
                f"--user-data-dir={self.perfil}",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-blink-features=AutomationControlled",
                "--hide-scrollbars",
                f"--window-size={largura},{altura}",
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
        self.eventos = []

    def cmd(self, metodo, **params):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                if "error" in msg:
                    raise RuntimeError(f"{metodo}: {msg['error']}")
                return msg.get("result", {})
            if "method" in msg:
                self.eventos.append(msg)

    def js(self, expressao):
        r = self.cmd(
            "Runtime.evaluate",
            expression=expressao,
            returnByValue=True,
            awaitPromise=True,
        )
        return r.get("result", {}).get("value")

    def fechar(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.terminate()


def catalogar_recursos(nav):
    """Lista tudo que o navegador baixou, com tipo, tamanho e URL."""
    recursos = {}
    for ev in nav.eventos:
        m = ev["method"]
        p = ev.get("params", {})
        if m == "Network.responseReceived":
            r = p["response"]
            recursos[p["requestId"]] = {
                "url": r["url"],
                "mime": r.get("mimeType", ""),
                "tipo": p.get("type", ""),
                "status": r.get("status"),
                "bytes": 0,
            }
        elif m == "Network.loadingFinished" and p["requestId"] in recursos:
            recursos[p["requestId"]]["bytes"] = int(p.get("encodedDataLength", 0))
    return list(recursos.values())


ANIMACOES_JS = r"""
(() => {
  const relevante = (v) => v && v !== 'none' && v !== 'auto' && v !== '0s';
  const achados = [];
  const vistos = new Set();

  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    const info = {
      transition: [s.transitionProperty, s.transitionDuration, s.transitionTimingFunction, s.transitionDelay].join(' | '),
      animation: [s.animationName, s.animationDuration, s.animationTimingFunction, s.animationDelay, s.animationIterationCount].join(' | '),
      transform: s.transform,
      opacity: s.opacity,
      willChange: s.willChange,
      filter: s.filter,
      backdrop: s.backdropFilter,
      clip: s.clipPath,
      mask: s.maskImage,
      position: s.position,
      bgImage: s.backgroundImage.slice(0, 200),
      mixBlend: s.mixBlendMode,
    };
    const temAnim = relevante(s.animationName);
    const temTrans = relevante(s.transitionDuration);
    const temMask = relevante(s.clipPath) || relevante(s.maskImage);
    const temFiltro = relevante(s.filter) || relevante(s.backdropFilter);
    if (!temAnim && !temTrans && !temMask && !temFiltro) continue;

    const chave = [el.tagName, info.transition, info.animation, info.clip, info.mask, info.filter].join('~');
    if (vistos.has(chave)) continue;
    vistos.add(chave);

    achados.push({
      tag: el.tagName.toLowerCase(),
      classe: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || '')).slice(0, 120),
      ...info,
    });
  }
  return achados.slice(0, 120);
})()
"""

KEYFRAMES_JS = r"""
(() => {
  const out = [];
  for (const folha of document.styleSheets) {
    let regras;
    try { regras = folha.cssRules; } catch (e) { continue; }
    if (!regras) continue;
    for (const r of regras) {
      if (r.type === CSSRule.KEYFRAMES_RULE) out.push(r.cssText.slice(0, 900));
    }
  }
  return out.slice(0, 60);
})()
"""

ESTRUTURA_JS = r"""
(() => {
  const secoes = [...document.querySelectorAll('section, header, footer, main > div')];
  return secoes.slice(0, 40).map((s, i) => {
    const r = s.getBoundingClientRect();
    const est = getComputedStyle(s);
    return {
      i,
      tag: s.tagName.toLowerCase(),
      id: s.id || null,
      classe: String(s.className || '').slice(0, 100),
      topo: Math.round(r.top + window.scrollY),
      altura: Math.round(r.height),
      fundo: est.backgroundColor,
      fundoImg: est.backgroundImage.slice(0, 160),
      imagens: s.querySelectorAll('img').length,
      svgs: s.querySelectorAll('svg').length,
      videos: s.querySelectorAll('video').length,
    };
  });
})()
"""

MIDIA_JS = r"""
(() => {
  const imgs = [...document.querySelectorAll('img')].map((im) => ({
    src: im.currentSrc || im.src,
    srcset: (im.srcset || '').slice(0, 300),
    alt: im.alt,
    largura: im.naturalWidth,
    altura: im.naturalHeight,
    exibida: Math.round(im.getBoundingClientRect().width),
    loading: im.loading,
    objectFit: getComputedStyle(im).objectFit,
  }));
  const videos = [...document.querySelectorAll('video')].map((v) => ({
    src: v.currentSrc || v.src,
    fontes: [...v.querySelectorAll('source')].map((s) => s.src),
    loop: v.loop, autoplay: v.autoplay, muted: v.muted,
    poster: v.poster,
    largura: v.videoWidth, altura: v.videoHeight,
  }));
  const svgsInline = [...document.querySelectorAll('svg')].slice(0, 30).map((s) => ({
    viewBox: s.getAttribute('viewBox'),
    classe: String(s.getAttribute('class') || ''),
    filhos: s.children.length,
    conteudo: s.outerHTML.slice(0, 300),
  }));
  const fundos = [];
  for (const el of document.querySelectorAll('*')) {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== 'none') fundos.push({ tag: el.tagName.toLowerCase(), classe: String(el.className || '').slice(0, 80), bg: bg.slice(0, 240) });
    if (fundos.length > 40) break;
  }
  return { imgs, videos, svgsInline, fundos };
})()
"""


def main():
    nav = Navegador()
    nav.cmd("Network.enable")
    nav.cmd("Page.enable")
    nav.cmd("Runtime.enable")
    nav.cmd(
        "Emulation.setDeviceMetricsOverride",
        width=1440,
        height=900,
        deviceScaleFactor=1,
        mobile=False,
    )
    nav.cmd("Page.navigate", url=ALVO)

    # O Cloudflare mostra um interstício antes de liberar a página. Espera ele
    # sumir em vez de assumir um tempo fixo de carregamento.
    for tentativa in range(40):
        time.sleep(2)
        titulo = nav.js("document.title") or ""
        corpo = nav.js("document.body ? document.body.innerText.slice(0,400) : ''") or ""
        desafio = "security verification" in corpo.lower() or "just a moment" in titulo.lower()
        if not desafio and nav.js("document.body.scrollHeight") > 1500:
            print(f"página liberada em {tentativa * 2}s — título: {titulo!r}")
            break
        if tentativa == 4:
            # Marca a caixa do desafio quando ela aparece dentro de um iframe.
            nav.js(
                "(() => { const i = document.querySelector('iframe');"
                " if (i) { const r = i.getBoundingClientRect();"
                " return [r.x + 30, r.y + r.height / 2]; } return null; })()"
            )
    else:
        print("AVISO: o desafio do Cloudflare não foi liberado")

    time.sleep(3)
    altura = nav.js("document.body.scrollHeight")
    print(f"altura da página: {altura}px")

    # Rola devagar para disparar animações de scroll e carregar imagens tardias.
    passo = 700
    pos = 0
    while pos < altura:
        nav.js(f"window.scrollTo(0, {pos})")
        time.sleep(0.55)
        pos += passo
        altura = nav.js("document.body.scrollHeight")
    nav.js("window.scrollTo(0, 0)")
    time.sleep(2)

    relatorio = {
        "url": ALVO,
        "altura": altura,
        "estrutura": nav.js(ESTRUTURA_JS),
        "midia": nav.js(MIDIA_JS),
        "animacoes": nav.js(ANIMACOES_JS),
        "keyframes": nav.js(KEYFRAMES_JS),
        "recursos": catalogar_recursos(nav),
    }

    caminho = os.path.join(SAIDA, "relatorio.json")
    with open(caminho, "w") as f:
        json.dump(relatorio, f, indent=2, ensure_ascii=False)
    print(f"relatório em {caminho}")

    # Fatias verticais da página inteira, para revisão visual.
    nav.cmd(
        "Emulation.setDeviceMetricsOverride",
        width=1440,
        height=900,
        deviceScaleFactor=1,
        mobile=False,
    )
    for i in range(0, min(altura, 24000), 900):
        nav.js(f"window.scrollTo(0, {i})")
        time.sleep(0.8)
        r = nav.cmd("Page.captureScreenshot", format="png")
        with open(os.path.join(SAIDA, f"fatia-{i:05d}.png"), "wb") as f:
            f.write(base64.b64decode(r["data"]))
    print("fatias desktop capturadas")

    nav.fechar()


if __name__ == "__main__":
    sys.exit(main())
