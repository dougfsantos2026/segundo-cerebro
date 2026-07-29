<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- The app is a single Next.js 16 / React 19 site living in `site/` (npm, `package-lock.json`). The update script already ran `npm install` for it on startup.
- Dev server: from `site/`, run `npm run dev` (Turbopack, http://localhost:3000). Lint/typecheck/build commands are in `site/README.md` (`npm run lint`, `npx tsc --noEmit`, `npm run build`).
- Env vars are non-secret and only affect canonical URLs / WhatsApp links (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMERO`). The site runs without them; copy `site/.env.example` to `site/.env.local` to customize. `.env.local` is gitignored.
- Budget form: the UI posts to `app/api/contato/route.ts`, which is a SIMULATED handler — it validates and only `console.info`s the request to the dev-server log (no email/DB). Verify submissions by checking the server output, not an inbox.
- The Python scripts in `../scripts/` (responsiveness/interaction/accessibility checks) run against a production build on port 3500 and require Chrome + the `websocket-client` package; these are not installed by the update script.
