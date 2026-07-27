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
    <section className="secao">
      <div className="container-k">
        <h2>Do primeiro contato ao site no ar</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2">
          {passos.map((p, i) => (
            <li key={p.titulo} className="flex gap-5">
              <span
                aria-hidden="true"
                className="font-[family-name:var(--font-display)] text-4xl font-extrabold text-[var(--toldo)]"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-[rgba(16,26,24,0.8)]">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
