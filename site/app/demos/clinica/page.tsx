import Image from "next/image";
import FaixaDemo from "@/components/FaixaDemo";

export const metadata = {
  title: "Exemplo: Clínica Sorriso Novo — kdiff",
  robots: { index: false },
};

const AZUL = "#1D4E89";
const GELO = "#F2F6FA";

const servicos = [
  "Limpeza e prevenção",
  "Clareamento dental",
  "Aparelho ortodôntico",
  "Implantes",
  "Atendimento infantil",
  "Urgência",
];

export default function DemoClinica() {
  return (
    <div style={{ background: GELO, color: "#15202B" }} className="min-h-screen">
      <FaixaDemo />

      {/* Capa */}
      <header className="px-6 pb-16 pt-24 text-center" style={{ background: AZUL, color: "white" }}>
        <h1 className="text-4xl font-extrabold">Clínica Sorriso Novo</h1>
        <p className="mt-3">Odontologia para toda a família, no coração do bairro.</p>
        <span className="mt-6 inline-block cursor-not-allowed rounded bg-white/20 px-6 py-3 font-semibold">
          Botão de exemplo
        </span>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-14">
        {/* Serviços */}
        <h2 className="text-2xl font-bold">Nossos serviços</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {servicos.map((s) => (
            <li key={s} className="rounded bg-white p-4 text-sm shadow-sm">{s}</li>
          ))}
        </ul>

        {/* Galeria */}
        <h2 className="mt-14 text-2xl font-bold">A clínica</h2>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <Image
              key={n}
              src={`/demos/clinica-${n}.jpg`}
              alt={`Foto do ambiente da clínica, imagem ${n}`}
              width={600}
              height={400}
              className="rounded object-cover"
            />
          ))}
        </div>

        {/* Horários */}
        <h2 className="mt-14 text-2xl font-bold">Horário de atendimento</h2>
        <table className="mt-6 w-full max-w-md bg-white text-sm">
          <tbody>
            <tr className="border-b"><td className="p-3">Segunda a sexta</td><td className="p-3">8h às 19h</td></tr>
            <tr className="border-b"><td className="p-3">Sábado</td><td className="p-3">8h às 13h</td></tr>
            <tr><td className="p-3">Domingo</td><td className="p-3">Fechado</td></tr>
          </tbody>
        </table>

        {/* Endereço */}
        <h2 className="mt-14 text-2xl font-bold">Onde estamos</h2>
        <p className="mt-3">Rua Exemplo, 123 — Bairro Fictício, São Paulo · (11) 0000-0000</p>
        <div className="mt-4 flex h-56 items-center justify-center rounded bg-neutral-300 text-neutral-600">
          Mapa vai aqui
        </div>
      </main>

      <footer className="px-6 py-10 text-center text-sm" style={{ background: AZUL, color: "white" }}>
        Clínica Sorriso Novo — site de exemplo criado pela kdiff
      </footer>
    </div>
  );
}
