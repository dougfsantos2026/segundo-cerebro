import { etapas } from "@/data/processo";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Processo() {
  return (
    <Section id="processo" fundo="claro">
      <SectionHeading
        tom="claro"
        etiqueta="Como funciona"
        titulo={
          <>
            Um <span className="texto-gradiente">processo claro</span>, do primeiro
            contato ao site no ar
          </>
        }
        descricao="Você sabe exatamente em que etapa o projeto está e o que se espera de você em cada uma delas."
      />

      <ol className="relative mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Linha do tempo contínua no desktop */}
        <span
          aria-hidden="true"
          className="absolute top-5 right-0 left-0 hidden h-px bg-grafite-200 lg:block"
        />

        {etapas.map((etapa, indice) => {
          const Icone = etapa.icone;
          return (
            <Reveal
              as="li"
              key={etapa.numero}
              delay={(indice % 4) * 0.06}
              className="relative"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-grafite-200 bg-white text-marca-600 shadow-[var(--shadow-suave)]"
                >
                  <Icone className="size-4.5" strokeWidth={1.75} />
                </span>
                <span className="font-display text-sm font-bold tracking-[0.14em] text-grafite-400">
                  {etapa.numero}
                </span>
              </div>

              <h3 className="mt-4 text-base text-grafite-900">{etapa.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-grafite-500">
                {etapa.descricao}
              </p>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
