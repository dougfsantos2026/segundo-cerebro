import { ArrowRight } from "lucide-react";
import { iconeSolucao as IconeSolucao, problemas, solucoes } from "@/data/problemas";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ProblemaSolucao() {
  return (
    <Section fundo="escuro-alt">
      <SectionHeading
        etiqueta="O problema"
        titulo={
          <>
            Um site desatualizado afasta clientes{" "}
            <span className="text-grafite-400">antes mesmo do primeiro contato</span>
          </>
        }
        descricao="Na maioria das vezes o problema não é falta de visitas — é o que acontece nos primeiros segundos depois que a pessoa abre a página."
      />

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problemas.map((problema, indice) => {
          const Icone = problema.icone;
          return (
            <Reveal as="li" key={problema.titulo} delay={indice * 0.05}>
              <Card className="h-full p-6">
                <Icone
                  className="size-6 text-grafite-350"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-base text-white">{problema.titulo}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-grafite-300">
                  {problema.descricao}
                </p>
              </Card>
            </Reveal>
          );
        })}
      </ul>

      <Reveal className="mt-20">
        <div className="flex items-center gap-4">
          <span
            aria-hidden="true"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-marca-600/15 text-marca-300"
          >
            <ArrowRight className="size-5" />
          </span>
          <h3 className="text-2xl text-white sm:text-3xl">
            Como um site bem construído resolve
          </h3>
        </div>
      </Reveal>

      <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {solucoes.map((solucao, indice) => (
          <Reveal as="li" key={solucao.titulo} delay={indice * 0.05}>
            <div className="flex gap-3.5">
              <IconeSolucao
                className="mt-0.5 size-5 shrink-0 text-ciano-400"
                aria-hidden="true"
                strokeWidth={2}
              />
              <div>
                <h4 className="font-display text-base font-semibold text-white">
                  {solucao.titulo}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-grafite-300">
                  {solucao.descricao}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
