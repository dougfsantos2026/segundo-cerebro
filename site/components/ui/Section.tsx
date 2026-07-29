import { cn } from "@/lib/utils";
import Container from "./Container";

/** Fundos alternados entre seções, para dar ritmo à leitura da página. */
export type FundoSecao = "escuro" | "escuro-alt" | "claro" | "claro-alt";

const fundos: Record<FundoSecao, string> = {
  escuro: "bg-grafite-900 text-grafite-200",
  "escuro-alt": "bg-grafite-850 text-grafite-200",
  claro: "bg-white text-grafite-700",
  "claro-alt": "bg-grafite-50 text-grafite-700",
};

type Props = {
  id?: string;
  children: React.ReactNode;
  fundo?: FundoSecao;
  className?: string;
  containerClassName?: string;
  /** Rótulo acessível quando a seção não tem um título visível. */
  "aria-label"?: string;
};

export default function Section({
  id,
  children,
  fundo = "escuro",
  className,
  containerClassName,
  ...rest
}: Props) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 sm:py-24 lg:py-32",
        fundos[fundo],
        className,
      )}
      {...rest}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
