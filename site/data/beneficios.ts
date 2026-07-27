import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Gauge,
  Layers,
  LifeBuoy,
  Lock,
  MessageCircle,
  MonitorSmartphone,
  Palette,
  PenTool,
  Search,
} from "lucide-react";

export type Beneficio = {
  titulo: string;
  descricao: string;
  icone: LucideIcon;
};

export const beneficios: Beneficio[] = [
  {
    titulo: "Design personalizado",
    descricao:
      "Layout criado a partir do seu segmento e do seu público, não de um tema pronto.",
    icone: Palette,
  },
  {
    titulo: "Adaptado para celular",
    descricao:
      "Testado de verdade em telas pequenas, onde acontece a maior parte das visitas.",
    icone: MonitorSmartphone,
  },
  {
    titulo: "Carregamento rápido",
    descricao:
      "Imagens otimizadas e código leve para abrir bem até em conexão instável.",
    icone: Gauge,
  },
  {
    titulo: "Estrutura preparada para SEO",
    descricao:
      "Títulos, descrições e dados estruturados corretos desde a publicação.",
    icone: Search,
  },
  {
    titulo: "Integração com WhatsApp",
    descricao:
      "Botão fixo com mensagem já escrita, para o contato acontecer em um toque.",
    icone: MessageCircle,
  },
  {
    titulo: "Formulário de orçamento",
    descricao:
      "Campos pensados para você receber o pedido já com as informações necessárias.",
    icone: FileText,
  },
  {
    titulo: "Certificado SSL",
    descricao:
      "Cadeado de segurança no navegador, exigência básica de confiança e do Google.",
    icone: Lock,
  },
  {
    titulo: "Painel de gerenciamento",
    descricao:
      "Quando o projeto pede, você edita textos e imagens sem depender de ninguém.",
    icone: Layers,
  },
  {
    titulo: "Suporte após a publicação",
    descricao:
      "Acompanhamento no período combinado para ajustar o que aparecer no uso real.",
    icone: LifeBuoy,
  },
  {
    titulo: "Textos voltados para conversão",
    descricao:
      "Escrita clara que explica seu serviço e conduz o visitante até o contato.",
    icone: PenTool,
  },
];
