import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Projeto } from "@/data/projetos";
import Card from "@/components/ui/Card";
import MolduraNavegador from "@/components/visual/MolduraNavegador";

type Props = {
  projeto: Projeto;
  /** A primeira imagem visível recebe prioridade de carregamento. */
  prioridade?: boolean;
};

export default function ProjetoCard({ projeto, prioridade = false }: Props) {
  const temDemo = Boolean(projeto.href);

  return (
    <Card
      tom="claro"
      interativo
      className="group flex h-full flex-col overflow-hidden"
    >
      {/*
        Painel colorido com a janela apoiada na base. O corte por baixo é
        proposital: sugere que a página continua, em vez de terminar num
        retângulo fechado.
      */}
      <div
        className={`relative overflow-hidden px-6 pt-8 sm:px-8 sm:pt-10 ${projeto.fundo}`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.25),transparent_55%)]"
        />

        {projeto.imagem ? (
          <MolduraNavegador
            src={projeto.imagem}
            alt={`Prévia do site ${projeto.nome} — ${projeto.segmento}`}
            endereco={projeto.dominio}
            prioridade={prioridade}
            className="relative translate-y-1 transition-transform duration-500 group-hover:-translate-y-1"
          />
        ) : (
          <div className="relative aspect-16/10 rounded-t-xl bg-grafite-900/40" />
        )}

        {/* Seta no canto, como afordância de “abrir”. */}
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          <ArrowUpRight className="size-4" />
        </span>
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
              className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-marca-600 transition-colors hover:text-marca-700"
            >
              Ver projeto
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                aria-hidden="true"
              />
              <span className="sr-only">— {projeto.nome}</span>
            </Link>
          ) : (
            <a
              href="#contato"
              className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-grafite-600 transition-colors hover:text-marca-600"
            >
              Quero algo parecido
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover/link:translate-x-1"
                aria-hidden="true"
              />
              <span className="sr-only">— {projeto.nome}</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
