/**
 * PORTFÓLIO — DADOS DE EXEMPLO
 *
 * Os projetos abaixo são demonstrações criadas pelo estúdio, com nomes
 * fictícios. Não representam clientes reais.
 *
 * >>> SUBSTITUIR por projetos reais quando houver autorização do cliente.
 * >>> Ao trocar, atualize `nome`, `segmento`, `descricao`, `imagem` e `href`.
 */

export type Projeto = {
  slug: string;
  /** Nome fictício temporário. SUBSTITUIR pelo cliente real. */
  nome: string;
  segmento: string;
  tipo: string;
  descricao: string;
  recursos: string[];
  /** Foto de apoio. Quando ausente, o card exibe um mockup gerado em CSS. */
  imagem?: string;
  /** Rota da demonstração navegável, quando existir. */
  href?: string;
};

export const projetos: Projeto[] = [
  {
    slug: "clinica-sorriso-novo",
    nome: "Clínica Sorriso Novo",
    segmento: "Odontologia",
    tipo: "Site institucional",
    descricao:
      "Site de clínica com lista de especialidades, apresentação da equipe e agendamento direto pelo WhatsApp.",
    recursos: ["Next.js", "Agendamento", "SEO local"],
    imagem: "/demos/clinica-1.jpg",
    href: "/demos/clinica",
  },
  {
    slug: "studio-bela-forma",
    nome: "Studio Bela Forma",
    segmento: "Beleza e estética",
    tipo: "Site para negócio local",
    descricao:
      "Tabela de serviços, galeria de resultados e horários de funcionamento em uma página só.",
    recursos: ["Galeria", "WhatsApp", "Google Maps"],
    imagem: "/demos/salao-1.jpg",
    href: "/demos/salao",
  },
  {
    slug: "cantina-do-bairro",
    nome: "Cantina do Bairro",
    segmento: "Restaurante",
    tipo: "Site com cardápio",
    descricao:
      "Cardápio digital, área de entrega e pedido direto pelo WhatsApp, sem taxa de aplicativo.",
    recursos: ["Cardápio", "Delivery", "Performance"],
    imagem: "/demos/pizza-1.jpg",
    href: "/demos/restaurante",
  },
  {
    slug: "andrade-advocacia",
    nome: "Andrade Advocacia",
    segmento: "Advocacia",
    tipo: "Site institucional",
    descricao:
      "Apresentação de áreas de atuação com linguagem sóbria e formulário de primeiro contato.",
    recursos: ["Áreas de atuação", "Formulário", "SEO"],
  },
  {
    slug: "contabil-precisa",
    nome: "Contábil Precisa",
    segmento: "Contabilidade",
    tipo: "Landing page",
    descricao:
      "Página objetiva para captação de novos clientes, com comparativo de planos de serviço.",
    recursos: ["Landing page", "Conversão", "Analytics"],
  },
  {
    slug: "oficina-mecanica-norte",
    nome: "Oficina Norte",
    segmento: "Serviços automotivos",
    tipo: "Site para negócio local",
    descricao:
      "Serviços, orçamento rápido e localização para quem procura oficina perto de casa.",
    recursos: ["Orçamento", "Mapa", "Mobile first"],
  },
];
