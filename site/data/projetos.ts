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
  /**
   * Fundo colorido do card, escrito por extenso porque o Tailwind precisa
   * enxergar a classe inteira no código-fonte para gerá-la.
   */
  fundo: string;
  /** Endereço fictício exibido na moldura de navegador. */
  dominio: string;
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
    imagem: "/images/segmento-clinica.webp",
    fundo: "bg-[linear-gradient(150deg,#0e7f95,#0b4c63)]",
    dominio: "clinicasorrisonovo.com.br",
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
    imagem: "/images/segmento-salao.webp",
    fundo: "bg-[linear-gradient(150deg,#6a4bf0,#3a1f8f)]",
    dominio: "studiobelaforma.com.br",
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
    imagem: "/images/segmento-restaurante.webp",
    fundo: "bg-[linear-gradient(150deg,#b4441f,#6d2312)]",
    dominio: "cantinadobairro.com.br",
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
    imagem: "/images/segmento-advocacia.webp",
    fundo: "bg-[linear-gradient(150deg,#1c2434,#0b0f16)]",
    dominio: "andradeadvocacia.adv.br",
  },
  {
    slug: "contabil-precisa",
    nome: "Contábil Precisa",
    segmento: "Contabilidade",
    tipo: "Landing page",
    descricao:
      "Página objetiva para captação de novos clientes, com comparativo de planos de serviço.",
    recursos: ["Landing page", "Conversão", "Analytics"],
    imagem: "/images/segmento-contabilidade.webp",
    fundo: "bg-[linear-gradient(150deg,#2c4cbf,#152563)]",
    dominio: "contabilprecisa.com.br",
  },
  {
    slug: "oficina-mecanica-norte",
    nome: "Oficina Norte",
    segmento: "Serviços automotivos",
    tipo: "Site para negócio local",
    descricao:
      "Serviços, orçamento rápido e localização para quem procura oficina perto de casa.",
    recursos: ["Orçamento", "Mapa", "Mobile first"],
    imagem: "/images/segmento-oficina.webp",
    fundo: "bg-[linear-gradient(150deg,#1f6b57,#0d3a2e)]",
    dominio: "oficinanorte.com.br",
  },
];
