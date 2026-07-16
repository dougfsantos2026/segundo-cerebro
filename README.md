# Segundo Cérebro

This repository vendors and evaluates the existing **Second Brain / Segundo Cérebro** project ([orobsonn/segundo-cerebro](https://github.com/orobsonn/segundo-cerebro)) — a sovereign personal knowledge-graph MCP server on Cloudflare.

## Contents

| Path | Description |
| --- | --- |
| [`archives/segundo-cerebro.tz`](archives/segundo-cerebro.tz) | Gzip-compressed tar snapshot of the upstream project (`.tz`) |
| [`docs/EVALUATION.md`](docs/EVALUATION.md) | Evaluation: architecture, tests, strengths, risks, recommendation |
| [`docs/THIRD_PARTY_NOTICE.md`](docs/THIRD_PARTY_NOTICE.md) | Upstream attribution and license status |

## Quick start

```bash
tar -xzf archives/segundo-cerebro.tz
cd segundo-cerebro
npm ci
npm test
```

Deploy setup is documented in the extracted tree’s `CLAUDE.md` (Cloudflare D1, Vectorize, KV, Workers AI, secrets).

## Evaluation summary

**Verdict: strong fit** for a Claude-native second brain on the Cloudflare free tier. Tests and typecheck pass on the snapshotted commit. Before adopting as the long-term codebase, resolve the **missing upstream LICENSE** and run a dependency vulnerability update. Full details: [docs/EVALUATION.md](docs/EVALUATION.md).
