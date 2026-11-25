import React, { useState, useEffect } from 'react';
import { PlayerProfile } from '../types';
import { findClub } from '../data/clubs';
import {
  ensurePlayerEconomy,
  formatEurCurrency,
  STRATEGIC_INVESTMENTS,
  getUpgradeCooldownKey,
  purchaseStrategicInvestment
} from '../services/economyAndContractService';
import { triggerHaptic } from '../services/hapticsService';
import { ClubBadge } from './ClubBadge';
import {
  Briefcase,
  Coins,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HeartPulse,
  Dumbbell,
  Megaphone,
  HeartHandshake,
  Crown,
  Receipt,
  X,
  Calendar
} from 'lucide-react';

interface FinanceAndContractModalProps {
  player: PlayerProfile;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onClose: () => void;
}

export const FinanceAndContractModal: React.FC<FinanceAndContractModalProps> = ({
  player: rawPlayer,
  onUpdatePlayer,
  onClose
}) => {
  const player = ensurePlayerEconomy(rawPlayer);
  const currentClub = findClub(player.currentClub);
  const contract = player.contract!;
  const sponsors = player.activeSponsors || [];
  const transactions = player.financeHistory || [];

  const [activeTab, setActiveTab] = useState<'contract' | 'investments' | 'ledger'>('contract');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const effectiveMatchDay = Math.max(player.currentMatchDay || 1, (player.currentSeasonStats?.games || 0) + 1);
  const remainder = effectiveMatchDay % 4;
  const nextPaydayRound = remainder === 0 ? effectiveMatchDay : effectiveMatchDay + (4 - remainder);

  const handleBuyInvestment = (investmentId: string) => {
    const res = purchaseStrategicInvestment(player, investmentId);
    if (res.success) {
      triggerHaptic('purchase_money');
      onUpdatePlayer(res.updatedPlayer);
      setFeedback({ ok: true, text: res.message });
    } else {
      triggerHaptic('yellow_card');
      setFeedback({ ok: false, text: res.message });
    }
  };

  const renderCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'physio': return <HeartPulse className="w-5 h-5 text-teal-400" />;
      case 'training': return <Dumbbell className="w-5 h-5 text-emerald-400" />;
      case 'media': return <Megaphone className="w-5 h-5 text-sky-400" />;
      case 'lifestyle': return <HeartHandshake className="w-5 h-5 text-amber-400" />;
      default: return <Crown className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#12151c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]"
      >
        {/* Header */}
        <div className="bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Contrato, Finanças & Investimentos
              </h2>
              <p className="text-xs text-slate-400">
                Salários, patrocínios esportivos e gastos estratégicos na sua carreira
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#10141d] px-3 py-1.5 rounded-xl border border-emerald-800/60 text-right">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Saldo Pessoal</span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                {formatEurCurrency(player.bankBalanceEur || 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="bg-[#141822] px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('contract')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'contract'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Contrato & Patrocínios</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('investments')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'investments'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Investir na Carreira</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'ledger'
                ? 'bg-sky-400 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Extrato ({transactions.length})</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className={`px-4 py-2.5 border-b text-xs font-bold flex items-center justify-between shrink-0 ${
            feedback.ok
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-200'
              : 'bg-rose-950/60 border-rose-700/60 text-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{feedback.text}</span>
            </div>
            <button type="button" onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white px-1">✕</button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar bg-[#10131a]">
          {activeTab === 'contract' && (
            <div className="space-y-5">
              {/* Contrato Profissional */}
              <div className="bg-gradient-to-br from-[#17212b] to-[#121620] border border-emerald-700/50 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <ClubBadge club={currentClub} size="md" />
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
                        Contrato Profissional Ativo
                      </span>
                      <h3 className="text-lg font-black text-white">{player.currentClub}</h3>
                      <span className="text-xs text-slate-400">{contract.roleLabel} • Camisa #{player.number}</span>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-slate-800 px-3.5 py-2 rounded-xl text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Próximo Pagamento</span>
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1 sm:justify-end">
                      <Calendar className="w-3.5 h-3.5" />
                      Rodada {nextPaydayRound} de 38
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-[#0e121a] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Salário Mensal</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {formatEurCurrency(contract.monthlySalaryEur)}
                    </span>
                  </div>
                  <div className="bg-[#0e121a] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Duração Restante</span>
                    <span className="text-base font-black text-white font-mono">
                      {contract.yearsRemaining} {contract.yearsRemaining === 1 ? 'ano' : 'anos'}
                    </span>
                  </div>
                  <div className="bg-[#0e121a] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Multa Rescisória</span>
                    <span className="text-base font-black text-amber-300 font-mono">
                      €{contract.releaseClauseEur.toFixed(1)}M
                    </span>
                  </div>
                  <div className="bg-[#0e121a] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Prêmio MOTM</span>
                    <span className="text-base font-black text-sky-400 font-mono">
                      {formatEurCurrency(Math.max(2500, Math.round((contract.monthlySalaryEur * 0.15) / 500) * 500))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Patrocínios Ativos */}
              <div className="bg-[#161b26] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>Contratos de Patrocínio ({sponsors.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Surgem em Oportunidades entre rodadas</span>
                </div>

                {sponsors.length === 0 ? (
                  <div className="bg-[#10141d] border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-400 space-y-1">
                    <Sparkles className="w-5 h-5 text-amber-400 mx-auto" />
                    <p className="font-bold text-slate-200">Nenhum patrocinador comercial assinado ainda.</p>
                    <p>Brilhe nas partidas para receber propostas reais de marcas de chuteiras e isotônicos!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sponsors.map(sp => (
                      <div key={sp.id} className="bg-[#10141d] border border-amber-700/40 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white">{sp.brand}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60">
                            {sp.roundsRemaining} rodadas
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Fixo Mensal:</span>
                          <span className="font-mono font-bold text-emerald-400">{formatEurCurrency(sp.monthlyEur)}/mês</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Bônus por Gol:</span>
                          <span className="font-mono font-bold text-sky-400">+{formatEurCurrency(sp.goalBonusEur)}/gol</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'investments' && (
            <div className="space-y-4">
              <div className="bg-[#161b26] border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 flex items-center justify-between gap-3">
                <span>Use seu salário e bônus de forma estratégica para recuperar o corpo, acelerar sua evolução técnica ou fortalecer sua imagem.</span>
                <Coins className="w-5 h-5 text-amber-400 shrink-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {STRATEGIC_INVESTMENTS.map(opt => {
                  const cooldownKey = getUpgradeCooldownKey(opt.id, player);
                  const alreadyUsed = (player.purchasedUpgrades || []).includes(cooldownKey);
                  const canAfford = (player.bankBalanceEur || 0) >= opt.costEur;

                  return (
                    <div key={opt.id} className="bg-[#151923] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-xl bg-black/40 border border-slate-800 shrink-0">
                              {renderCategoryIcon(opt.category)}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-white leading-tight">{opt.title}</h4>
                              <span className="text-[11px] text-slate-400 block">{opt.subtitle}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${opt.badgeColor}`}>
                            {opt.cooldownLabel}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-sm font-black font-mono text-amber-300">
                          {formatEurCurrency(opt.costEur)}
                        </span>
                        <button
                          type="button"
                          disabled={alreadyUsed || !canAfford}
                          onClick={() => handleBuyInvestment(opt.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                            alreadyUsed
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : !canAfford
                              ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60 cursor-not-allowed'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow'
                          }`}
                        >
                          {alreadyUsed ? 'Já Contratado' : !canAfford ? 'Saldo Insuficiente' : 'Contratar Agora'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="space-y-2.5">
              {transactions.length === 0 ? (
                <div className="bg-[#161b26] border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                  Nenhuma movimentação registrada ainda. Seus salários mensais (a cada 4 rodadas), bônus por gols e investimentos aparecerão aqui.
                </div>
              ) : (
                transactions.map(tx => (
                  <div key={tx.id} className="bg-[#151923] border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-white block">{tx.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Temporada {tx.seasonYear} • Rodada {tx.round}
                      </span>
                    </div>
                    <span className={`font-mono font-black text-sm shrink-0 ${
                      tx.amountEur >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.amountEur >= 0 ? `+${formatEurCurrency(tx.amountEur)}` : formatEurCurrency(tx.amountEur)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#181d28] border-t border-slate-800 p-3.5 sm:p-4 flex items-center justify-between shrink-0 safe-bottom">
          <span className="text-[11px] text-slate-400">
            Pagamentos mensais e bônus creditados automaticamente após as rodadas.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-colors shrink-0"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
