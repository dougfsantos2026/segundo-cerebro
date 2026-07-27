import { linkWhatsapp } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(16,26,24,0.15)] py-12">
      <div className="container-k flex flex-col gap-2">
        <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
          kdiff.
        </span>
        <span className="eyebrow text-[var(--toldo)]">
          SITES PARA NEGÓCIOS LOCAIS
        </span>
        <p className="mt-4">
          kdiff — a diferença aparece no celular do seu cliente.
        </p>
        <p className="text-sm text-[rgba(16,26,24,0.7)]">
          Sites para negócios locais — São Paulo e região
        </p>
        <p className="text-sm">
          contato@SEUDOMINIO ·{" "}
          <a
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            WhatsApp
          </a>
        </p>
        <p className="mt-4 text-sm text-[rgba(16,26,24,0.5)]">© 2026 kdiff</p>
      </div>
    </footer>
  );
}
