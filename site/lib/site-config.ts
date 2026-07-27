/**
 * Configuração central do site.
 *
 * PREENCHER ANTES DE PUBLICAR: todos os valores marcados com "SUBSTITUIR"
 * devem ser trocados pelos dados reais da empresa. Os mesmos valores podem
 * ser definidos por variáveis de ambiente (ver `.env.example`), o que evita
 * recompilar o código a cada alteração de contato.
 */

/** URL pública do site, usada em canonical, sitemap, Open Graph e JSON-LD. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.kdiff.com.br"; // SUBSTITUIR pelo domínio real

/**
 * Número do WhatsApp somente com dígitos, no padrão internacional.
 * Ex.: 55 (país) + 11 (DDD) + número.
 */
export const whatsappNumero =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5511999999999"; // SUBSTITUIR

export const siteConfig = {
  nome: "kdiff",
  nomeCompleto: "kdiff — Estúdio de Sites",
  tagline: "Sites profissionais que transformam visitantes em clientes",
  descricao:
    "Criamos sites modernos, rápidos e estratégicos para pequenos e médios negócios que querem transmitir confiança, atrair novos clientes e crescer no digital.",
  url: siteUrl,
  locale: "pt_BR",
  idioma: "pt-BR",
  regiao: "São Paulo, SP", // SUBSTITUIR se atender outra região
  areaAtendimento: "Brasil",
  fundacao: "2024", // SUBSTITUIR pelo ano real de início
} as const;

export const contato = {
  email: "contato@kdiff.com.br", // SUBSTITUIR
  whatsapp: whatsappNumero,
  /** Exibição formatada do telefone. SUBSTITUIR junto com `whatsappNumero`. */
  telefoneExibicao: "(11) 99999-9999",
  horario: "Segunda a sexta, das 9h às 18h",
  cidade: "São Paulo",
  estado: "SP",
} as const;

export const redesSociais = [
  { nome: "Instagram", href: "https://instagram.com/kdiff" }, // SUBSTITUIR
  { nome: "LinkedIn", href: "https://linkedin.com/company/kdiff" }, // SUBSTITUIR
  { nome: "GitHub", href: "https://github.com/kdiff" }, // SUBSTITUIR
] as const;

/** Mensagem pré-preenchida ao abrir o WhatsApp a partir do site. */
export const mensagemWhatsappPadrao =
  "Olá! Conheci o site e gostaria de solicitar um orçamento.";
