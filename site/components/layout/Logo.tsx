import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type Props = {
  className?: string;
  /** Cor do texto conforme o fundo. */
  tom?: "escuro" | "claro";
};

/** Marca do estúdio: wordmark tipográfico com um ponto em destaque. */
export default function Logo({ className, tom = "escuro" }: Props) {
  return (
    <span
      className={cn(
        "font-display text-2xl leading-none font-bold tracking-tight",
        tom === "escuro" ? "text-white" : "text-grafite-900",
        className,
      )}
    >
      {siteConfig.nome}
      <span className="text-ciano-400">.</span>
    </span>
  );
}
