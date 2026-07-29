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
│   ├── ui/                         primitivos (Button, Card, Section, Reveal…)
│   └── visual/                     peças decorativas (marca, faixa, painel…)
├── data/                           conteúdo, separado da interface
├── public/images/                  fotos em WebP, textura e máscara da marca
└── lib/
    ├── site-config.ts              configuração central (contatos, domínio)
    ├── validacao-contato.ts        regras usadas no cliente e no servidor
    ├── whatsapp.ts                 montagem dos links de WhatsApp
    ├── use-movimento-reduzido.ts   preferência de movimento, segura para hidratar
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

## Camada visual

### Imagens

Tudo mora em `public/images/`, em WebP, servido pelo próprio projeto — nenhuma
imagem vem de domínio externo em tempo de execução.

| Arquivo | Onde aparece |
| --- | --- |
| `mascara-marca.svg` | recorte do “k” usado como máscara alfa (gerado por script, não é foto) |
| `marca-cena-poster.webp` | primeiro quadro do vídeo; aparece com movimento reduzido |
| `cena-aurora.webp` | ilustração de fundo (usada ao gravar o vídeo) |
| `figura-costas.webp` | primeira pose do giro (só na gravação do vídeo) |
| `figura-perfil.webp` | segunda pose do giro (só na gravação do vídeo) |
| `equipe-trabalho.webp` | seção “Sobre o estúdio” |
| `segmento-*.webp` (6) | prévias dos projetos do portfólio |

Vídeo em `public/videos/`:

| Arquivo | Onde aparece |
| --- | --- |
| `marca-cena.mp4` | animação dentro do recorte da marca no topo (laço de 8s) |

As fotos de seção vêm do Unsplash, sob a
[licença da plataforma](https://unsplash.com/license). A cena da marca e as duas
poses da figura são ilustrações originais feitas para o projeto. Autoria,
origem e descrição de cada arquivo ficam em `public/images/creditos.json`.

### A cena dentro da marca (vídeo)

O “k” do topo é recortado pela máscara alfa da letra e, dentro dela, roda um
vídeo em loop: `public/videos/marca-cena.mp4`. O componente é
`components/visual/MarcaAurora.tsx`. Com `prefers-reduced-motion: reduce` o
vídeo some e fica o pôster parado (`marca-cena-poster.webp`).

**Trocar a animação por outro MP4**

1. Coloque o arquivo em `site/public/videos/marca-cena.mp4` (substitua o existente).
2. Gere um pôster do primeiro quadro, para o celular e para movimento reduzido:

   ```bash
   ffmpeg -i site/public/videos/marca-cena.mp4 -frames:v 1 \
     -vf "scale=1120:-2" -quality 82 site/public/images/marca-cena-poster.webp
   ```

3. Rebuild e teste: `cd site && npm run build && npm start`.

O vídeo precisa ser **sem áudio**, em loop visual (o HTML usa `loop`), e com
proporção parecida com 560 × 600 — a mesma do recorte da marca. H.264 em
`yuv420p` abre em todos os navegadores.

**Regenerar o vídeo a partir da cena em CSS**

Se você altera a cena em `components/visual/CenaAurora.tsx` (aurora, figura,
estrelas), regrave o MP4:

```bash
cd site && npm run build
ALLOW_RENDER=1 npm start -- -p 3600
python3 scripts/gera-video-marca.py
```

O script abre `/render/marca`, posiciona cada quadro do laço de 8s e monta o
MP4 com `ffmpeg`. A rota `/render/marca` só existe em desenvolvimento ou com
`ALLOW_RENDER=1` no servidor de produção.

### Movimento

Todos os laços animam apenas `transform` e `opacity`, resolvidos na GPU, e
nenhum altera o tamanho do elemento — por isso não há deslocamento de conteúdo
enquanto rodam. As curvas estão em `globals.css`, sob `@layer utilities`.

O giro da figura e o brilho da aurora dividem a mesma duração de 8s, para que a
aurora esteja no auge quando a figura está de perfil. As outras camadas correm
em tempos próprios: períodos que não se dividem entre si demoram muito a
coincidir, e o céu nunca repete exatamente o mesmo desenho.

| Animação | Duração | Onde |
| --- | --- | --- |
| `marca-cena.mp4` | 8s em loop | recorte da marca no topo (vídeo, não CSS) |
| `girar-para-perfil` / `girar-para-costas` | 8s | só em `/render/marca` ao gravar o vídeo |
| `acender-aurora` | 8s | idem |
| `respirar` | 4s | oscilação vertical do corpo inteiro |
| `cintilar` | 5,5s / 7s | duas camadas de estrelas em ritmos diferentes |
| `subir-esfera` | 13s a 21s | quatro esferas de luz atravessando a cena |
| `aproximar-cena` | 24s | aproximação lenta da câmera sobre a ilustração |
| `aurora-deriva` | 22s / 30s | manchas de cor passeando por trás do brilho |
| `flutuar` | 6s / 7s | selos de desempenho e prévia de celular no topo |
| `varredura` | 7s | reflexo que cruza a janela do mockup |
| `girar-lento` | 40s | gradiente cônico sob o bloco principal do mockup |
| `encher-barra` | 4,5s | barra de carregamento do mockup |
| `correr-faixa` | 46s | faixa de segmentos atendidos |
| `subir-perspectiva` | 18s | painel de palavras em perspectiva |

Fora dos laços: entrada escalonada por seção (`Reveal`, 0,5s com deslocamento de
22px), parallax de 50px na marca do topo (`Parallax`), e nos cartões de projeto
uma elevação de 4px com aproximação de 6% na imagem.

Sob `prefers-reduced-motion: reduce` os laços param, as entradas saltam direto
para o estado final e o parallax fica travado em zero. Os componentes de
movimento leem a preferência por `useSyncExternalStore`
(`lib/use-movimento-reduzido.ts`), o que mantém a mesma árvore no servidor e no
cliente durante a hidratação.

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
bash scripts/servidor.sh                               # reconstrói e sobe em :3500
python3 scripts/verifica-responsividade.py --completo  # 7 larguras, 3 páginas
python3 scripts/testa-interacoes.py                    # menu, FAQ, carrossel, formulário
python3 scripts/testa-acessibilidade.py                # teclado, ARIA, movimento reduzido
python3 scripts/verifica-contraste.py                  # contraste WCAG
python3 scripts/testa-animacoes.py                     # assets, laços, parallax, hover
```

`testa-animacoes.py` abre o Chrome com janela real dentro de um display virtual
(`xvfb-run`), e não em `--headless`. O modo headless declara `(hover: none)`, e o
Tailwind v4 embala as utilidades `hover:` em `@media (hover: hover)` — sob
headless nenhum efeito de mouse chega a valer e o teste acusaria falha em algo
que funciona no navegador do usuário.

Para revisão visual, `captura.py` tira telas do site local (`--completo` fatia a
página inteira, `--larguras` escolhe as viewports), `captura-secoes.py` gera uma
imagem por seção e `filmstrip-mobile.py` percorre a home no celular.

O laço da marca não cabe numa captura só — cada tela pega um instante escolhido
pelo acaso do carregamento. `amostra-cena.py` pausa as animações do laço, move o
relógio delas à mão e monta uma tira com o ciclo inteiro, o que torna a revisão
comparável entre execuções:

```bash
python3 scripts/amostra-cena.py --quadros 16
```

Os scripts de apoio ao trabalho visual ficam no mesmo diretório:
`analisa-referencia.py` e `analisa-animacoes-referencia.py` inspecionam um site
externo; `escolhe-fotos.py`, `fixa-foto.py` e `baixa-fotos.py` buscam, convertem
e registram fotografia do Unsplash; `gera-mascara-marca.py` reescreve o SVG do
recorte da marca; `recorta-figura.py` tira as poses da figura do fundo branco e
alinha uma com a outra; `gera-video-marca.py` grava `public/videos/marca-cena.mp4`
a partir da cena em `/render/marca`.

Todos precisam do Chrome instalado e do pacote `websocket-client`.
