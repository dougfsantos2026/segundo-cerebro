"use client";

import { useSyncExternalStore } from "react";

const CONSULTA = "(prefers-reduced-motion: reduce)";

function assinar(aoMudar: () => void) {
  const media = window.matchMedia(CONSULTA);
  media.addEventListener("change", aoMudar);
  return () => media.removeEventListener("change", aoMudar);
}

/**
 * A preferência de menos movimento do sistema, segura para hidratar.
 *
 * No servidor não há como saber a configuração do usuário. Ler a media query
 * direto no primeiro render do cliente produziria uma árvore diferente do HTML
 * recebido e a hidratação falharia. Com `useSyncExternalStore` o React usa o
 * retrato do servidor (`false`) enquanto hidrata e só depois passa a valer o
 * valor real — que é justamente o caso de uso para o qual o hook existe.
 *
 * Durante esse intervalo de um render a visibilidade fica garantida pela regra
 * `[data-revelar]` de `globals.css`, escrita dentro da própria media query.
 */
export function useMovimentoReduzido() {
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
