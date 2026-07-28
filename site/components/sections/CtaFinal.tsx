import { ArrowRight, MessageCircle } from "lucide-react";
import { linkWhatsapp } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import MarcaAurora from "@/components/visual/MarcaAurora";

export default function CtaFinal() {
  return (
    <section className="relative overflow-hidden bg-grafite-900 py-20 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fundo-pontilhado absolute inset-0 opacity-30" />
        <div className="absolute -bottom-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(76,125,255,0.25),transparent_65%)] blur-3xl" />

        {/* A marca reaparece aqui em escala grande e bem apagada: fecha a
            página com o mesmo elemento que a abre, sem competir com o texto. */}
        <MarcaAurora className="absolute -bottom-1/4 left-1/2 aspect-560/600 h-[150%] -translate-x-1/2 opacity-[0.07]" />
      </div>

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl text-white sm:text-4xl lg:text-5xl">
            Seu negócio merece um site que{" "}
            <span className="texto-gradiente-claro">
              transmita profissionalismo
            </span>
            .
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-grafite-300 sm:text-lg">
            Conte um pouco sobre sua empresa e receba uma proposta para
            transformar sua presença digital.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#contato" tamanho="lg" className="w-full sm:w-auto">
              Solicitar orçamento
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button
              href={linkWhatsapp()}
              externo
              variante="secundario"
              tamanho="lg"
              className="w-full sm:w-auto"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Falar pelo WhatsApp
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
