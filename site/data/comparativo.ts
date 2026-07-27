export type LinhaComparativo = {
  criterio: string;
  improvisado: string;
  profissional: string;
};

export const comparativo: LinhaComparativo[] = [
  {
    criterio: "Identidade",
    improvisado: "Visual genérico de modelo pronto",
    profissional: "Identidade própria, alinhada à sua marca",
  },
  {
    criterio: "Credibilidade",
    improvisado: "Passa insegurança para quem não conhece",
    profissional: "Transmite confiança já no primeiro acesso",
  },
  {
    criterio: "Celular",
    improvisado: "Lento e desalinhado em telas pequenas",
    profissional: "Rápido e responsivo em qualquer tela",
  },
  {
    criterio: "Organização",
    improvisado: "Informações espalhadas e difíceis de achar",
    profissional: "Navegação clara, com o essencial à mão",
  },
  {
    criterio: "Atualização",
    improvisado: "Depende de terceiros para qualquer mudança",
    profissional: "Conteúdo fácil de atualizar quando preciso",
  },
  {
    criterio: "Resultado",
    improvisado: "Poucos contatos e nenhuma medição",
    profissional: "Caminhos de contato claros e mensuráveis",
  },
];
