const dados = [
  { numero: "13 anos", rotulo: "testando software" },
  { numero: "1 pessoa", rotulo: "do começo ao fim" },
  { numero: "30 dias", rotulo: "de ajustes inclusos" },
];

export default function PorQueComigo() {
  return (
    <section className="secao">
      <div className="container-k grid gap-12 md:grid-cols-[2fr_1fr]">
        <div>
          <h2>Quem faz o seu site</h2>
          <p className="mt-6 max-w-prose">
            Sou Douglas. Passei os últimos 13 anos testando software para
            empresas grandes — meu trabalho literalmente era achar o que quebra
            antes do cliente achar. Aplico o mesmo cuidado aqui: seu site é
            testado em celular antigo, internet ruim e tela pequena antes de
            entrar no ar.
          </p>
          <p className="mt-4 max-w-prose">
            Você fala comigo, não com atendente. E não sumo depois da entrega.
          </p>
        </div>
        <dl className="flex flex-col gap-8 md:border-l md:border-[rgba(16,26,24,0.15)] md:pl-8">
          {dados.map((d) => (
            <div key={d.rotulo}>
              <dt className="eyebrow text-[rgba(16,26,24,0.6)]">{d.rotulo}</dt>
              <dd className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--toldo)]">
                {d.numero}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
