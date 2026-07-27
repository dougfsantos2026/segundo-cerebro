import {
  normalizarDadosContato,
  temErros,
  validarContato,
} from "@/lib/validacao-contato";

/**
 * Recebe os pedidos de orçamento do formulário da home.
 *
 * >>> IMPLEMENTAÇÃO SIMULADA <<<
 * Hoje esta rota apenas valida os dados e registra o pedido no log do
 * servidor. Nenhum e-mail é enviado e nada é gravado em banco.
 *
 * PARA CONECTAR UM SERVIÇO REAL, substitua o bloco marcado com
 * "PONTO DE INTEGRAÇÃO" por uma das opções abaixo:
 *
 *  - E-mail transacional (Resend, SendGrid, Postmark):
 *      await resend.emails.send({ from, to, subject, html })
 *  - Planilha ou CRM (Google Sheets, Notion, RD Station, Pipedrive):
 *      await fetch(URL_DO_WEBHOOK, { method: "POST", body: JSON.stringify(dados) })
 *  - Banco de dados (Supabase, Postgres):
 *      await db.insert(pedidos).values(dados)
 *
 * Guarde chaves de API em variáveis de ambiente *sem* o prefixo
 * NEXT_PUBLIC_, para que fiquem restritas ao servidor.
 */
export async function POST(request: Request) {
  let corpo: unknown;

  try {
    corpo = await request.json();
  } catch {
    return Response.json(
      { ok: false, mensagem: "Não foi possível ler os dados enviados." },
      { status: 400 },
    );
  }

  const dados = normalizarDadosContato(corpo);

  // Proteção contra spam: bots costumam preencher todos os campos do
  // formulário, inclusive o que está escondido para pessoas.
  if (dados.website.trim().length > 0) {
    // Responde como sucesso para não sinalizar ao bot que foi detectado.
    return Response.json({ ok: true, mensagem: "Recebido." });
  }

  const erros = validarContato(dados);
  if (temErros(erros)) {
    return Response.json(
      { ok: false, mensagem: "Confira os campos destacados.", erros },
      { status: 422 },
    );
  }

  // ---------------------------------------------------------------
  // PONTO DE INTEGRAÇÃO — troque este bloco pelo envio real.
  console.info("[contato] novo pedido de orçamento", {
    nome: dados.nome,
    empresa: dados.empresa,
    email: dados.email,
    whatsapp: dados.whatsapp,
    segmento: dados.segmento,
    tipoProjeto: dados.tipoProjeto,
    orcamento: dados.orcamento,
    prazo: dados.prazo,
    recebidoEm: new Date().toISOString(),
  });
  // ---------------------------------------------------------------

  return Response.json({
    ok: true,
    mensagem: "Pedido recebido com sucesso.",
  });
}
