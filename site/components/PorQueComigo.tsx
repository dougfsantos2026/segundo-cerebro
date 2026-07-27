const dados = [
  { numero: "13 anos", rotulo: "testando software" },
  { numero: "1 pessoa", rotulo: "do começo ao fim" },
  { numero: "30 dias", rotulo: "de ajustes inclusos" },
];

export default function PorQueComigo() {
  return (
    <section className="secao">
      <div className="container-k about-grid">
        <div>
          <p className="eyebrow accent">Quem faz</p>
          <h2 className="section-title">Quem faz o seu site</h2>
          <p style={{ marginTop: "1.25rem", maxWidth: "38rem" }}>
            Sou Douglas. Passei os últimos 13 anos testando software para
            empresas grandes — meu trabalho literalmente era achar o que quebra
            antes do cliente achar. Aplico o mesmo cuidado aqui: seu site é
            testado em celular antigo, internet ruim e tela pequena antes de
            entrar no ar.
          </p>
          <p style={{ marginTop: "0.9rem", maxWidth: "38rem" }}>
            Você fala comigo, não com atendente. E não sumo depois da entrega.
          </p>
        </div>
        <dl>
          {dados.map((d) => (
            <div key={d.rotulo} className="stat">
              <dt className="eyebrow muted">{d.rotulo}</dt>
              <dd className="stat__n">{d.numero}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
