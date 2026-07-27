const itens = [
  "Uma página completa, feita primeiro para o celular",
  "Seus serviços, fotos, horários e endereço com mapa",
  "Botão de WhatsApp fixo, com a mensagem já escrita",
  "Seu perfil no Google configurado, para aparecer no mapa",
  "Domínio próprio no ar, com cadeado de segurança",
  "Testado em vários celulares antes de entrar no ar",
  "30 dias de ajustes depois da entrega",
];

export default function Entregaveis() {
  return (
    <section className="secao">
      <div className="container-k">
        <p className="eyebrow" style={{ color: "var(--toldo)" }}>
          O pacote
        </p>
        <h2 style={{ marginTop: "0.75rem" }}>O que entra no seu site</h2>
        <ul className="check-grid">
          {itens.map((item) => (
            <li key={item} className="check-item">
              <span className="check-item__tick" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p
          className="eyebrow"
          style={{ marginTop: "2rem", color: "var(--toldo)" }}
        >
          Sem mensalidade escondida. Você é dono do domínio e do site.
        </p>
      </div>
    </section>
  );
}
