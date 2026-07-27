"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { perguntasFrequentes } from "@/data/faq";
import { cn } from "@/lib/utils";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Accordion seguindo o padrão ARIA: cada pergunta é um `button` com
 * `aria-expanded` e `aria-controls`, e cada resposta é uma região rotulada
 * pelo botão correspondente. Permite mais de um item aberto ao mesmo tempo.
 */
export default function Faq() {
  const [abertos, setAbertos] = useState<string[]>([]);

  const alternar = (id: string) => {
    setAbertos((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id],
    );
  };

  return (
    <Section id="faq" fundo="claro-alt">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeading
          tom="claro"
          etiqueta="Perguntas frequentes"
          titulo="Dúvidas que aparecem antes de começar"
          descricao="Se a sua pergunta não estiver aqui, é só chamar no WhatsApp — respondemos sem compromisso."
          className="lg:sticky lg:top-28"
        />

        <div className="divide-y divide-grafite-200 border-y border-grafite-200">
          {perguntasFrequentes.map((item) => {
            const aberto = abertos.includes(item.id);
            const idBotao = `faq-botao-${item.id}`;
            const idPainel = `faq-painel-${item.id}`;

            return (
              <div key={item.id}>
                <h3>
                  <button
                    type="button"
                    id={idBotao}
                    aria-expanded={aberto}
                    aria-controls={idPainel}
                    onClick={() => alternar(item.id)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-marca-600"
                  >
                    <span className="font-display text-base font-semibold text-grafite-900 sm:text-lg">
                      {item.pergunta}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "size-5 shrink-0 text-grafite-400 transition-transform duration-300",
                        aberto && "rotate-180 text-marca-600",
                      )}
                    />
                  </button>
                </h3>

                <div
                  id={idPainel}
                  role="region"
                  aria-labelledby={idBotao}
                  hidden={!aberto}
                  className="pb-6"
                >
                  <p className="max-w-2xl text-sm leading-relaxed text-grafite-500 sm:text-base">
                    {item.resposta}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
