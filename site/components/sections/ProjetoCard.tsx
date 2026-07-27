import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { Projeto } from "@/data/projetos";
import Card from "@/components/ui/Card";

type Props = {
  projeto: Projeto;
  /** A primeira imagem visível recebe prioridade de carregamento. */
  prioridade?: boolean;
};

/** Mockup gerado em CSS para projetos que ainda não têm foto própria. */
function MockupAbstrato({ nome }: { nome: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full flex-col justify-center gap-3 bg-gradient-to-br from-grafite-800 via-grafite-700 to-grafite-800 p-8"
    >
      <div className="mx-auto w-full max-w-56 rounded-lg border border-white/10 bg-grafite-900/70 p-3">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-10 rounded-full bg-white/45" />
          <div className="flex gap-1">
            <div className="h-1 w-4 rounded-full bg-white/20" />
            <div className="h-1 w-4 rounded-full bg-white/20" />
          </div>
        </div>
        <div className="mt-2.5 h-12 rounded-md bg-gradient-to-br from-marca-500/70 to-ciano-500/60" />
        <div className="mt-2 h-1.5 w-3/4 rounded-full bg-white/20" />
        <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/15" />
        <div className="mt-2.5 h-4 w-16 rounded-full bg-marca-500/80" />
      </div>
      <p className="text-center font-display text-xs tracking-[0.16em] text-grafite-400 uppercase">
        {nome}
      </p>
    </div>
  );
}

export default function ProjetoCard({ projeto, prioridade = false }: Props) {
  const temDemo = Boolean(projeto.href);

  return (
    <Card
      tom="claro"
      interativo
      className="group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-grafite-800">
        {projeto.imagem ? (
          <Image
            src={projeto.imagem}
            alt={`Prévia do site ${projeto.nome} — ${projeto.segmento}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={prioridade}
            loading={prioridade ? undefined : "lazy"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <MockupAbstrato nome={projeto.nome} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-marca-500/10 px-2.5 py-1 font-medium text-marca-700">
            {projeto.segmento}
          </span>
          <span className="text-grafite-400">{projeto.tipo}</span>
        </div>

        <h3 className="mt-4 text-xl text-grafite-900">{projeto.nome}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-grafite-500">
          {projeto.descricao}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {projeto.recursos.map((recurso) => (
            <li
              key={recurso}
              className="rounded-md border border-grafite-200 px-2 py-0.5 text-xs text-grafite-500"
            >
              {recurso}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          {temDemo && projeto.href ? (
            <Link
              href={projeto.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-marca-600 transition-colors hover:text-marca-700"
            >
              Ver projeto
              <ExternalLink className="size-4" aria-hidden="true" />
              <span className="sr-only">— {projeto.nome}</span>
            </Link>
          ) : (
            <a
              href="#contato"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-grafite-600 transition-colors hover:text-marca-600"
            >
              Quero algo parecido
              <ArrowRight className="size-4" aria-hidden="true" />
              <span className="sr-only">— {projeto.nome}</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
