import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Duração de uma volta completa. Quanto maior, mais lento. */
  duracao?: string;
  /** Inverte o sentido do movimento. */
  inverso?: boolean;
  className?: string;
};

/**
 * Faixa que desliza para sempre na horizontal.
 *
 * O conteúdo é renderizado duas vezes e a animação desloca exatamente 50% da
 * largura total, então quando a primeira cópia sai a segunda já ocupou o lugar
 * dela — o loop não tem salto. A segunda cópia fica escondida dos leitores de
 * tela para o texto não ser anunciado em dobro.
 */
export default function FaixaCorrente({
  children,
  duracao = "38s",
  inverso = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        // Esmaece as pontas para a faixa não terminar num corte seco.
        "[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max motion-safe:group-hover:[animation-play-state:paused]"
        style={{
          animation: `correr-faixa ${duracao} linear infinite`,
          animationDirection: inverso ? "reverse" : "normal",
          willChange: "transform",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
