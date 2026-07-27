import Image from "next/image";
import FaixaDemo from "@/components/FaixaDemo";

export const metadata = {
  title: "Exemplo: Clínica Sorriso Novo — kdiff",
  robots: { index: false },
};

const AZUL = "#1A3F6F";
const GELO = "#F3F6FA";
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
    <div style={{ background: GELO, color: "#15202B", minHeight: "100vh" }}>
      <FaixaDemo />
      <header
        style={{
          padding: "6.5rem 1.5rem 4rem",
          textAlign: "center",
          background: `linear-gradient(160deg, ${AZUL}, #123257)`,
          color: "white",
        }}
      >
        <p
          style={{
            margin: 0,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: "0.72rem",
            opacity: 0.8,
          }}
        >
          Odontologia
        </p>
        <h1
          style={{
            margin: "0.7rem 0 0",
            fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          Clínica Sorriso Novo
        </h1>
        <p style={{ margin: "0.9rem auto 0", maxWidth: "28rem", opacity: 0.92 }}>
          Odontologia para toda a família, no coração do bairro.
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
        <h2 style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}>Nossos serviços</h2>
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
          {servicos.map((s) => (
            <li
              key={s}
              style={{
                background: "white",
                border: "1px solid rgba(21,32,43,0.1)",
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
          A clínica
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
              src={`/demos/clinica-${n}.jpg`}
              alt={`Foto do ambiente da clínica, imagem ${n}`}
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
            background: "white",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
          }}
        >
          <tbody>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "0.85rem" }}>Segunda a sexta</td>
              <td style={{ padding: "0.85rem" }}>8h às 19h</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "0.85rem" }}>Sábado</td>
              <td style={{ padding: "0.85rem" }}>8h às 13h</td>
            </tr>
            <tr>
              <td style={{ padding: "0.85rem" }}>Domingo</td>
              <td style={{ padding: "0.85rem" }}>Fechado</td>
            </tr>
          </tbody>
        </table>

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
            background: "#d7dde6",
            color: "#5b6572",
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
          background: AZUL,
          color: "white",
          fontSize: "0.92rem",
        }}
      >
        Clínica Sorriso Novo — site de exemplo criado pela kdiff
      </footer>
    </div>
  );
}
