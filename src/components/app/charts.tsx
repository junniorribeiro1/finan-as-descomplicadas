import { useState } from "react";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/mock-data";

/* Gráfico de barras agrupadas: Receitas x Despesas */
export function BarrasComparativas({
  dados,
  altura = 220,
}: {
  dados: { mes: string; receitas: number; despesas: number }[];
  altura?: number;
}) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const max = Math.max(...dados.map((d) => Math.max(d.receitas, d.despesas)));

  return (
    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
      <div className="flex items-end gap-2 sm:gap-4" style={{ height: altura }}>
        {dados.map((d, i) => (
          <button
            type="button"
            key={d.mes}
            onMouseEnter={() => setAtivo(i)}
            onMouseLeave={() => setAtivo(null)}
            onFocus={() => setAtivo(i)}
            onBlur={() => setAtivo(null)}
            className="group relative flex h-full flex-1 flex-col justify-end outline-none"
          >
            {ativo === i && (
              <div className="pointer-events-none absolute -top-1 left-1/2 z-10 w-max -translate-x-1/2 rounded-lg border border-border bg-popover px-2.5 py-2 text-left shadow-lg">
                <p className="num text-[0.7rem] text-primary">{brl(d.receitas)}</p>
                <p className="num text-[0.7rem] text-muted-foreground">{brl(d.despesas)}</p>
              </div>
            )}
            <div className="flex h-full items-end justify-center gap-1">
              <div
                className={cn(
                  "w-2.5 rounded-t-[4px] bg-primary transition-opacity sm:w-3.5",
                  ativo !== null && ativo !== i && "opacity-40",
                )}
                style={{ height: `${(d.receitas / max) * 88}%` }}
              />
              <div
                className={cn(
                  "w-2.5 rounded-t-[4px] bg-surface-2 transition-opacity sm:w-3.5",
                  ativo !== null && ativo !== i && "opacity-40",
                )}
                style={{ height: `${(d.despesas / max) * 88}%` }}
              />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2 sm:gap-4">
        {dados.map((d, i) => (
          <span
            key={d.mes}
            className={cn(
              "flex-1 text-center text-[0.68rem]",
              ativo === i ? "text-foreground" : "text-subtle",
            )}
          >
            {d.mes}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-5 border-t border-border pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-primary" /> Receitas
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-surface-2" /> Despesas
        </span>
      </div>
    </div>
  );
}

/* Rosca de distribuição */
export function Rosca({
  dados,
  total,
  legenda = "das despesas",
}: {
  dados: { nome: string; valor: number; percentual: number; cor: string }[];
  total: number;
  legenda?: string;
}) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const raio = 52;
  const circ = 2 * Math.PI * raio;
  let offset = 0;
  const selecionado = ativo !== null ? dados[ativo] : null;

  return (
    <div className="flex flex-col items-center gap-7 px-5 pb-6 sm:px-6 lg:flex-row lg:items-center">
      <div className="relative shrink-0">
        <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
          {dados.map((d, i) => {
            const len = (d.percentual / 100) * circ;
            const dash = `${len - 2} ${circ - len + 2}`;
            const el = (
              <circle
                key={d.nome}
                cx="70"
                cy="70"
                r={raio}
                fill="none"
                stroke={d.cor}
                strokeWidth={ativo === i ? 18 : 14}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                opacity={ativo !== null && ativo !== i ? 0.35 : 1}
                className="transition-all duration-200"
                onMouseEnter={() => setAtivo(i)}
                onMouseLeave={() => setAtivo(null)}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="num text-2xl font-semibold">
              {(selecionado?.percentual ?? 100).toLocaleString("pt-BR")}%
            </p>
            <p className="mt-0.5 max-w-[6.5rem] text-[0.68rem] text-muted-foreground">
              {selecionado ? selecionado.nome : legenda}
            </p>
          </div>
        </div>
      </div>

      <ul className="w-full space-y-2.5">
        {dados.map((d, i) => (
          <li
            key={d.nome}
            onMouseEnter={() => setAtivo(i)}
            onMouseLeave={() => setAtivo(null)}
            className={cn(
              "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-1.5 transition-colors",
              ativo === i ? "bg-surface-2" : "bg-transparent",
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: d.cor }} />
            <span className="min-w-0 truncate text-xs text-muted-foreground">{d.nome}</span>
            <span className="num shrink-0 text-xs">
              {brl(d.valor)}
              <span className="ml-2 text-subtle">
                {d.percentual.toLocaleString("pt-BR")}%
              </span>
            </span>
          </li>
        ))}
        <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-t border-border pt-3 text-xs">
          <span className="text-muted-foreground">Total</span>
          <span className="num">{brl(total)}</span>
        </li>
      </ul>
    </div>
  );
}

/* Anel de progresso grande */
export function AnelProgresso({
  percentual,
  titulo,
  subtitulo,
}: {
  percentual: number;
  titulo: string;
  subtitulo: string;
}) {
  const raio = 78;
  const circ = 2 * Math.PI * raio;
  return (
    <div className="relative grid place-items-center">
      <svg viewBox="0 0 190 190" className="h-52 w-52 -rotate-90 sm:h-60 sm:w-60">
        <circle cx="95" cy="95" r={raio} fill="none" stroke="var(--surface-2)" strokeWidth="12" />
        <circle
          cx="95"
          cy="95"
          r={raio}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(percentual / 100) * circ} ${circ}`}
        />
      </svg>
      <div className="absolute text-center">
        <p className="num text-4xl font-semibold sm:text-5xl">{titulo}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitulo}</p>
      </div>
    </div>
  );
}

/* Sparkline de barras simples */
export function BarrasSimples({
  dados,
  altura = 120,
}: {
  dados: { rotulo: string; valor: number }[];
  altura?: number;
}) {
  const max = Math.max(...dados.map((d) => d.valor));
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height: altura }}>
        {dados.map((d) => (
          <div key={d.rotulo} className="flex h-full flex-1 items-end">
            <div
              className="w-full rounded-md bg-primary/85 transition-colors hover:bg-primary"
              style={{ height: `${(d.valor / max) * 100}%` }}
              title={`${d.rotulo} · ${brl(d.valor)}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {dados.map((d) => (
          <span key={d.rotulo} className="flex-1 text-center text-[0.65rem] text-subtle">
            {d.rotulo}
          </span>
        ))}
      </div>
    </div>
  );
}
