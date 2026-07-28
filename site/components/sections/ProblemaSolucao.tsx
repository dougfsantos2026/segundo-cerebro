import { ArrowRight } from "lucide-react";
import { iconeSolucao as IconeSolucao, problemas, solucoes } from "@/data/problemas";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import PainelPalavras from "@/components/visual/PainelPalavras";

export default function ProblemaSolucao() {
  return (
    <Section fundo="escuro-alt">
      <SectionHeading
        etiqueta="O problema"
        titulo={
          <>
            Um site desatualizado{" "}
            <span className="texto-gradiente-claro">afasta clientes</span> antes
            mesmo do primeiro contato
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

      {/* A partir daqui a seção vira duas colunas: o painel de palavras à
          esquerda quebra o bloco de texto e sustenta o resto da altura. */}
      <div className="mt-20 grid items-start gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal origem="esquerda" className="lg:sticky lg:top-28">
          <PainelPalavras
            /* A lista precisa ser mais longa que a janela do painel; com
               poucas palavras a mesma aparece em cima e embaixo ao mesmo
               tempo e o loop fica evidente. */
            palavras={[
              "Confiança",
              "Clareza",
              "Velocidade",
              "Contato",
              "Credibilidade",
              "Resultado",
              "Autoridade",
              "Presença",
              "Constância",
              "Alcance",
            ]}
            className="h-72 w-full sm:h-80 lg:h-[26rem]"
          />
        </Reveal>

        <div>
          <Reveal>
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

          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
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
        </div>
      </div>
    </Section>
  );
}
