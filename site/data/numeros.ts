/**
 * INDICADORES — DADOS PENDENTES
 *
 * Os valores abaixo são PLACEHOLDERS e estão marcados com colchetes de
 * propósito, para deixar evidente que ainda não são reais.
 *
 * >>> SUBSTITUIR o campo `valor` de cada item pelos números verdadeiros
 * >>> antes de publicar o site. Não divulgue métricas que não possam ser
 * >>> comprovadas.
 */

export type Indicador = {
  /** SUBSTITUIR pelo número real. */
  valor: string;
  rotulo: string;
  descricao: string;
};

export const indicadores: Indicador[] = [
  {
    valor: "[X]+", // SUBSTITUIR: total de projetos entregues
    rotulo: "projetos entregues",
    descricao: "Sites publicados e no ar para negócios de segmentos diferentes.",
  },
  {
    valor: "[X]", // SUBSTITUIR: anos de experiência
    rotulo: "anos de experiência",
    descricao: "Tempo de estrada construindo produtos digitais.",
  },
  {
    valor: "[X]%", // SUBSTITUIR: índice de satisfação apurado
    rotulo: "de clientes satisfeitos",
    descricao: "Medido em pesquisa aplicada após a entrega de cada projeto.",
  },
  {
    valor: "[X]", // SUBSTITUIR: prazo médio real em dias
    rotulo: "dias de prazo médio",
    descricao: "Da aprovação do escopo até a publicação do site.",
  },
];
