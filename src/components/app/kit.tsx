import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <section className={cn("panel", className)}>{children}</section>;
}

export function PanelHead({
  titulo,
  descricao,
  acao,
  className,
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold sm:text-lg">{titulo}</h2>
        {descricao && (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{descricao}</p>
        )}
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </header>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] font-medium tracking-[0.16em] text-subtle uppercase">
      {children}
    </p>
  );
}

export function Money({
  valor,
  className,
  sinal = false,
}: {
  valor: number;
  className?: string;
  sinal?: boolean;
}) {
  const formatado = Math.abs(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [inteiro, decimal] = formatado.split(",");
  const prefixo = sinal ? (valor < 0 ? "−" : "+") : "";
  return (
    <span className={cn("num inline-flex items-baseline", className)}>
      <span className="mr-1 text-[0.55em] font-medium text-muted-foreground">R$</span>
      {prefixo}
      {inteiro}
      <span className="text-[0.62em]">,{decimal}</span>
    </span>
  );
}

const tomBadge = {
  positivo: "bg-primary/12 text-primary",
  negativo: "bg-destructive/12 text-destructive",
  neutro: "bg-surface-2 text-muted-foreground",
  atencao: "bg-warning/12 text-warning",
} as const;

export function Badge({
  children,
  tom = "neutro",
  className,
}: {
  children: ReactNode;
  tom?: keyof typeof tomBadge;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[0.7rem] font-medium",
        tomBadge[tom],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, keyof typeof tomBadge> = {
    Pago: "positivo",
    Recebido: "positivo",
    Paga: "positivo",
    Pendente: "atencao",
    Aberta: "atencao",
    Agendado: "neutro",
  };
  const tom = map[status] ?? "neutro";
  return (
    <Badge tom={tom}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tom === "positivo" && "bg-primary",
          tom === "atencao" && "bg-warning",
          tom === "neutro" && "bg-subtle",
        )}
      />
      {status}
    </Badge>
  );
}

export function Segmented({
  itens,
  ativo,
  onChange,
  className,
}: {
  itens: string[];
  ativo: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex gap-1 overflow-x-auto rounded-xl border border-border bg-background/60 p-1",
        className,
      )}
    >
      {itens.map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={cn(
            "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            i === ativo
              ? "bg-primary/14 text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

export function SelectPill({
  valor,
  opcoes,
  onChange,
  label,
}: {
  valor: string;
  opcoes: string[];
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-muted-foreground focus-within:border-primary/50">
      {label && <span className="hidden sm:inline">{label}</span>}
      <select
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-xs font-medium text-foreground outline-none"
      >
        {opcoes.map((o) => (
          <option key={o} value={o} className="bg-popover">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EmptyState({
  titulo,
  descricao,
  icone,
}: {
  titulo: string;
  descricao: string;
  icone?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-border bg-background text-muted-foreground">
        {icone}
      </div>
      <p className="text-sm font-medium">{titulo}</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">{descricao}</p>
    </div>
  );
}

export function ProgressBar({ valor, className }: { valor: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-2", className)}>
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500"
        style={{ width: `${Math.min(100, valor)}%` }}
      />
    </div>
  );
}
