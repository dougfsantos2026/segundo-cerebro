"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMovimentoReduzido } from "@/lib/use-movimento-reduzido";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /**
   * Deslocamento total em pixels ao longo da travessia pela viewport.
   * Positivo desce, negativo sobe.
   */
  distancia?: number;
};

/**
 * Move o conteúdo devagar conforme a página rola.
 *
 * O deslocamento é fixo em pixels e pequeno de propósito: parallax medido em
 * porcentagem cresce junto com a tela e, em monitores altos, o elemento
 * termina longe de onde foi posicionado no layout.
 */
export default function Parallax({ children, className, distancia = 60 }: Props) {
  const alvo = useRef<HTMLDivElement>(null);
  const semMovimento = useMovimentoReduzido();

  const { scrollYProgress } = useScroll({
    target: alvo,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distancia, -distancia]);

  return (
    <div ref={alvo} className={cn(className)}>
      {/* `size-full` porque o wrapper interno precisa repassar a altura do
          contêiner; sem isso qualquer filho com `h-full` mede zero.

          Sem movimento a camada continua existindo, só travada em zero: remover
          a div mudaria a árvore entre servidor e cliente e a hidratação falharia. */}
      <motion.div
        style={{ y: semMovimento ? 0 : y }}
        className="size-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
