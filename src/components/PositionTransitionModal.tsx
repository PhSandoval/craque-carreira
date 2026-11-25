import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { PositionTransitionRecommendation, applyPositionTransition } from '../services/playerAgingService';
import { Compass, Sparkles, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2, History } from 'lucide-react';

interface PositionTransitionModalProps {
  player: PlayerProfile;
  recommendation: PositionTransitionRecommendation;
  onClose: () => void;
  onUpdatePlayer: (updated: PlayerProfile) => void;
}

export const PositionTransitionModal: React.FC<PositionTransitionModalProps> = ({
  player,
  recommendation,
  onClose,
  onUpdatePlayer
}) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleAcceptTransition = () => {
    const updated = applyPositionTransition(player, recommendation.recommendedPosition);
    onUpdatePlayer(updated);
    setConfirmed(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#181d28] via-[#12151c] to-[#0f1117] border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-950/40 via-slate-800 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Evolução & Longevidade aos {player.age} anos
              </span>
              <h2 className="text-lg font-black text-white tracking-wide mt-1">
                Adaptação Tática de Posição
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {confirmed ? (
            <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-black text-white">Transição Concluída com Sucesso!</h3>
              <p className="text-xs text-emerald-300 leading-relaxed">
                Você agora atua oficialmente como <strong>{recommendation.recommendedPosition} ({recommendation.recommendedPositionLabel})</strong>! Seus atributos de visão de jogo e passe foram potencializados.
              </p>
            </div>
          ) : (
            <>
              {/* Card de Comparação de Posição */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-around text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Posição Atual</span>
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-lg font-black text-slate-300">
                    {recommendation.currentPosition}
                  </div>
                  <span className="text-xs text-slate-400 font-bold block">{recommendation.currentPositionLabel}</span>
                  <span className="text-[10px] text-rose-400 block font-semibold">Alto Desgaste Físico</span>
                </div>

                <div className="flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-amber-400 animate-pulse" />
                  <span className="text-[10px] text-amber-400 font-black uppercase mt-1">Revolução</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400">Nova Posição</span>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-center mx-auto text-lg font-black text-emerald-300 shadow-lg shadow-emerald-950/50">
                    {recommendation.recommendedPosition}
                  </div>
                  <span className="text-xs text-emerald-300 font-bold block">{recommendation.recommendedPositionLabel}</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">Visão & Longevidade</span>
                </div>
              </div>

              {/* Conversa com o Treinador */}
              <div className="p-4 rounded-2xl bg-[#161a24] border border-slate-800 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  Conselho da Comissão Técnica
                </span>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{recommendation.coachAdvice}"
                </p>
              </div>

              {/* Precedentes Históricos */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
                <History className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Exemplos Históricos no Futebol Real: </strong>
                  {recommendation.historicalPrecedents}
                </span>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        {!confirmed && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Manter Posição Atual ({recommendation.currentPosition})
            </button>
            <button
              type="button"
              onClick={handleAcceptTransition}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Aceitar Transição para {recommendation.recommendedPosition}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
