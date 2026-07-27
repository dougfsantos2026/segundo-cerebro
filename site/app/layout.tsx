import type { Metadata } from "next";
import {
  Instrument_Serif,
  Manrope,
  JetBrains_Mono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-k-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-k-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-k-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "kdiff — Sites para negócios locais em São Paulo",
  description:
    "Sites rápidos para clínicas, salões, lojas e restaurantes. Feitos para celular, com WhatsApp integrado e prontos para aparecer no Google.",
  openGraph: {
    title: "kdiff — Sites para negócios locais",
    description:
      "Sites rápidos para clínicas, salões, lojas e restaurantes. Feitos para celular, com WhatsApp integrado e prontos para aparecer no Google.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "kdiff",
              url: "https://SEUDOMINIO",
              telephone: "+SEUNUMERO",
              areaServed: "São Paulo",
              description:
                "Criação de sites para negócios locais: clínicas, salões, lojas e restaurantes.",
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
