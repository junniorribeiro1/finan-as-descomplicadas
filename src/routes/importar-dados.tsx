import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { AppShell } from "@/components/app/AppShell";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/importar-dados")({
  head: () => ({
    meta: [
      { title: "Importar dados — OrganizaMais+" },
      {
        name: "description",
        content: "Traga sua planilha do Excel, Google Sheets ou extrato do banco.",
      },
    ],
  }),
  component: ImportarDados,
});

interface TransacaoPrevia {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  tipo: "Despesa" | "Receita";
  valor: number;
}

const transacoesExemplo: TransacaoPrevia[] = [
  {
    id: "tx-1",
    data: "05/03/2026",
    descricao: "Supermercado Pão de Açúcar",
    categoria: "Alimentação",
    tipo: "Despesa",
    valor: 487.35,
  },
  {
    id: "tx-2",
    data: "07/03/2026",
    descricao: "Posto Shell Combustível",
    categoria: "Transporte",
    tipo: "Despesa",
    valor: 210.0,
  },
  {
    id: "tx-3",
    data: "10/03/2026",
    descricao: "Depósito Salário Mensal",
    categoria: "Salário",
    tipo: "Receita",
    valor: 7500.0,
  },
  {
    id: "tx-4",
    data: "12/03/2026",
    descricao: "Netflix Mensalidade",
    categoria: "Assinaturas",
    tipo: "Despesa",
    valor: 55.9,
  },
  {
    id: "tx-5",
    data: "15/03/2026",
    descricao: "Farmácia Drogasil",
    categoria: "Saúde",
    tipo: "Despesa",
    valor: 142.8,
  },
];

function ImportarDados() {
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [arrastando, setArrastando] = useState(false);
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null);
  const [tamanhoArquivo, setTamanhoArquivo] = useState<string | null>(null);
  const [importadoComSucesso, setImportadoComSucesso] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processarArquivo = (file: File) => {
    setNomeArquivo(file.name);
    const kb = Math.round(file.size / 1024);
    setTamanhoArquivo(kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);
    setEtapa(2);
    toast.success(`Arquivo "${file.name}" carregado com sucesso!`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processarArquivo(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastando(false);
    if (e.dataTransfer.files?.[0]) {
      processarArquivo(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmarImportacao = () => {
    setImportadoComSucesso(true);
    toast.success("5 transações importadas e categorizadas com sucesso!");
  };

  const reiniciar = () => {
    setEtapa(1);
    setNomeArquivo(null);
    setTamanhoArquivo(null);
    setImportadoComSucesso(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Header Superior com Ícone 3D em Pod Escuro */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] p-1.5 shadow-xl shadow-black/50 sm:h-14 sm:w-14">
            <img
              src="/icons/kpi/import-header@2x.png"
              alt="Importar dados"
              className="h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(249,115,22,0.3)]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Importar dados
            </h1>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Traga sua planilha do Excel, Google Sheets ou extrato do banco.
            </p>
          </div>
        </div>

        {/* Stepper com 3 Etapas */}
        <div className="mt-8 flex items-center justify-start gap-3 sm:gap-4 overflow-x-auto pb-2">
          {/* Etapa 1 */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                etapa >= 1
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30"
                  : "bg-neutral-800 text-neutral-500"
              }`}
            >
              {etapa > 1 ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : "1"}
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold transition-colors ${
                etapa >= 1 ? "text-white" : "text-neutral-500"
              }`}
            >
              Selecionar arquivo
            </span>
          </div>

          <div className="h-px w-8 sm:w-16 bg-neutral-800 shrink-0" />

          {/* Etapa 2 */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                etapa >= 2
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30"
                  : "bg-neutral-800 text-neutral-500"
              }`}
            >
              {etapa > 2 ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : "2"}
            </div>
            <span
              className={`text-xs sm:text-sm font-medium transition-colors ${
                etapa >= 2 ? "text-white font-semibold" : "text-neutral-500"
              }`}
            >
              Prévia dos dados
            </span>
          </div>

          <div className="h-px w-8 sm:w-16 bg-neutral-800 shrink-0" />

          {/* Etapa 3 */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                etapa === 3
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30"
                  : "bg-neutral-800 text-neutral-500"
              }`}
            >
              3
            </div>
            <span
              className={`text-xs sm:text-sm font-medium transition-colors ${
                etapa === 3 ? "text-white font-semibold" : "text-neutral-500"
              }`}
            >
              Confirmar
            </span>
          </div>
        </div>

        {/* Conteúdo de Acordo com a Etapa */}
        {etapa === 1 && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`group relative mt-6 flex min-h-[300px] sm:min-h-[340px] cursor-pointer flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed bg-[#161618] p-8 sm:p-12 text-center transition-all duration-300 ${
              arrastando
                ? "border-orange-500 bg-[#1e1e24] scale-[1.01]"
                : "border-[#b45309]/50 hover:border-orange-500/70 hover:bg-[#18181c]"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Nuvem 3D Central */}
            <div className="relative mb-2 transition-transform duration-300 group-hover:scale-110">
              <img
                src="/icons/kpi/import-cloud-3d@2x.png"
                alt="Upload em nuvem"
                className="h-20 w-20 object-contain drop-shadow-[0_4px_16px_rgba(249,115,22,0.35)]"
              />
            </div>

            <h2 className="mt-2 text-base font-bold text-white sm:text-lg">
              Arraste sua planilha aqui
            </h2>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
              Aceitamos CSV, XLS e XLSX até 10MB
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-500/40 active:scale-95 sm:text-sm"
            >
              <Upload className="h-4 w-4" />
              <span>Escolher arquivo</span>
            </button>
          </div>
        )}

        {etapa === 2 && (
          <div className="mt-6 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#161618] p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  Prévia dos Lançamentos
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Arquivo: <span className="text-orange-400 font-semibold">{nomeArquivo}</span> ({tamanhoArquivo}) • 5 transações detectadas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEtapa(1)}
                  className="rounded-xl border border-white/10 px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-white/[0.06] transition-colors"
                >
                  Trocar arquivo
                </button>
                <button
                  onClick={() => setEtapa(3)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all"
                >
                  <span>Avançar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Tabela de Prévia */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] text-neutral-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Descrição</th>
                    <th className="py-2.5 px-3">Categoria Sugerida</th>
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {transacoesExemplo.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-neutral-300 font-mono">{tx.data}</td>
                      <td className="py-3 px-3 font-semibold text-white">{tx.descricao}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center rounded-full bg-white/[0.05] border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-orange-400">
                          {tx.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] font-medium ${
                            tx.tipo === "Receita" ? "text-emerald-400" : "text-neutral-400"
                          }`}
                        >
                          {tx.tipo}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-semibold font-mono ${
                          tx.tipo === "Receita" ? "text-emerald-400" : "text-white"
                        }`}
                      >
                        {tx.tipo === "Receita" ? "+" : "-"} R${" "}
                        {tx.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="mt-6 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#161618] p-6 shadow-xl sm:p-8">
            {!importadoComSucesso ? (
              <div className="max-w-xl mx-auto text-center py-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 mb-4">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-white">Confirmar Importação</h2>
                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Pronto para consolidar os lançamentos do arquivo{" "}
                  <strong className="text-white">{nomeArquivo}</strong> no seu OrganizaMais+.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 text-left">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <span className="text-[11px] text-neutral-400">Receitas Identificadas</span>
                    <p className="text-base font-bold text-emerald-400 mt-1">+ R$ 7.500,00</p>
                    <span className="text-[10px] text-neutral-500">1 lançamento</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <span className="text-[11px] text-neutral-400">Despesas Identificadas</span>
                    <p className="text-base font-bold text-rose-400 mt-1">- R$ 896,05</p>
                    <span className="text-[10px] text-neutral-500">4 lançamentos</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setEtapa(2)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-white/[0.06] transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Voltar à prévia</span>
                  </button>
                  <button
                    onClick={handleConfirmarImportacao}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-amber-600 transition-all active:scale-95"
                  >
                    <Check className="h-4 w-4" />
                    <span>Confirmar e Importar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                  <Check className="h-8 w-8 stroke-[2.5]" />
                </div>
                <h2 className="text-xl font-bold text-white">Importação Concluída!</h2>
                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                  Todas as 5 transações foram adicionadas ao seu fluxo de caixa e já estão refletidas nos seus relatórios.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-orange-500/20"
                  >
                    Ir para o Dashboard
                  </Link>
                  <button
                    onClick={reiniciar}
                    className="w-full sm:w-auto rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-white/[0.06] transition-colors"
                  >
                    Importar outro arquivo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
