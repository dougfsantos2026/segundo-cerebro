import { ArrowRight, Check } from "lucide-react";
import { servicos } from "@/data/servicos";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Servicos() {
  return (
    <Section id="servicos" fundo="claro">
      <SectionHeading
        tom="claro"
        etiqueta="Serviços"
        titulo="O que podemos construir para o seu negócio"
        descricao="Do site institucional à loja virtual, cada projeto é montado sobre a mesma base: velocidade, clareza e um caminho evidente até o contato."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {servicos.map((servico, indice) => {
          const Icone = servico.icone;
          return (
            <Reveal as="li" key={servico.slug} delay={(indice % 4) * 0.05}>
              <Card tom="claro" interativo className="group flex h-full flex-col p-6">
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 items-center justify-center rounded-xl bg-marca-500/10 text-marca-600 transition-colors duration-300 group-hover:bg-marca-500 group-hover:text-white"
                >
                  <Icone className="size-5" strokeWidth={1.75} />
                </span>

                <h3 className="mt-5 text-lg text-grafite-900">{servico.titulo}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-grafite-500">
                  {servico.descricao}
                </p>

                <ul className="mt-5 space-y-2">
                  {servico.beneficios.map((beneficio) => (
                    <li
                      key={beneficio}
                      className="flex items-start gap-2 text-sm text-grafite-600"
                    >
                      <Check
                        className="mt-1 size-3.5 shrink-0 text-marca-600"
                        aria-hidden="true"
                        strokeWidth={2.5}
                      />
                      {beneficio}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contato"
                  className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-sm font-semibold text-marca-600 transition-colors hover:text-marca-700"
                >
                  Saber mais
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">sobre {servico.titulo}</span>
                </a>
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
