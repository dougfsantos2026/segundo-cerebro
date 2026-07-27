import Image from "next/image";
import FaixaDemo from "@/components/FaixaDemo";

export const metadata = {
  title: "Exemplo: Studio Vera Cabelo — kdiff",
  robots: { index: false },
};

const DESTAQUE = "#8C4A5E";
const FUNDO = "#FAF5F0";
const TEXTO = "#2A1E22";

const servicos = [
  "Corte feminino",
  "Corte masculino",
  "Coloração",
  "Mechas e luzes",
  "Escova e finalização",
  "Tratamento capilar",
];

export default function DemoSalao() {
  return (
    <div style={{ background: FUNDO, color: TEXTO }} className="min-h-screen">
      <FaixaDemo />

      <header className="px-6 pb-16 pt-24 text-center" style={{ background: DESTAQUE, color: "white" }}>
        <h1 className="text-4xl font-extrabold">Studio Vera Cabelo</h1>
        <p className="mt-3">Corte, cor e cuidado — do jeito que você gosta.</p>
        <span className="mt-6 inline-block cursor-not-allowed rounded bg-white/20 px-6 py-3 font-semibold">
          Botão de exemplo
        </span>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-2xl font-bold">Serviços</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {servicos.map((s) => (
            <li key={s} className="rounded bg-white p-4 text-sm shadow-sm">{s}</li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl font-bold">O salão</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <Image
              key={n}
              src={`/demos/salao-${n}.jpg`}
              alt={`Foto do salão de beleza, imagem ${n}`}
              width={600}
              height={400}
              className="rounded object-cover"
            />
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold">Horário de atendimento</h2>
        <table className="mt-6 w-full max-w-md bg-white text-sm">
          <tbody>
            <tr className="border-b"><td className="p-3">Terça a sexta</td><td className="p-3">9h às 20h</td></tr>
            <tr className="border-b"><td className="p-3">Sábado</td><td className="p-3">8h às 18h</td></tr>
            <tr><td className="p-3">Domingo e segunda</td><td className="p-3">Fechado</td></tr>
          </tbody>
        </table>

        <h2 className="mt-14 text-2xl font-bold">Onde estamos</h2>
        <p className="mt-3">Rua Exemplo, 123 — Bairro Fictício, São Paulo · (11) 0000-0000</p>
        <div className="mt-4 flex h-56 items-center justify-center rounded bg-neutral-300 text-neutral-600">
          Mapa vai aqui
        </div>
      </main>

      <footer className="px-6 py-10 text-center text-sm" style={{ background: DESTAQUE, color: "white" }}>
        Studio Vera Cabelo — site de exemplo criado pela kdiff
      </footer>
    </div>
  );
}
