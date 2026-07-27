import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappFloat from "@/components/layout/WhatsappFloat";
import Hero from "@/components/sections/Hero";
import ProblemaSolucao from "@/components/sections/ProblemaSolucao";
import Servicos from "@/components/sections/Servicos";
import Beneficios from "@/components/sections/Beneficios";
import SobreNumeros from "@/components/sections/SobreNumeros";
import Processo from "@/components/sections/Processo";
import Portfolio from "@/components/sections/Portfolio";
import Comparativo from "@/components/sections/Comparativo";
import Depoimentos from "@/components/sections/Depoimentos";
import Planos from "@/components/sections/Planos";
import Faq from "@/components/sections/Faq";
import CtaFinal from "@/components/sections/CtaFinal";
import Contato from "@/components/sections/Contato";
import { perguntasFrequentes } from "@/data/faq";
import { siteUrl } from "@/lib/site-config";

/** Dados estruturados das perguntas frequentes, para rich results no Google. */
const dadosEstruturadosFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteUrl}/#faq`,
  mainEntity: perguntasFrequentes.map((item) => ({
    "@type": "Question",
    name: item.pergunta,
    acceptedAnswer: { "@type": "Answer", text: item.resposta },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dadosEstruturadosFaq),
        }}
      />

      <Header />

      <main id="conteudo">
        <Hero />
        <ProblemaSolucao />
        <Servicos />
        <Beneficios />
        <SobreNumeros />
        <Processo />
        <Portfolio />
        <Comparativo />
        <Depoimentos />
        <Planos />
        <Faq />
        <CtaFinal />
        <Contato />
      </main>

      <Footer />
      <WhatsappFloat />
    </>
  );
}
