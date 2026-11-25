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
  HeartPulse,
  Sparkles,
  Calendar,
  ChevronRight,
  Clock,
  FastForward,
  ArrowRightLeft,
  Trophy,
  Newspaper
} from 'lucide-react';

export type DashboardTab = 'resumo' | 'treino' | 'ligas' | 'mercado' | 'perfil';
export type PerfilSubTab = 'atributos' | 'vestiario' | 'imprensa' | 'memorias';

interface CareerDashboardProps {
  player: PlayerProfile;
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
  trainingSubTab: 'attributes' | 'agenda' | 'coach_prep' | 'calendar' | 'physio';
  onChangeTrainingSubTab: (sub: 'attributes' | 'agenda' | 'coach_prep' | 'calendar' | 'physio') => void;
  mercadoSubTab: 'transfer' | 'finance';
  onChangeMercadoSubTab: (sub: 'transfer' | 'finance') => void;
  perfilSubTab: PerfilSubTab;
  onChangePerfilSubTab: (sub: PerfilSubTab) => void;
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
}

const WEEK_DAY_LABELS = [
  'Dia 1 • Reapresentação',
  'Dia 2 • Treino no CT',
  'Dia 3 • Bastidores',
  'Dia 4 • Dia de Jogo'
];

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  player: rawPlayer,
  activeTab,
  onChangeTab,
  trainingSubTab,
  onChangeTrainingSubTab,
  mercadoSubTab,
  onChangeMercadoSubTab,
  perfilSubTab,
  onChangePerfilSubTab,
  onUpdatePlayer,
  onTrainingCompleted,
  onAdvanceDay,
  onAdvanceToMatchDay,
  onPlayNextMatch,
  onSelectTransferClub,
  onOpenMedicalCenter,
  onSimulateInjuryRound,
  onOpenOpportunity,
  onOpenNewsPopup
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
  const isTransferWindowSeasonEnd = effectiveMatchDay > 38;
  const isTrainingPending = !player.weeklyTrainingDone;

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
    return agenda.allRounds.filter(item => item.round >= effectiveMatchDay).slice(0, 3);
  }, [effectivePlayer.currentClub, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear, effectiveMatchDay]);

  const latestNews = React.useMemo(
    () => getOrInitNewsFeed(player).slice(0, 3),
    [player.newsFeed, player.currentClub, player.currentMatchDay]
  );

  const switchTab = (tab: DashboardTab) => {
    triggerHaptic('tap');
    onChangeTab(tab);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      {/* ===================================================================== */}
      {/* ABA 1: RESUMO LIMPO (JOGADOR + AGENDA & PASSAR O DIA + NOTÍCIAS)      */}
      {/* ===================================================================== */}
      {activeTab === 'resumo' && (
        <div className="space-y-5 animate-fadeIn">
          {/* 1. Faixa Compacta de Resumo do Jogador */}
          <section className="bg-[#11151d] border border-white/[0.07] rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-slate-500 uppercase">OVR</span>
                <span className="text-2xl font-black text-white font-['Teko'] leading-none">
                  {player.ovr}
                </span>
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none">
                    {knownName}
                  </h1>
                  <span className="text-xs text-slate-400 truncate">
                    {fullName}
                  </span>
                  <span className="text-[11px] text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded-md font-semibold">
                    {player.flag} #{player.number} {player.position}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <ClubBadge club={currentClubObj} size="xs" />
                    <span className="text-slate-200 font-medium">{player.currentClub}</span>
                  </div>
                  {player.playStyleName && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-emerald-400/90 font-medium">{player.playStyleName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Métricas limpas em linha */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-7 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/[0.06] text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Jogos / G / A</span>
                <span className="font-bold text-white font-mono">
                  {totalCareerGames} · {totalCareerGoals}G · {totalCareerAssists}A
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Energia</span>
                <span className={`font-bold font-mono ${player.energy >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {player.energy}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Moral</span>
                <span className="font-bold text-slate-200 font-mono">{player.moral}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Saldo</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {formatEurCurrency(player.bankBalanceEur || 0)}
                </span>
              </div>
            </div>
          </section>

          {/* Alerta único e discreto caso exista lesão ou decisão pendente */}
          {(player.activeInjury || player.activeOpportunity) && (
            <div className="bg-[#141821] border border-amber-500/30 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs">
                {player.activeInjury ? (
                  <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-slate-200 font-medium">
                  {player.activeInjury
                    ? `Departamento Médico: ${player.activeInjury.name} (${player.activeInjury.roundsRemaining} rod.)`
                    : `Decisão pendente: ${player.activeOpportunity?.title}`}
                </span>
              </div>
              <button
                type="button"
                onClick={player.activeInjury ? onOpenMedicalCenter : onOpenOpportunity}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors"
              >
                {player.activeInjury ? 'Abrir DM' : 'Responder'}
              </button>
            </div>
          )}

          {/* Grid Principal Limpo (Agenda & Passar o Dia + Últimas Notícias) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 2. Bloco Central: Agenda & Passar o Dia */}
            <section className="lg:col-span-7 bg-[#11151d] border border-white/[0.07] rounded-2xl p-5 sm:p-6 space-y-5">
              {/* Cabeçalho da Semana */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 block">
                    {isTransferWindowSeasonEnd
                      ? `Fim da Temporada ${player.seasonYear}`
                      : `Rodada ${effectiveMatchDay} de 38 • ${WEEK_DAY_LABELS[currentWeekDay - 1]}`}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {isTransferWindowSeasonEnd
                      ? 'Janela de Transferências Aberta'
                      : nextFixture.competitionName}
                  </h2>
                </div>

                {!isTransferWindowSeasonEnd && (
                  <button
                    type="button"
                    onClick={() => {
                      onChangeTrainingSubTab('attributes');
                      switchTab('treino');
                    }}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                      isTrainingPending
                        ? 'border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20'
                        : 'border-white/[0.08] text-slate-300 bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                  >
                    {isTrainingPending ? 'Treino Pendente →' : 'Treino OK ✓'}
                  </button>
                )}
              </div>

              {/* Progresso limpo dos 4 dias da semana */}
              {!isTransferWindowSeasonEnd && (
                <div className="grid grid-cols-4 gap-1.5">
                  {['Reapresentação', 'Treino CT', 'Bastidores', 'Jogo'].map((label, idx) => {
                    const stepNum = idx + 1;
                    const isActive = stepNum === currentWeekDay;
                    const isDone = stepNum < currentWeekDay;
                    return (
                      <div key={label} className="space-y-1.5">
                        <div
                          className={`h-1 rounded-full transition-colors ${
                            isActive
                              ? 'bg-emerald-400'
                              : isDone
                              ? 'bg-emerald-500/40'
                              : 'bg-white/[0.08]'
                          }`}
                        />
                        <span
                          className={`text-[10px] block text-center truncate ${
                            isActive
                              ? 'text-white font-bold'
                              : isDone
                              ? 'text-slate-400'
                              : 'text-slate-600'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Confronto Centralizado ou Janela */}
              {isTransferWindowSeasonEnd ? (
                <div className="py-4 space-y-4 border-y border-white/[0.06]">
                  <p className="text-xs sm:text-sm text-slate-300">
                    Você concluiu a temporada pelo <strong>{player.currentClub}</strong>. Acesse o Mercado para analisar propostas de transferência ou renovar seu vínculo.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeMercadoSubTab('transfer');
                      switchTab('mercado');
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Abrir Mercado da Bola</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="py-4 border-y border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {nextFixture.isNationalTeamMatch ? (
                        <span className="text-2xl shrink-0">{player.flag}</span>
                      ) : (
                        <ClubBadge club={currentClubObj} size="sm" />
                      )}
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-white block truncate">
                          {nextFixture.isNationalTeamMatch ? player.nationality : currentClubObj.shortName}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {player.trainingVerdict?.earnedRoleLabel || hierarchy.naturalRoleLabel}
                        </span>
                      </div>
                    </div>

                    <div className="px-3 text-center shrink-0">
                      <TrophyVisual competitionName={nextFixture.competitionName} size="xs" />
                      <span className="text-[10px] font-semibold text-slate-500 block mt-1">
                        {nextFixture.stageName}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 min-w-0 flex-1 text-right">
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-white block truncate">
                          {nextFixture.opponent.shortName}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {nextFixture.opponent.league}
                        </span>
                      </div>
                      {nextFixture.isNationalTeamMatch ? (
                        <span className="text-2xl shrink-0">{nextFixture.nationalOpponentFlag || '🏳️'}</span>
                      ) : (
                        <ClubBadge club={nextFixture.opponent} size="sm" />
                      )}
                    </div>
                  </div>

                  {/* Ação Principal: Passar o Dia / Jogar */}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    {(player.suspensionRoundsRemaining || 0) > 0 && currentWeekDay >= 4 ? (
                      <button
                        type="button"
                        onClick={onSimulateInjuryRound}
                        className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Cumprir Suspensão</span>
                      </button>
                    ) : player.activeInjury && player.activeInjury.roundsRemaining > 0 && !player.activeInjury.isPlayingOnSacrifice && currentWeekDay >= 4 ? (
                      <button
                        type="button"
                        onClick={onSimulateInjuryRound}
                        className="flex-1 py-3 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Avançar 1 Semana no DM</span>
                      </button>
                    ) : currentWeekDay < 4 ? (
                      <>
                        <button
                          type="button"
                          onClick={onAdvanceDay}
                          className="flex-1 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Passar o Dia</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={onAdvanceToMatchDay}
                          className="py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FastForward className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ir p/ Jogo</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={onPlayNextMatch}
                        className="flex-1 py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Entrar em Campo (#{player.number} {knownName})</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Agenda Resumida (Próximos 3 Jogos) */}
              {upcomingAgenda.length > 0 && (
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">Próximos jogos na agenda</span>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeTrainingSubTab('agenda');
                        switchTab('treino');
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Agenda completa →
                    </button>
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    {upcomingAgenda.map(item => (
                      <div
                        key={item.round}
                        className="py-2 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[11px] text-slate-500 w-16 shrink-0">
                            {item.dateLabel}
                          </span>
                          <ClubBadge club={item.fixture.opponent} size="xs" />
                          <span className="font-medium text-slate-200 truncate">
                            vs {item.fixture.opponent.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {item.fixture.competitionShort}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 3. Bloco Lateral: Últimas Notícias + Relações */}
            <div className="lg:col-span-5 space-y-5">
              <section className="bg-[#11151d] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-slate-400" />
                    <span>Últimas Notícias</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      onChangePerfilSubTab('imprensa');
                      switchTab('perfil');
                    }}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Ver todas →
                  </button>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {latestNews.map(article => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('tap');
                        onOpenNewsPopup(article);
                      }}
                      className="w-full text-left py-3 first:pt-1 last:pb-1 hover:opacity-85 transition-opacity space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-slate-400 uppercase">{article.outlet}</span>
                        <span>{article.dateStr}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-slate-100 leading-snug line-clamp-2">
                        {article.headline}
                      </h3>
                    </button>
                  ))}
                </div>
              </section>

              {/* Resumo discreto de Confiança */}
              <section className="bg-[#11151d] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Ambiente & Contrato</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatEurCurrency(player.contract?.monthlySalaryEur || 15000)}/mês
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Técnico</span>
                    <span className="text-xs font-bold text-white">{player.relationships.coach}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Torcida</span>
                    <span className="text-xs font-bold text-white">{player.relationships.fans}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Diretoria</span>
                    <span className="text-xs font-bold text-white">{player.relationships.board}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Elenco</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {player.relationships.teammates || 70}%
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 2: TREINO & AGENDA                                                */}
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
      {/* ABA 3: LIGAS & ELENCOS                                                */}
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
      {/* ABA 4: MERCADO & FINANÇAS                                             */}
      {/* ===================================================================== */}
      {activeTab === 'mercado' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-1 bg-[#11151d] p-1 rounded-xl border border-white/[0.07] w-fit">
            <button
              type="button"
              onClick={() => onChangeMercadoSubTab('transfer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mercadoSubTab === 'transfer'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transferências
            </button>
            <button
              type="button"
              onClick={() => onChangeMercadoSubTab('finance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                mercadoSubTab === 'finance'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Finanças & Contrato
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
      {/* ABA 5: PERFIL (ATRIBUTOS & TROFÉUS | VESTIÁRIO | IMPRENSA | MEMÓRIAS) */}
      {/* ===================================================================== */}
      {activeTab === 'perfil' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-1 bg-[#11151d] p-1 rounded-xl border border-white/[0.07] w-fit">
            {[
              { id: 'atributos' as PerfilSubTab, label: 'Atributos & Troféus' },
              { id: 'vestiario' as PerfilSubTab, label: 'Vestiário' },
              { id: 'imprensa' as PerfilSubTab, label: 'Imprensa' },
              { id: 'memorias' as PerfilSubTab, label: `Memórias (${player.memories?.length || 0})` }
            ].map(sub => (
              <button
                key={sub.id}
                type="button"
                onClick={() => onChangePerfilSubTab(sub.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  perfilSubTab === sub.id
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {perfilSubTab === 'atributos' && (
            <div className="space-y-5">
              <FMAttributePanel attributes={player.attributes} position={player.position} />

              {/* Competições & Sala de Troféus */}
              <div className="bg-[#11151d] border border-white/[0.07] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Competições ({effectivePlayer.seasonYear}) & Troféus ({totalTrophies})</span>
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{player.awards?.motmCount || 0} MOTM</span>
                    <span>·</span>
                    <span>{player.awards?.potmHistory?.length || 0} POTM</span>
                    {(player.awards?.ballonDorCount || 0) > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-amber-300 font-bold">{player.awards?.ballonDorCount} Bola de Ouro</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeCompetitions.map(comp => (
                    <div
                      key={comp.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{comp.roundsRange}</span>
                        <span className="text-slate-300 font-medium">
                          {comp.isActiveNow ? 'Em disputa' : comp.isCompleted ? 'Fim' : 'Em breve'}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white truncate">{comp.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate">{comp.currentStage}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trajetória & Tabela */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5 bg-[#11151d] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                  <h2 className="text-sm font-bold text-white">Trajetória Anual</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-slate-500 text-[10px] uppercase">
                          <th className="pb-2">Id</th>
                          <th className="pb-2">Clube</th>
                          <th className="pb-2 text-center">OVR</th>
                          <th className="pb-2 text-center">J</th>
                          <th className="pb-2 text-center">G</th>
                          <th className="pb-2 text-center">A</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {player.history.map((record, index) => (
                          <tr key={index} className="text-slate-300">
                            <td className="py-2">{record.age}</td>
                            <td className="py-2 truncate max-w-[120px]">{record.club}</td>
                            <td className="py-2 text-center font-bold text-emerald-400">{record.ovr}</td>
                            <td className="py-2 text-center">{record.games}</td>
                            <td className="py-2 text-center">{record.goals}</td>
                            <td className="py-2 text-center">{record.assists}</td>
                          </tr>
                        ))}
                        <tr className="text-white font-bold">
                          <td className="py-2">{player.age}</td>
                          <td className="py-2 truncate max-w-[120px]">{player.currentClub}</td>
                          <td className="py-2 text-center text-emerald-400">{player.ovr}</td>
                          <td className="py-2 text-center">{player.currentSeasonStats.games}</td>
                          <td className="py-2 text-center">{player.currentSeasonStats.goals}</td>
                          <td className="py-2 text-center">{player.currentSeasonStats.assists}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-[#11151d] border border-white/[0.07] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">
                      {isStateCupPhase && stateCupInfo
                        ? stateCupInfo.cupName
                        : currentClubObj.league}
                    </h2>
                    <button
                      type="button"
                      onClick={() => switchTab('ligas')}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      Ver 19 ligas →
                    </button>
                  </div>
                  <div className="overflow-x-auto max-h-[300px] custom-scrollbar">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-slate-500 text-[10px] uppercase">
                          <th className="pb-2">#</th>
                          <th className="pb-2">Clube</th>
                          <th className="pb-2 text-center">PTS</th>
                          <th className="pb-2 text-center">J</th>
                          <th className="pb-2 text-center">SG</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05]">
                        {leagueStandings.map(st => {
                          const isUserClub = st.clubName === player.currentClub;
                          return (
                            <tr
                              key={st.clubId}
                              className={isUserClub ? 'bg-emerald-500/10 text-white font-bold' : 'text-slate-300'}
                            >
                              <td className="py-1.5">{st.position}º</td>
                              <td className="py-1.5">{st.clubName}</td>
                              <td className="py-1.5 text-center font-bold text-emerald-400">{st.points}</td>
                              <td className="py-1.5 text-center">{st.played}</td>
                              <td className="py-1.5 text-center">{st.goalDifference}</td>
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

          {perfilSubTab === 'vestiario' && (
            <TeammateAffinityModal
              embedded
              player={player}
              onUpdatePlayer={onUpdatePlayer}
              onClose={() => switchTab('resumo')}
            />
          )}

          {perfilSubTab === 'imprensa' && (
            <NewsFeedModal
              embedded
              player={player}
              onClose={() => switchTab('resumo')}
            />
          )}

          {perfilSubTab === 'memorias' && (
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
