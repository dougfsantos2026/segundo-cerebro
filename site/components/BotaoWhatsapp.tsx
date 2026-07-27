import { linkWhatsapp } from "@/lib/whatsapp";

type Props = {
  variante?: "primario" | "secundario";
  nomeNegocio?: string;
  children?: React.ReactNode;
};

export default function BotaoWhatsapp({
  variante = "primario",
  nomeNegocio,
  children = "Chamar no WhatsApp",
}: Props) {
  const estilos =
    variante === "primario"
      ? "bg-[var(--sinal)] text-[var(--tinta)]"
      : "bg-[var(--toldo)] text-white";

  return (
    <a
      href={linkWhatsapp(nomeNegocio)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center rounded px-7 py-4 font-semibold shadow-[0_2px_0_var(--tinta)] transition-transform hover:-translate-y-0.5 ${estilos}`}
    >
      {children}
    </a>
  );
}
