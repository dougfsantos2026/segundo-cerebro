import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/** Aviso fixo exibido no topo das páginas de demonstração. */
export default function FaixaDemo() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-grafite-950 px-4 py-2.5 text-center text-sm text-grafite-200">
      Este é um site de demonstração.{" "}
      <Link
        href="/#projetos"
        className="ml-1 inline-flex items-center gap-1 font-semibold text-ciano-400 underline underline-offset-4"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Voltar para a {siteConfig.nome}
      </Link>
    </div>
  );
}
