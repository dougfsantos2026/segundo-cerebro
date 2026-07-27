import { cn } from "@/lib/utils";

type Variante = "primario" | "secundario" | "fantasma";
type Tom = "escuro" | "claro";
type Tamanho = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

const tamanhos: Record<Tamanho, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

/** `secundario` e `fantasma` mudam conforme o fundo em que estão apoiados. */
const variantes: Record<Variante, Record<Tom, string>> = {
  primario: {
    escuro:
      "bg-marca-600 text-white shadow-[0_10px_30px_-10px_rgba(76,125,255,0.8)] hover:bg-marca-500",
    claro:
      "bg-marca-600 text-white shadow-[0_10px_30px_-12px_rgba(58,99,230,0.7)] hover:bg-marca-500",
  },
  secundario: {
    escuro:
      "border border-white/20 bg-white/5 text-white hover:border-white/35 hover:bg-white/10",
    claro:
      "border border-grafite-200 bg-white text-grafite-900 hover:border-grafite-300 hover:bg-grafite-50",
  },
  fantasma: {
    escuro: "text-grafite-200 hover:text-white",
    claro: "text-grafite-600 hover:text-grafite-900",
  },
};

type PropsBase = {
  children: React.ReactNode;
  variante?: Variante;
  tom?: Tom;
  tamanho?: Tamanho;
  className?: string;
};

type PropsLink = PropsBase &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof PropsBase> & {
    href: string;
    /** Abre em nova aba com `rel` seguro. */
    externo?: boolean;
  };

type PropsBotao = PropsBase &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof PropsBase> & {
    href?: never;
    externo?: never;
  };

/**
 * Botão único do site. Vira `<a>` quando recebe `href` e `<button>` caso
 * contrário, mantendo a mesma aparência nos dois casos.
 */
export default function Button({
  children,
  variante = "primario",
  tom = "escuro",
  tamanho = "md",
  className,
  href,
  externo,
  ...rest
}: PropsLink | PropsBotao) {
  const classes = cn(
    base,
    tamanhos[tamanho],
    variantes[variante][tom],
    className,
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={classes}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
