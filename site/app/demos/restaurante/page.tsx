import Image from "next/image";
import FaixaDemo from "@/components/FaixaDemo";

export const metadata = {
  title: "Exemplo: Pizzaria do Beto — kdiff",
  robots: { index: false },
};

const DESTAQUE = "#C93A2B";
const FUNDO = "#1C1512";
const TEXTO = "#F5EDE4";
const CARTAO = "#2A211C";

const cardapio = [
  "Marguerita",
  "Calabresa",
  "Portuguesa",
  "Quatro queijos",
  "Frango com catupiry",
  "Chocolate",
];

export default function DemoRestaurante() {
  return (
    <div style={{ background: FUNDO, color: TEXTO }} className="min-h-screen">
      <FaixaDemo />

      <header className="px-6 pb-16 pt-24 text-center" style={{ background: DESTAQUE, color: "white" }}>
        <h1 className="text-4xl font-extrabold">Pizzaria do Beto</h1>
        <p className="mt-3">Forno a lenha desde 2009. Entregamos no bairro inteiro.</p>
        <span className="mt-6 inline-block cursor-not-allowed rounded bg-white/20 px-6 py-3 font-semibold">
          Botão de exemplo
        </span>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <h2 className="text-2xl font-bold">Cardápio</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {cardapio.map((s) => (
            <li key={s} className="rounded p-4 text-sm" style={{ background: CARTAO }}>{s}</li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl font-bold">A pizzaria</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <Image
              key={n}
              src={`/demos/pizza-${n}.jpg`}
              alt={`Foto da pizzaria, imagem ${n}`}
              width={600}
              height={400}
              className="rounded object-cover"
            />
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold">Horário de atendimento</h2>
        <table className="mt-6 w-full max-w-md text-sm" style={{ background: CARTAO }}>
          <tbody>
            <tr className="border-b border-white/10"><td className="p-3">Terça a domingo</td><td className="p-3">18h às 23h30</td></tr>
            <tr><td className="p-3">Segunda</td><td className="p-3">Fechado</td></tr>
          </tbody>
        </table>

        <h2 className="mt-14 text-2xl font-bold">Delivery</h2>
        <p className="mt-3">Entregamos em toda a região. Peça pelo telefone ou WhatsApp.</p>

        <h2 className="mt-14 text-2xl font-bold">Onde estamos</h2>
        <p className="mt-3">Rua Exemplo, 123 — Bairro Fictício, São Paulo · (11) 0000-0000</p>
        <div className="mt-4 flex h-56 items-center justify-center rounded text-neutral-400" style={{ background: "#3A302A" }}>
          Mapa vai aqui
        </div>
      </main>

      <footer className="px-6 py-10 text-center text-sm" style={{ background: DESTAQUE, color: "white" }}>
        Pizzaria do Beto — site de exemplo criado pela kdiff
      </footer>
    </div>
  );
}
