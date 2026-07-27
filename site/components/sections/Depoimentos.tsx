"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { depoimentos } from "@/data/depoimentos";
import { cn } from "@/lib/utils";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Carrossel de depoimentos sem reprodução automática — o usuário controla a
 * navegação, o que evita conteúdo em movimento sem consentimento.
 */
export default function Depoimentos() {
  const [indice, setIndice] = useState(0);
  const total = depoimentos.length;

  const irPara = (proximo: number) => {
    setIndice((proximo + total) % total);
  };

  const atual = depoimentos[indice];

  return (
    <Section fundo="escuro-alt">
      <SectionHeading
        alinhamento="centro"
        etiqueta="Depoimentos"
        titulo="O que os clientes dizem"
        descricao="Esta seção está reservada para depoimentos reais, publicados apenas com autorização de cada cliente."
      />

      <div
        className="mx-auto mt-14 max-w-3xl"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Depoimentos de clientes"
      >
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10">
          <Quote
            className="size-8 text-marca-500/50"
            aria-hidden="true"
            strokeWidth={1.5}
          />

          <div aria-live="polite" aria-atomic="true">
            <div
              key={atual.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Depoimento ${indice + 1} de ${total}`}
            >
              <blockquote>
                <p
                  className={cn(
                    "mt-5 text-lg leading-relaxed sm:text-xl",
                    atual.preenchido
                      ? "text-grafite-100"
                      : "text-grafite-500 italic",
                  )}
                >
                  {atual.texto}
                </p>
              </blockquote>

              <footer className="mt-7 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white/5 font-display text-sm font-bold text-grafite-400"
                >
                  {atual.preenchido ? atual.autor.charAt(0) : "—"}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      atual.preenchido ? "text-white" : "text-grafite-500",
                    )}
                  >
                    {atual.autor}
                  </p>
                  <p className="text-xs text-grafite-500">{atual.cargo}</p>
                </div>
              </footer>
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => irPara(indice - 1)}
            aria-label="Depoimento anterior"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-grafite-300 transition-colors hover:border-white/30 hover:text-white"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>

          <ul className="flex items-center gap-2">
            {depoimentos.map((depoimento, posicao) => (
              <li key={depoimento.id}>
                <button
                  type="button"
                  onClick={() => irPara(posicao)}
                  aria-label={`Ir para o depoimento ${posicao + 1}`}
                  aria-current={posicao === indice ? "true" : undefined}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    posicao === indice
                      ? "w-7 bg-ciano-400"
                      : "w-2 bg-white/20 hover:bg-white/40",
                  )}
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => irPara(indice + 1)}
            aria-label="Próximo depoimento"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-grafite-300 transition-colors hover:border-white/30 hover:text-white"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Section>
  );
}
