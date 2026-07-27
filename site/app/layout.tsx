import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { contato, redesSociais, siteConfig, siteUrl } from "@/lib/site-config";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.nome} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.nome}`,
  },
  description: siteConfig.descricao,
  applicationName: siteConfig.nome,
  keywords: [
    "criação de sites",
    "site profissional",
    "site para pequenas empresas",
    "landing page",
    "site para clínica",
    "site para advogado",
    "site para restaurante",
    "desenvolvimento web",
  ],
  authors: [{ name: siteConfig.nome, url: siteUrl }],
  creator: siteConfig.nome,
  publisher: siteConfig.nome,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.nome,
    title: `${siteConfig.nome} — ${siteConfig.tagline}`,
    description: siteConfig.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.nome} — ${siteConfig.tagline}`,
    description: siteConfig.descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0f16",
  colorScheme: "dark",
};

/** Dados estruturados da empresa, válidos para todas as páginas. */
const dadosEstruturadosEmpresa = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#organizacao`,
  name: siteConfig.nome,
  alternateName: siteConfig.nomeCompleto,
  description: siteConfig.descricao,
  url: siteUrl,
  email: contato.email,
  telephone: `+${contato.whatsapp}`,
  areaServed: siteConfig.areaAtendimento,
  address: {
    "@type": "PostalAddress",
    addressLocality: contato.cidade,
    addressRegion: contato.estado,
    addressCountry: "BR",
  },
  sameAs: redesSociais.map((rede) => rede.href),
  knowsLanguage: "pt-BR",
  serviceType: [
    "Criação de sites",
    "Landing pages",
    "Lojas virtuais",
    "Otimização para mecanismos de busca",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={siteConfig.idioma}
      className={`${sora.variable} ${inter.variable}`}
    >
      <head>
        {/* Sem JavaScript as animações de entrada nunca disparam; sem isto o
            conteúdo abaixo da dobra ficaria invisível. */}
        <noscript>
          <style>{"[data-revelar]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="antialiased">
        <a
          href="#conteudo"
          className="sr-only-focusable absolute top-4 left-4 z-[60] rounded-full bg-marca-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Pular para o conteúdo
        </a>

        <script
          type="application/ld+json"
          // Conteúdo estático definido no servidor, sem entrada de usuário.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dadosEstruturadosEmpresa),
          }}
        />

        {children}
        <Analytics />
      </body>
    </html>
  );
}
