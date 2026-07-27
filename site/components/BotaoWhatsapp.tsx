import { linkWhatsapp } from "@/lib/whatsapp";

type Props = {
  nomeNegocio?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function BotaoWhatsapp({
  nomeNegocio,
  children = "Chamar no WhatsApp",
  className = "btn-sinal",
}: Props) {
  return (
    <a
      href={linkWhatsapp(nomeNegocio)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
