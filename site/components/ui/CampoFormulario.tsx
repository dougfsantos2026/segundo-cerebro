import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const controleBase =
  "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white transition-colors placeholder:text-grafite-500 focus:outline-none focus-visible:border-ciano-400 disabled:opacity-60";

const controleNormal = "border-white/15 hover:border-white/25";
const controleInvalido = "border-red-400/70";

type PropsRotulo = {
  htmlFor: string;
  children: React.ReactNode;
  obrigatorio?: boolean;
};

function Rotulo({ htmlFor, children, obrigatorio }: PropsRotulo) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-grafite-200"
    >
      {children}
      {obrigatorio ? (
        <span className="ml-1 text-ciano-400" aria-hidden="true">
          *
        </span>
      ) : (
        <span className="ml-1 text-xs font-normal text-grafite-500">
          (opcional)
        </span>
      )}
    </label>
  );
}

function MensagemErro({ id, texto }: { id: string; texto: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-xs text-red-300">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      {texto}
    </p>
  );
}

type PropsBase = {
  id: string;
  rotulo: string;
  erro?: string;
  obrigatorio?: boolean;
  className?: string;
};

export function CampoTexto({
  id,
  rotulo,
  erro,
  obrigatorio,
  className,
  ...rest
}: PropsBase & React.InputHTMLAttributes<HTMLInputElement>) {
  const idErro = `${id}-erro`;
  return (
    <div className={className}>
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={cn(controleBase, erro ? controleInvalido : controleNormal)}
        {...rest}
      />
      {erro ? <MensagemErro id={idErro} texto={erro} /> : null}
    </div>
  );
}

export function CampoSelecao({
  id,
  rotulo,
  erro,
  obrigatorio,
  className,
  opcoes,
  placeholder = "Selecione",
  ...rest
}: PropsBase &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    opcoes: readonly string[];
    placeholder?: string;
  }) {
  const idErro = `${id}-erro`;
  return (
    <div className={className}>
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      <select
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={cn(
          controleBase,
          "appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 stroke=%22%2394a3b8%22 stroke-width=%222%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')]",
          erro ? controleInvalido : controleNormal,
        )}
        {...rest}
      >
        <option value="" className="bg-grafite-800">
          {placeholder}
        </option>
        {opcoes.map((opcao) => (
          <option key={opcao} value={opcao} className="bg-grafite-800">
            {opcao}
          </option>
        ))}
      </select>
      {erro ? <MensagemErro id={idErro} texto={erro} /> : null}
    </div>
  );
}

export function CampoTextoLongo({
  id,
  rotulo,
  erro,
  obrigatorio,
  className,
  ...rest
}: PropsBase & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const idErro = `${id}-erro`;
  return (
    <div className={className}>
      <Rotulo htmlFor={id} obrigatorio={obrigatorio}>
        {rotulo}
      </Rotulo>
      <textarea
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : undefined}
        className={cn(
          controleBase,
          "min-h-32 resize-y",
          erro ? controleInvalido : controleNormal,
        )}
        {...rest}
      />
      {erro ? <MensagemErro id={idErro} texto={erro} /> : null}
    </div>
  );
}
