import Image from "next/image";

type Props = {
  className?: string;
  /**
   * Deixa só a superfície animada, sem a figura. Usado onde a marca aparece
   * pequena ou muito apagada e a pessoa não teria tamanho para ser lida.
   */
  semFigura?: boolean;
  /** Carrega a cena junto com o restante do topo, em vez de sob demanda. */
  prioridade?: boolean;
};

/** Esferas de luz que sobem: posição, tamanho, ritmo e defasagem de cada uma. */
const esferas = [
  { esquerda: "14%", base: "18%", tamanho: "9%", duracao: "13s", atraso: "0s" },
  { esquerda: "58%", base: "8%", tamanho: "6%", duracao: "17s", atraso: "-6s" },
  { esquerda: "76%", base: "26%", tamanho: "11%", duracao: "21s", atraso: "-13s" },
  { esquerda: "36%", base: "2%", tamanho: "5%", duracao: "15s", atraso: "-9s" },
];

/**
 * A marca em tamanho grande, recortada sobre uma cena viva.
 *
 * A letra vem de `mascara-marca.svg` aplicada como máscara alfa, então o que
 * aparece dentro dela é HTML comum, empilhado em camadas: a ilustração da
 * aurora ao fundo, o brilho que acende e apaga, o céu que cintila, esferas
 * subindo e, sobre a borda do penhasco, a figura que gira de costas para o
 * perfil e volta.
 *
 * Tudo isso poderia ser um vídeo — é o que a referência faz. Em camadas o
 * resultado pesa cerca de cem quilobytes em vez de dois megabytes, continua
 * nítido em qualquer resolução e cada movimento pode parar sozinho quando o
 * sistema pede menos animação.
 */
export default function MarcaAurora({
  className,
  semFigura = false,
  prioridade = false,
}: Props) {
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
    <div aria-hidden="true" data-marca-cena="" className={className}>
      <div className="relative size-full">
        {/* Halo atrás do recorte: sem ele a letra fica solta no fundo escuro. */}
        <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(76,125,255,0.38),transparent_68%)] blur-3xl" />

        <div className="relative size-full overflow-hidden" style={mascara}>
          <div className="absolute inset-0 bg-grafite-950" />

          {/* Cena base, com aproximação lenta da câmera. A escala inicial já
              passa de 1 para a aproximação nunca descobrir a borda. */}
          <div
            className="anima-aproximar absolute inset-0 scale-[1.04]"
            style={{ animationDelay: "-6s" }}
          >
            <Image
              src="/images/cena-aurora.webp"
              alt=""
              fill
              sizes="(max-width: 768px) 40vw, 34vw"
              priority={prioridade}
              loading={prioridade ? undefined : "lazy"}
              className="object-cover"
            />
          </div>

          {/* Brilho da aurora acendendo e apagando: é o que faz a cena parecer
              um vídeo. `screen` só clareia, então nunca suja as sombras. */}
          <div className="anima-acender absolute inset-0 bg-[radial-gradient(120%_80%_at_62%_28%,rgba(53,214,238,0.75),rgba(106,75,240,0.45)_42%,transparent_72%)] mix-blend-screen" />
          <div
            className="anima-acender absolute inset-0 bg-[radial-gradient(90%_70%_at_28%_18%,rgba(236,120,255,0.55),transparent_62%)] mix-blend-screen"
            style={{ animationDelay: "-3.2s" }}
          />

          {/* Manchas largas que passeiam devagar por trás do brilho, para o
              céu nunca repetir exatamente o mesmo desenho. */}
          <div className="anima-aurora absolute -inset-1/4 bg-[radial-gradient(circle_at_30%_30%,rgba(53,214,238,0.35),transparent_58%)] mix-blend-screen" />
          <div
            className="anima-aurora absolute -inset-1/4 bg-[radial-gradient(circle_at_70%_65%,rgba(106,75,240,0.35),transparent_55%)] mix-blend-screen"
            style={{ animationDuration: "30s", animationDelay: "-8s" }}
          />

          {/* Duas camadas de estrelas em ritmos diferentes: juntas cintilam sem
              nunca apagar o céu por completo. */}
          <div className="estrelas anima-cintilar absolute inset-0" />
          <div
            className="estrelas-densas anima-cintilar absolute inset-0"
            style={{ animationDuration: "5.5s", animationDelay: "-2.4s" }}
          />

          {esferas.map((esfera) => (
            <span
              key={esfera.esquerda}
              className="anima-esfera absolute aspect-square rounded-full bg-[radial-gradient(circle_at_32%_30%,rgba(255,255,255,0.85),rgba(150,220,255,0.35)_45%,rgba(120,90,255,0.08)_70%,transparent)] opacity-0"
              style={{
                left: esfera.esquerda,
                bottom: esfera.base,
                width: esfera.tamanho,
                animationDuration: esfera.duracao,
                animationDelay: esfera.atraso,
              }}
            />
          ))}

          {semFigura ? null : (
            /*
              A figura fica sobre a borda do penhasco da ilustração e dentro da
              haste vertical do recorte — é o único traço largo o bastante para
              ela ser reconhecida. As duas poses ocupam a mesma caixa, então a
              troca acontece sem o corpo mudar de lugar.
            */
            <div
              className="anima-respirar absolute bottom-[47%] left-[7%] w-[20%]"
              style={{ aspectRatio: "520 / 900" }}
            >
              <Image
                src="/images/figura-costas.webp"
                alt=""
                fill
                sizes="80px"
                loading="lazy"
                className="anima-girar-perfil object-contain object-bottom"
              />
              <Image
                src="/images/figura-perfil.webp"
                alt=""
                fill
                sizes="80px"
                loading="lazy"
                className="anima-girar-costas object-contain object-bottom opacity-0"
              />
            </div>
          )}

          {/* Grade fina por cima, para a superfície não ficar leitosa. */}
          <div className="fundo-grade absolute inset-0 opacity-20 mix-blend-overlay" />

          {/* Realce diagonal, sugerindo uma fonte de luz no canto superior. */}
          <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,255,255,0.16),transparent_45%)]" />
        </div>
      </div>
    </div>
  );
}
