#!/usr/bin/env python3
"""Gera `site/public/images/mascara-marca.svg`: um “k” geométrico usado como
máscara alfa da composição do topo.

Cada traço vira um polígono explícito em vez de um `stroke`, para que as pontas
fiquem retas e o arquivo não dependa de como o navegador resolve
`stroke-linecap`. As diagonais são cortadas na vertical, o que dá o acabamento
anguloso da marca.
"""

import math
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "site", "public", "images", "mascara-marca.svg")

LARGURA, ALTURA = 560, 600
TRACO = 104  # espessura dos traços, em unidades do viewBox


def barra_vertical(x, y0, y1, largura):
    meia = largura / 2
    return [(x - meia, y0), (x + meia, y0), (x + meia, y1), (x - meia, y1)]


def barra_diagonal(p0, p1, largura):
    """Segmento espesso com as duas pontas cortadas na vertical.

    O deslocamento é aplicado só no eixo X, então a espessura medida na
    horizontal é constante e as extremidades ficam a prumo — é isso que faz o
    “k” parecer recortado em vez de desenhado com caneta.
    """
    dx = largura / 2 / math.cos(math.atan2(abs(p1[1] - p0[1]), abs(p1[0] - p0[0])))
    dx = largura / 2 * math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / abs(p1[0] - p0[0])
    return [
        (p0[0] - dx, p0[1]),
        (p0[0] + dx, p0[1]),
        (p1[0] + dx, p1[1]),
        (p1[0] - dx, p1[1]),
    ]


def para_path(pontos):
    d = f"M{pontos[0][0]:.1f} {pontos[0][1]:.1f}"
    for x, y in pontos[1:]:
        d += f"L{x:.1f} {y:.1f}"
    return d + "Z"


def main():
    stem_x = 96
    topo, base = 40, 560
    junta = 372  # altura em que as diagonais encostam na haste

    formas = [
        barra_vertical(stem_x, topo, base, TRACO),
        # Braço superior: sobe da haste até o alto à direita.
        barra_diagonal((stem_x + TRACO / 2 - 12, junta), (452, 132), TRACO),
        # Perna inferior: desce da haste até a base à direita.
        barra_diagonal((stem_x + TRACO / 2 - 12, junta - 34), (470, base), TRACO),
    ]

    corpos = "\n    ".join(f'<path d="{para_path(f)}" />' for f in formas)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {LARGURA} {ALTURA}" width="{LARGURA}" height="{ALTURA}">
  <title>Marca kdiff em forma de máscara</title>
  <g fill="#000">
    {corpos}
  </g>
</svg>
"""
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with open(SAIDA, "w") as f:
        f.write(svg)
    print(f"gravado em {SAIDA} ({len(svg)} bytes)")


if __name__ == "__main__":
    main()
