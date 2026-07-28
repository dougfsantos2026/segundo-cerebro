#!/usr/bin/env python3
"""Recorta a figura do fundo branco e alinha as poses entre si.

As duas poses vêm de gerações separadas, então cada uma chega com altura e
enquadramento próprios. Se forem usadas como estão, a troca entre elas salta —
o corpo muda de tamanho e os pés mudam de lugar no mesmo instante em que a
pessoa deveria apenas girar. Aqui as duas são recortadas, escaladas para a mesma
altura de corpo e coladas numa tela comum, com os pés na mesma linha e o eixo do
tronco na mesma coluna.

    python3 scripts/recorta-figura.py

Entra em /opt/cursor/artifacts/assets, sai em site/public/images.
"""

import os
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRADA = "/opt/cursor/artifacts/assets"
SAIDA = os.path.join(RAIZ, "site", "public", "images")
TRABALHO = "/tmp/figura-recorte"

# Tela final das duas poses. A largura sobra de propósito: no perfil o braço
# avança para fora do tronco e não pode encostar na borda.
LARGURA, ALTURA = 520, 900
# Altura do corpo dentro da tela, dos pés ao topo do cabelo.
CORPO = 820
# Distância dos pés até a base da tela.
BASE = 20

POSES = {"figura-costas": "figura-a.png", "figura-perfil": "figura-b.png"}


def sh(*args):
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(" ".join(args) + "\n" + r.stderr)
    return r.stdout.strip()


def recorta(origem, destino):
    """Tira o branco preservando o que está cercado por pixels escuros.

    Um `-transparent white` global apagaria também a tela do celular, que é
    clara e fica no meio da mão. O preenchimento a partir dos quatro cantos só
    alcança o branco conectado à borda, então a tela sobrevive.
    """
    cmd = ["convert", origem, "-alpha", "set", "-fuzz", "18%"]
    for canto in ("+0+0", "-1+0", "+0-1", "-1-1"):
        cmd += ["-fill", "none", "-floodfill", canto, "white"]
    # A borda do recorte fica com um fio claro do fundo; encolher e devolver o
    # alfa come exatamente esse fio.
    cmd += ["-channel", "A", "-blur", "0x1", "-level", "45%,100%", "+channel"]
    cmd += ["-trim", "+repage", destino]
    sh(*cmd)


def main():
    os.makedirs(TRABALHO, exist_ok=True)
    os.makedirs(SAIDA, exist_ok=True)

    for nome, arquivo in POSES.items():
        origem = os.path.join(ENTRADA, arquivo)
        if not os.path.exists(origem):
            print(f"faltando: {origem}")
            return 1

        cortado = os.path.join(TRABALHO, f"{nome}-corte.png")
        recorta(origem, cortado)

        largura, altura = (int(v) for v in sh(
            "identify", "-format", "%wx%h", cortado).split("x"))

        # Escala pela altura: é o que precisa bater entre as poses. A largura
        # segue a proporção de cada uma — o perfil é naturalmente mais estreito.
        escala = CORPO / altura
        nova_l = max(1, round(largura * escala))

        deslocamento_x = (LARGURA - nova_l) // 2
        deslocamento_y = ALTURA - BASE - CORPO

        final = os.path.join(SAIDA, f"{nome}.webp")
        sh(
            "convert", cortado,
            "-resize", f"{nova_l}x{CORPO}!",
            "-background", "none",
            "-extent", f"{LARGURA}x{ALTURA}-{deslocamento_x}-{deslocamento_y}",
            "-define", "webp:lossless=false", "-quality", "88",
            "-define", "webp:method=6", "-define", "webp:alpha-quality=100",
            final,
        )
        kb = os.path.getsize(final) // 1024
        print(f"{nome}.webp  {LARGURA}x{ALTURA}  {kb}KB  (corte {largura}x{altura})")

    return 0


if __name__ == "__main__":
    sys.exit(main())
