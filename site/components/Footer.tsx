import { linkWhatsapp } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-k" style={{ display: "grid", gap: "0.35rem" }}>
        <span
          className="display"
          style={{ fontSize: "1.75rem", fontWeight: 800 }}
        >
          kdiff<span style={{ color: "var(--sinal)" }}>.</span>
        </span>
        <span className="eyebrow" style={{ color: "var(--toldo)" }}>
          Sites para negócios locais
        </span>
        <p style={{ marginTop: "1rem" }}>
          kdiff — a diferença aparece no celular do seu cliente.
        </p>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "rgba(12,22,20,0.7)" }}>
          Sites para negócios locais — São Paulo e região
        </p>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.95rem" }}>
          contato@SEUDOMINIO ·{" "}
          <a
            href={linkWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", textUnderlineOffset: "0.22em" }}
          >
            WhatsApp
          </a>
        </p>
        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "0.9rem",
            color: "rgba(12,22,20,0.5)",
          }}
        >
          © 2026 kdiff
        </p>
      </div>
    </footer>
  );
}
