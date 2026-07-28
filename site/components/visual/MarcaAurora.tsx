type Props = {
  className?: string;
  /** Desliga a foto e deixa só o gradiente animado, para blocos menores. */
  semFoto?: boolean;
};

/**
 * A marca em tamanho grande, recortada sobre uma textura viva.
 *
 * A letra vem de `mascara-marca.svg` aplicada como máscara alfa, então o que
 * aparece dentro dela é HTML comum: a foto abstrata ao fundo e três manchas de
 * cor que passeiam em velocidades diferentes. Como o recorte é feito no CSS, a
 * composição continua nítida em qualquer resolução e não custa um vídeo.
 */
export default function MarcaAurora({ className, semFoto = false }: Props) {
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

  return (
    /* A posição fica por conta de quem usa: o componente não impõe `relative`,
       senão sobrescreveria um `absolute` vindo de fora — no Tailwind quem vence
       é a ordem no CSS gerado, não a ordem no atributo. */
    <div aria-hidden="true" className={className}>
      <div className="relative size-full">
        {/* Halo atrás do recorte: sem ele a letra fica solta no fundo escuro. */}
        <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(76,125,255,0.32),transparent_68%)] blur-3xl" />

        <div className="relative size-full" style={mascara}>
          <div className="absolute inset-0 bg-grafite-950" />

          {semFoto ? null : (
            /* A foto é escura de origem; sem realçar saturação e brilho ela
               desaparece dentro do recorte sobre o fundo grafite. */
            <div
              className="absolute inset-0 scale-125 bg-cover bg-center"
              style={{
                backgroundImage: "url(/images/textura-aurora.webp)",
                filter: "saturate(1.5) brightness(1.45)",
              }}
            />
          )}

          {/* Manchas de cor em ritmos diferentes: é o que dá a sensação de que
              a textura está viva sem precisar de vídeo. */}
          <div className="anima-aurora absolute -inset-1/4 bg-[radial-gradient(circle_at_30%_30%,rgba(53,214,238,0.55),transparent_58%)]" />
          <div
            className="anima-aurora absolute -inset-1/4 bg-[radial-gradient(circle_at_70%_65%,rgba(106,75,240,0.55),transparent_55%)]"
            style={{ animationDuration: "30s", animationDelay: "-8s" }}
          />
          <div
            className="anima-aurora absolute -inset-1/4 bg-[radial-gradient(circle_at_50%_85%,rgba(76,125,255,0.5),transparent_52%)]"
            style={{ animationDuration: "26s", animationDelay: "-16s" }}
          />

          {/* Grade fina por cima, para a superfície não ficar leitosa. */}
          <div className="fundo-grade absolute inset-0 opacity-30 mix-blend-overlay" />

          {/* Realce diagonal, sugerindo uma fonte de luz no canto superior. */}
          <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.28),transparent_45%)]" />
        </div>
      </div>
    </div>
  );
}
