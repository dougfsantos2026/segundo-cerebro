import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.nome} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento gerada no build, sem dependência de assets. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0B0F16 0%, #131926 60%, #0F141D 100%)",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#35D6EE",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700, color: "#ffffff" }}>
            {siteConfig.nome}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            Sites profissionais que
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#6E9BFF",
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            transformam visitantes em clientes
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#94A3B8" }}>
            Criação de sites para pequenos e médios negócios
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 8,
            width: 300,
            borderRadius: 999,
            background: "linear-gradient(90deg, #4C7DFF, #35D6EE)",
          }}
        />
      </div>
    ),
    size,
  );
}
