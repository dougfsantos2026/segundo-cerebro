import Image from "next/image";

type Props = {
  className?: string;
  /**
   * Deixa só a superfície estática, sem a figura. Usado onde a marca aparece
   * pequena ou muito apagada e a pessoa não teria tamanho para ser lida.
   */
  semFigura?: boolean;
  /** Carrega o vídeo junto com o restante do topo, em vez de sob demanda. */
  prioridade?: boolean;
};

const mascara = {
  maskImage: "url(/images/mascara-marca.svg)",
  WebkitMaskImage: "url(/images/mascara-marca.svg)",
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
} as const;

const POSTER = "/images/marca-cena-poster.webp";
const VIDEO = "/videos/marca-cena.mp4";
const TAMANHOS = "(max-width: 768px) 40vw, 34vw";

/**
 * A marca em tamanho grande, recortada sobre um vídeo em loop.
 *
 * A letra vem de `mascara-marca.svg` aplicada como máscara alfa. Dentro dela
 * roda `public/videos/marca-cena.mp4` — a cena com aurora, estrelas, esferas
 * e a figura que gira de costas para o perfil e volta.
 *
 * Para trocar a animação, substitua o MP4 em `public/videos/marca-cena.mp4`
 * (ou regenere com `scripts/gera-video-marca.py`) e atualize o pôster em
 * `public/images/marca-cena-poster.webp`.
 */
export default function MarcaAurora({
  className,
  semFigura = false,
  prioridade = false,
}: Props) {
  return (
    /* A posição fica por conta de quem usa: o componente não impõe `relative`,
       senão sobrescreveria um `absolute` vindo de fora — no Tailwind quem vence
       é a ordem no CSS gerado, não a ordem no atributo. */
    <div aria-hidden="true" data-marca-cena="" className={className}>
      <div className="relative size-full">
        {/* Halo atrás do recorte: sem ele a letra fica solta no fundo escuro. */}
        <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(76,125,255,0.38),transparent_68%)] blur-3xl" />

        <div className="relative size-full overflow-hidden" style={mascara}>
          <div className="absolute inset-0 bg-grafite-950" />

          {semFigura ? (
            /* Sem figura: só o pôster, apagado — a pessoa não seria lida nesta
               escala e o vídeo gastaria banda sem ganho visual. */
            <Image
              src={POSTER}
              alt=""
              fill
              sizes={TAMANHOS}
              priority={prioridade}
              loading={prioridade ? undefined : "lazy"}
              className="object-cover opacity-90"
            />
          ) : (
            <>
              {/* Vídeo do laço. `muted` + `playsInline` são obrigatórios para
                  autoplay no celular; `loop` fecha o ciclo de 8s. */}
              <video
                className="marca-video absolute inset-0 size-full object-cover"
                src={VIDEO}
                poster={POSTER}
                autoPlay
                loop
                muted
                playsInline
                preload={prioridade ? "auto" : "metadata"}
                disablePictureInPicture
              />

              {/* Com movimento reduzido o vídeo some e o pôster fica parado. */}
              <Image
                src={POSTER}
                alt=""
                fill
                sizes={TAMANHOS}
                priority={prioridade}
                loading={prioridade ? undefined : "lazy"}
                className="marca-poster-estatico absolute inset-0 hidden object-cover"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
