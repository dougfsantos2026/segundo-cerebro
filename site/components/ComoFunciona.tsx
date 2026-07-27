const passos = [
  {
    titulo: "Conversa",
    texto:
      "A gente fala no WhatsApp por 15 minutos. Você me conta o que o negócio faz e quem é o cliente.",
  },
  {
    titulo: "Material",
    texto:
      "Você me manda fotos, serviços e horários. Se não tiver foto boa, eu te digo exatamente o que fotografar com o celular.",
  },
  {
    titulo: "Site pronto",
    texto:
      "Em poucos dias você recebe o link para ver e pedir ajustes. Quantos ajustes precisar, dentro do combinado.",
  },
  {
    titulo: "No ar",
    texto:
      "Coloco o domínio, configuro o Google e te entrego tudo funcionando. Depois disso, 30 dias de suporte.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="processo" className="secao">
      <div className="container-k">
        <p className="eyebrow accent">O processo</p>
        <h2 className="section-title">Do primeiro contato ao site no ar</h2>
        <ol className="steps">
          {passos.map((p, i) => (
            <li key={p.titulo} className="step">
              <span className="step__n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{p.titulo}</h3>
                <p style={{ margin: "0.45rem 0 0", color: "var(--ink-soft)" }}>
                  {p.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
