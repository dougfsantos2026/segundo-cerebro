import { cn } from "@/lib/utils";

type Props = {
  palavras: string[];
  className?: string;
};

/**
 * Coluna de palavras que sobe sem fim, inclinada em perspectiva.
 *
 * A lista é escrita duas vezes e a animação desloca exatamente metade da
 * altura, então o ponto de emenda cai sobre uma cópia idêntica e o loop não
 * tem costura. O degradê nas pontas evita que as palavras apareçam e sumam de
 * forma abrupta nas bordas do painel.
 */
export default function PainelPalavras({ palavras, className }: Props) {
  const sequencia = [...palavras, ...palavras];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-2xl bg-grafite-950 ring-1 ring-white/8",
        className,
      )}
    >
      <div className="fundo-grade absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,125,255,0.18),transparent_65%)]" />

      <div
        className="relative h-full"
        style={{
          perspective: "460px",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)",
        }}
      >
        <div
          className="flex h-full items-center justify-center"
          style={{ transform: "rotateX(26deg)", transformStyle: "preserve-3d" }}
        >
          <ul
            className="w-full text-center"
            style={{
              animation: "subir-perspectiva 18s linear infinite",
              willChange: "transform",
            }}
          >
            {sequencia.map((palavra, indice) => (
              <li
                key={`${palavra}-${indice}`}
                className="font-display text-3xl leading-[1.9] font-bold tracking-tight text-white/85 sm:text-4xl"
              >
                {palavra}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
