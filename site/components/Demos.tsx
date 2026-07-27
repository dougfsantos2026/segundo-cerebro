const demos = [
  {
    titulo: "Clínica odontológica",
    subtitulo: "Agendamento, convênios, equipe",
    href: "/demos/clinica",
  },
  {
    titulo: "Salão de beleza",
    subtitulo: "Tabela de serviços, galeria, horários",
    href: "/demos/salao",
  },
  {
    titulo: "Pizzaria de bairro",
    subtitulo: "Cardápio, delivery, área de entrega",
    href: "/demos/restaurante",
  },
];

export default function Demos() {
  return (
    <section id="demos" className="secao">
      <div className="container-k">
        <h2>Sites de exemplo</h2>
        <p className="mt-4 max-w-prose">
          Modelos navegáveis que uso como ponto de partida. O seu é feito com as
          suas fotos, seus serviços e seus horários.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {demos.map((d) => (
            <a key={d.href} href={d.href} className="cartao relative block p-6">
              <span className="eyebrow absolute right-4 top-4 text-[rgba(16,26,24,0.5)]">
                EXEMPLO
              </span>
              <h3 className="mt-6 font-semibold">{d.titulo}</h3>
              <p className="mt-2 text-sm text-[rgba(16,26,24,0.7)]">
                {d.subtitulo}
              </p>
              <span className="mt-6 inline-block font-medium text-[var(--toldo)] underline underline-offset-4">
                Ver o exemplo
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
