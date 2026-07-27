import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  CheckCircle2,
  Compass,
  MessageSquareOff,
  Smartphone,
  ThumbsDown,
  Timer,
} from "lucide-react";

export type Problema = {
  titulo: string;
  descricao: string;
  icone: LucideIcon;
};

export const problemas: Problema[] = [
  {
    titulo: "Não funciona bem no celular",
    descricao:
      "A maior parte das visitas vem do celular. Se o texto sai da tela ou os botões não respondem, o cliente fecha.",
    icone: Smartphone,
  },
  {
    titulo: "Visual pouco profissional",
    descricao:
      "Um site datado passa a impressão de empresa parada — mesmo quando o serviço é excelente.",
    icone: ThumbsDown,
  },
  {
    titulo: "Carregamento lento",
    descricao:
      "Cada segundo a mais de espera derruba a chance de contato. Imagens pesadas são o motivo mais comum.",
    icone: Timer,
  },
  {
    titulo: "Informação difícil de achar",
    descricao:
      "Horário, endereço e serviços escondidos fazem o visitante desistir antes de encontrar o que precisa.",
    icone: Compass,
  },
  {
    titulo: "Sem caminho direto para contato",
    descricao:
      "Sem botão visível de WhatsApp ou formulário, o interesse do visitante se perde no meio do caminho.",
    icone: MessageSquareOff,
  },
  {
    titulo: "Dependência só de redes sociais",
    descricao:
      "Perfil bloqueado ou alcance em queda deixa seu negócio sem canal próprio. O site é o endereço que é seu.",
    icone: AtSign,
  },
];

export type Solucao = {
  titulo: string;
  descricao: string;
};

export const solucoes: Solucao[] = [
  {
    titulo: "Construído primeiro para o celular",
    descricao:
      "O layout é desenhado na tela pequena e só depois cresce para o desktop. Testamos em telas de 320px a 1920px.",
  },
  {
    titulo: "Identidade visual própria",
    descricao:
      "Cores, tipografia e imagens escolhidas para o seu segmento — nada de modelo genérico reaproveitado.",
  },
  {
    titulo: "Rápido desde o primeiro acesso",
    descricao:
      "Imagens otimizadas, carregamento sob demanda e código enxuto para abrir bem até em conexão ruim.",
  },
  {
    titulo: "Navegação óbvia",
    descricao:
      "Menu curto, seções na ordem em que o cliente pensa e as informações essenciais sempre à mão.",
  },
  {
    titulo: "Contato a um toque",
    descricao:
      "WhatsApp fixo na tela e formulário de orçamento em pontos estratégicos da página.",
  },
  {
    titulo: "Um canal que é seu",
    descricao:
      "Domínio no seu nome, conteúdo sob seu controle e estrutura preparada para aparecer no Google.",
  },
];

export const iconeSolucao = CheckCircle2;
