"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Atraso em segundos, para escalonar itens de uma lista. */
  delay?: number;
  /** Direção da entrada. Em telas estreitas sempre vira vertical. */
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
 *
 * Duas salvaguardas: quando o sistema pede menos movimento, não anima nada; e
 * abaixo de 768px o deslocamento é sempre vertical, porque mover elementos de
 * largura total na horizontal empurraria o conteúdo para fora da tela.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  origem = "baixo",
  as = "div",
}: Props) {
  const semMovimento = useMovimentoReduzido();
  const [temEspacoLateral, setTemEspacoLateral] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia("(min-width: 768px)");
    const atualizar = () => setTemEspacoLateral(consulta.matches);
    atualizar();
    consulta.addEventListener("change", atualizar);
    return () => consulta.removeEventListener("change", atualizar);
  }, []);

  const Componente = as === "li" ? motion.li : motion.div;
  const { x, y } =
    origem === "baixo" || !temEspacoLateral
      ? deslocamento.baixo
      : deslocamento[origem];

  const visivel = { opacity: 1, x: 0, y: 0 };

  return (
    <Componente
      // `data-revelar` permite que o CSS force a visibilidade quando não há
      // JavaScript ou quando o sistema pede menos movimento.
      data-revelar
      className={cn(className)}
      initial={{ opacity: 0, x, y }}
      // Sem movimento o elemento salta direto para o estado final, em vez de
      // esperar a viewport. Trocar as props é o que mantém a marcação igual à do
      // servidor — remontar um elemento diferente aqui quebraria a hidratação.
      animate={semMovimento ? visivel : undefined}
      whileInView={semMovimento ? undefined : visivel}
      viewport={{ once: true, margin: "-60px" }}
      transition={
        semMovimento
          ? { duration: 0 }
          : { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </Componente>
  );
}
