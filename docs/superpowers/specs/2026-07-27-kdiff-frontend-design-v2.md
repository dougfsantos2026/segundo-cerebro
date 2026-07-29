# Frontend Design — kdiff v2 (execução real)

## Subject / job
Fachada digital de negócio de bairro. Job: WhatsApp.

## Tokens
| Token | Hex | Uso |
|---|---|---|
| tinta | `#0C1614` | texto, CTA final, sombras |
| papel | `#E4E7DE` | fundo página + atmosfera |
| toldo | `#0B4F40` | awning, acentos de rua |
| sinal | `#F5B942` | só CTAs WhatsApp |
| cal | `#FFFEF8` | superfícies claras |

Font vars renomeadas para `--font-k-*` (evita colisão Tailwind `--font-mono`).

## Layout
- Hero full-bleed: toldo listrado + vitrine com letreiro vivo
- Brand `kdiff.` hero-level no primeiro viewport
- Seções quietas, tipográficas; cards só onde há interação (FAQ details, demos clicáveis)
- Sem badges flutuantes no hero

## Signature
Letreiro na vitrine atualizado ao digitar o nome do negócio — o único momento memorável.

## Motion (CSS)
1. Hero: toldo + copy entram em sequência
2. Letreiro: fade 150ms ao digitar
3. Demos/links: translateY + sombra leve no hover
4. prefers-reduced-motion respeitado

## Critica vs defaults IA
Não é cream+serif+terracotta, nem dark+neon, nem broadsheet. É material de comércio: toldo, vidro, letreiro.
