# Evaluation: Segundo Cérebro (Second Brain)

**Upstream:** [orobsonn/segundo-cerebro](https://github.com/orobsonn/segundo-cerebro)  
**Snapshot commit:** `a527f09c73d1e4ed9e36bd148bc59d8961ab694b` (2026-04-21)  
**Archive in this repo:** [`archives/segundo-cerebro.tz`](../archives/segundo-cerebro.tz)  
**Evaluated:** 2026-07-16

## Verdict

**Strong fit** for a sovereign, Claude-native personal knowledge graph on Cloudflare. The project is production-shaped (MCP + OAuth + D1/Vectorize + web dashboard), opinionated about note quality, and well tested. Main blockers before treating it as a long-term base: **no LICENSE**, **dependency vulnerabilities**, and a few operational caveats (token overhead, Vectorize eventual consistency).

## What it is

Internal package name is `mind-vault`; product name is **Segundo Cérebro**. It is a single-user MCP server that:

- Captures atomic notes (title / body / Feynman-style `tldr` / domains / kind)
- Links notes with typed edges that require a substantive `why`
- Retrieves via hybrid recall (Vectorize embeddings + D1/FTS)
- Exposes a passphrase-gated web dashboard and graph view
- Deploys entirely on Cloudflare free tier (Workers, D1, Vectorize, Workers AI, KV)

## Architecture snapshot

| Layer | Implementation |
| --- | --- |
| Runtime | Cloudflare Worker + Durable Object (`MindVaultMCP`) |
| Auth | OAuth 2.1 + dynamic client registration; PBKDF2 passphrase for dashboard |
| Storage | D1 (`notes`, `edges`, `tags`, FTS5) |
| Search | Vectorize + `@cf/baai/bge-m3` (1024-dim, multilingual) |
| MCP tools | `save_note`, `recall`, `get_note`, `update_note`, `delete_note`, `link`, `expand`, `stats`, `reembed` |
| Web UI | Server-rendered notes + Sigma/graphology graph client |
| Agent setup | Deterministic runbook in `CLAUDE.md` |

Schema enforces 9 edge types (`analogous_to`, `same_mechanism_as`, `contradicts`, `refines`, …) and rejects weak justifications.

## Quality signals (verified in this environment)

| Check | Result |
| --- | --- |
| Automated tests | **108 passed** (107 + 1 auth suite) across 22 files |
| Typecheck | **Pass** (`tsc --noEmit` for worker + graph client) |
| Source size | ~88 tracked files; ~3.6k LOC in `src/**/*.ts` |
| Docs | Strong Portuguese README + agent runbook + design specs |
| CI | GitHub Actions deploy workflow present |

## Strengths

1. **Clear product thesis** — thinking tool, not a dump inbox; tool descriptions encode the discipline.
2. **Sovereign stack** — data stays in the user’s Cloudflare account; no third-party PKM SaaS.
3. **Cross-domain design** — domains + analogy-first edges match latticework / Zettelkasten intent.
4. **Agent-first install** — `CLAUDE.md` is a concrete provision/deploy runbook.
5. **Test coverage** — tools, validation, web handlers, and auth have automated coverage.

## Risks / gaps

1. **No license** — GitHub reports no LICENSE; `package.json` is `"private": true` with no `license` field. Default copyright applies; redistributing or modifying for production needs an explicit grant from the author.
2. **npm audit** — 24 reported issues (2 critical, 9 high) mostly via transitive deps (`agents`, `wrangler`/`vitest` tooling, `esbuild`). Needs a dependency bump pass before hardened deploy.
3. **Claude token overhead** — MCP instructions/tools inject ~2.4k tokens per cold request; unsuitable for Claude Free, selective use on Pro.
4. **Vectorize lag** — docs correctly warn that fresh notes may take 1–2 minutes to appear in vector recall.
5. **Single-tenant only** — one owner email/passphrase; not a multi-user product.
6. **Graph tests noisy** — some graph tests log Vectorize mock failures while still passing (mock completeness gap, not a functional blocker).

## Fit for this repository (`dougfsantos2026/segundo-cerebro`)

| Criterion | Assessment |
| --- | --- |
| Name / mission alignment | Exact match (Segundo Cérebro / Second Brain) |
| Include as archive | Done — `archives/segundo-cerebro.tz` |
| Ready to fork as primary codebase | Yes technically; **clarify license with upstream first** |
| Ready to deploy as-is | After Cloudflare resource setup + secret provisioning + dependency updates |

## Recommendation

1. Keep the `.tz` snapshot as the vendored reference (done).
2. Contact or check upstream for an OSI license (MIT/Apache-2.0 preferred) before heavy modification.
3. If adopting as the active codebase: extract the archive, bump vulnerable deps, run `npm test` / `npm run typecheck`, then follow `CLAUDE.md` for deploy.
4. Treat this as a **discipline-shaped MCP vault**, not a general note-taking app.

## Extract the archive

```bash
tar -xzf archives/segundo-cerebro.tz
cd segundo-cerebro
npm ci
npm test
```
