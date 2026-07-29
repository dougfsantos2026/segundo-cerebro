import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Adapta bordas e sombras ao fundo da seção. */
  tom?: "escuro" | "claro";
  /** Destaca o card com borda e brilho da cor da marca. */
  destaque?: boolean;
  /** Aplica realce sutil ao passar o mouse. */
  interativo?: boolean;
  /**
   * Corta o canto superior direito em diagonal. O recorte come a borda junto,
   * então o card passa a se apoiar só no preenchimento.
   */
  chanfro?: boolean;
  className?: string;
};

export default function Card({
  children,
  tom = "escuro",
  destaque = false,
  interativo = false,
  chanfro = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        // `translate`, não `transform`: no Tailwind v4 é essa a propriedade que
        // as utilidades de deslocamento escrevem.
        "relative transition-[border-color,box-shadow,translate] duration-300",
        chanfro ? "canto-chanfrado rounded-lg" : "rounded-2xl border",
        tom === "escuro"
          ? chanfro
            ? "bg-white/[0.06]"
            : "border-white/10 bg-white/[0.03] backdrop-blur-sm"
          : chanfro
            ? "bg-grafite-50"
            : "border-grafite-200/80 bg-white shadow-[var(--shadow-suave)]",
        destaque &&
          (tom === "escuro"
            ? "border-marca-500/50 bg-marca-500/[0.07]"
            : "border-marca-500/60 shadow-[var(--shadow-media)]"),
        interativo &&
          (tom === "escuro"
            ? "hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
            : "hover:-translate-y-1 hover:border-marca-300 hover:shadow-[var(--shadow-media)]"),
        className,
      )}
    >
      {children}
    </div>
  );
}
