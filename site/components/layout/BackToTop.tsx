"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const voltarAoTopo = () => {
    const preferSemMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: preferSemMovimento ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={voltarAoTopo}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-grafite-300 transition-colors hover:border-white/30 hover:text-white"
    >
      <ArrowUp className="size-4" aria-hidden="true" />
      Voltar ao topo
    </button>
  );
}
