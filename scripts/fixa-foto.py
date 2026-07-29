#!/usr/bin/env python3
"""Move um candidato escolhido em /tmp/candidatos para `site/public/images/`,
convertendo para WebP e registrando o crédito.

    python3 scripts/fixa-foto.py aurora:04=textura-aurora:1600
                                 ^rotulo ^indice ^nome final ^largura
"""

import json
import os
import subprocess
import sys
import urllib.request

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "site", "public", "images")
BASE = "/tmp/candidatos"


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1

    os.makedirs(DESTINO, exist_ok=True)
    caminho_creditos = os.path.join(DESTINO, "creditos.json")
    creditos = json.load(open(caminho_creditos)) if os.path.exists(caminho_creditos) else {}

    for arg in sys.argv[1:]:
        origem, _, alvo = arg.partition("=")
        rotulo, _, indice = origem.partition(":")
        nome, _, largura = alvo.partition(":")
        largura = int(largura or 1400)

        pasta = os.path.join(BASE, rotulo)
        meta_todos = json.load(open(os.path.join(pasta, "meta.json")))
        if indice not in meta_todos:
            print(f"não achei {rotulo}:{indice}")
            continue

        # A folha de contato usa miniaturas de 1000px; para o projeto vale
        # buscar de novo na largura final em vez de ampliar a miniatura.
        bruto = os.path.join("/tmp", f"bruto-{nome}.jpg")
        origem = (
            f"https://images.unsplash.com/{meta_todos[indice]['id']}"
            f"?w={largura}&q=85&fm=jpg&fit=max"
        )
        req = urllib.request.Request(origem, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r, open(bruto, "wb") as f:
            f.write(r.read())

        saida = os.path.join(DESTINO, f"{nome}.webp")
        subprocess.run(
            ["convert", bruto, "-resize", f"{largura}x>", "-strip",
             "-quality", "82", "-define", "webp:method=6", saida],
            check=True,
        )
        dim = subprocess.run(
            ["identify", "-format", "%wx%h", saida], capture_output=True, text=True
        ).stdout.strip()
        kb = os.path.getsize(saida) // 1024

        os.remove(bruto)
        c = meta_todos[indice]
        creditos[f"{nome}.webp"] = {
            "fonte": "Unsplash",
            "licenca": "https://unsplash.com/license",
            "id": c.get("id"),
            "pagina": c.get("pagina"),
            "autor": c.get("autor"),
            "perfil": c.get("perfil"),
            "descricao": c.get("alt"),
        }
        print(f"{nome}.webp  {dim}  {kb}KB  ← {rotulo}:{indice}")

    with open(caminho_creditos, "w") as f:
        json.dump(creditos, f, indent=2, ensure_ascii=False, sort_keys=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
