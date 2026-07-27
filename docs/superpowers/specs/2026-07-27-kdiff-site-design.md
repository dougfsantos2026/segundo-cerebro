# Design: site kdiff

**Fonte aprovada:** plano de execução v2 (brief anexado). Este spec consolida decisões; não altera copy, paleta nem arquitetura do brief.

## Objetivo

Landing one-page da **kdiff** (sites para negócios locais) cuja única conversão é o clique em **Chamar no WhatsApp**. Três demos navegáveis (`/demos/clinica`, `/demos/salao`, `/demos/restaurante`) servem de prova social até haver clientes reais.

## Público e promessa

- Dono de negócio local (clínicas, salões, lojas, restaurantes), 30–55 anos.
- Dor: sem site (ou site ruim no celular); perde tempo respondendo horário/endereço no Instagram.
- Promessa: site mobile-first, WhatsApp em tudo, pronto para Google — sem preço na página, sem jargão de agência, sem a palavra "IA".

## Arquitetura

```
/                    → landing (11 seções + WhatsApp flutuante mobile)
/demos/clinica       → Clínica Sorriso Novo
/demos/salao         → Studio Vera Cabelo
/demos/restaurante   → Pizzaria do Beto
```

Stack: Next.js App Router + TypeScript + Tailwind CSS. Deploy Vercel. Contato só via `wa.me` (`lib/whatsapp.ts`). Sem formulário, sem `/contato`, sem preços.

## Componentes (landing)

Ordem fixa: Header → Hero (FachadaPreview) → Dores → Entregaveis → Demos → ComoFunciona → PorQueComigo → ExtraOpcional → Faq → CtaFinal → Footer (+ WhatsappFlutuante mobile).

Copy: seção 5 do brief, caractere a caractere. Placeholders `SEUNUMERO` e `SEUDOMINIO` até Douglas informar.

## Abordagens consideradas

1. **Seguir o brief à risca (recomendada)** — código, tokens e copy do documento; risco baixo de desvio de marca.
2. Design system genérico + copy adaptada — rejeitada (viola brief e identidade "fachada").
3. CMS/headless — rejeitada (YAGNI; site estático de conversão).

## Restrições absolutas

- Sem preço / "a partir de" / planos.
- Sem depoimento inventado.
- Sem "IA" / "inteligência artificial".
- Sem libs de animação (só CSS das 3 animações do brief).
- Cores só da paleta: tinta, papel, toldo, sinal, cal.
- Marca: `kdiff.` sempre minúsculas + descritor mono.

## Sucesso

Build limpo; home e 3 demos ok; WhatsApp com mensagem pré-preenchida (nome do hero quando houver); Lighthouse mobile Performance ≥ 90, Acessibilidade ≥ 95; checklist seção 9 do brief.
