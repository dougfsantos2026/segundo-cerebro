// Substituir SEUNUMERO pelos dígitos reais, ex: "5511999999999"
export const TELEFONE = "SEUNUMERO";

export function linkWhatsapp(nomeNegocio?: string) {
  const texto = nomeNegocio && nomeNegocio.trim().length > 0
    ? `Oi! Sou do ${nomeNegocio.trim()} e quero um site.`
    : "Oi! Vi o site da kdiff e quero um orçamento.";
  return `https://wa.me/${TELEFONE}?text=${encodeURIComponent(texto)}`;
}
