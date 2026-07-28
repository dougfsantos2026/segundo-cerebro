import { MessageCircle } from "lucide-react";
import { linkWhatsapp } from "@/lib/whatsapp";

/**
 * Botão flutuante de WhatsApp. O número vem sempre de `lib/site-config`,
 * nunca escrito direto aqui.
 */
export default function WhatsappFloat() {
  return (
    <a
      href={linkWhatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp (abre em nova aba)"
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-marca-600 text-white shadow-[0_14px_36px_-10px_rgba(76,125,255,0.9)] transition-[translate,background-color] duration-200 hover:-translate-y-1 hover:bg-marca-500 sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}
