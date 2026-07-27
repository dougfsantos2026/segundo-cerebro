import { projetos } from "@/data/projetos";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjetoCard from "./ProjetoCard";

export default function Portfolio() {
  return (
    <Section id="projetos" fundo="claro-alt">
      <SectionHeading
        tom="claro"
        etiqueta="Projetos"
        titulo="Exemplos navegáveis do que entregamos"
        descricao="Projetos de demonstração criados pelo estúdio, com nomes fictícios, para você ver na prática a estrutura e o acabamento de cada tipo de site."
      />

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projetos.map((projeto, indice) => (
          <Reveal as="li" key={projeto.slug} delay={(indice % 3) * 0.06}>
            <ProjetoCard projeto={projeto} prioridade={indice === 0} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
