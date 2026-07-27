import { beneficios } from "@/data/beneficios";
import { segmentos } from "@/data/segmentos";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Beneficios() {
  return (
    <Section fundo="claro-alt">
      <SectionHeading
        tom="claro"
        etiqueta="Diferenciais"
        titulo="O que vem junto em todo projeto"
        descricao="Não é uma lista de extras cobrados à parte. É o padrão mínimo que consideramos necessário para um site ser chamado de profissional."
      />

      <ul className="mt-14 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12">
        {beneficios.map((beneficio, indice) => {
          const Icone = beneficio.icone;
          return (
            <Reveal as="li" key={beneficio.titulo} delay={(indice % 3) * 0.05}>
              <div className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-grafite-200 bg-white text-marca-600 shadow-[var(--shadow-suave)]"
                >
                  <Icone className="size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-base text-grafite-900">{beneficio.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-grafite-500">
                    {beneficio.descricao}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>

      <Reveal className="mt-16 border-t border-grafite-200 pt-10">
        <h3 className="text-sm font-semibold tracking-[0.14em] text-grafite-500 uppercase">
          Segmentos que atendemos
        </h3>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {segmentos.map((segmento) => {
            const Icone = segmento.icone;
            return (
              <li key={segmento.nome}>
                <span className="inline-flex items-center gap-2 rounded-full border border-grafite-200 bg-white px-4 py-2 text-sm text-grafite-700">
                  <Icone
                    className="size-4 text-marca-600"
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                  {segmento.nome}
                </span>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
