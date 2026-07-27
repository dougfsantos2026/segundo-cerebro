import { Gauge, Smartphone, TrendingUp } from "lucide-react";

/**
 * Composição visual original do hero, montada inteiramente em CSS.
 * Não usa imagens externas: carrega instantaneamente e não gera layout shift.
 */
export default function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      {/* Brilho de fundo */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(76,125,255,0.28),transparent_65%)] blur-2xl"
      />

      {/* Janela de navegador */}
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-grafite-800 shadow-[var(--shadow-alta)]">
        <div className="flex items-center gap-2 border-b border-white/8 bg-grafite-700/70 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex h-6 flex-1 items-center rounded-full bg-black/25 px-3 text-[11px] text-grafite-400">
            seunegocio.com.br
          </div>
        </div>

        {/* Prévia clara de um site entregue */}
        <div className="bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-20 rounded-full bg-grafite-800" />
            <div className="flex gap-1.5">
              <div className="h-1.5 w-8 rounded-full bg-grafite-200" />
              <div className="h-1.5 w-8 rounded-full bg-grafite-200" />
              <div className="h-1.5 w-8 rounded-full bg-grafite-200" />
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-marca-600 via-marca-500 to-ciano-500 p-5 sm:p-6">
            <div className="h-2.5 w-3/5 rounded-full bg-white/85" />
            <div className="mt-2.5 h-2.5 w-2/5 rounded-full bg-white/60" />
            <div className="mt-4 h-7 w-28 rounded-full bg-white/95" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((indice) => (
              <div
                key={indice}
                className="rounded-lg border border-grafite-100 bg-grafite-50 p-2.5"
              >
                <div className="size-5 rounded-md bg-marca-500/25" />
                <div className="mt-2 h-1.5 w-full rounded-full bg-grafite-200" />
                <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-grafite-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celular flutuante: reforça o "feito para o celular" */}
      <div className="absolute -bottom-8 -left-4 hidden w-28 overflow-hidden rounded-[1.25rem] border-4 border-grafite-700 bg-white shadow-[var(--shadow-alta)] sm:block sm:-left-8 sm:w-32">
        <div className="bg-grafite-800 py-1.5">
          <div className="mx-auto h-1 w-8 rounded-full bg-white/25" />
        </div>
        <div className="space-y-2 p-2.5">
          <div className="h-10 rounded-md bg-gradient-to-br from-marca-500 to-ciano-500" />
          <div className="h-1.5 w-full rounded-full bg-grafite-200" />
          <div className="h-1.5 w-3/4 rounded-full bg-grafite-200" />
          <div className="h-5 rounded-full bg-marca-600" />
        </div>
      </div>

      {/* Indicadores flutuantes */}
      <div className="absolute -top-5 -right-2 flex items-center gap-2 rounded-full border border-white/15 bg-grafite-850/90 px-3.5 py-2 shadow-[var(--shadow-alta)] backdrop-blur-md sm:-right-6">
        <Gauge className="size-4 text-ciano-400" aria-hidden="true" />
        <span className="text-xs font-semibold text-white">Carrega rápido</span>
      </div>

      <div className="absolute top-1/2 -right-3 flex items-center gap-2 rounded-full border border-white/15 bg-grafite-850/90 px-3.5 py-2 shadow-[var(--shadow-alta)] backdrop-blur-md sm:-right-8">
        <Smartphone className="size-4 text-ciano-400" aria-hidden="true" />
        <span className="text-xs font-semibold text-white">100% responsivo</span>
      </div>

      <div className="absolute -bottom-6 right-4 flex items-center gap-2 rounded-full border border-white/15 bg-grafite-850/90 px-3.5 py-2 shadow-[var(--shadow-alta)] backdrop-blur-md sm:right-8">
        <TrendingUp className="size-4 text-ciano-400" aria-hidden="true" />
        <span className="text-xs font-semibold text-white">Feito para converter</span>
      </div>
    </div>
  );
}
