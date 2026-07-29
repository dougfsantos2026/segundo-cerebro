#!/usr/bin/env python3
"""Busca e baixa fotografia do Unsplash, converte para WebP e grava em
`site/public/images/`.

A Licença Unsplash permite uso comercial sem atribuição obrigatória. Ainda
assim o script grava `creditos.json` com autor e link de cada foto, para que a
origem de tudo que está no repositório fique rastreável.

Uso:
    python3 scripts/baixa-fotos.py              # baixa o conjunto padrão
    python3 scripts/baixa-fotos.py nome=busca   # baixa um item avulso
"""

import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "site", "public", "images")
PORTA = 9379

# nome do arquivo -> (busca, largura final)
CONJUNTO = {
    "textura-aurora": ("abstract iridescent gradient flow", 1600),
    "segmento-advocacia": ("law office interior books", 1400),
    "segmento-contabilidade": ("accountant desk documents calculator", 1400),
    "segmento-oficina": ("car mechanic workshop garage", 1400),
    "segmento-clinica": ("modern dental clinic interior", 1400),
    "segmento-restaurante": ("cozy restaurant interior table", 1400),
    "segmento-salao": ("hair salon interior chairs", 1400),
    "equipe-trabalho": ("designer working laptop desk dark", 1600),
}


class Navegador:
    def __init__(self):
        self.perfil = "/tmp/chrome-fotos"
        subprocess.run(["rm", "-rf", self.perfil], check=False)
        os.makedirs(self.perfil, exist_ok=True)
        self.proc = subprocess.Popen(
            [
                "xvfb-run",
                "-a",
                "--server-args=-screen 0 1400x1000x24",
                "google-chrome",
                f"--remote-debugging-port={PORTA}",
                "--remote-allow-origins=*",
                f"--user-data-dir={self.perfil}",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-blink-features=AutomationControlled",
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
            alvo["webSocketDebuggerUrl"], timeout=90, max_size=100 * 1024 * 1024
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


COLETA = r"""
(() => {
  const vistos = new Set();
  const out = [];
  for (const fig of document.querySelectorAll('figure')) {
    const img = fig.querySelector('img[srcset*="images.unsplash.com/photo-"]');
    if (!img) continue;
    const m = (img.src || '').match(/photo-[\w-]+/);
    if (!m || vistos.has(m[0])) continue;
    vistos.add(m[0]);
    const link = fig.querySelector('a[href*="/photos/"]');
    const autor = fig.querySelector('a[href^="/@"]');
    out.push({
      id: m[0],
      pagina: link ? link.href : null,
      autor: autor ? autor.textContent.trim() : null,
      perfil: autor ? autor.href : null,
      alt: img.alt || '',
      proporcao: img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : null,
    });
  }
  return out;
})()
"""


def buscar(nav, termo, quantos=8):
    url = f"https://unsplash.com/s/photos/{urllib.parse.quote(termo)}?orientation=landscape"
    nav.cmd("Page.navigate", url=url)
    for _ in range(20):
        time.sleep(1.5)
        achados = nav.js(COLETA) or []
        if len(achados) >= quantos:
            return achados[:quantos]
    return (nav.js(COLETA) or [])[:quantos]


def baixar_e_converter(foto_id, nome, largura):
    """Baixa em JPEG largo e grava um WebP de qualidade alta."""
    origem = (
        f"https://images.unsplash.com/{foto_id}"
        f"?w={largura}&q=85&fm=jpg&fit=max&auto=format"
    )
    bruto = os.path.join("/tmp", f"{nome}.jpg")
    req = urllib.request.Request(origem, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r, open(bruto, "wb") as f:
        f.write(r.read())

    destino = os.path.join(DESTINO, f"{nome}.webp")
    subprocess.run(
        [
            "convert",
            bruto,
            "-resize",
            f"{largura}x>",
            "-strip",
            "-quality",
            "82",
            "-define",
            "webp:method=6",
            destino,
        ],
        check=True,
    )
    tamanho = os.path.getsize(destino)
    dimensoes = (
        subprocess.run(
            ["identify", "-format", "%wx%h", destino], capture_output=True, text=True
        ).stdout.strip()
    )
    os.remove(bruto)
    return destino, tamanho, dimensoes


def main():
    import urllib.parse  # noqa: F401  (usado em buscar)

    os.makedirs(DESTINO, exist_ok=True)
    pedidos = dict(CONJUNTO)
    if len(sys.argv) > 1:
        pedidos = {}
        for arg in sys.argv[1:]:
            nome, _, termo = arg.partition("=")
            pedidos[nome] = (termo, 1400)

    nav = Navegador()
    nav.cmd("Page.enable")
    nav.cmd("Runtime.enable")

    caminho_creditos = os.path.join(DESTINO, "creditos.json")
    creditos = {}
    if os.path.exists(caminho_creditos):
        creditos = json.load(open(caminho_creditos))

    for nome, (termo, largura) in pedidos.items():
        print(f"\n[{nome}] buscando “{termo}”…")
        achados = buscar(nav, termo)
        if not achados:
            print("  nenhum resultado")
            continue
        for cand in achados:
            try:
                destino, tamanho, dim = baixar_e_converter(cand["id"], nome, largura)
            except Exception as e:
                print(f"  falhou {cand['id']}: {e}")
                continue
            print(f"  OK {os.path.basename(destino)}  {dim}  {tamanho // 1024}KB")
            print(f"     autor: {cand['autor']}  {cand['pagina']}")
            creditos[f"{nome}.webp"] = {
                "fonte": "Unsplash",
                "licenca": "https://unsplash.com/license",
                "id": cand["id"],
                "pagina": cand["pagina"],
                "autor": cand["autor"],
                "perfil": cand["perfil"],
                "descricao": cand["alt"],
            }
            break

    with open(caminho_creditos, "w") as f:
        json.dump(creditos, f, indent=2, ensure_ascii=False, sort_keys=True)
    print(f"\ncréditos em {caminho_creditos}")
    nav.fechar()


if __name__ == "__main__":
    import urllib.parse

    sys.exit(main())
