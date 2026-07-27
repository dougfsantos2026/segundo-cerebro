import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  tom?: "escuro" | "claro" | "marca";
  className?: string;
};

export default function Badge({ children, tom = "escuro", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        tom === "escuro" && "border border-white/15 bg-white/5 text-grafite-200",
        tom === "claro" &&
          "border border-grafite-200 bg-grafite-50 text-grafite-600",
        tom === "marca" && "border border-marca-500/40 bg-marca-500/10 text-marca-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
