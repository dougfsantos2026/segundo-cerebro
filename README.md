# segundo-cerebro

Repositório do site institucional da **kdiff**, um estúdio que cria sites
profissionais para pequenos e médios negócios.

```
site/      aplicação Next.js — é o site em si
scripts/   auditorias e capturas que rodam contra o build de produção
docs/      especificações de design e plano de implementação
```

## Como executar

```bash
cd site
npm install
cp .env.example .env.local   # preencha domínio e WhatsApp
npm run dev                  # http://localhost:3000
```

O [README do site](site/README.md) traz o resto: estrutura de pastas, camada
visual, animações, acessibilidade, as suítes de verificação e a lista de dados
que ainda precisam ser preenchidos antes de publicar em domínio próprio.
