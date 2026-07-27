# kdiff site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline) — o brief exige Passos 1–20 na ordem, sem pular/juntar.

**Goal:** Entregar o site da kdiff conforme o plano de execução v2.

**Architecture:** Next.js App Router em `site/`, componentes por seção, helper WhatsApp, 3 demos estáticas com `FaixaDemo`, SEO via sitemap/robots/JSON-LD, Analytics Vercel.

**Tech Stack:** Next.js (latest), TypeScript, Tailwind CSS, `@vercel/analytics`, CSS puro para motion.

## Global Constraints

- Copy e código fornecidos no brief: copiar exatamente.
- Sem `npm install` além de `@vercel/analytics` (Passo 18).
- Placeholders: `SEUNUMERO`, `SEUDOMINIO` se Douglas não informou.
- Verificação ✅ de cada passo antes do próximo.

---

### Task 1: Scaffold (Passos 1–2)

**Files:** Create `site/` via create-next-app; limpar boilerplate.

- [ ] Passo 1: `npx create-next-app@latest site --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack` (flags não-interativas alinhadas ao Context7; aceitar defaults de React Compiler/AGENTS se o CLI perguntar via `--yes` quando necessário)
- [ ] Verificar `npm run dev` em http://localhost:3000
- [ ] Passo 2: `page.tsx` vazio; `globals.css` só Tailwind; apagar SVGs do `public/`

### Task 2: Design tokens + layout (Passos 3–4)

- [ ] Passo 3: colar tokens/CSS do brief em `globals.css`
- [ ] Passo 4: `layout.tsx` com Bricolage Grotesque, Instrument Sans, JetBrains Mono + metadata

### Task 3: WhatsApp + Header + Hero (Passos 5–8)

- [ ] `lib/whatsapp.ts`, `BotaoWhatsapp.tsx`, `Header.tsx`, `Hero.tsx` (código do brief)
- [ ] Verificar preview de fachada e encoding do nome no `href`

### Task 4: Seções + montagem (Passos 9–11)

- [ ] Oito componentes de conteúdo + Footer
- [ ] `WhatsappFlutuante.tsx`
- [ ] Montar `app/page.tsx`

### Task 5: Demos (Passos 12–15)

- [ ] Imagens em `public/demos/` (ou placeholders sólidos se download falhar)
- [ ] `FaixaDemo.tsx` + 3 páginas demo

### Task 6: SEO, favicon, analytics (Passos 16–18)

- [ ] `sitemap.ts`, `robots.ts`, JSON-LD no layout
- [ ] `app/icon.svg`
- [ ] `npm install @vercel/analytics` + `<Analytics />`

### Task 7: Qualidade + git (Passos 19–20)

- [ ] `npm run build`, responsividade, checklist seção 9
- [ ] Commit/push no branch do agente; PR; relatório de placeholders/pendências
