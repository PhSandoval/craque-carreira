import React from 'react';
import { PlayerProfile, NewsArticle, WeeklyTrainingResult } from '../types';
import { findClub, getTransferOffersForPlayer } from '../data/clubs';
import { getNextMatchFixture, getLeagueStandings, getActiveSeasonCompetitions } from '../services/tournamentService';
import { getStateCupStandings } from '../services/syncLeagueSimulationService';
import { getSquadHierarchy } from '../services/squadHierarchyService';
import { ensurePlayerEconomy, formatEurCurrency } from '../services/economyAndContractService';
import { buildSeasonAgenda } from '../services/seasonAgendaService';
import { getOrInitNewsFeed } from '../services/newsService';
import { getPlayerKnownName, getPlayerFullName } from '../utils/playerDisplay';
import { triggerHaptic } from '../services/hapticsService';
import { ClubBadge } from './ClubBadge';
import { TrophyVisual } from './TrophyVisual';
import { FMAttributePanel } from './FMAttributePanel';
import { TrainingAndCalendarModal } from './TrainingAndCalendarModal';
import { LeaguesAndSquadsModal } from './LeaguesAndSquadsModal';
import { TransferMarketModal } from './TransferMarketModal';
import { FinanceAndContractModal } from './FinanceAndContractModal';
import { TeammateAffinityModal } from './TeammateAffinityModal';
import { NewsFeedModal } from './NewsFeedModal';
import { MemoryLedgerModal } from './MemoryLedgerModal';
import {
  Play,
  Brain,
  Newspaper,
  Award,
  Heart,
  Users,
  Briefcase,
  Calendar,
  Sparkles,
  Shield,
  ArrowRightLeft,
  RotateCcw,
  Trophy,
  ChevronRight,
  Dumbbell,
  Handshake,
  HeartPulse,
  AlertTriangle,
  Globe,
  Flame,
  Medal,
  Clock,
  FastForward,
  LayoutDashboard,
  UserCheck
} from 'lucide-react';

export type DashboardTab =
  | 'resumo'
  | 'treino'
  | 'carreira'
  | 'ligas'
  | 'mercado'
  | 'vestiario';

interface CareerDashboardProps {
  player: PlayerProfile;
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
  trainingSubTab: 'attributes' | 'agenda' | 'coach_prep' | 'calendar' | 'physio';
  onChangeTrainingSubTab: (sub: 'attributes' | 'agenda' | 'coach_prep' | 'calendar' | 'physio') => void;
  mercadoSubTab: 'transfer' | 'finance';
  onChangeMercadoSubTab: (sub: 'transfer' | 'finance') => void;
  vestiarioSubTab: 'squad' | 'news' | 'memories';
  onChangeVestiarioSubTab: (sub: 'squad' | 'news' | 'memories') => void;
  onUpdatePlayer: (updated: PlayerProfile) => void;
  onTrainingCompleted?: (result: WeeklyTrainingResult, updatedPlayer: PlayerProfile) => void;
  onAdvanceDay: () => void;
  onAdvanceToMatchDay: () => void;
  onPlayNextMatch: () => void;
  onSelectTransferClub: (clubName: string) => void;
  onOpenMedicalCenter: () => void;
  onSimulateInjuryRound: () => void;
  onOpenOpportunity: () => void;
  onOpenNewsPopup: (article: NewsArticle) => void;
  onOpenSettings: () => void;
  onResetCareer: () => void;
}

const WEEK_DAY_META: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Dia 1 • Reapresentação', subtitle: 'Análise da imprensa, agenda e recuperação pós-jogo' },
  2: { title: 'Dia 2 • Treino no CT', subtitle: 'Sessão tática e física semanal com a comissão técnica' },
  3: { title: 'Dia 3 • Bastidores & Imprensa', subtitle: 'Sondagens, vestiário e ajustes antes da concentração' },
  4: { title: 'Dia 4 • Dia de Jogo!', subtitle: 'Estádio lotado! Hora de entrar em campo pela rodada' }
};

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  player: rawPlayer,
  activeTab,
  onChangeTab,
  trainingSubTab,
  onChangeTrainingSubTab,
  mercadoSubTab,
  onChangeMercadoSubTab,
  vestiarioSubTab,
  onChangeVestiarioSubTab,
  onUpdatePlayer,
  onTrainingCompleted,
  onAdvanceDay,
  onAdvanceToMatchDay,
  onPlayNextMatch,
  onSelectTransferClub,
  onOpenMedicalCenter,
  onSimulateInjuryRound,
  onOpenOpportunity,
  onOpenNewsPopup,
  onOpenSettings,
  onResetCareer
}) => {
  const player = ensurePlayerEconomy(rawPlayer);
  const currentClubObj = findClub(player.currentClub);
  const knownName = getPlayerKnownName(player);
  const fullName = getPlayerFullName(player);

  const effectiveMatchDay = Math.max(
    player.currentMatchDay || 1,
    (player.currentSeasonStats?.games || 0) + 1
  );
  const effectivePlayer: PlayerProfile =
    player.currentMatchDay !== effectiveMatchDay
      ? { ...player, currentMatchDay: effectiveMatchDay }
      : player;

  const currentWeekDay = Math.min(4, Math.max(1, player.currentWeekDay || 1));
  const weekDayInfo = WEEK_DAY_META[currentWeekDay] || WEEK_DAY_META[1];
  const isTransferWindowSeasonEnd = effectiveMatchDay > 38;

  const nextFixture = React.useMemo(
    () => getNextMatchFixture(effectivePlayer),
    [effectivePlayer.currentClub, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear, effectivePlayer.id]
  );

  const isStateCupPhase = currentClubObj.country === 'Brasil' && effectiveMatchDay <= 8;
  const stateCupInfo = React.useMemo(
    () => (isStateCupPhase ? getStateCupStandings(effectivePlayer) : null),
    [isStateCupPhase, effectivePlayer.currentClub, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear]
  );

  const rawLeagueStandings = React.useMemo(
    () => getLeagueStandings(currentClubObj.leagueId || 'serie_b', effectivePlayer),
    [currentClubObj.leagueId, effectivePlayer.currentMatchDay, effectivePlayer.currentSeasonStats?.games, effectivePlayer.currentSeasonStats?.goals]
  );
  const leagueStandings = isStateCupPhase && stateCupInfo ? stateCupInfo.standings : rawLeagueStandings;

  // Garantido seguro mesmo com OVR decimal
  getTransferOffersForPlayer(player.currentClub, player.ovr, player.age);

  const pastGames = player.history.reduce((acc, h) => acc + (h.games || 0), 0);
  const pastGoals = player.history.reduce((acc, h) => acc + (h.goals || 0), 0);
  const pastAssists = player.history.reduce((acc, h) => acc + (h.assists || 0), 0);

  const totalCareerGames = pastGames + (player.currentSeasonStats?.games || 0);
  const totalCareerGoals = pastGoals + (player.currentSeasonStats?.goals || 0);
  const totalCareerAssists = pastAssists + (player.currentSeasonStats?.assists || 0);

  const activeCompetitions = React.useMemo(
    () =>
      getActiveSeasonCompetitions(
        currentClubObj,
        effectivePlayer.currentMatchDay || 1,
        effectivePlayer.seasonYear || 2026,
        effectivePlayer.eliminatedCompetitions || [],
        effectivePlayer.seasonTitlesWon || []
      ),
    [currentClubObj, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear, effectivePlayer.eliminatedCompetitions, effectivePlayer.seasonTitlesWon]
  );

  const earnedTrophiesList = React.useMemo(() => {
    const fromHistory = player.history.flatMap(h => h.titlesWon || []);
    const fromSeason = player.seasonTitlesWon || [];
    return Array.from(new Set([...fromSeason, ...fromHistory]));
  }, [player.history, player.seasonTitlesWon]);

  const totalTrophies = (player.careerTotals?.trophies || 0) || earnedTrophiesList.length;

  const hierarchy = React.useMemo(
    () => getSquadHierarchy(player),
    [player.currentClub, player.position, player.ovr, player.energy, player.relationships.coach, player.lifestylePersona]
  );

  const upcomingAgenda = React.useMemo(() => {
    const agenda = buildSeasonAgenda(effectivePlayer);
    return agenda.allRounds.filter(item => item.round >= effectiveMatchDay).slice(0, 4);
  }, [effectivePlayer.currentClub, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear, effectiveMatchDay]);

  const latestNews = React.useMemo(
    () => getOrInitNewsFeed(player).slice(0, 4),
    [player.newsFeed, player.currentClub, player.currentMatchDay]
  );

  const isTrainingPending = !player.weeklyTrainingDone;

  const switchTab = (tab: DashboardTab) => {
    triggerHaptic('tap');
    onChangeTab(tab);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      {/* ===================================================================== */}
      {/* CABEÇALHO COMPACTO FIXO DO JOGADOR                                   */}
      {/* ===================================================================== */}
      <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* Box OVR */}
            <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 shadow-lg shrink-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider">OVR</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-['Teko'] leading-none mt-0.5">
                {player.ovr}
              </span>
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-2xl font-black text-white tracking-tight leading-none">
                  {knownName}
                </span>
                <span className="text-xs text-slate-400 font-medium truncate">
                  ({fullName})
                </span>
                <span className="bg-[#1c2230] text-slate-200 text-[11px] px-2 py-0.5 rounded-full font-bold border border-slate-700/70">
                  {player.flag} #{player.number} {player.position}
                </span>
                {player.playStyleName && (
                  <span className="text-[10px] bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold">
                    {player.playStyleName}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <ClubBadge club={currentClubObj} size="xs" />
                  <span className="font-bold text-slate-100">{player.currentClub}</span>
                </div>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{currentClubObj.league}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 font-bold font-mono">
                  {isTransferWindowSeasonEnd ? 'Janela Aberta' : `Rodada ${effectiveMatchDay}/38`}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                <span>IDADE <strong className="text-white">{player.age}</strong></span>
                <span>ENERGIA <strong className={player.energy >= 70 ? 'text-emerald-400' : 'text-amber-400'}>{player.energy}%</strong></span>
                <span>MORAL <strong className="text-sky-300">{player.moral}%</strong></span>
                <span>SALDO <strong className="text-emerald-300">{formatEurCurrency(player.bankBalanceEur || 0)}</strong></span>
                <span>MERCADO <strong className="text-emerald-400">€{player.marketValueEur.toFixed(1)}M</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Deseja iniciar uma nova carreira do zero?')) {
                  onResetCareer();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Nova Carreira</span>
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Config / Nuvem
            </button>
          </div>
        </div>

        {/* Barra de Abas Principais Compartimentadas */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {[
            { id: 'resumo' as DashboardTab, label: 'Resumo & Dia', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
            {
              id: 'treino' as DashboardTab,
              label: 'Treinos & Agenda',
              icon: <Dumbbell className="w-3.5 h-3.5" />,
              dot: isTrainingPending ? 'amber' : undefined
            },
            { id: 'carreira' as DashboardTab, label: 'Perfil & Troféus', icon: <Trophy className="w-3.5 h-3.5" /> },
            { id: 'ligas' as DashboardTab, label: 'Ligas & Elencos', icon: <Shield className="w-3.5 h-3.5" /> },
            {
              id: 'mercado' as DashboardTab,
              label: 'Mercado & Finanças',
              icon: <ArrowRightLeft className="w-3.5 h-3.5" />,
              dot: isTransferWindowSeasonEnd ? 'emerald' : undefined
            },
            {
              id: 'vestiario' as DashboardTab,
              label: 'Vestiário & Imprensa',
              icon: <Users className="w-3.5 h-3.5" />,
              dot: player.activeOpportunity ? 'amber' : undefined
            }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-[#181d28] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.dot && !isActive && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      tab.dot === 'amber' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ABA 1: RESUMO DO JOGADOR, AGENDA, PASSAR O DIA E ÚLTIMAS NOTÍCIAS     */}
      {/* ===================================================================== */}
      {activeTab === 'resumo' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Alertas Urgentes de Ação / Decisão (Lesão ou Oportunidade pendente) */}
          {(player.activeInjury || player.activeOpportunity) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {player.activeInjury && (
                <div className="bg-red-950/50 border border-red-500/60 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <HeartPulse className="w-5 h-5 text-red-400 shrink-0 animate-pulse" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase text-red-300 block">
                        Departamento Médico ({player.activeInjury.roundsRemaining} rod.)
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white truncate">
                        {player.activeInjury.name}
                      </h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenMedicalCenter}
                    className="px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-black font-black text-xs shrink-0"
                  >
                    Abrir DM
                  </button>
                </div>
              )}

              {player.activeOpportunity && (
                <div className="bg-amber-950/50 border border-amber-500/60 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase text-amber-300 block">
                        Decisão Pendente
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white truncate">
                        {player.activeOpportunity.title}
                      </h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenOpportunity}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs shrink-0"
                  >
                    Responder
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Coluna Esquerda (7 cols): Agenda Semanal, Passar o Dia e Próximo Jogo */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                {/* Trilha da Semana (Passar o Dia) */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                        Agenda da Semana • Rodada {Math.min(38, effectiveMatchDay)} de 38
                      </span>
                      <h2 className="text-lg font-black text-white">{weekDayInfo.title}</h2>
                      <p className="text-xs text-slate-400">{weekDayInfo.subtitle}</p>
                    </div>

                    {!isTransferWindowSeasonEnd && (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border ${
                          isTrainingPending
                            ? 'bg-amber-950/60 text-amber-300 border-amber-700/60'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                        }`}
                      >
                        {isTrainingPending ? 'Treino Pendente' : 'Treino da Semana OK'}
                      </span>
                    )}
                  </div>

                  {/* Barra visual dos 4 dias */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(dayNum => {
                      const isDone = dayNum < currentWeekDay;
                      const isCurr = dayNum === currentWeekDay;
                      const labels = ['Reapresentação', 'Treino CT', 'Bastidores', 'Dia de Jogo'];
                      return (
                        <div
                          key={dayNum}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            isCurr
                              ? 'bg-emerald-500/20 border-emerald-400 text-white shadow'
                              : isDone
                              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                              : 'bg-[#0e1118] border-slate-800/80 text-slate-500'
                          }`}
                        >
                          <span className="text-[9px] font-mono block">Dia {dayNum}</span>
                          <span className="text-[10px] font-bold block truncate">{labels[dayNum - 1]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card do Próximo Compromisso ou Janela de Transferências */}
                {isTransferWindowSeasonEnd ? (
                  <div className="bg-gradient-to-r from-emerald-950/60 to-[#141925] border border-emerald-600/50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-emerald-400" />
                      <div>
                        <h3 className="text-base font-black text-white">
                          Janela de Transferências Aberta!
                        </h3>
                        <p className="text-xs text-slate-300">
                          A temporada {player.seasonYear} terminou. Avalie propostas de outros clubes ou renove seu contrato no Mercado.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeMercadoSubTab('transfer');
                        switchTab('mercado');
                      }}
                      className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                      <span>Abrir Janela de Transferências</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#0e121a] border border-slate-800 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <TrophyVisual competitionName={nextFixture.competitionName} size="sm" />
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase block truncate">
                            {nextFixture.competitionName}
                          </span>
                          <h3 className="text-sm font-black text-white truncate">
                            {nextFixture.stageName} • {currentClubObj.stadium}
                          </h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-black/50 text-slate-300 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
                        {nextFixture.isNationalTeamMatch ? 'Seleção' : `R${effectiveMatchDay}/38`}
                      </span>
                    </div>

                    {/* Duelo Visual */}
                    <div className="flex items-center justify-around bg-[#141925] border border-slate-800/80 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        {nextFixture.isNationalTeamMatch ? (
                          <span className="text-2xl">{player.flag}</span>
                        ) : (
                          <ClubBadge club={currentClubObj} size="sm" />
                        )}
                        <div>
                          <span className="text-xs font-black text-white block">
                            {nextFixture.isNationalTeamMatch ? player.nationality : currentClubObj.shortName}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold">Seu Time</span>
                        </div>
                      </div>

                      <span className="text-sm font-black text-slate-500 font-['Teko']">VS</span>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-xs font-black text-white block">
                            {nextFixture.opponent.shortName}
                          </span>
                          <span className="text-[10px] text-slate-400">{nextFixture.opponent.league}</span>
                        </div>
                        {nextFixture.isNationalTeamMatch ? (
                          <span className="text-2xl">{nextFixture.nationalOpponentFlag || '🏳️'}</span>
                        ) : (
                          <ClubBadge club={nextFixture.opponent} size="sm" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] bg-black/30 px-3 py-2 rounded-xl border border-slate-800/70">
                      <span className="text-slate-300">
                        Status de Vaga:{' '}
                        <strong className="text-emerald-300">
                          {player.trainingVerdict?.earnedRoleLabel || hierarchy.naturalRoleLabel}
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onChangeTrainingSubTab('attributes');
                          switchTab('treino');
                        }}
                        className="text-amber-300 hover:text-amber-200 font-bold underline"
                      >
                        {isTrainingPending ? 'Fazer Treino da Semana' : 'Ver Relatório de Treino'}
                      </button>
                    </div>

                    {/* Botões Principais: PASSAR O DIA ou JOGAR */}
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      {(player.suspensionRoundsRemaining || 0) > 0 && currentWeekDay >= 4 ? (
                        <button
                          type="button"
                          onClick={onSimulateInjuryRound}
                          className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Clock className="w-4 h-4" />
                          <span>Cumprir Suspensão na Rodada</span>
                        </button>
                      ) : player.activeInjury && player.activeInjury.roundsRemaining > 0 && !player.activeInjury.isPlayingOnSacrifice && currentWeekDay >= 4 ? (
                        <>
                          <button
                            type="button"
                            onClick={onSimulateInjuryRound}
                            className="flex-1 py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2"
                          >
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>Recuperar 1 Semana no DM</span>
                          </button>
                          <button
                            type="button"
                            onClick={onOpenMedicalCenter}
                            className="py-3.5 px-4 rounded-2xl bg-rose-950/60 border border-rose-600/60 text-rose-200 font-bold text-xs"
                          >
                            Ver DM
                          </button>
                        </>
                      ) : currentWeekDay < 4 ? (
                        <>
                          <button
                            type="button"
                            onClick={onAdvanceDay}
                            className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-[0.99] transition-all"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Passar o Dia</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={onAdvanceToMatchDay}
                            className="py-3.5 px-4 rounded-2xl bg-[#1a202c] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            title="Avança os dias da semana até o próximo acontecimento ou Dia de Jogo"
                          >
                            <FastForward className="w-4 h-4 text-amber-400" />
                            <span>Ir p/ Jogo</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={onPlayNextMatch}
                          className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-[0.99] transition-all"
                        >
                          <Play className="w-5 h-5 fill-current" />
                          <span>ENTRAR EM CAMPO (#{player.number} {knownName})</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Próximos Jogos na Agenda */}
                {upcomingAgenda.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#141822] border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Agenda das Próximas Rodadas</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onChangeTrainingSubTab('agenda');
                          switchTab('treino');
                        }}
                        className="text-[10px] font-bold text-purple-300 hover:text-purple-200 flex items-center gap-0.5"
                      >
                        <span>Abrir Agenda Completa</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {upcomingAgenda.map(item => (
                        <div
                          key={item.round}
                          className={`p-2 rounded-xl border text-left space-y-1 ${
                            item.status === 'current'
                              ? 'bg-emerald-950/40 border-emerald-500/60'
                              : 'bg-[#10131a] border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[9px] font-mono">
                            <span className={item.status === 'current' ? 'text-emerald-300 font-black' : 'text-slate-400'}>
                              {item.dateLabel} • R{item.round}
                            </span>
                            {item.isPaydayAndPotm && <span title="Salário + Craque do Mês">💰</span>}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ClubBadge club={item.fixture.opponent} size="xs" />
                            <span className="text-[11px] font-bold text-white truncate">
                              {item.fixture.opponent.shortName}
                            </span>
                          </div>
                          <span className="text-[9px] text-amber-300/90 font-semibold block truncate">
                            {item.fixture.competitionShort}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita (5 cols): Resumo do Jogador + Últimas Notícias */}
            <div className="lg:col-span-5 space-y-5">
              {/* Card Resumo do Jogador */}
              <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Resumo do Jogador</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => switchTab('carreira')}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
                  >
                    <span>Atributos & Troféus</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 bg-[#161b26] p-3 rounded-2xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">JOGOS</span>
                    <span className="text-xl font-black text-white font-['Teko']">{totalCareerGames}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">GOLS</span>
                    <span className="text-xl font-black text-emerald-400 font-['Teko']">{totalCareerGoals}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">AST</span>
                    <span className="text-xl font-black text-sky-400 font-['Teko']">{totalCareerAssists}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">TAÇAS</span>
                    <span className="text-xl font-black text-amber-400 font-['Teko']">{totalTrophies}</span>
                  </div>
                </div>

                {/* Contrato & Salário */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-[#161b26] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block">SALÁRIO ATUAL</span>
                    <span className="text-sm font-black text-sky-300">
                      {formatEurCurrency(player.contract?.monthlySalaryEur || 15000)}/mês
                    </span>
                  </div>
                  <div className="bg-[#161b26] p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block">STATUS CONTRATO</span>
                    <span className="text-sm font-black text-white truncate block">
                      {player.contract?.yearsRemaining || 3} ano(s) • {player.contract?.roleLabel || 'Elenco'}
                    </span>
                  </div>
                </div>

                {/* Relações */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-[#161b26] p-2 rounded-xl border border-slate-800 text-center">
                    <Heart className="w-3.5 h-3.5 text-rose-400 mx-auto mb-0.5" />
                    <span className="text-[9px] text-slate-400 font-bold block">TÉCNICO</span>
                    <span className="text-xs font-black text-white">{player.relationships.coach}%</span>
                  </div>
                  <div className="bg-[#161b26] p-2 rounded-xl border border-slate-800 text-center">
                    <Users className="w-3.5 h-3.5 text-sky-400 mx-auto mb-0.5" />
                    <span className="text-[9px] text-slate-400 font-bold block">TORCIDA</span>
                    <span className="text-xs font-black text-white">{player.relationships.fans}%</span>
                  </div>
                  <div className="bg-[#161b26] p-2 rounded-xl border border-slate-800 text-center">
                    <Award className="w-3.5 h-3.5 text-amber-400 mx-auto mb-0.5" />
                    <span className="text-[9px] text-slate-400 font-bold block">DIRETORIA</span>
                    <span className="text-xs font-black text-white">{player.relationships.board}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeVestiarioSubTab('squad');
                      switchTab('vestiario');
                    }}
                    className="bg-[#161b26] hover:bg-emerald-950/40 p-2 rounded-xl border border-slate-800 hover:border-emerald-700/60 text-center transition-colors"
                  >
                    <Handshake className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-0.5" />
                    <span className="text-[9px] text-slate-400 font-bold block">ELENCO</span>
                    <span className="text-xs font-black text-emerald-400">{player.relationships.teammates || 70}%</span>
                  </button>
                </div>
              </div>

              {/* Card Últimas Notícias */}
              <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-blue-400" />
                    <span>Últimas Notícias</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeVestiarioSubTab('news');
                      switchTab('vestiario');
                    }}
                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                  >
                    <span>Ver Imprensa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {latestNews.map(article => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap');
                        onOpenNewsPopup(article);
                      }}
                      className="w-full text-left bg-[#161b26] hover:bg-[#1c2331] border border-slate-800 hover:border-blue-700/60 rounded-2xl p-3 space-y-1 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px]">
                        <span className="font-black text-blue-300 uppercase">{article.outlet}</span>
                        <span className="text-slate-500 font-mono">{article.dateStr}</span>
                      </div>
                      <h3 className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {article.headline}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{article.snippet}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 2: TREINOS & AGENDA                                               */}
      {/* ===================================================================== */}
      {activeTab === 'treino' && (
        <div className="animate-fadeIn">
          <TrainingAndCalendarModal
            embedded
            player={player}
            initialTab={trainingSubTab}
            onUpdatePlayer={onUpdatePlayer}
            onTrainingCompleted={onTrainingCompleted}
            onClose={() => switchTab('resumo')}
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 3: PERFIL, ATRIBUTOS, TRAJETÓRIA & TROFÉUS                        */}
      {/* ===================================================================== */}
      {activeTab === 'carreira' && (
        <div className="space-y-6 animate-fadeIn">
          <FMAttributePanel attributes={player.attributes} position={player.position} />

          {/* Competições Oficiais da Temporada & Sala de Troféus */}
          <div className="bg-[#12151c] border border-amber-900/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">
                    Competições & Sala de Troféus ({effectivePlayer.seasonYear})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Frentes disputadas pelo {currentClubObj.name} e prêmios individuais
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-[#181d28] px-3.5 py-1.5 rounded-xl border border-amber-800/40 text-xs font-bold">
                <Medal className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-mono font-black">
                  {totalTrophies} {totalTrophies === 1 ? 'Taça' : 'Taças'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {activeCompetitions.map(comp => {
                const isState = comp.category === 'state';
                const isLeague = comp.category === 'league';
                const isCup = comp.category === 'national_cup';
                const isCont = comp.category === 'continental';

                return (
                  <div
                    key={comp.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                      comp.isActiveNow
                        ? 'bg-gradient-to-b from-[#191f2c] to-[#12151c] border-amber-500/50'
                        : 'bg-[#10131a] border-slate-800/80 opacity-90'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          {isState && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                          {isLeague && <Shield className="w-3.5 h-3.5 text-emerald-400" />}
                          {isCup && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                          {isCont && <Globe className="w-3.5 h-3.5 text-sky-400" />}
                          <span>{comp.roundsRange}</span>
                        </span>

                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                          {comp.isActiveNow ? 'Em Disputa' : comp.isCompleted ? 'Finalizado' : 'Aguardando'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-white leading-tight">{comp.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Fase: <strong className="text-slate-200">{comp.currentStage}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Em jogo:</span>
                      <span className="font-bold text-amber-300 truncate max-w-[130px]">{comp.trophyTitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Prêmios Individuais */}
            <div className="bg-[#10131a] border border-slate-800/90 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-300 flex items-center gap-1.5 uppercase">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Prêmios Individuais (MOTM, POTM & Bola de Ouro)</span>
                </span>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="bg-amber-950/60 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded-lg font-bold">
                    ⭐ {player.awards?.motmCount || 0}x Craque do Jogo
                  </span>
                  <span className="bg-purple-950/60 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded-lg font-bold">
                    📅 {player.awards?.potmHistory?.length || 0}x Jogador do Mês
                  </span>
                  {(player.awards?.ballonDorCount || 0) > 0 && (
                    <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/60 px-2 py-0.5 rounded-lg font-black">
                      🥇 {player.awards?.ballonDorCount}x Bola de Ouro
                    </span>
                  )}
                </div>
              </div>
              {((player.awards?.potmHistory?.length || 0) > 0 || (player.awards?.seasonAwards?.length || 0) > 0) && (
                <div className="flex flex-wrap gap-2">
                  {(player.awards?.potmHistory || []).map(potm => (
                    <span key={potm.id} className="text-[11px] bg-[#181d28] border border-purple-700/50 text-purple-200 px-2.5 py-1 rounded-xl font-bold">
                      🏆 Craque de {potm.monthLabel}/{potm.seasonYear} (Nota {potm.ratingAvg.toFixed(1)})
                    </span>
                  ))}
                  {(player.awards?.seasonAwards || []).map(aw => (
                    <span key={aw.id} className="text-[11px] bg-[#181d28] border border-amber-700/50 text-amber-200 px-2.5 py-1 rounded-xl font-bold">
                      {aw.title} ({aw.seasonYear})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trajetória da Carreira + Tabela da Liga */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">Trajetória da Carreira</h2>
                <span className="text-[11px] font-semibold text-slate-400">
                  {player.history.length + 1} temporada(s)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Id</th>
                      <th className="pb-2">Clube</th>
                      <th className="pb-2 text-center">OVR</th>
                      <th className="pb-2 text-center">J</th>
                      <th className="pb-2 text-center">G</th>
                      <th className="pb-2 text-center">A</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {player.history.map((record, index) => (
                      <tr key={index} className="text-slate-300">
                        <td className="py-2 font-bold text-white">{record.age}</td>
                        <td className="py-2">{record.club}</td>
                        <td className="py-2 text-center font-bold text-emerald-400">{record.ovr}</td>
                        <td className="py-2 text-center">{record.games}</td>
                        <td className="py-2 text-center">{record.goals}</td>
                        <td className="py-2 text-center">{record.assists}</td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-950/20 text-emerald-300 font-bold">
                      <td className="py-2 pl-1 text-white">{player.age}</td>
                      <td className="py-2">{player.currentClub}</td>
                      <td className="py-2 text-center text-emerald-400">{player.ovr}</td>
                      <td className="py-2 text-center">{player.currentSeasonStats.games}</td>
                      <td className="py-2 text-center">{player.currentSeasonStats.goals}</td>
                      <td className="py-2 text-center">{player.currentSeasonStats.assists}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white">
                  {isStateCupPhase && stateCupInfo
                    ? `Estadual • ${stateCupInfo.cupName}`
                    : `Tabela • ${currentClubObj.league}`}
                </h2>
                <button
                  type="button"
                  onClick={() => switchTab('ligas')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  Ver 19 Ligas →
                </button>
              </div>
              <div className="overflow-x-auto max-h-[340px] custom-scrollbar">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Pos</th>
                      <th className="pb-2">Clube</th>
                      <th className="pb-2 text-center">PTS</th>
                      <th className="pb-2 text-center">J</th>
                      <th className="pb-2 text-center">SG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leagueStandings.map(st => {
                      const isUserClub = st.clubName === player.currentClub;
                      return (
                        <tr
                          key={st.clubId}
                          className={isUserClub ? 'bg-emerald-950/40 text-white font-bold' : 'text-slate-300'}
                        >
                          <td className="py-2 font-black">{st.position}º</td>
                          <td className="py-2">{st.clubName}</td>
                          <td className="py-2 text-center font-black text-emerald-400">{st.points}</td>
                          <td className="py-2 text-center">{st.played}</td>
                          <td className="py-2 text-center">{st.goalDifference}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 4: LIGAS & ELENCOS                                                */}
      {/* ===================================================================== */}
      {activeTab === 'ligas' && (
        <div className="animate-fadeIn">
          <LeaguesAndSquadsModal
            embedded
            player={player}
            onClose={() => switchTab('resumo')}
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 5: MERCADO DA BOLA & FINANÇAS                                     */}
      {/* ===================================================================== */}
      {activeTab === 'mercado' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 bg-[#12151c] p-1.5 rounded-2xl border border-slate-800 w-fit">
            <button
              type="button"
              onClick={() => onChangeMercadoSubTab('transfer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mercadoSubTab === 'transfer'
                  ? 'bg-amber-400 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Mercado da Bola</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeMercadoSubTab('finance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                mercadoSubTab === 'finance'
                  ? 'bg-emerald-500 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Finanças & Contrato</span>
            </button>
          </div>

          {mercadoSubTab === 'transfer' ? (
            <TransferMarketModal
              embedded
              player={player}
              onSelectTransferClub={onSelectTransferClub}
              onClose={() => switchTab('resumo')}
            />
          ) : (
            <FinanceAndContractModal
              embedded
              player={player}
              onUpdatePlayer={onUpdatePlayer}
              onClose={() => switchTab('resumo')}
            />
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 6: VESTIÁRIO, IMPRENSA & DOSSIÊ                                   */}
      {/* ===================================================================== */}
      {activeTab === 'vestiario' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2 bg-[#12151c] p-1.5 rounded-2xl border border-slate-800 w-fit">
            <button
              type="button"
              onClick={() => onChangeVestiarioSubTab('squad')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                vestiarioSubTab === 'squad'
                  ? 'bg-sky-400 text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Vestiário & Elenco</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeVestiarioSubTab('news')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                vestiarioSubTab === 'news'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Imprensa & Redes</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeVestiarioSubTab('memories')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                vestiarioSubTab === 'memories'
                  ? 'bg-purple-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Dossiê de Memórias ({player.memories?.length || 0})</span>
            </button>
          </div>

          {vestiarioSubTab === 'squad' && (
            <TeammateAffinityModal
              embedded
              player={player}
              onUpdatePlayer={onUpdatePlayer}
              onClose={() => switchTab('resumo')}
            />
          )}

          {vestiarioSubTab === 'news' && (
            <NewsFeedModal
              embedded
              player={player}
              onClose={() => switchTab('resumo')}
            />
          )}

          {vestiarioSubTab === 'memories' && (
            <MemoryLedgerModal
              embedded
              player={player}
              onClose={() => switchTab('resumo')}
            />
          )}
        </div>
      )}
    </div>
  );
};
