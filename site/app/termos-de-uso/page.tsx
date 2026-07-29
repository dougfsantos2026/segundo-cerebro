import type { Metadata } from "next";
import PaginaLegal from "@/components/layout/PaginaLegal";
import { contato, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: `Condições de uso do site do ${siteConfig.nome}.`,
  alternates: { canonical: "/termos-de-uso" },
  openGraph: {
    title: `Termos de uso — ${siteConfig.nome}`,
    description: `Condições de uso do site do ${siteConfig.nome}.`,
    url: "/termos-de-uso",
  },
};

/*
 * TEXTO BASE — REVISAR ANTES DE PUBLICAR
 * Recomenda-se revisão por profissional jurídico antes da publicação.
 */
export default function TermosDeUso() {
  return (
    <PaginaLegal titulo="Termos de uso" atualizadoEm="27 de julho de 2026">
      <section>
        <h2>Aceitação</h2>
        <p>
          Ao navegar neste site você concorda com as condições descritas
          abaixo. Se não concordar com algum ponto, recomendamos que
          interrompa o uso.
        </p>
      </section>

      <section>
        <h2>Objeto do site</h2>
        <p>
          Este site tem finalidade informativa e comercial: apresenta os
          serviços do {siteConfig.nome} e oferece um canal para solicitação de
          orçamentos. A navegação não cria, por si só, qualquer vínculo
          contratual.
        </p>
      </section>

      <section>
        <h2>Orçamentos e propostas</h2>
        <p>
          Os conteúdos publicados aqui não constituem oferta vinculante.
          Valores, prazos e escopo são definidos individualmente em proposta
          formal, enviada após a conversa inicial sobre o projeto.
        </p>
      </section>

      <section>
        <h2>Projetos de demonstração</h2>
        <p>
          Os projetos exibidos na seção de portfólio com nomes fictícios são
          demonstrações criadas pelo próprio estúdio para ilustrar estrutura e
          acabamento. Não representam clientes reais nem sugerem qualquer
          vínculo com empresas de nome semelhante.
        </p>
      </section>

      <section>
        <h2>Propriedade intelectual</h2>
        <p>
          O código, o texto, o layout e os elementos visuais deste site
          pertencem ao {siteConfig.nome}. É proibida a reprodução total ou
          parcial sem autorização prévia por escrito.
        </p>
        <p>
          Nos projetos contratados, os direitos de uso sobre o site entregue
          são transferidos ao cliente nos termos definidos em contrato.
        </p>
      </section>

      <section>
        <h2>Links para outros sites</h2>
        <p>
          Podemos indicar endereços de terceiros. Não temos controle sobre
          esses conteúdos e não nos responsabilizamos pelas práticas de
          privacidade ou pelas informações neles publicadas.
        </p>
      </section>

      <section>
        <h2>Disponibilidade</h2>
        <p>
          Trabalhamos para manter o site sempre no ar, mas ele pode ficar
          temporariamente indisponível por manutenção ou por fatores fora do
          nosso controle. Não há garantia de funcionamento ininterrupto.
        </p>
      </section>

      <section>
        <h2>Uso adequado</h2>
        <p>
          É vedado utilizar o formulário de contato para envio de mensagens
          automatizadas, conteúdo ofensivo, publicidade não solicitada ou
          qualquer tentativa de comprometer a segurança do site.
        </p>
      </section>

      <section>
        <h2>Alterações e contato</h2>
        <p>
          Estes termos podem ser atualizados a qualquer momento, com a nova
          data indicada no topo da página. Dúvidas podem ser enviadas para{" "}
          <a href={`mailto:${contato.email}`}>{contato.email}</a>.
        </p>
      </section>
    </PaginaLegal>
  );
}
