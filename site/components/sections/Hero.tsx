import { ArrowRight, ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import HeroMockup from "./HeroMockup";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-grafite-900 pt-32 pb-24 sm:pt-36 lg:pt-44 lg:pb-32"
    >
      {/* Elementos gráficos abstratos de fundo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fundo-pontilhado absolute inset-0 opacity-40" />
        <div className="absolute -top-40 -left-40 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(76,125,255,0.22),transparent_70%)] blur-3xl" />
        <div className="absolute -right-32 top-20 size-[32rem] rounded-full bg-[radial-gradient(circle,rgba(53,214,238,0.14),transparent_70%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px borda-luz" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-12">
          <div>
            <Reveal>
              <Badge tom="marca">
                <span className="size-1.5 rounded-full bg-ciano-400" />
                Estúdio de sites para pequenos e médios negócios
              </Badge>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 text-4xl text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
                Sites profissionais que transformam{" "}
                <span className="texto-gradiente">visitantes em clientes</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-grafite-300 sm:text-lg">
                Criamos sites modernos, rápidos e estratégicos para empresas que
                querem transmitir confiança, atrair novos clientes e crescer no
                digital.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="#contato" tamanho="lg">
                  Solicitar orçamento
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button href="#projetos" variante="secundario" tamanho="lg">
                  Conhecer projetos
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-8 flex items-start gap-2.5 text-sm text-grafite-300">
                <ShieldCheck
                  className="mt-0.5 size-4 shrink-0 text-ciano-400"
                  aria-hidden="true"
                />
                Orçamento sem compromisso e sem reunião obrigatória. Você fala
                direto com quem desenvolve o seu site.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} origem="direita" className="lg:pl-4">
            <HeroMockup />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
