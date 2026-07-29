#!/usr/bin/env python3
"""Observa o site de referência enquanto a página rola e registra as animações
no instante em que disparam.

As animações de scroll são aplicadas por JavaScript e removidas assim que
terminam, então ler o CSS depois não mostra nada. Aqui um MutationObserver
grava cada mudança de classe e de estilo em linha durante a rolagem.
"""

import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

ALVO = os.environ.get("ALVO", "https://www.viaagenciadigital.com.br/")
SAIDA = os.environ.get("SAIDA", "/opt/cursor/artifacts/referencia")
PORTA = 9378

OBSERVADOR = r"""
window.__registro = [];
window.__obs = new MutationObserver((muts) => {
  for (const m of muts) {
    const el = m.target;
    if (!(el instanceof Element)) continue;
    const s = getComputedStyle(el);
    window.__registro.push({
      quando: Math.round(performance.now()),
      atributo: m.attributeName,
      tag: el.tagName.toLowerCase(),
      classe: String(el.getAttribute('class') || '').slice(0, 150),
      estilo: String(el.getAttribute('style') || '').slice(0, 200),
      animacao: [s.animationName, s.animationDuration, s.animationTimingFunction, s.animationDelay, s.animationFillMode].join(' | '),
      transicao: [s.transitionProperty, s.transitionDuration, s.transitionTimingFunction, s.transitionDelay].join(' | '),
      transform: s.transform,
      opacidade: s.opacity,
    });
  }
});
window.__obs.observe(document.body, {
  attributes: true, subtree: true, attributeFilter: ['class', 'style'],
});
'ok'
"""

# Atributos declarativos do tema revelam a intenção de cada animação.
DECLARACOES = r"""
(() => {
  const out = [];
  for (const el of document.querySelectorAll('[uk-scrollspy], [data-uk-scrollspy], [uk-parallax], [data-uk-parallax], [uk-slideshow], [uk-slider], [uk-sticky], [uk-video], [uk-cover]')) {
    for (const attr of el.attributes) {
      if (attr.name.includes('uk-') || attr.name.includes('scrollspy') || attr.name.includes('parallax')) {
        out.push({
          tag: el.tagName.toLowerCase(),
          classe: String(el.getAttribute('class') || '').slice(0, 120),
          atributo: attr.name,
          valor: attr.value.slice(0, 250),
        });
      }
    }
  }
  return out;
})()
"""

VIDEOS = r"""
(() => [...document.querySelectorAll('video')].map((v) => {
  const r = v.getBoundingClientRect();
  const s = getComputedStyle(v);
  const pai = v.parentElement;
  return {
    src: v.currentSrc || v.src,
    fontes: [...v.querySelectorAll('source')].map((f) => ({ src: f.src, tipo: f.type })),
    loop: v.loop, autoplay: v.autoplay, muted: v.muted, playsInline: v.playsInline,
    preload: v.preload, poster: v.poster,
    intrinseco: [v.videoWidth, v.videoHeight],
    exibido: [Math.round(r.width), Math.round(r.height)],
    objectFit: s.objectFit, clip: s.clipPath, mask: s.maskImage,
    paiClasse: pai ? String(pai.className || '').slice(0, 120) : null,
    paiFundo: pai ? getComputedStyle(pai).backgroundColor : null,
  };
}))()
"""

TIPOGRAFIA = r"""
(() => {
  const alvos = ['h1', 'h2', 'h3', 'p', 'a', 'body'];
  const out = {};
  for (const t of alvos) {
    const el = document.querySelector(t);
    if (!el) continue;
    const s = getComputedStyle(el);
    out[t] = {
      familia: s.fontFamily, tamanho: s.fontSize, peso: s.fontWeight,
      alturaLinha: s.lineHeight, espacamento: s.letterSpacing, cor: s.color,
    };
  }
  const gradientes = [];
  for (const el of document.querySelectorAll('span, strong, em, h1, h2')) {
    const s = getComputedStyle(el);
    if (s.backgroundImage.includes('gradient') && s.webkitTextFillColor === 'rgba(0, 0, 0, 0)') {
      gradientes.push({ texto: el.textContent.slice(0, 40), gradiente: s.backgroundImage.slice(0, 220) });
    }
  }
  return { alvos: out, gradientes: gradientes.slice(0, 10) };
})()
"""


class Navegador:
    def __init__(self, largura, altura, movel=False):
        self.perfil = f"/tmp/chrome-anim-{largura}"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "xvfb-run",
                "-a",
                f"--server-args=-screen 0 {max(largura, 800)}x{altura + 200}x24",
                "google-chrome",
                f"--remote-debugging-port={PORTA}",
                "--remote-allow-origins=*",
                f"--user-data-dir={self.perfil}",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-blink-features=AutomationControlled",
                "--autoplay-policy=no-user-gesture-required",
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

    def cmd(self, metodo, **params):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                if "error" in msg:
                    raise RuntimeError(f"{metodo}: {msg['error']}")
                return msg.get("result", {})

    def js(self, expr):
        r = self.cmd(
            "Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True
        )
        return r.get("result", {}).get("value")

    def fechar(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.terminate()


def esperar_liberacao(nav):
    for _ in range(40):
        time.sleep(2)
        corpo = nav.js("document.body ? document.body.innerText.slice(0,300) : ''") or ""
        if "security verification" not in corpo.lower():
            if (nav.js("document.body.scrollHeight") or 0) > 1500:
                return True
    return False


def coletar(largura, altura, movel):
    nav = Navegador(largura, altura, movel)
    nav.cmd("Page.enable")
    nav.cmd("Runtime.enable")
    nav.cmd("Page.navigate", url=ALVO)
    if not esperar_liberacao(nav):
        nav.fechar()
        raise RuntimeError("Cloudflare barrou")

    time.sleep(3)
    nav.js("window.scrollTo(0,0)")
    time.sleep(1)
    nav.js(OBSERVADOR)

    # Rolagem lenta, em passos pequenos, para não pular nenhum gatilho.
    total = nav.js("document.body.scrollHeight")
    pos = 0
    while pos < total:
        nav.js(f"window.scrollTo({{top: {pos}, behavior: 'instant'}})")
        time.sleep(0.4)
        pos += 300
        total = nav.js("document.body.scrollHeight")

    registro = nav.js("window.__registro.slice(0, 2500)") or []
    dados = {
        "largura": largura,
        "declaracoes": nav.js(DECLARACOES),
        "videos": nav.js(VIDEOS),
        "tipografia": nav.js(TIPOGRAFIA),
        "registro": registro,
    }
    nav.fechar()
    return dados


def main():
    os.makedirs(SAIDA, exist_ok=True)
    saida = {}
    for nome, (largura, altura, movel) in {
        "desktop": (1440, 900, False),
        "mobile": (390, 844, True),
    }.items():
        print(f"coletando {nome}…")
        try:
            saida[nome] = coletar(largura, altura, movel)
            print(f"  {len(saida[nome]['registro'])} mutações registradas")
        except Exception as e:
            print(f"  falhou: {e}")

    caminho = os.path.join(SAIDA, "animacoes.json")
    with open(caminho, "w") as f:
        json.dump(saida, f, indent=2, ensure_ascii=False)
    print(f"gravado em {caminho}")


if __name__ == "__main__":
    sys.exit(main())
