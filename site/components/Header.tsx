import BotaoWhatsapp from "./BotaoWhatsapp";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[rgba(16,26,24,0.15)] bg-[rgba(232,234,227,0.85)] backdrop-blur">
      <div className="container-k flex h-16 items-center justify-between">
        <a
          href="#topo"
          className="font-[family-name:var(--font-display)] text-2xl font-extrabold"
        >
          kdiff.
        </a>
        <BotaoWhatsapp>
          <span className="hidden sm:inline">Chamar no WhatsApp</span>
          <span className="sm:hidden">WhatsApp</span>
        </BotaoWhatsapp>
      </div>
    </header>
  );
}
