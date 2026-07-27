import { Check } from "lucide-react";
import { planos } from "@/data/planos";
import { linkWhatsappSobre } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export default function Planos() {
  return (
    <Section fundo="claro">
      <SectionHeading
        tom="claro"
        alinhamento="centro"
        etiqueta="Formatos de projeto"
        titulo="Escolha o ponto de partida do seu site"
        descricao="Cada projeto é orçado conforme o escopo, por isso não trabalhamos com tabela fixa de preços. Conte o que precisa e receba uma proposta com valor fechado."
      />

      <ul className="mt-14 grid items-start gap-6 lg:grid-cols-3">
        {planos.map((plano, indice) => (
          <Reveal as="li" key={plano.slug} delay={indice * 0.07}>
            <Card
              tom="claro"
              destaque={plano.destaque}
              className={cn(
                "flex h-full flex-col p-7 sm:p-8",
                plano.destaque && "lg:-mt-4 lg:pb-10",
              )}
            >
              {plano.destaque ? (
                <span className="mb-5 inline-flex w-fit items-center rounded-full bg-marca-600 px-3 py-1 text-xs font-semibold text-white">
                  Mais procurado
                </span>
              ) : null}

              <h3 className="text-2xl text-grafite-900">{plano.nome}</h3>
              <p className="mt-3 text-sm leading-relaxed text-grafite-500">
                {plano.resumo}
              </p>

              <p className="mt-5 rounded-xl bg-grafite-50 p-4 text-sm text-grafite-600">
                <span className="font-semibold text-grafite-700">
                  Indicado para:{" "}
                </span>
                {plano.indicadoPara}
              </p>

              <ul className="mt-6 space-y-3">
                {plano.itens.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-grafite-600"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-marca-600"
                      aria-hidden="true"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Button
                  href={linkWhatsappSobre(`o formato ${plano.nome}`)}
                  externo
                  tom="claro"
                  tamanho="lg"
                  variante={plano.destaque ? "primario" : "secundario"}
                  className="w-full"
                >
                  Solicite uma proposta
                  <span className="sr-only"> para o formato {plano.nome}</span>
                </Button>
              </div>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
