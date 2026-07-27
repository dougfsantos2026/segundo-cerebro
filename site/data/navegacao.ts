export type ItemNavegacao = {
  rotulo: string;
  href: string;
};

/** Navegação principal por âncoras da página inicial. */
export const navegacaoPrincipal: ItemNavegacao[] = [
  { rotulo: "Início", href: "#inicio" },
  { rotulo: "Serviços", href: "#servicos" },
  { rotulo: "Como funciona", href: "#processo" },
  { rotulo: "Projetos", href: "#projetos" },
  { rotulo: "Sobre", href: "#sobre" },
  { rotulo: "Perguntas frequentes", href: "#faq" },
  { rotulo: "Contato", href: "#contato" },
];

export const linksInstitucionais: ItemNavegacao[] = [
  { rotulo: "Política de privacidade", href: "/politica-de-privacidade" },
  { rotulo: "Termos de uso", href: "/termos-de-uso" },
];
