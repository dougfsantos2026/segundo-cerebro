import { Check, X } from "lucide-react";
import { comparativo } from "@/data/comparativo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Comparativo() {
  return (
    <Section fundo="escuro">
      <SectionHeading
        etiqueta="Comparativo"
        titulo={
          <>
            A diferença entre um site improvisado e um{" "}
            <span className="texto-gradiente-claro">site profissional</span>
          </>
        }
        descricao="Os dois ficam no ar. Só um deles trabalha a favor do seu negócio todos os dias."
      />

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <Reveal origem="esquerda">
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-7 sm:p-8">
            <h3 className="flex items-center gap-3 text-xl text-grafite-300">
              <span
                aria-hidden="true"
                className="inline-flex size-8 items-center justify-center rounded-full bg-grafite-700 text-grafite-300"
              >
                <X className="size-4" strokeWidth={2.5} />
              </span>
              Site improvisado
            </h3>

            <ul className="mt-7 space-y-4">
              {comparativo.map((linha) => (
                <li key={linha.criterio} className="flex gap-3 text-sm">
                  <X
                    className="mt-0.5 size-4 shrink-0 text-grafite-400"
                    aria-hidden="true"
                    strokeWidth={2.5}
                  />
                  <span className="text-grafite-300">
                    <span className="sr-only">{linha.criterio}: </span>
                    {linha.improvisado}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal origem="direita">
          <div className="relative h-full overflow-hidden rounded-2xl border border-marca-500/40 bg-marca-500/[0.07] p-7 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 size-64 rounded-full bg-[radial-gradient(circle,rgba(76,125,255,0.3),transparent_70%)] blur-2xl"
            />
            <div className="relative">
              <h3 className="flex items-center gap-3 text-xl text-white">
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-full bg-marca-600 text-white"
                >
                  <Check className="size-4" strokeWidth={2.5} />
                </span>
                Site profissional
              </h3>

              <ul className="mt-7 space-y-4">
                {comparativo.map((linha) => (
                  <li key={linha.criterio} className="flex gap-3 text-sm">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-ciano-400"
                      aria-hidden="true"
                      strokeWidth={2.5}
                    />
                    <span className="text-grafite-200">
                      <span className="sr-only">{linha.criterio}: </span>
                      {linha.profissional}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
