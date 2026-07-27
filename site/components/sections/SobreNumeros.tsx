import { Code2, Handshake, Ruler } from "lucide-react";
import { indicadores } from "@/data/numeros";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const pilares = [
  {
    titulo: "Feito sob medida",
    descricao:
      "Cada projeto começa do zero a partir do seu negócio. Sem tema comprado, sem layout reciclado de outro cliente.",
    icone: Ruler,
  },
  {
    titulo: "Construído com cuidado técnico",
    descricao:
      "Código limpo, imagens otimizadas e testes em telas reais antes de qualquer publicação.",
    icone: Code2,
  },
  {
    titulo: "Contato direto",
    descricao:
      "Você conversa com quem desenvolve o site, sem intermediários e sem fila de atendimento.",
    icone: Handshake,
  },
];

export default function SobreNumeros() {
  return (
    <Section id="sobre" fundo="escuro">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            etiqueta="Sobre o estúdio"
            titulo="Não vendemos páginas bonitas. Entregamos ferramentas de trabalho."
            descricao="Um site precisa ser bonito, sim — mas antes disso precisa abrir rápido, funcionar no celular de qualquer cliente e deixar claro como falar com você. É nessa ordem que trabalhamos."
          />

          <ul className="mt-10 space-y-7">
            {pilares.map((pilar, indice) => {
              const Icone = pilar.icone;
              return (
                <Reveal as="li" key={pilar.titulo} delay={indice * 0.06}>
                  <div className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-ciano-400"
                    >
                      <Icone className="size-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <h3 className="text-base text-white">{pilar.titulo}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-grafite-400">
                        {pilar.descricao}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        {/*
          Indicadores com valores de exemplo.
          Os números reais devem ser preenchidos em `data/numeros.ts`.
        */}
        <div className="grid gap-4 sm:grid-cols-2 lg:content-center">
          {indicadores.map((indicador, indice) => (
            <Reveal key={indicador.rotulo} delay={indice * 0.06}>
              <Card className="h-full p-6">
                <p className="font-display text-4xl font-bold text-white sm:text-5xl">
                  {indicador.valor}
                </p>
                <p className="mt-2 text-sm font-semibold text-ciano-400">
                  {indicador.rotulo}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-grafite-400">
                  {indicador.descricao}
                </p>
              </Card>
            </Reveal>
          ))}

          <p className="text-xs text-grafite-500 sm:col-span-2">
            Os valores entre colchetes são espaços reservados e serão
            substituídos pelos números reais do estúdio.
          </p>
        </div>
      </div>
    </Section>
  );
}
