import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { contato, redesSociais, siteConfig } from "@/lib/site-config";
import { linksInstitucionais, navegacaoPrincipal } from "@/data/navegacao";
import { servicos } from "@/data/servicos";
import { linkWhatsapp } from "@/lib/whatsapp";
import Container from "@/components/ui/Container";
import BackToTop from "./BackToTop";
import Logo from "./Logo";

const anoAtual = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-grafite-950 text-grafite-300">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-grafite-300">
              Criamos sites profissionais para pequenos e médios negócios —
              rápidos, fáceis de usar no celular e preparados para transformar
              visitas em contatos.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={linkWhatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <MessageCircle
                    className="size-4 shrink-0 text-ciano-400"
                    aria-hidden="true"
                  />
                  {contato.telefoneExibicao}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contato.email}`}
                  className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-white"
                >
                  <Mail
                    className="size-4 shrink-0 text-ciano-400"
                    aria-hidden="true"
                  />
                  {contato.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5">
                <MapPin
                  className="size-4 shrink-0 text-ciano-400"
                  aria-hidden="true"
                />
                {contato.cidade} — {contato.estado}
              </li>
            </ul>
          </div>

          <nav className="lg:col-span-3" aria-labelledby="rodape-servicos">
            <h2
              id="rodape-servicos"
              className="font-display text-sm font-semibold tracking-wide text-white"
            >
              Serviços
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {servicos.map((servico) => (
                <li key={servico.slug}>
                  <a
                    href="#servicos"
                    className="transition-colors hover:text-white"
                  >
                    {servico.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-labelledby="rodape-navegacao">
            <h2
              id="rodape-navegacao"
              className="font-display text-sm font-semibold tracking-wide text-white"
            >
              Navegação
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {navegacaoPrincipal.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-white">
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold tracking-wide text-white">
              Redes sociais
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {redesSociais.map((rede) => (
                <li key={rede.nome}>
                  <a
                    href={rede.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    {rede.nome}
                  </a>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 font-display text-sm font-semibold tracking-wide text-white">
              Institucional
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm">
              {linksInstitucionais.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-white"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-grafite-350">
            © {anoAtual} {siteConfig.nome}. Todos os direitos reservados.
          </p>
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
