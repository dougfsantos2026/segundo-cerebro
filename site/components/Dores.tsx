const dores = [
  {
    titulo: "Você só tem o Instagram",
    texto:
      "Quem procura seu serviço no Google não te encontra. Encontra o concorrente da rua de trás.",
  },
  {
    titulo: "O site trava no celular",
    texto:
      "Foi feito anos atrás, demora para abrir e o cliente desiste antes de ver o telefone.",
  },
  {
    titulo: "Você responde a mesma coisa o dia todo",
    texto:
      "Horário, endereço, se atende no sábado. Toda hora, no direct, no meio do atendimento.",
  },
];

export default function Dores() {
  return (
    <section className="secao">
      <div className="container-k">
        <h2>Provavelmente é assim hoje</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {dores.map((d) => (
            <div key={d.titulo} className="cartao p-6">
              <h3 className="font-semibold">{d.titulo}</h3>
              <p className="mt-3 text-[rgba(16,26,24,0.8)]">{d.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
