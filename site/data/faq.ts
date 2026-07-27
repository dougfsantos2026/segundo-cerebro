export type PerguntaFrequente = {
  id: string;
  pergunta: string;
  resposta: string;
};

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    id: "custo",
    pergunta: "Quanto custa criar um site?",
    resposta:
      "O valor depende do número de páginas, do tipo de projeto e de quanto material você já tem pronto. Por isso trabalhamos com proposta individual: você conta o que precisa e recebe um orçamento fechado, sem surpresas depois.",
  },
  {
    id: "prazo",
    pergunta: "Quanto tempo demora?",
    resposta:
      "Depois que o escopo é aprovado e o material está em mãos, uma página única costuma ficar pronta em poucos dias e um site com várias páginas leva algumas semanas. O que mais influencia o prazo é o tempo de retorno com textos, fotos e aprovações.",
  },
  {
    id: "mobile",
    pergunta: "O site funciona bem no celular?",
    resposta:
      "Sim. O layout é desenhado primeiro para a tela do celular e testado em larguras de 320px até monitores grandes, verificando que não haja rolagem lateral, texto cortado ou botão fora da tela.",
  },
  {
    id: "alteracoes",
    pergunta: "Posso solicitar alterações?",
    resposta:
      "Pode. Existe uma etapa de revisão antes da publicação em que você navega no site e pede os ajustes que quiser. Depois da entrega, há um período de suporte combinado no início do projeto.",
  },
  {
    id: "dominio",
    pergunta: "O domínio e a hospedagem estão incluídos?",
    resposta:
      "Cuidamos de toda a configuração de domínio, hospedagem e certificado de segurança. As taxas de registro do domínio e do serviço de hospedagem são cobradas pelos respectivos provedores e ficam registradas no seu nome — você continua dono de tudo.",
  },
  {
    id: "whatsapp",
    pergunta: "O site terá integração com WhatsApp?",
    resposta:
      "Sim. Todo projeto sai com botão de WhatsApp fixo na tela e mensagem inicial já preenchida, para o visitante iniciar a conversa em um toque.",
  },
  {
    id: "google",
    pergunta: "O site vai aparecer no Google?",
    resposta:
      "Entregamos o site com a estrutura técnica que o Google espera: títulos e descrições próprios, dados estruturados, sitemap e indexação configurada. Isso é a base necessária. A posição alcançada depende também da concorrência do seu segmento e da produção de conteúdo ao longo do tempo.",
  },
  {
    id: "manutencao",
    pergunta: "Vocês fazem manutenção?",
    resposta:
      "Fazemos. Há um serviço contínuo de manutenção que cobre atualizações de segurança, pequenos ajustes de conteúdo, backup e monitoramento. É opcional e pode ser contratado depois da entrega.",
  },
  {
    id: "atualizar",
    pergunta: "Eu vou conseguir atualizar o conteúdo?",
    resposta:
      "Quando o projeto pede atualizações frequentes, entregamos um painel simples para você editar textos e imagens sozinho, com uma explicação de como usar. Em sites mais estáticos, os ajustes entram no serviço de manutenção.",
  },
  {
    id: "pagamento",
    pergunta: "Como funciona o pagamento?",
    resposta:
      "As condições são definidas na proposta, normalmente com uma parte no início do projeto e o restante na entrega. Formas de pagamento e parcelamento são combinados antes de qualquer trabalho começar.",
  },
];
