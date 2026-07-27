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
        <h2>O que entra no seu site</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {itens.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-1 font-bold text-[var(--toldo)]">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="eyebrow mt-10 text-[var(--toldo)]">
          Sem mensalidade escondida. Você é dono do domínio e do site.
        </p>
      </div>
    </section>
  );
}
