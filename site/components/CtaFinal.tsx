import BotaoWhatsapp from "./BotaoWhatsapp";

export default function CtaFinal() {
  return (
    <section className="cta-band">
      <div className="container-k">
        <h2>Manda uma mensagem. Sem compromisso.</h2>
        <p
          style={{
            margin: "1rem auto 0",
            maxWidth: "34rem",
          }}
        >
          Me diz o nome do seu negócio e o que ele faz. Eu respondo com uma
          ideia do que dá para fazer.
        </p>
        <div style={{ marginTop: "1.75rem" }}>
          <BotaoWhatsapp />
        </div>
        <p
          className="eyebrow"
          style={{ marginTop: "1rem", color: "rgba(255,255,255,0.5)" }}
        >
          Costumo responder no mesmo dia.
        </p>
      </div>
    </section>
  );
}
