import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow } from "@/components/app/kit";
import { Upload, FileSpreadsheet, CheckCircle2, ArrowUpCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/importar-dados")({
  head: () => ({
    meta: [
      { title: "Importar Dados — OrganizAI" },
      { name: "description", content: "Importe extratos OFX, planilhas CSV e faturas para o OrganizAI." },
    ],
  }),
  component: ImportarDados,
});

function ImportarDados() {
  const [arrastando, setArrastando] = useState(false);
  const [arquivoCarregado, setArquivoCarregado] = useState<string | null>(null);

  return (
    <AppShell titulo="Importar dados" descricao="Traga suas planilhas antigas e extratos bancários com rapidez.">
      <div className="mx-auto max-w-3xl space-y-6">
        <Panel className="p-8">
          <PanelHead
            titulo="Upload de Extratos & Arquivos"
            descricao="Suporte para arquivos OFX bancários, CSV e planilhas Excel"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setArrastando(true);
            }}
            onDragLeave={() => setArrastando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastando(false);
              if (e.dataTransfer.files[0]) {
                setArquivoCarregado(e.dataTransfer.files[0].name);
              }
            }}
            className={`mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
              arrastando
                ? "border-primary bg-primary/10"
                : "border-border bg-surface/30 hover:border-orange-500/50 hover:bg-surface/50"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 mb-4">
              <Upload className="h-7 w-7" />
            </div>
            <h4 className="text-base font-semibold text-foreground">
              Arraste seu arquivo OFX ou CSV aqui
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Extratos do Nubank, Inter, Itaú, Bradesco ou sua planilha Excel (.csv, .ofx, .xlsx)
            </p>

            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
              <span>Selecionar Arquivo</span>
              <input
                type="file"
                accept=".csv,.ofx,.xlsx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setArquivoCarregado(e.target.files[0].name);
                  }
                }}
              />
            </label>

            {arquivoCarregado && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Arquivo pronto para processamento: {arquivoCarregado}
              </div>
            )}
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Panel className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-orange-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Modelo de Planilha</h4>
                <p className="text-xs text-muted-foreground">Baixe o template em Excel</p>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2 text-emerald-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Extrato OFX Padrão</h4>
                <p className="text-xs text-muted-foreground">Importe com categorização por IA</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
