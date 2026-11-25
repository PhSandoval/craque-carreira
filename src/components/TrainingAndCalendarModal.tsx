import React, { useState, useMemo, useEffect } from 'react';
import { PlayerProfile, Position, WeeklyTrainingResult } from '../types';
import { 
  getTrainingFocusOptions, 
  executeWeeklyTrainingFocus, 
  getCleanWeeklyCalendar, 
  applyWeeklyPhysioRecovery,
  TrainingFocusOption
} from '../services/trainingCalendarService';
import { getSquadHierarchy } from '../services/squadHierarchyService';
import { hydrateFMAttributes, getFMAttributeBadge } from '../services/footballManagerAttributes';
import { buildSeasonAgenda } from '../services/seasonAgendaService';
import { CLUBS } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { TrophyVisual } from './TrophyVisual';
import { 
  Calendar, 
  Dumbbell, 
  X, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  HeartPulse, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Award, 
  Activity,
  Users,
  Target,
  Compass,
  AlertTriangle,
  RotateCcw,
  Check,
  Clock,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TrainingAndCalendarModalProps {
  player: PlayerProfile;
  initialTab?: 'attributes' | 'agenda' | 'coach_prep' | 'calendar' | 'physio';
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onClose: () => void;
}

export const TrainingAndCalendarModal: React.FC<TrainingAndCalendarModalProps> = ({
  player,
  initialTab = 'attributes',
  onUpdatePlayer,
  onClose
}) => {
  const hierarchy = getSquadHierarchy(player);
  const [activeTab, setActiveTab] = useState<'attributes' | 'agenda' | 'coach_prep' | 'calendar' | 'physio'>(initialTab);
  const [agendaCompFilter, setAgendaCompFilter] = useState<'all' | 'league' | 'cups' | 'national'>('all');
  const [agendaMonthFilter, setAgendaMonthFilter] = useState<number | 'all'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const effectiveMatchDay = Math.max(player.currentMatchDay || 1, (player.currentSeasonStats?.games || 0) + 1);
  const effectivePlayer: PlayerProfile = player.currentMatchDay !== effectiveMatchDay
    ? { ...player, currentMatchDay: effectiveMatchDay }
    : player;

  const weekSchedule = getCleanWeeklyCalendar(effectivePlayer);
  const focusOptions = getTrainingFocusOptions(player);
  const hydratedAttrs = hydrateFMAttributes(player.attributes, player.position);

  const seasonAgenda = useMemo(
    () => buildSeasonAgenda(effectivePlayer),
    [effectivePlayer.currentClub, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear, effectivePlayer.matchHistory?.length, effectivePlayer.eliminatedCompetitions?.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Executa o treino focado escolhido (com cálculo de resultado positivo, estável ou negativo)
  const handleExecuteFocus = (focusId: string) => {
    if (player.weeklyTrainingDone) {
      setFeedbackMessage('A sessão de foco semanal desta rodada já foi realizada. Aguarde a disputa da partida para abrir o próximo ciclo.');
      return;
    }

    const focus = focusOptions.find(f => f.id === focusId);
    if (!focus) return;

    if (player.energy < 20) {
      setFeedbackMessage('Energia física criticamente baixa. Faça uma sessão de fisioterapia antes de se expor a cargas de treino.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const { updatedPlayer, result } = executeWeeklyTrainingFocus(player, focusId);
      onUpdatePlayer(updatedPlayer);
      setIsProcessing(false);

      if (result.outcomeType === 'crit_success') {
        setFeedbackMessage(`Desempenho Notável: ${result.statChanges.map(s => `${s.statLabel} +${s.delta}`).join(', ')}. Elogio da comissão técnica!`);
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } else if (result.outcomeType === 'success') {
        setFeedbackMessage(`Evolução Concluída: ${result.statChanges.map(s => `${s.statLabel} +${s.delta}`).join(', ')}.`);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } else if (result.outcomeType === 'neutral') {
        setFeedbackMessage('Sessão regular: carga física cumprida sem saltos imediatos de atributos nesta rodada.');
      } else {
        setFeedbackMessage(`Sobrecarga física: o atleta sentiu o desgaste e registrou queda temporária de rendimento (${result.statChanges.map(s => `${s.statLabel} ${s.delta}`).join(', ')}).`);
      }
    }, 200);
  };

  // Recuperação de emergência no DM
  const handlePhysioSession = () => {
    const { updatedPlayer, message } = applyWeeklyPhysioRecovery(player);
    onUpdatePlayer(updatedPlayer);
    setFeedbackMessage(message);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const renderFocusIcon = (type: string) => {
    switch (type) {
      case 'target': return <Target className="w-5 h-5 text-rose-400" />;
      case 'compass': return <Compass className="w-5 h-5 text-sky-400" />;
      case 'zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'dumbbell': return <Dumbbell className="w-5 h-5 text-emerald-400" />;
      case 'shield': return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'award': return <Award className="w-5 h-5 text-purple-400" />;
      default: return <Activity className="w-5 h-5 text-slate-300" />;
    }
  };

  const lastResult: WeeklyTrainingResult | undefined = player.lastTrainingResult;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-[#12151c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        
        {/* Header Superior */}
        <div className="bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Centro de Treinamento & Foco Tático
                </h2>
                <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                  {player.currentClub}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Preparação oficial para a Rodada {effectiveMatchDay} de 38 • Posição: <strong className="text-white">{player.position}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Status de Energia */}
            <div className="bg-[#10141d] px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <Zap className={`w-3.5 h-3.5 ${player.energy >= 70 ? 'text-emerald-400' : player.energy >= 50 ? 'text-yellow-400' : 'text-rose-400'}`} />
              <div className="text-left">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">Fôlego</span>
                <span className="text-xs font-black text-white font-mono tracking-wide">
                  {player.energy}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notificação de Feedback */}
        {feedbackMessage && (
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
            <button onClick={() => setFeedbackMessage(null)} className="text-slate-400 hover:text-white p-0.5">✕</button>
          </div>
        )}

        {/* Sub-Tabs de Navegação */}
        <div className="bg-[#141822] px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('attributes')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'attributes'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Foco Semanal de Treino</span>
            {!player.weeklyTrainingDone ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ) : (
              <span className="text-[9px] bg-black/40 px-1 rounded font-mono">OK</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'agenda'
                ? 'bg-purple-400 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda da Temporada</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coach_prep')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'coach_prep'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Hierarquia & Vaga ({hierarchy.coachName})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'calendar'
                ? 'bg-sky-400 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendário da Semana</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('physio')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'physio'
                ? 'bg-teal-400 text-black shadow-md'
                : 'bg-[#1a202c] text-slate-300 hover:text-white border border-slate-700/60'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Fisioterapia & DM</span>
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-[#10131a]">
          
          {/* ==================================================== */}
          {/* ABA 1: FOCO SEMANAL DE TREINO (NÃO INFINITO / CÁLCULO) */}
          {/* ==================================================== */}
          {activeTab === 'attributes' && (
            <div className="space-y-4">
              
              {/* Barra de Status do Treino da Semana */}
              <div className="bg-[#161b26] p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">
                      Ciclo de Treinamento da Rodada {effectiveMatchDay}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      !player.weeklyTrainingDone
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950/80 text-amber-300 border-amber-800'
                    }`}>
                      {!player.weeklyTrainingDone ? 'Foco Semanal Disponível (1 de 1)' : 'Foco Concluído nesta Rodada'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {!player.weeklyTrainingDone
                      ? 'Escolha uma área prioritária de trabalho. O sistema calculará o rendimento baseado na sua energia, idade e nível técnico.'
                      : 'Você já realizou o treino tático desta semana. Próximo ciclo liberado após a disputa da rodada.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-xs text-slate-400">OVR Atual:</span>
                  <span className="text-base font-black text-emerald-400 font-mono bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                    {player.ovr}
                  </span>
                </div>
              </div>

              {/* Card de Relatório se o treino já foi realizado nesta rodada */}
              {player.weeklyTrainingDone && lastResult && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                  lastResult.outcomeType === 'crit_success'
                    ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-200'
                    : lastResult.outcomeType === 'success'
                    ? 'bg-sky-950/30 border-sky-700/60 text-sky-200'
                    : lastResult.outcomeType === 'neutral'
                    ? 'bg-slate-900/60 border-slate-700 text-slate-300'
                    : 'bg-rose-950/30 border-rose-700/60 text-rose-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      {lastResult.outcomeType === 'crit_success' || lastResult.outcomeType === 'success' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : lastResult.outcomeType === 'neutral' ? (
                        <Activity className="w-4 h-4 text-slate-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-rose-400" />
                      )}
                      <span className="font-black text-white text-sm">
                        Relatório da Sessão: {lastResult.outcomeTitle}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] bg-black/50 px-2 py-0.5 rounded border border-slate-700">
                      Foco: {lastResult.focusTitle}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {lastResult.description}
                  </p>

                  {/* Impacto nos Atributos */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {lastResult.statChanges.map((change, idx) => (
                      <div key={idx} className="bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1.5 font-mono">
                        <span className="text-slate-400">{change.statLabel}:</span>
                        <span className="text-white">{change.before}</span>
                        <span className="text-slate-500">➔</span>
                        <span className={change.delta > 0 ? 'text-emerald-400 font-bold' : change.delta < 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {change.after} ({change.delta > 0 ? `+${change.delta}` : change.delta})
                        </span>
                      </div>
                    ))}

                    {lastResult.ovrDelta !== 0 && (
                      <span className={`px-2 py-1 rounded-lg font-mono font-bold ${lastResult.ovrDelta > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                        {lastResult.ovrDelta > 0 ? `+${lastResult.ovrDelta}` : lastResult.ovrDelta} OVR
                      </span>
                    )}

                    <span className="bg-slate-800 px-2 py-1 rounded-lg text-slate-300 font-mono">
                      -{lastResult.energyCost}% Energia
                    </span>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 italic">
                    {lastResult.coachFeedback}
                  </div>
                </div>
              )}

              {/* Grade dos 6 Focos Disponíveis com Overalls Reais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {focusOptions.map((focus) => {
                  const pVal = (hydratedAttrs as any)[focus.primaryStat] ?? 65;
                  const sVal = (hydratedAttrs as any)[focus.secondaryStat] ?? 65;
                  const pBadge = getFMAttributeBadge(pVal);
                  const sBadge = getFMAttributeBadge(sVal);

                  const isTrained = player.weeklyTrainingDone;
                  const canAfford = player.energy >= focus.energyCost;

                  return (
                    <div
                      key={focus.id}
                      className={`bg-[#151923] border p-4 rounded-2xl flex flex-col justify-between space-y-3.5 transition-all ${
                        isTrained 
                          ? 'border-slate-800/60 opacity-80' 
                          : 'border-slate-800 hover:border-slate-700 shadow-md'
                      }`}
                    >
                      <div className="space-y-2.5">
                        
                        {/* Topo do Card: Ícone + Título + Custo de Energia */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start space-x-2.5 min-w-0">
                            <div className="p-2 rounded-xl bg-black/40 border border-slate-800 shrink-0">
                              {renderFocusIcon(focus.iconType)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                                {focus.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {focus.subtitle}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-900/60 shrink-0 font-mono">
                            -{focus.energyCost}% Fôlego
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-snug">
                          {focus.description}
                        </p>

                        {/* Overall Real dos Atributos Envolvidos */}
                        <div className="bg-[#10141d] p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            Atributos Trabalhados (Nível Atual)
                          </span>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-between bg-black/30 px-2 py-1 rounded border border-slate-800">
                              <span className="text-slate-300 font-semibold truncate pr-1">
                                {focus.primaryStatLabel}
                              </span>
                              <span className={`font-mono text-xs px-1.5 rounded font-bold border ${pBadge.badgeBg} ${pBadge.badgeBorder} ${pBadge.colorClass}`}>
                                {pVal}
                              </span>
                            </div>

                            <div className="flex items-center justify-between bg-black/30 px-2 py-1 rounded border border-slate-800">
                              <span className="text-slate-300 font-semibold truncate pr-1">
                                {focus.secondaryStatLabel}
                              </span>
                              <span className={`font-mono text-xs px-1.5 rounded font-bold border ${sBadge.badgeBg} ${sBadge.badgeBorder} ${sBadge.colorClass}`}>
                                {sVal}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Risco e Condição */}
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-400/90 bg-amber-950/20 px-2 py-1 rounded-lg border border-amber-900/30">
                          <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                          <span className="truncate">{focus.riskNote}</span>
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <button
                        type="button"
                        disabled={isTrained || !canAfford || isProcessing}
                        onClick={() => handleExecuteFocus(focus.id)}
                        className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all shadow flex items-center justify-center gap-1.5 ${
                          isTrained
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                            : !canAfford
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-black active:scale-98 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        }`}
                      >
                        {isTrained ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Sessão Cumprida nesta Rodada</span>
                          </>
                        ) : !canAfford ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Fôlego Insuficiente</span>
                          </>
                        ) : (
                          <>
                            <Dumbbell className="w-3.5 h-3.5" />
                            <span>Confirmar Foco Semanal</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* ABA EXTRA: AGENDA COMPLETA DA TEMPORADA (FM STYLE)    */}
          {/* ==================================================== */}
          {activeTab === 'agenda' && (
            <div className="space-y-4">
              {/* Controles de Filtro por Mês & Competição */}
              <div className="bg-[#161b26] border border-slate-800 rounded-2xl p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span>Esquema de Agenda • Temporada {effectivePlayer.seasonYear}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Todas as 38 rodadas organizadas mês a mês com resultados, datas FIFA, pagamentos e prêmios POTM.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-[#10141d] p-1 rounded-xl border border-slate-800 text-[11px]">
                    {([
                      { id: 'all', label: 'Todos' },
                      { id: 'league', label: 'Liga' },
                      { id: 'cups', label: 'Copas' },
                      { id: 'national', label: 'Seleção' }
                    ] as const).map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setAgendaCompFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          agendaCompFilter === f.id ? 'bg-purple-400 text-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pílulas dos Meses */}
                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setAgendaMonthFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                      agendaMonthFilter === 'all' ? 'bg-white text-black' : 'bg-[#10141d] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Ano Inteiro (38)
                  </button>
                  {seasonAgenda.months.map(m => {
                    const isCurr = m.monthIndex === seasonAgenda.currentMonthIndex;
                    return (
                      <button
                        key={m.monthIndex}
                        type="button"
                        onClick={() => setAgendaMonthFilter(m.monthIndex)}
                        className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                          agendaMonthFilter === m.monthIndex
                            ? 'bg-emerald-500 text-black'
                            : isCurr
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60'
                            : 'bg-[#10141d] text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <span>{m.monthLabel.split(' ')[0]}</span>
                        {isCurr && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lista Mensal da Agenda */}
              <div className="space-y-4">
                {seasonAgenda.months
                  .filter(m => agendaMonthFilter === 'all' || m.monthIndex === agendaMonthFilter)
                  .map(month => {
                    const visibleRounds = month.rounds.filter(item => {
                      if (agendaCompFilter === 'all') return true;
                      if (agendaCompFilter === 'league') return item.fixture.competitionType === 'league';
                      if (agendaCompFilter === 'cups') {
                        return ['state_cup', 'national_cup', 'continental_cup'].includes(item.fixture.competitionType);
                      }
                      return item.fixture.isNationalTeamMatch;
                    });
                    if (visibleRounds.length === 0) return null;

                    return (
                      <div key={month.monthIndex} className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                            <span>{month.monthLabel}</span>
                            {month.monthIndex === seasonAgenda.currentMonthIndex && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-600/50 px-2 py-0.5 rounded-full font-bold">
                                Mês Atual
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Rodadas {month.rounds[0]?.round}–{month.rounds[month.rounds.length - 1]?.round}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {visibleRounds.map(item => {
                            const rec = item.historyRecord;
                            const isWin = rec ? rec.playerTeamScore > rec.opponentTeamScore : false;
                            const isDraw = rec ? rec.playerTeamScore === rec.opponentTeamScore : false;
                            const currentClubObj = CLUBS[effectivePlayer.currentClub];

                            return (
                              <div
                                key={item.round}
                                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                                  item.status === 'current'
                                    ? 'bg-gradient-to-r from-emerald-950/50 via-[#17202b] to-[#121620] border-emerald-500/70 shadow-md'
                                    : item.status === 'completed'
                                    ? 'bg-[#141821] border-slate-800/80'
                                    : 'bg-[#151a24]/80 border-slate-800'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="text-center w-12 shrink-0 bg-black/40 py-1.5 rounded-xl border border-slate-800">
                                    <span className="text-[9px] text-slate-400 font-bold block uppercase">{item.dateLabel}</span>
                                    <span className="text-xs font-black font-mono text-white">R{item.round}</span>
                                  </div>

                                  <TrophyVisual competitionName={item.fixture.competitionName} size="xs" />

                                  <div className="min-w-0 flex-1 space-y-0.5">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] font-bold uppercase text-amber-300">
                                        {item.fixture.competitionShort}
                                      </span>
                                      <span className="text-slate-600 text-[10px]">•</span>
                                      <span className="text-[10px] text-slate-400 truncate">{item.fixture.stageName}</span>
                                      {item.isKnockout && (
                                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-600/40">
                                          Mata-Mata
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                      <span className="truncate">{item.fixture.isNationalTeamMatch ? (item.fixture.nationalTeamName || effectivePlayer.nationality) : (currentClubObj?.shortName || effectivePlayer.currentClub)}</span>
                                      <span className="text-slate-500 text-[10px]">vs</span>
                                      <ClubBadge club={item.fixture.opponent} size="xs" />
                                      <span className="truncate">{item.fixture.opponent.shortName}</span>
                                    </div>

                                    {item.milestones.length > 0 && (
                                      <div className="flex flex-wrap gap-1 pt-0.5">
                                        {item.milestones.map((ms, mIdx) => (
                                          <span key={mIdx} className="text-[9px] bg-slate-900 text-slate-300 border border-slate-700/80 px-1.5 py-0.5 rounded-md">
                                            {ms}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pl-14 sm:pl-0">
                                  {item.status === 'current' ? (
                                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500 text-black">
                                      Próximo Jogo • {effectivePlayer.weeklyTrainingDone ? 'Treino OK' : 'Treino Pendente'}
                                    </span>
                                  ) : rec ? (
                                    rec.skippedReason ? (
                                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/60">
                                        {rec.skippedReason === 'injury' ? 'DM (Lesionado)' : 'Suspenso'}
                                      </span>
                                    ) : (
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-lg border ${
                                          isWin
                                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/70'
                                            : isDraw
                                            ? 'bg-slate-800 text-slate-200 border-slate-700'
                                            : 'bg-rose-950/70 text-rose-300 border-rose-700/70'
                                        }`}>
                                          {isWin ? 'V' : isDraw ? 'E' : 'D'} {rec.playerTeamScore}x{rec.opponentTeamScore}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                                          {rec.goals}G {rec.assists}A • {rec.rating.toFixed(1)}
                                        </span>
                                        {rec.isMotm && (
                                          <span className="text-[9px] font-black bg-amber-400 text-black px-1.5 py-0.5 rounded">
                                            ⭐ MOTM
                                          </span>
                                        )}
                                      </div>
                                    )
                                  ) : item.status === 'completed' ? (
                                    <span className="text-[10px] text-slate-500 font-semibold">Concluída</span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 font-mono">Agendada</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* ABA 2: HIERARQUIA & VAGA COM O TREINADOR             */}
          {/* ==================================================== */}
          {activeTab === 'coach_prep' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#171e2c] to-[#121620] border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>Hierarquia do Elenco • {player.currentClub} ({hierarchy.prestige} Estrelas)</span>
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Disputa pela Vaga na Posição {player.position}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Comandante Técnico:</span>
                    <span className="text-xs sm:text-sm font-extrabold text-white">{hierarchy.coachName}</span>
                  </div>
                </div>

                {/* Duelo de Atletas: Titular vs Você */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-black/40 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 block uppercase">Titular Principal</span>
                      <span className="text-xs font-black text-white">{hierarchy.topCompetitor?.name}</span>
                      <span className="text-[10px] text-slate-400 block">{hierarchy.topCompetitor?.position} • Experiente</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-amber-300 font-mono">{hierarchy.topCompetitor?.ovr} OVR</span>
                    </div>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 block uppercase">Você</span>
                      <span className="text-xs font-black text-white">{player.name} "{player.surname}"</span>
                      <span className="text-[10px] text-slate-400 block">{player.position} • {player.age} anos</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-300 font-mono">{player.ovr} OVR</span>
                    </div>
                  </div>
                </div>

                {/* Veredito Atual */}
                <div className="bg-[#121622] p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Status Atual para o Próximo Jogo:</span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {hierarchy.naturalRoleLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {hierarchy.statusExplanation}
                  </p>
                  <div className="text-xs text-amber-300 italic pt-1">
                    {hierarchy.coachVerdictQuote}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* ABA 3: CALENDÁRIO DA SEMANA                          */}
          {/* ==================================================== */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                  Cronograma da Semana (Rodada {effectiveMatchDay})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weekSchedule.map((day, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-start space-x-3.5 transition-all ${
                        day.type === 'match'
                          ? 'bg-amber-950/30 border-amber-600/50 shadow-md'
                          : day.completed
                          ? 'bg-[#161a24] border-slate-800/80 text-slate-300'
                          : 'bg-[#191e2b] border-slate-700/80 text-white'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 text-slate-300 shrink-0">
                        {day.type === 'match' ? (
                          <Award className="w-5 h-5 text-amber-400" />
                        ) : day.type === 'physio' ? (
                          <HeartPulse className="w-5 h-5 text-teal-400" />
                        ) : (
                          <Activity className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-400">
                            {day.dayName} • {day.dateLabel}
                          </span>
                          {day.completed && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Cumprido</span>
                            </span>
                          )}
                          {day.type === 'match' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-500/40">
                              JOGO
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{day.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* ABA 4: FISIOTERAPIA & REGENERAÇÃO NO DM              */}
          {/* ==================================================== */}
          {activeTab === 'physio' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-950/70 to-slate-900 border border-teal-800/60 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white">Departamento Médico & Fisioterapia</h4>
                  <p className="text-xs text-teal-300">
                    Sessão de crioterapia e drenagem miofascial para restaurar fôlego e prevenir lesões graves.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Fôlego Atual</span>
                  <span className="text-2xl font-black text-teal-300 font-mono">
                    {player.energy}%
                  </span>
                </div>
              </div>

              <div className="bg-[#151923] p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white">Sessão Especial de Crioterapia e Liberação Muscular</h5>
                    <p className="text-xs text-slate-400">Recupera +30% de energia imediatamente sem desgaste de atributos.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                    +30% Fôlego
                  </span>
                </div>

                <button
                  type="button"
                  disabled={player.energy >= 100}
                  onClick={handlePhysioSession}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    player.energy >= 100
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-teal-400 hover:bg-teal-300 text-black shadow-md'
                  }`}
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>{player.energy >= 100 ? 'Energia Já Está em 100%' : 'Executar Fisioterapia Muscular'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Rodapé Informativo */}
        <div className="bg-[#181d28] border-t border-slate-800 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Limite: 1 foco de treino por rodada. O sistema calcula a evolução técnica ou desgaste com base na sua energia física e idade.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-colors shrink-0"
          >
            Concluir & Voltar
          </button>
        </div>

      </div>
    </div>
  );
};
