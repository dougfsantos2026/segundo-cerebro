import { notFound } from "next/navigation";
import CenaAurora from "@/components/visual/CenaAurora";

/** Tamanho do vídeo. Mantém a proporção do recorte da marca (560 × 600). */
const ESCALA = 2;
const LARGURA = 560 * ESCALA;
const ALTURA = 600 * ESCALA;

export const metadata = { robots: { index: false, follow: false } };

/**
 * Página de trabalho: existe só para `scripts/gera-video-marca.py` abrir a cena
 * sem o recorte da letra, no tamanho exato do vídeo.
 *
 * A cena é montada em 560 × 600 e ampliada por transformação, em vez de ser
 * montada direto no tamanho final. A diferença aparece nas estrelas, que são
 * pontos de um pixel e meio: montadas no dobro do tamanho elas continuariam com
 * um pixel e meio e sumiriam ao exibir o vídeo reduzido. Ampliando, elas crescem
 * junto com o resto.
 *
 * Fora de desenvolvimento a rota não responde — não há motivo para ela existir
 * em produção, exceto quando `ALLOW_RENDER=1` está definido para gravar o vídeo
 * com `scripts/gera-video-marca.py` contra o build de produção.
 */
export default function RenderMarca() {
  const permitido =
    process.env.NODE_ENV === "development" || process.env.ALLOW_RENDER === "1";
  if (!permitido) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div
        data-cena-render=""
        className="overflow-hidden"
        style={{ width: LARGURA, height: ALTURA }}
      >
        <div
          className="origin-top-left"
          style={{
            width: LARGURA / ESCALA,
            height: ALTURA / ESCALA,
            transform: `scale(${ESCALA})`,
          }}
        >
          <CenaAurora />
        </div>
      </div>
    </main>
  );
}
