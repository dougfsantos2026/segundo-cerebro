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
    <div style={{ background: FUNDO, color: TEXTO, minHeight: "100vh" }}>
      <FaixaDemo />
      <header
        style={{
          padding: "6.5rem 1.5rem 4rem",
          textAlign: "center",
          background: `linear-gradient(160deg, ${DESTAQUE}, #8F2A1F)`,
          color: "white",
        }}
      >
        <p
          style={{
            margin: 0,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: "0.72rem",
            opacity: 0.85,
          }}
        >
          Forno a lenha
        </p>
        <h1
          style={{
            margin: "0.7rem 0 0",
            fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Pizzaria do Beto
        </h1>
        <p style={{ margin: "0.9rem auto 0", maxWidth: "28rem", opacity: 0.95 }}>
          Forno a lenha desde 2009. Entregamos no bairro inteiro.
        </p>
        <span
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "0.85rem 1.4rem",
            borderRadius: 4,
            background: "rgba(255,255,255,0.16)",
            fontWeight: 600,
            cursor: "not-allowed",
          }}
        >
          Botão de exemplo
        </span>
      </header>

      <main style={{ maxWidth: 840, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        <h2 style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}>Cardápio</h2>
        <ul
          style={{
            marginTop: "1.25rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
            listStyle: "none",
            padding: 0,
          }}
        >
          {cardapio.map((s) => (
            <li
              key={s}
              style={{
                background: CARTAO,
                borderRadius: 4,
                padding: "1rem",
                fontSize: "0.95rem",
              }}
            >
              {s}
            </li>
          ))}
        </ul>

        <h2 style={{ marginTop: "3rem", fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
          A pizzaria
        </h2>
        <div
          style={{
            marginTop: "1.25rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          {[1, 2, 3, 4].map((n) => (
            <Image
              key={n}
              src={`/demos/pizza-${n}.jpg`}
              alt={`Foto da pizzaria, imagem ${n}`}
              width={600}
              height={400}
              style={{ borderRadius: 4, objectFit: "cover", width: "100%", height: "auto" }}
            />
          ))}
        </div>

        <h2 style={{ marginTop: "3rem", fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
          Horário de atendimento
        </h2>
        <table
          style={{
            marginTop: "1rem",
            width: "100%",
            maxWidth: 420,
            background: CARTAO,
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <td style={{ padding: "0.85rem" }}>Terça a domingo</td>
              <td style={{ padding: "0.85rem" }}>18h às 23h30</td>
            </tr>
            <tr>
              <td style={{ padding: "0.85rem" }}>Segunda</td>
              <td style={{ padding: "0.85rem" }}>Fechado</td>
            </tr>
          </tbody>
        </table>

        <h2 style={{ marginTop: "3rem", fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
          Delivery
        </h2>
        <p style={{ marginTop: "0.7rem" }}>
          Entregamos em toda a região. Peça pelo telefone ou WhatsApp.
        </p>

        <h2 style={{ marginTop: "3rem", fontSize: "1.6rem", letterSpacing: "-0.02em" }}>
          Onde estamos
        </h2>
        <p style={{ marginTop: "0.7rem" }}>
          Rua Exemplo, 123 — Bairro Fictício, São Paulo · (11) 0000-0000
        </p>
        <div
          style={{
            marginTop: "1rem",
            height: 220,
            borderRadius: 4,
            background: "#3A302A",
            color: "#b8aea4",
            display: "grid",
            placeItems: "center",
          }}
        >
          Mapa vai aqui
        </div>
      </main>

      <footer
        style={{
          padding: "2.25rem 1.5rem",
          textAlign: "center",
          background: DESTAQUE,
          color: "white",
          fontSize: "0.92rem",
        }}
      >
        Pizzaria do Beto — site de exemplo criado pela kdiff
      </footer>
    </div>
  );
}
