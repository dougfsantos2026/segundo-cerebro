import Image from "next/image";

const demos = [
  {
    titulo: "Clínica odontológica",
    subtitulo: "Agendamento, convênios, equipe",
    href: "/demos/clinica",
    img: "/demos/clinica-1.jpg",
    alt: "Ambiente de clínica odontológica",
  },
  {
    titulo: "Salão de beleza",
    subtitulo: "Tabela de serviços, galeria, horários",
    href: "/demos/salao",
    img: "/demos/salao-1.jpg",
    alt: "Interior de salão de beleza",
  },
  {
    titulo: "Pizzaria de bairro",
    subtitulo: "Cardápio, delivery, área de entrega",
    href: "/demos/restaurante",
    img: "/demos/pizza-1.jpg",
    alt: "Pizza saindo do forno",
  },
];

export default function Demos() {
  return (
    <section id="demos" className="secao">
      <div className="container-k">
        <p className="eyebrow" style={{ color: "var(--toldo)" }}>
          Exemplos
        </p>
        <h2 style={{ marginTop: "0.75rem" }}>Sites de exemplo</h2>
        <p style={{ marginTop: "0.9rem", maxWidth: "38rem" }}>
          Modelos navegáveis que uso como ponto de partida. O seu é feito com as
          suas fotos, seus serviços e seus horários.
        </p>
        <div className="demo-grid">
          {demos.map((d) => (
            <a key={d.href} href={d.href} className="link-demo demo-card">
              <div className="demo-card__media">
                <Image
                  src={d.img}
                  alt={d.alt}
                  width={600}
                  height={450}
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
              </div>
              <div className="demo-card__body">
                <span className="eyebrow demo-card__label">Exemplo</span>
                <h3 style={{ marginTop: "0.55rem" }}>{d.titulo}</h3>
                <p
                  style={{
                    margin: "0.4rem 0 0",
                    fontSize: "0.95rem",
                    color: "rgba(12,22,20,0.7)",
                  }}
                >
                  {d.subtitulo}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    color: "var(--toldo)",
                    fontWeight: 600,
                    textDecoration: "underline",
                    textUnderlineOffset: "0.22em",
                  }}
                >
                  Ver o exemplo
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
