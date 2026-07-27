"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Atraso em segundos, para escalonar itens de uma lista. */
  delay?: number;
  /** Direção da entrada. */
  origem?: "baixo" | "esquerda" | "direita";
  as?: "div" | "li";
};

const deslocamento = {
  baixo: { x: 0, y: 22 },
  esquerda: { x: -22, y: 0 },
  direita: { x: 22, y: 0 },
};

/**
 * Animação leve de entrada ao entrar na viewport.
 * Quando o sistema pede menos movimento, renderiza sem animação alguma.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  origem = "baixo",
  as = "div",
}: Props) {
  const preferSemMovimento = useReducedMotion();
  const Componente = as === "li" ? motion.li : motion.div;

  if (preferSemMovimento) {
    const Estatico = as;
    return <Estatico className={cn(className)}>{children}</Estatico>;
  }

  const { x, y } = deslocamento[origem];

  return (
    <Componente
      className={cn(className)}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Componente>
  );
}
