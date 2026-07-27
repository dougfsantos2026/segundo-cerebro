import { mensagemWhatsappPadrao, whatsappNumero } from "./site-config";

/**
 * Monta o link do WhatsApp. O número vem sempre da configuração central,
 * nunca de valores fixos espalhados pelos componentes.
 */
export function linkWhatsapp(mensagem: string = mensagemWhatsappPadrao) {
  const numero = whatsappNumero.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

/** Link com mensagem contextualizada por serviço ou plano. */
export function linkWhatsappSobre(assunto: string) {
  return linkWhatsapp(
    `Olá! Conheci o site e gostaria de saber mais sobre ${assunto}.`,
  );
}
