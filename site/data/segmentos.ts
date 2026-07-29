import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Calculator,
  Hammer,
  Scale,
  Stethoscope,
  Store,
  UtensilsCrossed,
} from "lucide-react";

export type Segmento = {
  nome: string;
  icone: LucideIcon;
};

/** Segmentos atendidos, usados na home e no seletor do formulário. */
export const segmentos: Segmento[] = [
  { nome: "Clínicas e consultórios", icone: Stethoscope },
  { nome: "Advocacia", icone: Scale },
  { nome: "Contabilidade", icone: Calculator },
  { nome: "Restaurantes", icone: UtensilsCrossed },
  { nome: "Lojas e comércio", icone: Store },
  { nome: "Prestadores de serviço", icone: Hammer },
  { nome: "Profissionais autônomos", icone: Briefcase },
];

/** Opções do campo "segmento" do formulário de orçamento. */
export const opcoesSegmento = [
  "Clínica ou consultório",
  "Odontologia",
  "Advocacia",
  "Contabilidade",
  "Restaurante ou alimentação",
  "Loja ou comércio",
  "Beleza e estética",
  "Prestador de serviços",
  "Profissional autônomo",
  "Outro",
];

export const opcoesTipoProjeto = [
  "Site institucional",
  "Landing page",
  "Site para negócio local",
  "Loja virtual",
  "Reformulação de site existente",
  "Manutenção e suporte",
  "Ainda não sei",
];

export const opcoesOrcamento = [
  "Ainda não defini",
  "Até R$ 2.000",
  "De R$ 2.000 a R$ 5.000",
  "De R$ 5.000 a R$ 10.000",
  "Acima de R$ 10.000",
];

export const opcoesPrazo = [
  "O quanto antes",
  "Nas próximas semanas",
  "Nos próximos meses",
  "Sem data definida",
];
