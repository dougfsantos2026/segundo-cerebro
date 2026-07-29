import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Endereço exibido na barra, só como enfeite. */
  endereco?: string;
  /** A primeira imagem visível da página carrega sem esperar o scroll. */
  prioridade?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Envolve uma foto numa janela de navegador.
 *
 * Serve para apresentar imagem de projeto: sem a moldura, a foto de um
 * consultório é só uma foto; dentro dela, lê-se como “o site desse
 * consultório”. A janela é HTML puro, então acompanha qualquer largura.
 */
export default function MolduraNavegador({
  src,
  alt,
  endereco = "seunegocio.com.br",
  prioridade = false,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-t-xl bg-grafite-800 shadow-[0_20px_50px_rgba(6,8,12,0.4)] ring-1 ring-white/10",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 bg-grafite-700/90 px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex h-4 flex-1 items-center overflow-hidden rounded-full bg-black/30 px-2 text-[9px] whitespace-nowrap text-grafite-350">
          {endereco}
        </span>
      </div>

      <div className="relative aspect-16/10 overflow-hidden">
        {/* A aproximação depende de um ancestral com `group`; sem ele a classe
            simplesmente não dispara e a imagem fica parada. */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={prioridade}
          loading={prioridade ? undefined : "lazy"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>
    </div>
  );
}
