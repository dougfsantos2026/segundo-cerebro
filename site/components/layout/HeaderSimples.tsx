import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import Logo from "./Logo";

/** Cabeçalho reduzido para páginas fora da home, sem navegação por âncoras. */
export default function HeaderSimples() {
  return (
    <header className="border-b border-white/10 bg-grafite-950">
      <Container className="flex h-18 items-center justify-between gap-4">
        <Link
          href="/"
          className="rounded-md"
          aria-label="Voltar para a página inicial"
        >
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-grafite-300 transition-colors hover:border-white/30 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar ao site
        </Link>
      </Container>
    </header>
  );
}
