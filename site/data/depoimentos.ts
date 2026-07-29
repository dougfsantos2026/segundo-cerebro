/**
 * DEPOIMENTOS — ESTRUTURA VAZIA
 *
 * Nenhum depoimento real foi inventado. Os itens abaixo existem apenas para
 * manter o layout funcional e visível.
 *
 * >>> SUBSTITUIR cada item por depoimentos reais, com autorização por escrito
 * >>> do cliente, incluindo nome, cargo e empresa verdadeiros.
 * >>> Enquanto `preenchido` for `false`, o card é exibido como espaço reservado.
 */

export type Depoimento = {
  id: string;
  texto: string;
  autor: string;
  cargo: string;
  /** Marque como `true` somente quando o depoimento for real. */
  preenchido: boolean;
};

export const depoimentos: Depoimento[] = [
  {
    id: "depoimento-1",
    texto: "Depoimento de cliente será inserido aqui.",
    autor: "Nome do cliente",
    cargo: "Cargo · Empresa",
    preenchido: false,
  },
  {
    id: "depoimento-2",
    texto: "Depoimento de cliente será inserido aqui.",
    autor: "Nome do cliente",
    cargo: "Cargo · Empresa",
    preenchido: false,
  },
  {
    id: "depoimento-3",
    texto: "Depoimento de cliente será inserido aqui.",
    autor: "Nome do cliente",
    cargo: "Cargo · Empresa",
    preenchido: false,
  },
];
