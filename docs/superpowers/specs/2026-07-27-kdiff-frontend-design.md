# Frontend Design — direção visual kdiff

**Skill:** Frontend Design (pass 1: plano de tokens/signature; pass 2: implementar exatamente o brief).

## Subject / job

Fachada digital de comércio de bairro. Job único: CTA WhatsApp.

## Color (5 tokens — brief §6.1)

| Token | Hex | Uso |
|---|---|---|
| tinta | `#101A18` | texto, fundos escuros, sombras-placa |
| papel | `#E8EAE3` | fundo body |
| toldo | `#0F5C4A` | destaques, números, faixa do toldo |
| sinal | `#FFC24B` | só CTAs (≤10% da tela); texto sobre sinal = tinta |
| cal | `#FFFFFF` | cartões / vitrine |

Proibido: gradiente roxo/azul, glassmorphism genérico, sombra blur.

## Type

- Display: **Bricolage Grotesque** 700/800 — h1, h2, números
- Body: **Instrument Sans** 400/500
- Utility: **JetBrains Mono** 500 — eyebrows/rótulos UPPERCASE, `letter-spacing: 0.08em`

## Layout

Container 1120px / padding 24px. Seções com `.secao` (96/144px). Radius 4px. Sombra placa `0 2px 0 tinta`. Hero em 2 colunas: copy + vitrine interativa.

```
[ kdiff.                    ][ WhatsApp ]
[ eyebrow                    ][ VEJA COMO FICARIA ]
[ H1 rua → internet          ][ input nome        ]
[ sub + CTA + link demos     ][ ===== TOLDO ===== ]
[                            ][ Nome | NAV        ]
[                            ][ [WhatsApp span]   ]
```

## Signature

**Preview de fachada no hero** — toldo listrado + vitrine que atualiza o nome digitado e injeta esse nome na mensagem do WhatsApp. É o único ornamento memorável; o resto fica disciplinado.

## Motion (só 3, CSS)

1. Load: título/moldura sobem 12px + fade (400ms staggered)
2. Nome na vitrine: opacity 150ms
3. Cards hover: `translateY(-2px)` + sombra 4px  
Respeitar `prefers-reduced-motion`.

## Critique vs defaults de IA

Não é cream+serif+terracotta nem dark+acid-green: é papel esverdeado + toldo verde-loja + amarelo-sinal de placa. Signature material (toldo/vitrine), não badge flutuante.
