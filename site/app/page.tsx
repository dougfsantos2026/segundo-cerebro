import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dores from "@/components/Dores";
import Entregaveis from "@/components/Entregaveis";
import Demos from "@/components/Demos";
import ComoFunciona from "@/components/ComoFunciona";
import PorQueComigo from "@/components/PorQueComigo";
import ExtraOpcional from "@/components/ExtraOpcional";
import Faq from "@/components/Faq";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import WhatsappFlutuante from "@/components/WhatsappFlutuante";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Dores />
        <Entregaveis />
        <Demos />
        <ComoFunciona />
        <PorQueComigo />
        <ExtraOpcional />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsappFlutuante />
    </>
  );
}
