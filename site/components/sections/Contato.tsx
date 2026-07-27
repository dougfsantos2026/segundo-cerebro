"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCheck,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  opcoesOrcamento,
  opcoesPrazo,
  opcoesSegmento,
  opcoesTipoProjeto,
} from "@/data/segmentos";
import {
  dadosContatoIniciais,
  temErros,
  validarContato,
  type DadosContato,
  type ErrosContato,
} from "@/lib/validacao-contato";
import { contato } from "@/lib/site-config";
import { linkWhatsapp } from "@/lib/whatsapp";
import Button from "@/components/ui/Button";
import {
  CampoSelecao,
  CampoTexto,
  CampoTextoLongo,
} from "@/components/ui/CampoFormulario";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

type Estado = "inativo" | "enviando" | "sucesso" | "erro";

export default function Contato() {
  const [dados, setDados] = useState<DadosContato>(dadosContatoIniciais);
  const [erros, setErros] = useState<ErrosContato>({});
  const [estado, setEstado] = useState<Estado>("inativo");
  const [mensagemServidor, setMensagemServidor] = useState("");
  // Segunda barreira anti-spam: envios instantâneos são de robô.
  const montadoEm = useRef(0);

  useEffect(() => {
    montadoEm.current = Date.now();
  }, []);

  const atualizar = <Campo extends keyof DadosContato>(
    campo: Campo,
    valor: DadosContato[Campo],
  ) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => {
      if (!atual[campo]) return atual;
      const proximo = { ...atual };
      delete proximo[campo];
      return proximo;
    });
  };

  const enviar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const errosEncontrados = validarContato(dados);
    if (temErros(errosEncontrados)) {
      setErros(errosEncontrados);
      setEstado("erro");
      setMensagemServidor("Confira os campos destacados e tente novamente.");
      const primeiroCampo = Object.keys(errosEncontrados)[0];
      document.getElementById(`contato-${primeiroCampo}`)?.focus();
      return;
    }

    if (Date.now() - montadoEm.current < 2000) {
      setEstado("erro");
      setMensagemServidor("Envio muito rápido. Tente novamente em instantes.");
      return;
    }

    setEstado("enviando");
    setMensagemServidor("");

    try {
      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const resultado = await resposta.json();

      if (!resposta.ok || !resultado.ok) {
        setErros(resultado.erros ?? {});
        setEstado("erro");
        setMensagemServidor(
          resultado.mensagem ?? "Não foi possível enviar agora.",
        );
        return;
      }

      setEstado("sucesso");
      setDados(dadosContatoIniciais);
    } catch {
      setEstado("erro");
      setMensagemServidor(
        "Falha de conexão. Tente de novo ou fale com a gente pelo WhatsApp.",
      );
    }
  };

  const enviando = estado === "enviando";

  return (
    <Section id="contato" fundo="escuro-alt">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionHeading
            etiqueta="Contato"
            titulo="Peça seu orçamento"
            descricao="Quanto mais detalhes você contar, mais precisa fica a proposta. Costumamos responder no mesmo dia útil."
          />

          <ul className="mt-10 space-y-4">
            <li>
              <a
                href={linkWhatsapp()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/25"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-marca-600/15 text-ciano-400">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    WhatsApp
                  </span>
                  <span className="text-sm text-grafite-400">
                    {contato.telefoneExibicao}
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contato.email}`}
                className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/25"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-marca-600/15 text-ciano-400">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">
                    E-mail
                  </span>
                  <span className="block truncate text-sm text-grafite-400">
                    {contato.email}
                  </span>
                </span>
              </a>
            </li>
            <li className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-marca-600/15 text-ciano-400">
                <Clock className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  Atendimento
                </span>
                <span className="text-sm text-grafite-400">
                  {contato.horario}
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          {estado === "sucesso" ? (
            <div role="status" className="py-10 text-center">
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-marca-600/20 text-ciano-400">
                <CheckCheck className="size-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl text-white">Pedido enviado!</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-grafite-400">
                Recebemos suas informações e vamos responder no e-mail ou
                WhatsApp que você informou, normalmente no mesmo dia útil.
              </p>
              <Button
                variante="secundario"
                className="mt-8"
                onClick={() => {
                  setEstado("inativo");
                  montadoEm.current = Date.now();
                }}
              >
                Enviar outro pedido
              </Button>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              {/* Campo-armadilha invisível para pessoas e para leitores de tela. */}
              <div aria-hidden="true" className="sr-only-focusable absolute">
                <label htmlFor="contato-website">Não preencha este campo</label>
                <input
                  id="contato-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={dados.website}
                  onChange={(e) => atualizar("website", e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <CampoTexto
                  id="contato-nome"
                  rotulo="Nome"
                  obrigatorio
                  type="text"
                  autoComplete="name"
                  placeholder="Como podemos te chamar"
                  value={dados.nome}
                  erro={erros.nome}
                  onChange={(e) => atualizar("nome", e.target.value)}
                />
                <CampoTexto
                  id="contato-empresa"
                  rotulo="Empresa"
                  type="text"
                  autoComplete="organization"
                  placeholder="Nome do seu negócio"
                  value={dados.empresa}
                  erro={erros.empresa}
                  onChange={(e) => atualizar("empresa", e.target.value)}
                />
                <CampoTexto
                  id="contato-whatsapp"
                  rotulo="WhatsApp"
                  obrigatorio
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={dados.whatsapp}
                  erro={erros.whatsapp}
                  onChange={(e) => atualizar("whatsapp", e.target.value)}
                />
                <CampoTexto
                  id="contato-email"
                  rotulo="E-mail"
                  obrigatorio
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com.br"
                  value={dados.email}
                  erro={erros.email}
                  onChange={(e) => atualizar("email", e.target.value)}
                />
                <CampoSelecao
                  id="contato-segmento"
                  rotulo="Segmento"
                  obrigatorio
                  opcoes={opcoesSegmento}
                  value={dados.segmento}
                  erro={erros.segmento}
                  onChange={(e) => atualizar("segmento", e.target.value)}
                />
                <CampoSelecao
                  id="contato-tipoProjeto"
                  rotulo="Tipo de projeto"
                  obrigatorio
                  opcoes={opcoesTipoProjeto}
                  value={dados.tipoProjeto}
                  erro={erros.tipoProjeto}
                  onChange={(e) => atualizar("tipoProjeto", e.target.value)}
                />
                <CampoSelecao
                  id="contato-orcamento"
                  rotulo="Orçamento aproximado"
                  opcoes={opcoesOrcamento}
                  value={dados.orcamento}
                  erro={erros.orcamento}
                  onChange={(e) => atualizar("orcamento", e.target.value)}
                />
                <CampoSelecao
                  id="contato-prazo"
                  rotulo="Prazo desejado"
                  opcoes={opcoesPrazo}
                  value={dados.prazo}
                  erro={erros.prazo}
                  onChange={(e) => atualizar("prazo", e.target.value)}
                />
                <CampoTextoLongo
                  id="contato-mensagem"
                  rotulo="Mensagem"
                  obrigatorio
                  className="sm:col-span-2"
                  placeholder="Conte o que seu negócio faz, se já tem site e o que espera do novo projeto."
                  value={dados.mensagem}
                  erro={erros.mensagem}
                  onChange={(e) => atualizar("mensagem", e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="contato-consentimento"
                  className="flex cursor-pointer items-start gap-3 text-sm text-grafite-300"
                >
                  <input
                    id="contato-consentimento"
                    type="checkbox"
                    checked={dados.consentimento}
                    aria-invalid={erros.consentimento ? true : undefined}
                    aria-describedby={
                      erros.consentimento
                        ? "contato-consentimento-erro"
                        : undefined
                    }
                    onChange={(e) => atualizar("consentimento", e.target.checked)}
                    className="mt-0.5 size-4.5 shrink-0 accent-marca-600"
                  />
                  <span>
                    Concordo com o uso dos meus dados para retorno deste
                    contato, conforme a{" "}
                    <Link
                      href="/politica-de-privacidade"
                      className="font-medium text-ciano-400 underline underline-offset-4"
                    >
                      política de privacidade
                    </Link>
                    .
                  </span>
                </label>
                {erros.consentimento ? (
                  <p
                    id="contato-consentimento-erro"
                    className="mt-2 flex items-start gap-1.5 text-xs text-red-300"
                  >
                    <AlertCircle
                      className="mt-0.5 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {erros.consentimento}
                  </p>
                ) : null}
              </div>

              {/* Retorno textual do envio, anunciado por leitores de tela. */}
              <div aria-live="polite" className="empty:hidden">
                {estado === "erro" && mensagemServidor ? (
                  <p className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3.5 text-sm text-red-200">
                    <AlertCircle
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    {mensagemServidor}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                tamanho="lg"
                disabled={enviando}
                className="mt-7 w-full"
              >
                {enviando ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Enviar pedido de orçamento
                  </>
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-grafite-500">
                Seus dados são usados apenas para responder este contato.
              </p>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
