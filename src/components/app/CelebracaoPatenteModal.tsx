import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, X, CheckCircle2, ArrowRight } from "lucide-react";
import { PatenteInfo, EscudoPatente } from "@/lib/patentes";

interface CelebracaoPatenteModalProps {
  patente: PatenteInfo;
  nomeUsuario: string;
  onFechar: () => void;
}

export function CelebracaoPatenteModal({
  patente,
  nomeUsuario,
  onFechar,
}: CelebracaoPatenteModalProps) {
  useEffect(() => {
    // Dispara confetes comemorativos
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ["#f59e0b", "#eab308", "#38bdf8", "#a855f7", "#ffffff"];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors,
          zIndex: 99999,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors,
          zIndex: 99999,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch {
      // Ignora erro se canvas-confetti não carregar
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#1c1822] via-[#141217] to-[#0e0c10] p-6 text-center shadow-2xl shadow-purple-950/40 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Feixes de luz decorativos de fundo */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full blur-3xl opacity-40"
          style={{ background: patente.corHex }}
        />

        <button
          onClick={onFechar}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-stone-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Selo e Escudo 3D */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-400 mb-4 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>NOVA PATENTE CONQUISTADA!</span>
          </div>

          <div className="my-2 transition-transform hover:scale-105 duration-300">
            <EscudoPatente nivel={patente.nivel} tamanho="xl" />
          </div>

          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {patente.titulo}
          </h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-300 mt-0.5">
            {patente.subtitulo} • Nível {patente.nivel} de 5
          </p>

          <p className="mt-3 text-xs text-stone-300 max-w-xs leading-relaxed">
            Parabéns, <strong className="text-white">{nomeUsuario}</strong>! A sua dedicação e disciplina financeira foram reconhecidas pela mentoria.
          </p>

          {/* Conquistas Desbloqueadas */}
          <div className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Conquistas alcançadas nesta fase:
            </span>
            {patente.conquistas.map((conquista) => (
              <div key={conquista.id} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">
                    {conquista.titulo}
                  </span>
                  <span className="text-[11px] text-stone-400 leading-snug">
                    {conquista.descricao}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onFechar}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:brightness-110 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-950/40 active:scale-95 transition-all cursor-pointer"
          >
            <span>Acessar Meu Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
