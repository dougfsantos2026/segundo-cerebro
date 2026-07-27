# kdiff — site institucional

Site de um estúdio que cria sites profissionais para pequenos e médios
negócios. Página única com navegação por âncoras, formulário de orçamento e
três demonstrações navegáveis.

## Tecnologia

| Item | Versão |
| --- | --- |
| Next.js (App Router) | 16 |
| React | 19 |
| TypeScript | 5 (modo estrito) |
| Tailwind CSS | 4 (tokens via `@theme`) |
| Ícones | `lucide-react` |
| Animações | `framer-motion` |
| Métricas | `@vercel/analytics` |

## Como executar localmente

```bash
cd site
npm install
cp .env.example .env.local   # preencha domínio e WhatsApp
npm run dev                  # http://localhost:3000
```

Outros comandos:

```bash
npm run lint      # ESLint
npx tsc --noEmit  # verificação de tipos
npm run build     # build de produção
npm start         # serve o build
```

## Estrutura

```
site/
├── app/
│   ├── layout.tsx                  metadata global, fontes, JSON-LD da empresa
│   ├── page.tsx                    composição da home + JSON-LD do FAQ
│   ├── globals.css                 tokens de design e estilos base
│   ├── opengraph-image.tsx         imagem de compartilhamento gerada no build
│   ├── robots.ts / sitemap.ts      arquivos de indexação
│   ├── api/contato/route.ts        recebe o formulário (envio simulado)
│   ├── politica-de-privacidade/
│   ├── termos-de-uso/
│   └── demos/                      três sites de demonstração
├── components/
│   ├── layout/                     cabeçalho, rodapé, WhatsApp flutuante
│   ├── sections/                   uma seção da home por arquivo
│   └── ui/                         primitivos (Button, Card, Section, Reveal…)
├── data/                           conteúdo, separado da interface
└── lib/
    ├── site-config.ts              configuração central (contatos, domínio)
    ├── validacao-contato.ts        regras usadas no cliente e no servidor
    ├── whatsapp.ts                 montagem dos links de WhatsApp
    └── utils.ts
```

O conteúdo mora em `data/` e a interface em `components/`. Para trocar textos,
serviços ou projetos, edite apenas os arquivos de `data/` — nenhum componente
precisa ser tocado.

## Configuração

Contatos, domínio e redes sociais ficam em `lib/site-config.ts`. Os dois
valores que mudam por ambiente vêm de variáveis (ver `.env.example`):

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domínio público, sem barra final. Usado em canonical, sitemap e Open Graph. |
| `NEXT_PUBLIC_WHATSAPP_NUMERO` | Somente dígitos: país + DDD + número. |

O número de WhatsApp nunca aparece escrito dentro de um componente: todos os
links passam por `lib/whatsapp.ts`.

## Formulário de orçamento

O envio hoje é **simulado**: `app/api/contato/route.ts` valida os dados,
registra o pedido no log do servidor e responde sucesso. Nenhum e-mail é
enviado.

Para conectar um serviço real, substitua o bloco marcado como
`PONTO DE INTEGRAÇÃO` nesse arquivo — o comentário lista as opções (e-mail
transacional, webhook de CRM ou banco de dados). Guarde chaves de API em
variáveis de ambiente **sem** o prefixo `NEXT_PUBLIC_`.

Proteção contra spam em duas camadas: um campo-armadilha invisível e uma
verificação de tempo mínimo de preenchimento.

## Dados que ainda precisam ser preenchidos

Todos estão marcados com `SUBSTITUIR` ou `[X]` no código:

| Onde | O que falta |
| --- | --- |
| `lib/site-config.ts` | domínio, WhatsApp, e-mail, telefone de exibição, cidade, ano de fundação, links das redes sociais |
| `data/numeros.ts` | os quatro indicadores, hoje exibidos como `[X]` |
| `data/depoimentos.ts` | depoimentos reais; marque `preenchido: true` ao substituir |
| `data/projetos.ts` | projetos reais de clientes, se houver autorização |
| `app/politica-de-privacidade` e `app/termos-de-uso` | revisão jurídica dos textos base |

## Acessibilidade e desempenho

- Contraste verificado em todos os textos renderizados (mínimo WCAG AA)
- Navegação por teclado com foco visível e atalho “pular para o conteúdo”
- `prefers-reduced-motion` desliga as animações sem esconder conteúdo
- Conteúdo permanece visível mesmo sem JavaScript
- Sem rolagem horizontal de 320px a 1920px
- Imagens otimizadas por `next/image`, com carregamento sob demanda

## Verificação

Os scripts em `../scripts/` rodam contra o build de produção
(`npm start -- -p 3500`):

```bash
python3 scripts/verifica-responsividade.py --completo  # 7 larguras, 3 páginas
python3 scripts/testa-interacoes.py                    # menu, FAQ, carrossel, formulário
python3 scripts/testa-acessibilidade.py                # teclado, ARIA, movimento reduzido
python3 scripts/verifica-contraste.py                  # contraste WCAG
```
