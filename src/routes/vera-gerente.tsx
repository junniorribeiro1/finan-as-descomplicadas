import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { Panel, PanelHead, Eyebrow } from "@/components/app/kit";
import { Bot, Sparkles, Send, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/vera-gerente")({
  head: () => ({
    meta: [
      { title: "Vera | Gerente Virtual — OrganizAI" },
      { name: "description", content: "Sua gerente financeira inteligente para insights, alertas e recomendações." },
    ],
  }),
  component: VeraGerente,
});

const mensagensIniciais = [
  {
    remetente: "vera",
    texto: "Olá! Eu sou a Vera, sua gerente financeira inteligente no OrganizAI. Analisei seus últimos lançamentos e tenho 2 insights para otimizar suas finanças este mês. Como posso te ajudar hoje?",
    hora: "10:30",
  },
];

function VeraGerente() {
  const [mensagens, setMensagens] = useState(mensagensIniciais);
  const [input, setInput] = useState("");

  const enviarMensagem = () => {
    if (!input.trim()) return;
    const novaMsg = { remetente: "usuario", texto: input, hora: "Agora" };
    setMensagens((prev) => [...prev, novaMsg]);
    setInput("");

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        {
          remetente: "vera",
          texto: "Entendido! Baseado no seu padrão de gastos, recomendo limitar os gastos com delivery neste final de semana para não ultrapassar a meta mensal de lazer.",
          hora: "Agora",
        },
      ]);
    }, 800);
  };

  return (
    <AppShell titulo="Vera | Gerente" descricao="Inteligência artificial financeira personalizada para o seu dia a dia.">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
        {/* Chat com a Vera */}
        <Panel className="flex h-[580px] flex-col p-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
              <Bot className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                Vera
                <span className="rounded bg-orange-500/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-orange-400">
                  IA Gerente
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">Online • Monitorando suas contas</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
            {mensagens.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.remetente === "usuario" ? "justify-end" : "justify-start"}`}
              >
                {msg.remetente === "vera" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.remetente === "usuario"
                      ? "bg-primary text-primary-foreground font-medium rounded-br-none"
                      : "bg-surface-2 text-foreground rounded-bl-none border border-border"
                  }`}
                >
                  <p>{msg.texto}</p>
                  <span className={`block mt-1 text-[0.65rem] ${msg.remetente === "usuario" ? "text-primary-foreground/70" : "text-subtle"}`}>
                    {msg.hora}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensagem();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Pergunte à Vera: 'Quanto posso gastar hoje?'..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </Panel>

        {/* Dicas e Insights */}
        <div className="space-y-4">
          <Panel className="p-5">
            <div className="flex items-center gap-2 text-orange-400">
              <Sparkles className="h-4 w-4" />
              <h4 className="text-xs font-semibold uppercase tracking-wider">Insights da Semana</h4>
            </div>
            <div className="mt-3 space-y-3 text-xs">
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3">
                <p className="font-semibold text-foreground">Aviso de Assinatura Duplicada</p>
                <p className="text-muted-foreground mt-1">Identificamos duas cobranças de streaming no mesmo ciclo.</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="font-semibold text-foreground">Economia Atingida</p>
                <p className="text-muted-foreground mt-1">Você gastou 15% menos em delivery em relação ao mês anterior!</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
