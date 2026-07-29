import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Code2,
  Lightbulb,
  MessagesSquare,
  PenTool,
  Rocket,
  Search,
  LifeBuoy,
} from "lucide-react";

export type Etapa = {
  numero: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
};

export const etapas: Etapa[] = [
  {
    numero: "01",
    titulo: "Conversa inicial",
    descricao:
      "Um bate-papo curto para entender o que você precisa e responder suas dúvidas. Sem compromisso.",
    icone: MessagesSquare,
  },
  {
    numero: "02",
    titulo: "Entendimento do negócio",
    descricao:
      "Mapeamos serviços, público e concorrência para o site falar a língua de quem você quer atender.",
    icone: Search,
  },
  {
    numero: "03",
    titulo: "Planejamento do site",
    descricao:
      "Definimos as seções, a ordem das informações e o caminho até o contato.",
    icone: ClipboardList,
  },
  {
    numero: "04",
    titulo: "Criação do design",
    descricao:
      "Você recebe a proposta visual para aprovar antes de qualquer linha de código.",
    icone: PenTool,
  },
  {
    numero: "05",
    titulo: "Desenvolvimento",
    descricao:
      "Construção do site com foco em velocidade, responsividade e acessibilidade.",
    icone: Code2,
  },
  {
    numero: "06",
    titulo: "Revisão e ajustes",
    descricao:
      "Você navega no site em ambiente de teste e pede os ajustes que quiser.",
    icone: Lightbulb,
  },
  {
    numero: "07",
    titulo: "Publicação",
    descricao:
      "Configuramos domínio, certificado de segurança e indexação no Google.",
    icone: Rocket,
  },
  {
    numero: "08",
    titulo: "Suporte",
    descricao:
      "Acompanhamento após a entrega para resolver o que surgir no uso do dia a dia.",
    icone: LifeBuoy,
  },
];
