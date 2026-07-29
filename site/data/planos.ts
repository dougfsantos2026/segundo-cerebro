/**
 * FORMATOS DE PROJETO
 *
 * Nenhum preço é exibido: cada projeto é orçado conforme escopo.
 * >>> Se um dia houver tabela de preços, adicione o campo aqui — nunca
 * >>> invente valores no componente.
 */

export type Plano = {
  slug: string;
  nome: string;
  resumo: string;
  indicadoPara: string;
  itens: string[];
  destaque: boolean;
};

export const planos: Plano[] = [
  {
    slug: "essencial",
    nome: "Essencial",
    resumo:
      "Uma página completa para quem precisa existir bem no digital com o essencial no lugar.",
    indicadoPara:
      "Profissionais autônomos e negócios que estão publicando o primeiro site.",
    itens: [
      "Página única com todas as seções",
      "Layout responsivo",
      "Botão de WhatsApp",
      "Formulário de contato",
      "Publicação com domínio e SSL",
    ],
    destaque: false,
  },
  {
    slug: "profissional",
    nome: "Profissional",
    resumo:
      "Site com várias páginas, conteúdo estratégico e estrutura preparada para o Google.",
    indicadoPara:
      "Clínicas, escritórios, lojas e empresas que dependem do site para gerar contatos.",
    itens: [
      "Tudo do Essencial",
      "Múltiplas páginas de serviço",
      "SEO técnico e dados estruturados",
      "Textos orientados para conversão",
      "Painel para atualizar conteúdo",
      "Período de suporte estendido",
    ],
    destaque: true,
  },
  {
    slug: "sob-medida",
    nome: "Sob medida",
    resumo:
      "Projeto desenhado do zero para necessidades específicas de integração ou catálogo.",
    indicadoPara:
      "Operações com loja virtual, sistemas internos ou integrações particulares.",
    itens: [
      "Tudo do Profissional",
      "Loja virtual ou catálogo",
      "Integrações com sistemas",
      "Escopo e prazo dedicados",
      "Acompanhamento contínuo",
    ],
    destaque: false,
  },
];
