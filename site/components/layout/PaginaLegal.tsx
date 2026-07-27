import Container from "@/components/ui/Container";
import Footer from "./Footer";
import HeaderSimples from "./HeaderSimples";

type Props = {
  titulo: string;
  atualizadoEm: string;
  children: React.ReactNode;
};

/**
 * Moldura das páginas institucionais (privacidade e termos).
 * Centraliza a tipografia do texto corrido para manter as duas iguais.
 */
export default function PaginaLegal({ titulo, atualizadoEm, children }: Props) {
  return (
    <>
      <HeaderSimples />

      <main id="conteudo" className="bg-grafite-900 py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl text-white sm:text-4xl lg:text-5xl">
              {titulo}
            </h1>
            <p className="mt-4 text-sm text-grafite-500">
              Última atualização: {atualizadoEm}
            </p>

            <div
              className={[
                "mt-12 space-y-8 text-grafite-300",
                "[&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white sm:[&_h2]:text-2xl",
                "[&_h2]:mb-3",
                "[&_p]:text-sm [&_p]:leading-relaxed sm:[&_p]:text-base",
                "[&_p+p]:mt-3",
                "[&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:text-sm sm:[&_ul]:text-base",
                "[&_li]:relative [&_li]:pl-5",
                "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-2.5",
                "[&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-ciano-400",
                "[&_a]:text-ciano-400 [&_a]:underline [&_a]:underline-offset-4",
              ].join(" ")}
            >
              {children}
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
