const dores = [
  {
    n: "01",
    titulo: "Você só tem o Instagram",
    texto:
      "Quem procura seu serviço no Google não te encontra. Encontra o concorrente da rua de trás.",
  },
  {
    n: "02",
    titulo: "O site trava no celular",
    texto:
      "Foi feito anos atrás, demora para abrir e o cliente desiste antes de ver o telefone.",
  },
  {
    n: "03",
    titulo: "Você responde a mesma coisa o dia todo",
    texto:
      "Horário, endereço, se atende no sábado. Toda hora, no direct, no meio do atendimento.",
  },
];

export default function Dores() {
  return (
    <section className="secao">
      <div className="container-k">
        <p className="eyebrow accent">O problema</p>
        <h2 className="section-title">Provavelmente é assim hoje</h2>
        <div className="pain-list">
          {dores.map((d) => (
            <article key={d.titulo} className="pain-item">
              <span className="pain-item__mark" aria-hidden="true">
                {d.n}
              </span>
              <div>
                <h3>{d.titulo}</h3>
                <p style={{ margin: "0.55rem 0 0", color: "var(--ink-soft)" }}>
                  {d.texto}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
