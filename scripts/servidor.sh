#!/usr/bin/env bash
# Reconstrói o site e reinicia o servidor de produção em uma sessão tmux.
#
# `next start` mantém em memória o manifesto do build que encontrou ao subir;
# se o build mudar por baixo, ele passa a devolver 500 nos arquivos novos. Por
# isso o processo antigo é sempre derrubado antes de reconstruir.
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORTA="${PORTA:-3500}"
SESSAO="${SESSAO:-kdiff-next}"
TMUX_CONF="/exec-daemon/tmux.portal.conf"

tmux_() {
  if [ -f "$TMUX_CONF" ]; then tmux -f "$TMUX_CONF" "$@"; else tmux "$@"; fi
}

echo "→ derrubando servidor anterior"
pkill -f "next-server" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true
for _ in $(seq 20); do
  ss -ltn 2>/dev/null | grep -q ":$PORTA " || break
  sleep 0.5
done

if [ "${PULAR_BUILD:-0}" != "1" ]; then
  echo "→ build"
  (cd "$RAIZ/site" && npm run build 2>&1 | tail -4)
fi

echo "→ subindo em :$PORTA"
tmux_ has-session -t "=$SESSAO" 2>/dev/null || tmux_ new-session -d -s "$SESSAO" -c "$RAIZ/site"
tmux_ send-keys -t "$SESSAO:0.0" "cd '$RAIZ/site' && npm start -- -p $PORTA" C-m

for _ in $(seq 40); do
  if [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORTA/")" = "200" ]; then
    echo "→ pronto em http://127.0.0.1:$PORTA"
    exit 0
  fi
  sleep 0.5
done

echo "→ o servidor não respondeu a tempo" >&2
tmux_ capture-pane -p -t "$SESSAO:0.0" | tail -20 >&2
exit 1
