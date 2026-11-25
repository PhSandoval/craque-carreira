import React, { useState, useEffect } from 'react';
import { PlayerProfile, CareerOpportunity } from '../types';
import { createMemory } from '../services/careerMemory';
import { registerSponsorshipFromOpportunity } from '../services/economyAndContractService';
import { triggerHaptic } from '../services/hapticsService';
import { Sparkles, Trophy, Shield, Users, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

interface CareerOpportunityModalProps {
  player: PlayerProfile;
  opportunity: CareerOpportunity;
  onClose: () => void;
  onUpdatePlayer: (updated: PlayerProfile) => void;
}

export const CareerOpportunityModal: React.FC<CareerOpportunityModalProps> = ({
  player,
  opportunity,
  onClose,
  onUpdatePlayer
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(opportunity.options[0]?.id || '');
  const [chosenResult, setChosenResult] = useState<string | null>(null);

  useEffect(() => {
    triggerHaptic('opportunity');
  }, [opportunity.id]);

  const handleConfirmChoice = () => {
    const opt = opportunity.options.find(o => o.id === selectedOptionId);
    if (!opt) return;
    triggerHaptic('tap');

    let newPlayer = { ...player };

    // Aplica efeitos
    if (opt.effects.moralDelta) {
      newPlayer.moral = Math.max(0, Math.min(100, (newPlayer.moral || 80) + opt.effects.moralDelta));
    }
    if (opt.effects.marketValueDeltaEur) {
      newPlayer.marketValueEur = Math.max(0.5, Number(((newPlayer.marketValueEur || 2.0) + opt.effects.marketValueDeltaEur).toFixed(1)));
    }
    if (opt.effects.coachTrustDelta || opt.effects.fansTrustDelta || opt.effects.boardTrustDelta || opt.effects.teammatesTrustDelta) {
      newPlayer.relationships = {
        ...newPlayer.relationships,
        coach: Math.max(0, Math.min(100, (newPlayer.relationships?.coach || 65) + (opt.effects.coachTrustDelta || 0))),
        fans: Math.max(0, Math.min(100, (newPlayer.relationships?.fans || 75) + (opt.effects.fansTrustDelta || 0))),
        board: Math.max(0, Math.min(100, (newPlayer.relationships?.board || 70) + (opt.effects.boardTrustDelta || 0))),
        teammates: Math.max(0, Math.min(100, (newPlayer.relationships?.teammates || 70) + (opt.effects.teammatesTrustDelta || 0)))
      };
    }
    if (opt.effects.tagEarned) {
      newPlayer.personalityTags = Array.from(new Set([...(newPlayer.personalityTags || []), opt.effects.tagEarned]));
    }

    // Cria memória permanente no Dossiê
    if (opt.effects.memoryTitle && opt.effects.memoryDesc) {
      const mem = createMemory(player, {
        title: opt.effects.memoryTitle,
        description: opt.effects.memoryDesc,
        impactSummary: opt.consequenceText,
        category: 'milestone',
        tags: [opt.effects.tagEarned || '#carreira', '#oportunidade', `#rodada${player.currentMatchDay}`],
        importance: 'alta'
      });
      newPlayer.memories = [mem, ...(player.memories || [])];
    }

    // Limpa a oportunidade ativa e registra contrato de patrocínio se aplicável
    newPlayer.activeOpportunity = null;
    let finalResultText = opt.consequenceText;
    if (opportunity.type === 'sponsorship') {
      const spRes = registerSponsorshipFromOpportunity(newPlayer, opportunity, opt.label);
      newPlayer = spRes.updatedPlayer;
      if (spRes.dealAdded) {
        finalResultText = `${opt.consequenceText} Contrato assinado com ${spRes.dealAdded.brand}: +€${spRes.dealAdded.monthlyEur.toLocaleString('pt-BR')}/mês e +€${spRes.dealAdded.goalBonusEur.toLocaleString('pt-BR')} por gol!`;
      }
    }

    onUpdatePlayer(newPlayer);
    setChosenResult(finalResultText);

    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        
        {/* Top Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-950/40 via-slate-800 to-slate-900 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {opportunity.badge}
              </span>
              <h2 className="text-lg font-black text-white tracking-wide mt-1">
                {opportunity.title}
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
          
          {chosenResult ? (
            <div className="p-6 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-black text-white">Decisão Registrada no Dossiê da Carreira!</h3>
              <p className="text-xs text-emerald-300 leading-relaxed">{chosenResult}</p>
            </div>
          ) : (
            <>
              {/* Context Card */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <span>{opportunity.subtitle}</span>
                  <span className="text-slate-500">{opportunity.source}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {opportunity.description}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  Qual Será a Sua Postura?
                </span>

                <div className="space-y-3">
                  {opportunity.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50'
                            : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white">{opt.label}</h4>
                              <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
                            </div>
                          </div>
                          {opt.risk && (
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                              opt.risk === 'alto'
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : opt.risk === 'medio'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}>
                              Risco {opt.risk}
                            </span>
                          )}
                        </div>

                        {/* Impact preview */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
                          <p className="italic text-slate-300 leading-relaxed">{opt.consequenceText}</p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {opt.effects.coachTrustDelta !== undefined && opt.effects.coachTrustDelta !== 0 && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                opt.effects.coachTrustDelta > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                👔 Técnico {opt.effects.coachTrustDelta > 0 ? `+${opt.effects.coachTrustDelta}%` : `${opt.effects.coachTrustDelta}%`}
                              </span>
                            )}
                            {opt.effects.teammatesTrustDelta !== undefined && opt.effects.teammatesTrustDelta !== 0 && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                opt.effects.teammatesTrustDelta > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                👥 Vestiário {opt.effects.teammatesTrustDelta > 0 ? `+${opt.effects.teammatesTrustDelta}%` : `${opt.effects.teammatesTrustDelta}%`}
                              </span>
                            )}
                            {opt.effects.fansTrustDelta !== undefined && opt.effects.fansTrustDelta !== 0 && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                opt.effects.fansTrustDelta > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                🏟️ Torcida {opt.effects.fansTrustDelta > 0 ? `+${opt.effects.fansTrustDelta}%` : `${opt.effects.fansTrustDelta}%`}
                              </span>
                            )}
                            {opt.effects.boardTrustDelta !== undefined && opt.effects.boardTrustDelta !== 0 && (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                opt.effects.boardTrustDelta > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                💼 Diretoria {opt.effects.boardTrustDelta > 0 ? `+${opt.effects.boardTrustDelta}%` : `${opt.effects.boardTrustDelta}%`}
                              </span>
                            )}
                            {opt.effects.marketValueDeltaEur !== undefined && opt.effects.marketValueDeltaEur !== 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                📈 Valor {opt.effects.marketValueDeltaEur > 0 ? `+€${opt.effects.marketValueDeltaEur}M` : `-€${Math.abs(opt.effects.marketValueDeltaEur)}M`}
                              </span>
                            )}
                            {opt.effects.moralDelta !== undefined && opt.effects.moralDelta !== 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                                ⚡ Moral {opt.effects.moralDelta > 0 ? `+${opt.effects.moralDelta}%` : `${opt.effects.moralDelta}%`}
                              </span>
                            )}
                            {opt.effects.tagEarned && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                🏷️ {opt.effects.tagEarned}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        {!chosenResult && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Pensar Depois
            </button>
            <button
              type="button"
              onClick={handleConfirmChoice}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>Tomar Decisão de Carreira</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
