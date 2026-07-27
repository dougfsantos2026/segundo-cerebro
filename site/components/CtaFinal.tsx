import BotaoWhatsapp from "./BotaoWhatsapp";

export default function CtaFinal() {
  return (
    <section className="bg-[var(--tinta)] py-24 text-[var(--papel)]">
      <div className="container-k text-center">
        <h2>Manda uma mensagem. Sem compromisso.</h2>
        <p className="mx-auto mt-4 max-w-prose">
          Me diz o nome do seu negócio e o que ele faz. Eu respondo com uma
          ideia do que dá para fazer.
        </p>
        <div className="mt-8">
          <BotaoWhatsapp />
        </div>
        <p className="eyebrow mt-4 text-[rgba(232,234,227,0.6)]">
          Costumo responder no mesmo dia.
        </p>
      </div>
    </section>
  );
}
