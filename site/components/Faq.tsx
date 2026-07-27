const perguntas = [
  {
    p: "Quanto custa?",
    r: "Depende do tamanho do site e de quanto material você já tem pronto. Me chama no WhatsApp, faço umas perguntas rápidas e te passo o valor fechado no mesmo dia. Sem reunião obrigatória.",
  },
  {
    p: "Quanto tempo demora?",
    r: "A partir do momento em que você me manda fotos e textos, poucos dias. O que mais atrasa é esperar o material.",
  },
  {
    p: "Eu preciso entender de tecnologia?",
    r: "Não. Você manda foto e me conta o que faz. O resto é comigo.",
  },
  {
    p: "E se eu quiser mudar alguma coisa depois?",
    r: "Nos primeiros 30 dias, ajustes estão inclusos. Depois disso, a gente combina caso a caso.",
  },
  {
    p: "O site é meu mesmo?",
    r: "Sim. O domínio fica no seu nome e o site é seu. Você não fica preso a mim.",
  },
  {
    p: "Você faz para qualquer tipo de negócio?",
    r: "Trabalho principalmente com negócios que atendem presencialmente: clínicas, salões, lojas, oficinas, restaurantes. Se for outra coisa, me pergunta que eu falo se consigo ajudar.",
  },
];

export default function Faq() {
  return (
    <section className="secao">
      <div className="container-k">
        <p className="eyebrow" style={{ color: "var(--toldo)" }}>
          FAQ
        </p>
        <h2 style={{ marginTop: "0.75rem" }}>Perguntas que sempre aparecem</h2>
        <div className="faq-list">
          {perguntas.map((item) => (
            <details key={item.p} className="faq-item">
              <summary>{item.p}</summary>
              <p>{item.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
