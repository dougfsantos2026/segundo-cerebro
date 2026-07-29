import type { Metadata } from "next";
import PaginaLegal from "@/components/layout/PaginaLegal";
import { contato, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Como o ${siteConfig.nome} coleta, usa e protege os dados pessoais enviados pelo site.`,
  alternates: { canonical: "/politica-de-privacidade" },
  openGraph: {
    title: `Política de privacidade — ${siteConfig.nome}`,
    description: `Como o ${siteConfig.nome} coleta, usa e protege os dados pessoais enviados pelo site.`,
    url: "/politica-de-privacidade",
  },
};

/*
 * TEXTO BASE — REVISAR ANTES DE PUBLICAR
 * Este documento descreve as práticas atuais do site. Recomenda-se revisão
 * por profissional jurídico para adequação completa à LGPD.
 */
export default function PoliticaDePrivacidade() {
  return (
    <PaginaLegal titulo="Política de privacidade" atualizadoEm="27 de julho de 2026">
      <section>
        <h2>Quem somos</h2>
        <p>
          Este site é operado pelo {siteConfig.nome}, estúdio de criação de
          sites para pequenos e médios negócios. Para tratar de qualquer
          assunto relacionado a dados pessoais, escreva para{" "}
          <a href={`mailto:${contato.email}`}>{contato.email}</a>.
        </p>
      </section>

      <section>
        <h2>Quais dados coletamos</h2>
        <p>
          Coletamos apenas o que você nos envia de forma voluntária pelo
          formulário de orçamento:
        </p>
        <ul>
          <li>Nome e nome da empresa</li>
          <li>Telefone de WhatsApp e endereço de e-mail</li>
          <li>Segmento, tipo de projeto, orçamento aproximado e prazo desejado</li>
          <li>O conteúdo da mensagem que você escrever</li>
        </ul>
        <p>
          Também coletamos dados de navegação agregados e anônimos por meio de
          uma ferramenta de análise de audiência, usada para entender quais
          páginas são mais acessadas. Esses dados não identificam você
          individualmente.
        </p>
      </section>

      <section>
        <h2>Para que usamos esses dados</h2>
        <p>
          As informações enviadas pelo formulário são utilizadas
          exclusivamente para responder ao seu contato, elaborar a proposta
          solicitada e dar continuidade à conversa sobre o projeto. Não
          vendemos, alugamos nem compartilhamos seus dados com terceiros para
          fins de publicidade.
        </p>
      </section>

      <section>
        <h2>Base legal</h2>
        <p>
          O tratamento é feito com base no seu consentimento, coletado no
          momento do envio do formulário, e no interesse legítimo de responder
          a uma solicitação comercial iniciada por você.
        </p>
      </section>

      <section>
        <h2>Por quanto tempo guardamos</h2>
        <p>
          Mantemos os dados de contato pelo tempo necessário para o
          atendimento da solicitação e, havendo contratação, pelo período
          exigido para o cumprimento do contrato e de obrigações legais. Você
          pode pedir a exclusão a qualquer momento.
        </p>
      </section>

      <section>
        <h2>Seus direitos</h2>
        <p>
          A Lei Geral de Proteção de Dados garante a você o direito de:
        </p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados</li>
          <li>Acessar os dados que temos sobre você</li>
          <li>Corrigir dados incompletos ou desatualizados</li>
          <li>Solicitar a exclusão dos dados</li>
          <li>Revogar o consentimento dado anteriormente</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, envie um e-mail para{" "}
          <a href={`mailto:${contato.email}`}>{contato.email}</a>. Respondemos
          no menor prazo possível.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Utilizamos apenas os cookies necessários ao funcionamento do site e
          à medição anônima de audiência. Você pode bloquear cookies nas
          configurações do seu navegador, sem prejuízo para a navegação.
        </p>
      </section>

      <section>
        <h2>Segurança</h2>
        <p>
          O site é servido por conexão criptografada (HTTPS) e adotamos
          medidas técnicas razoáveis para proteger as informações recebidas
          contra acesso não autorizado.
        </p>
      </section>

      <section>
        <h2>Alterações desta política</h2>
        <p>
          Esta política pode ser atualizada para refletir mudanças no site ou
          na legislação. A data da última atualização fica sempre indicada no
          topo desta página.
        </p>
      </section>
    </PaginaLegal>
  );
}
