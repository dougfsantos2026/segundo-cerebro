/**
 * Validação do formulário de orçamento.
 *
 * O mesmo módulo é usado no navegador (feedback imediato) e na rota de API
 * (garantia de que dados inválidos nunca sejam aceitos), evitando que as
 * regras saiam de sincronia.
 */

export type DadosContato = {
  nome: string;
  empresa: string;
  whatsapp: string;
  email: string;
  segmento: string;
  tipoProjeto: string;
  orcamento: string;
  prazo: string;
  mensagem: string;
  consentimento: boolean;
  /** Campo-armadilha: fica escondido e deve chegar sempre vazio. */
  website: string;
};

export type ErrosContato = Partial<Record<keyof DadosContato, string>>;

export const dadosContatoIniciais: DadosContato = {
  nome: "",
  empresa: "",
  whatsapp: "",
  email: "",
  segmento: "",
  tipoProjeto: "",
  orcamento: "",
  prazo: "",
  mensagem: "",
  consentimento: false,
  website: "",
};

const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarContato(dados: DadosContato): ErrosContato {
  const erros: ErrosContato = {};

  if (dados.nome.trim().length < 2) {
    erros.nome = "Informe seu nome.";
  }

  const digitosWhatsapp = dados.whatsapp.replace(/\D/g, "");
  if (digitosWhatsapp.length === 0) {
    erros.whatsapp = "Informe um WhatsApp para contato.";
  } else if (digitosWhatsapp.length < 10 || digitosWhatsapp.length > 13) {
    erros.whatsapp = "Informe o número com DDD, por exemplo (11) 99999-9999.";
  }

  if (dados.email.trim().length === 0) {
    erros.email = "Informe seu e-mail.";
  } else if (!formatoEmail.test(dados.email.trim())) {
    erros.email = "Esse e-mail parece incompleto. Confira o endereço.";
  }

  if (dados.segmento.trim().length === 0) {
    erros.segmento = "Selecione o segmento do seu negócio.";
  }

  if (dados.tipoProjeto.trim().length === 0) {
    erros.tipoProjeto = "Selecione o tipo de projeto.";
  }

  if (dados.mensagem.trim().length < 10) {
    erros.mensagem = "Conte um pouco mais — pelo menos 10 caracteres.";
  }

  if (!dados.consentimento) {
    erros.consentimento =
      "É necessário concordar com a política de privacidade para enviar.";
  }

  return erros;
}

export function temErros(erros: ErrosContato) {
  return Object.keys(erros).length > 0;
}

/** Converte um corpo JSON desconhecido no formato esperado do formulário. */
export function normalizarDadosContato(corpo: unknown): DadosContato {
  const bruto = (corpo ?? {}) as Record<string, unknown>;
  const texto = (chave: keyof DadosContato) =>
    typeof bruto[chave] === "string" ? (bruto[chave] as string) : "";

  return {
    nome: texto("nome"),
    empresa: texto("empresa"),
    whatsapp: texto("whatsapp"),
    email: texto("email"),
    segmento: texto("segmento"),
    tipoProjeto: texto("tipoProjeto"),
    orcamento: texto("orcamento"),
    prazo: texto("prazo"),
    mensagem: texto("mensagem"),
    consentimento: bruto.consentimento === true,
    website: texto("website"),
  };
}
