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
    <section id="demos" className="secao secao--paper">
      <div className="container-k">
        <p className="eyebrow accent">Exemplos</p>
        <h2 className="section-title">Sites de exemplo</h2>
        <p className="section-lead">
          Modelos navegáveis que uso como ponto de partida. O seu é feito com as
          suas fotos, seus serviços e seus horários.
        </p>

        <div className="demo-stack">
          {demos.map((d, i) => (
            <a
              key={d.href}
              href={d.href}
              className={`demo-row${i % 2 === 1 ? " demo-row--flip" : ""}`}
            >
              <div className="demo-row__frame">
                <div className="browser browser--compact">
                  <div className="browser__chrome">
                    <span />
                    <span />
                    <span />
                    <div className="browser__url">exemplo.kdiff</div>
                  </div>
                  <div className="demo-row__media">
                    <Image
                      src={d.img}
                      alt={d.alt}
                      width={900}
                      height={620}
                      sizes="(max-width: 900px) 100vw, 55vw"
                    />
                  </div>
                </div>
              </div>
              <div className="demo-row__copy">
                <span className="eyebrow muted">Exemplo 0{i + 1}</span>
                <h3>{d.titulo}</h3>
                <p>{d.subtitulo}</p>
                <span className="text-link">Ver o exemplo</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
