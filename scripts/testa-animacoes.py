#!/usr/bin/env python3
"""Verifica os recursos visuais adicionados ao site.

Cobre quatro perguntas:
  1. Todo asset carregou? (nenhuma imagem quebrada, nenhum 404)
  2. Os loops estão de fato rodando, e com a duração declarada?
  3. O parallax responde à rolagem e o hover muda o que deveria?
  4. Com `prefers-reduced-motion: reduce`, tudo para e nada fica torto?

Uso: python3 scripts/testa-animacoes.py
"""

import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

BASE = os.environ.get("BASE_URL", "http://127.0.0.1:3500")
PORTA = 9394

falhas = []


def checa(condicao, rotulo, detalhe=""):
    marca = "OK  " if condicao else "FALHA"
    print(f"  {marca}  {rotulo}" + (f" ({detalhe})" if detalhe else ""))
    if not condicao:
        falhas.append(rotulo)


class Navegador:
    """Chrome com janela real, dentro de um display virtual.

    O `--headless` reporta `(hover: none)` e `(pointer: none)`, porque não há
    dispositivo apontador de verdade. O Tailwind v4 embala as utilidades `hover:`
    em `@media (hover: hover)`, então nenhum efeito de mouse chega a valer nesse
    modo — e o teste acusaria falha em algo que funciona no navegador do usuário.
    Sob Xvfb a janela é comum e as duas mídias respondem como no desktop.
    """

    def __init__(self, movimento_reduzido=False, porta=PORTA):
        self.porta = porta
        self.perfil = f"/tmp/chrome-anim-teste-{porta}"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "xvfb-run",
                "-a",
                "--server-args=-screen 0 1920x1200x24",
                "google-chrome",
                f"--remote-debugging-port={porta}",
                "--remote-allow-origins=*",
                f"--user-data-dir={self.perfil}",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--no-first-run",
                "--no-default-browser-check",
                "--hide-scrollbars",
                "--window-size=1440,900",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        alvo = None
        for _ in range(80):
            try:
                dados = json.load(
                    urllib.request.urlopen(f"http://127.0.0.1:{porta}/json")
                )
                alvo = next(a for a in dados if a["type"] == "page")
                break
            except Exception:
                time.sleep(0.5)
        if not alvo:
            raise RuntimeError("Chrome não subiu")
        self.ws = websocket.create_connection(
            alvo["webSocketDebuggerUrl"], timeout=90, max_size=100 * 1024 * 1024
        )
        self.id = 0
        self.console = []
        self.rede = []
        self.urls = {}
        self.cmd("Page.enable")
        self.cmd("Runtime.enable")
        self.cmd("Network.enable")
        if movimento_reduzido:
            self.cmd(
                "Emulation.setEmulatedMedia",
                features=[{"name": "prefers-reduced-motion", "value": "reduce"}],
            )

    def cmd(self, metodo, **params):
        self.id += 1
        self.ws.send(json.dumps({"id": self.id, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.id:
                if "error" in msg:
                    raise RuntimeError(f"{metodo}: {msg['error']}")
                return msg.get("result", {})
            self._evento(msg)

    def _evento(self, msg):
        m = msg.get("method")
        p = msg.get("params", {})
        if m == "Runtime.consoleAPICalled" and p.get("type") in ("error", "warning"):
            self.console.append(
                (p["type"], " ".join(str(a.get("value", a)) for a in p.get("args", [])))
            )
        elif m == "Runtime.exceptionThrown":
            det = p.get("exceptionDetails", {})
            desc = (det.get("exception") or {}).get("description") or det.get("text")
            pilha = " | ".join(
                f"{q.get('functionName') or '?'}@{q.get('lineNumber')}"
                for q in (det.get("stackTrace") or {}).get("callFrames", [])[:4]
            )
            self.console.append(("exception", f"{desc} :: {pilha}"[:400]))
        elif m == "Network.responseReceived":
            r = p["response"]
            if r.get("status", 200) >= 400:
                self.rede.append((r["status"], r["url"]))
        elif m == "Network.requestWillBeSent":
            self.urls[p["requestId"]] = p["request"]["url"]
        elif m == "Network.loadingFailed":
            self.rede.append(
                (p.get("errorText", "falhou"), self.urls.get(p["requestId"], "?"))
            )

    def escoar(self, segundos):
        """Consome eventos por um tempo, para não perder erros assíncronos."""
        fim = time.time() + segundos
        self.ws.settimeout(0.4)
        while time.time() < fim:
            try:
                self._evento(json.loads(self.ws.recv()))
            except Exception:
                pass
        self.ws.settimeout(90)

    def js(self, expr):
        r = self.cmd(
            "Runtime.evaluate", expression=expr, returnByValue=True, awaitPromise=True
        )
        if "exceptionDetails" in r:
            raise RuntimeError(json.dumps(r["exceptionDetails"])[:300])
        return r.get("result", {}).get("value")

    def ir(self, rota="/", largura=1440, altura=900):
        self.cmd(
            "Emulation.setDeviceMetricsOverride",
            width=largura,
            height=altura,
            deviceScaleFactor=1,
            mobile=largura < 500,
        )
        self.cmd("Page.navigate", url=BASE + rota)
        self.escoar(5)

    def rolar_tudo(self, passo=600):
        total = self.js("document.body.scrollHeight")
        pos = 0
        while pos < total:
            self.js(f"window.scrollTo({{top:{pos},behavior:'instant'}})")
            self.escoar(0.35)
            pos += passo
            total = self.js("document.body.scrollHeight")

    def fechar(self):
        try:
            self.ws.close()
        except Exception:
            pass
        self.proc.terminate()
        # `xvfb-run` é só um invólucro: terminar o wrapper não alcança o Chrome
        # que ele lançou, e o perfil ficaria travado para a próxima execução.
        subprocess.run(["pkill", "-f", self.perfil], check=False)


# A marca aparece duas vezes no topo, uma versão para cada faixa de largura, e
# a que não é da vez fica em `display:none`. Imagem sob demanda dentro de um
# elemento oculto nunca começa a carregar — é o comportamento desejado, não uma
# imagem quebrada. Por isso o que não ocupa espaço na página fica de fora.
IMAGENS_QUEBRADAS = """
[...document.images]
  .filter((im) => im.getClientRects().length > 0)
  .filter((im) => !im.complete || im.naturalWidth === 0)
  .map((im) => im.currentSrc || im.src)
"""

# Fundos declarados por CSS não entram em `document.images`; é preciso pedir ao
# navegador que carregue cada URL e ver se resolve.
FUNDOS_QUEBRADOS = """
(async () => {
  const urls = new Set();
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    for (const prop of [cs.backgroundImage, cs.maskImage, cs.webkitMaskImage]) {
      for (const m of (prop || '').matchAll(/url\\((['"]?)([^'")]+)\\1\\)/g)) {
        if (!m[2].startsWith('data:')) urls.add(new URL(m[2], location.href).href);
      }
    }
  }
  const ruins = [];
  await Promise.all([...urls].map((u) =>
    fetch(u, { method: 'GET' })
      .then((r) => { if (!r.ok) ruins.push(`${r.status} ${u}`); })
      .catch(() => ruins.push(`erro ${u}`))
  ));
  return { total: urls.size, ruins };
})()
"""

LOOPS = """
(() => {
  const encontrados = {};
  for (const an of document.getAnimations()) {
    const nome = an.animationName || (an.effect && an.effect.getKeyframes && 'css') || '?';
    const dur = an.effect ? an.effect.getTiming().duration : null;
    const iter = an.effect ? an.effect.getTiming().iterations : null;
    const chave = nome;
    if (!encontrados[chave]) encontrados[chave] = { qtd: 0, estados: [], duracoes: [], infinito: false };
    encontrados[chave].qtd += 1;
    if (!encontrados[chave].estados.includes(an.playState)) encontrados[chave].estados.push(an.playState);
    if (typeof dur === 'number' && !encontrados[chave].duracoes.includes(dur)) encontrados[chave].duracoes.push(dur);
    if (iter === Infinity || iter === null) encontrados[chave].infinito = true;
  }
  return encontrados;
})()
"""

RESIDUOS = """
(() => {
  const suspeitos = [];
  for (const el of document.querySelectorAll('[data-revelar], .anima-aurora, .anima-flutuar, .anima-varredura, .anima-girar-lento')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (parseFloat(cs.opacity) < 0.99 && el.hasAttribute('data-revelar')) {
      suspeitos.push({ motivo: 'opacidade', valor: cs.opacity, classe: String(el.className).slice(0, 60) });
    }
    if (cs.transform !== 'none' && el.hasAttribute('data-revelar')) {
      suspeitos.push({ motivo: 'transform', valor: cs.transform, classe: String(el.className).slice(0, 60) });
    }
  }
  return suspeitos;
})()
"""


def testa_assets(nav):
    print("\nAssets")
    nav.ir("/")
    nav.rolar_tudo()

    quebradas = nav.js(IMAGENS_QUEBRADAS) or []
    checa(not quebradas, "nenhuma <img> quebrada", str(quebradas[:3]))

    fundos = nav.js(FUNDOS_QUEBRADOS) or {}
    checa(
        not fundos.get("ruins"),
        f"todo fundo/máscara em CSS resolve ({fundos.get('total')} url)",
        str(fundos.get("ruins", [])[:3]),
    )

    # A Vercel Analytics não existe fora da plataforma; o 404 dela é esperado.
    ruins = [r for r in nav.rede if "_vercel/insights" not in str(r[1])]
    checa(not ruins, "nenhuma resposta HTTP >= 400", str(ruins[:3]))

    erros = [c for c in nav.console if c[0] in ("error", "exception")]
    checa(not erros, "console sem erros", str(erros[:2]))


def testa_loops(nav):
    print("\nAnimações em loop")
    nav.ir("/")
    nav.rolar_tudo()
    nav.js("window.scrollTo({top:0,behavior:'instant'})")
    nav.escoar(1.5)

    loops = nav.js(LOOPS) or {}
    esperados = {
        "aurora-deriva": 22000,
        "flutuar": 6000,
        "varredura": 7000,
        "girar-lento": 40000,
        "encher-barra": 4500,
    }
    for nome, duracao in esperados.items():
        info = loops.get(nome)
        checa(bool(info), f"{nome} presente")
        if not info:
            continue
        checa(
            "running" in info["estados"],
            f"{nome} está rodando",
            f"{info['qtd']}x, estados={info['estados']}",
        )
        checa(
            duracao in info["duracoes"],
            f"{nome} com duração declarada",
            f"{info['duracoes']}ms",
        )

    # Estes dois só entram em cena depois da primeira dobra.
    nav.js("document.querySelector('#servicos').scrollIntoView()")
    nav.escoar(1.2)
    loops = nav.js(LOOPS) or {}
    for nome in ("correr-faixa", "subir-perspectiva"):
        info = loops.get(nome)
        checa(bool(info) and "running" in info["estados"], f"{nome} está rodando")
        checa(bool(info) and info["infinito"], f"{nome} repete sem fim")


def testa_parallax(nav):
    print("\nParallax e revelação no scroll")
    nav.ir("/")

    # O elemento do parallax é o filho direto do contêiner marcado.
    ler = """
    (() => {
      const cx = document.querySelector('[aria-hidden="true"][class*="aspect-560"]')
        || document.querySelector('div[class*="aspect-560"]');
      const alvo = document.querySelector('.will-change-transform');
      return alvo ? getComputedStyle(alvo).transform : null;
    })()
    """
    nav.js("window.scrollTo({top:0,behavior:'instant'})")
    nav.escoar(0.8)
    antes = nav.js(ler)
    nav.js("window.scrollTo({top:500,behavior:'instant'})")
    nav.escoar(0.8)
    depois = nav.js(ler)
    checa(
        antes is not None and depois is not None and antes != depois,
        "parallax do topo se move com a rolagem",
        f"{antes} → {depois}",
    )

    # Um item bem abaixo da dobra precisa sair de opacidade 0 e chegar a 1.
    escondido = nav.js(
        """
        (() => {
          const itens = [...document.querySelectorAll('[data-revelar]')];
          const alvo = itens[itens.length - 3];
          if (!alvo) return null;
          return parseFloat(getComputedStyle(alvo).opacity);
        })()
        """
    )
    checa(escondido is not None and escondido < 0.5, "item fora da tela começa oculto", str(escondido))

    nav.rolar_tudo()
    nav.escoar(1.2)
    revelado = nav.js(
        """
        (() => {
          const itens = [...document.querySelectorAll('[data-revelar]')];
          const alvo = itens[itens.length - 3];
          return alvo ? parseFloat(getComputedStyle(alvo).opacity) : null;
        })()
        """
    )
    checa(revelado is not None and revelado > 0.99, "o mesmo item aparece após rolar", str(revelado))


def testa_hover(nav):
    print("\nEfeitos de hover")
    nav.ir("/")
    # Rolar até o próprio cartão, não até a seção: o título ocupa a dobra e o
    # cartão acabava fora da tela, com coordenada de mouse inválida.
    nav.js("document.querySelector('#projetos .group').scrollIntoView({block:'center'})")
    nav.escoar(1.2)

    # O CDP não tem "hover" declarativo confiável para pseudo-classes do
    # Tailwind; simular o movimento do mouse é o que realmente dispara.
    caixa = nav.js(
        """
        (() => {
          const c = document.querySelector('#projetos .group');
          if (!c) return null;
          const r = c.getBoundingClientRect();
          return {
            x: Math.round(r.x + r.width / 2),
            y: Math.round(r.y + r.height / 2),
            naTela: r.top >= 0 && r.bottom <= innerHeight,
          };
        })()
        """
    )
    checa(bool(caixa) and caixa.get("naTela"), "cartão de projeto visível na tela", str(caixa))
    if not caixa:
        return

    # Sem esta mídia o Tailwind v4 nem gera efeito: `hover:` mora dentro de
    # `@media (hover: hover)`. Se ela falhar, o problema é do navegador de teste.
    checa(
        nav.js("matchMedia('(hover: hover)').matches") is True,
        "navegador de teste tem ponteiro com hover",
    )

    def medir():
        # O Tailwind v4 escreve `translate`, `scale` e `rotate` em vez de
        # empacotar tudo em `transform`; ler só `transform` devolve sempre
        # "none" e dá a impressão falsa de que o hover não funciona.
        return nav.js(
            """
            (() => {
              const geo = (el) => {
                const cs = getComputedStyle(el);
                return [cs.translate, cs.scale, cs.transform].join(' / ');
              };
              const c = document.querySelector('#projetos .group');
              const img = c.querySelector('img');
              return {
                cartao: geo(c),
                imagem: geo(img),
                moldura: geo(img.closest('div[class*="rounded-t-xl"]')),
              };
            })()
            """
        )

    nav.cmd(
        "Input.dispatchMouseEvent", type="mouseMoved", x=5, y=5, buttons=0
    )
    nav.escoar(0.7)
    antes = medir()
    nav.cmd(
        "Input.dispatchMouseEvent",
        type="mouseMoved",
        x=caixa["x"],
        y=caixa["y"],
        buttons=0,
    )
    nav.escoar(1.0)
    depois = medir()

    checa(
        antes["cartao"] != depois["cartao"],
        "cartão sobe ao passar o mouse",
        f"{antes['cartao']} → {depois['cartao']}",
    )
    checa(
        antes["imagem"] != depois["imagem"],
        "imagem aproxima ao passar o mouse",
        f"{antes['imagem']} → {depois['imagem']}",
    )
    checa(
        antes["moldura"] != depois["moldura"],
        "moldura desloca ao passar o mouse",
        f"{antes['moldura']} → {depois['moldura']}",
    )


def testa_movimento_reduzido():
    print("\nprefers-reduced-motion: reduce")
    nav = Navegador(movimento_reduzido=True, porta=PORTA + 1)
    try:
        nav.ir("/")
        emulado = nav.js(
            "window.matchMedia('(prefers-reduced-motion: reduce)').matches"
        )
        checa(emulado is True, "mídia emulada corretamente")

        nav.rolar_tudo()
        nav.escoar(1.0)

        # A regra global reduz a duração a 0,01ms; nada deve ficar em execução.
        rodando = nav.js(
            """
            document.getAnimations()
              .filter((a) => a.playState === 'running')
              .map((a) => a.animationName || '?')
            """
        ) or []
        checa(not rodando, "nenhum loop continua rodando", str(rodando[:5]))

        residuos = nav.js(RESIDUOS) or []
        checa(not residuos, "nenhum resíduo de opacidade ou transform", str(residuos[:3]))

        # A faixa em movimento precisa voltar ao início, senão fica cortada.
        faixa = nav.js(
            """
            (() => {
              const f = document.querySelector('[style*="correr-faixa"]');
              return f ? getComputedStyle(f).transform : 'ausente';
            })()
            """
        )
        checa(
            faixa in ("none", "matrix(1, 0, 0, 1, 0, 0)"),
            "faixa volta ao início sem deslocamento",
            str(faixa),
        )

        erros = [c for c in nav.console if c[0] in ("error", "exception")]
        checa(not erros, "console sem erros", str(erros[:2]))
    finally:
        nav.fechar()


def testa_mobile():
    print("\nCelular (390px)")
    nav = Navegador(porta=PORTA + 2)
    try:
        nav.ir("/", largura=390, altura=844)
        nav.rolar_tudo(passo=500)
        nav.escoar(1.0)

        quebradas = nav.js(IMAGENS_QUEBRADAS) or []
        checa(not quebradas, "nenhuma imagem quebrada no celular", str(quebradas[:3]))

        loops = nav.js(LOOPS) or {}
        checa(
            any(n in loops for n in ("aurora-deriva", "correr-faixa")),
            "loops também rodam no celular",
            ",".join(sorted(loops)[:6]),
        )

        largura = nav.js("document.documentElement.scrollWidth")
        checa(largura <= 390, "sem rolagem horizontal", f"{largura}px")

        erros = [c for c in nav.console if c[0] in ("error", "exception")]
        checa(not erros, "console sem erros", str(erros[:2]))
    finally:
        nav.fechar()


def main():
    nav = Navegador()
    try:
        testa_assets(nav)
        testa_loops(nav)
        testa_parallax(nav)
        testa_hover(nav)
    finally:
        nav.fechar()

    testa_movimento_reduzido()
    testa_mobile()

    print()
    if falhas:
        print(f"RESULTADO: {len(falhas)} falha(s)")
        for f in falhas:
            print(f"  - {f}")
        return 1
    print("RESULTADO: TUDO OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
