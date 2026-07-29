import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

type Props = {
  etiqueta?: string;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  /** Adapta as cores ao fundo da seção. */
  tom?: "escuro" | "claro";
  alinhamento?: "esquerda" | "centro";
  className?: string;
  /** Nível do heading, para manter a hierarquia correta do documento. */
  as?: "h2" | "h3";
};

export default function SectionHeading({
  etiqueta,
  titulo,
  descricao,
  tom = "escuro",
  alinhamento = "esquerda",
  className,
  as: Tag = "h2",
}: Props) {
  const centralizado = alinhamento === "centro";

  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        centralizado && "mx-auto text-center",
        className,
      )}
    >
      {etiqueta ? (
        <p
          className={cn(
            "mb-4 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase",
            tom === "escuro" ? "text-ciano-400" : "text-marca-600",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-px w-6",
              tom === "escuro" ? "bg-ciano-400/60" : "bg-marca-600/50",
            )}
          />
          {etiqueta}
        </p>
      ) : null}

      <Tag
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl",
          tom === "escuro" ? "text-white" : "text-grafite-900",
        )}
      >
        {titulo}
      </Tag>

      {descricao ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            tom === "escuro" ? "text-grafite-300" : "text-grafite-500",
          )}
        >
          {descricao}
        </p>
      ) : null}
    </Reveal>
  );
}
