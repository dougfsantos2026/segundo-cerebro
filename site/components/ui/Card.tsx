import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Adapta bordas e sombras ao fundo da seção. */
  tom?: "escuro" | "claro";
  /** Destaca o card com borda e brilho da cor da marca. */
  destaque?: boolean;
  /** Aplica realce sutil ao passar o mouse. */
  interativo?: boolean;
  className?: string;
};

export default function Card({
  children,
  tom = "escuro",
  destaque = false,
  interativo = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-[border-color,box-shadow,transform] duration-300",
        tom === "escuro"
          ? "border-white/10 bg-white/[0.03] backdrop-blur-sm"
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
