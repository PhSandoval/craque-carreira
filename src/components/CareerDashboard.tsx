import React from 'react';
import { PlayerProfile, Club } from '../types';
import { CLUBS, findClub, getTransferOffersForPlayer } from '../data/clubs';
import { getNextMatchFixture, getLeagueStandings, getActiveSeasonCompetitions, ActiveSeasonCompetition } from '../services/tournamentService';
import { getStateCupStandings } from '../services/syncLeagueSimulationService';
import { getSquadHierarchy } from '../services/squadHierarchyService';
import { ensurePlayerEconomy, calculateContractOffer, formatEurCurrency } from '../services/economyAndContractService';
import { buildSeasonAgenda } from '../services/seasonAgendaService';
import { ClubBadge } from './ClubBadge';
import { TrophyVisual } from './TrophyVisual';
import { FMAttributePanel } from './FMAttributePanel';
import { 
  Play, 
  Brain, 
  Newspaper, 
  TrendingUp, 
  Award, 
  Heart, 
  Users, 
  Briefcase,
  Share2,
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
  Clock
} from 'lucide-react';

interface CareerDashboardProps {
  player: PlayerProfile;
  onPlayNextMatch: () => void;
  onOpenMemoryLedger: () => void;
  onOpenNewsFeed: () => void;
  onOpenLeagues: () => void;
  onOpenTransferMarket: () => void;
  onSelectTransferClub?: (clubName: string) => void;
  onOpenTraining?: () => void;
  onOpenAgenda?: () => void;
  onOpenFinances?: () => void;
  onOpenTeammates?: () => void;
  onOpenMedicalCenter?: () => void;
  onSimulateInjuryRound?: () => void;
  onOpenOpportunity?: () => void;
  onOpenSettings: () => void;
  onResetCareer?: () => void;
}

export const CareerDashboard: React.FC<CareerDashboardProps> = ({
  player: rawPlayer,
  onPlayNextMatch,
  onOpenMemoryLedger,
  onOpenNewsFeed,
  onOpenLeagues,
  onOpenTransferMarket,
  onSelectTransferClub,
  onOpenTraining,
  onOpenAgenda,
  onOpenFinances,
  onOpenTeammates,
  onOpenMedicalCenter,
  onSimulateInjuryRound,
  onOpenOpportunity,
  onOpenSettings,
  onResetCareer
}) => {
  const player = ensurePlayerEconomy(rawPlayer);
  const currentClubObj = findClub(player.currentClub);
  
  // Sincronização estrita de rodada: se o jogador já disputou N jogos, a rodada NUNCA pode ser menor que N + 1
  const effectiveMatchDay = Math.max(player.currentMatchDay || 1, (player.currentSeasonStats?.games || 0) + 1);
  const effectivePlayer: PlayerProfile = player.currentMatchDay !== effectiveMatchDay
    ? { ...player, currentMatchDay: effectiveMatchDay }
    : player;

  const isTransferWindowSeasonEnd = effectiveMatchDay > 38;

  // Calendário oficial: confronto da rodada (Liga ou Taças Estaduais/Nacionais/Continentais)
  const nextFixture = React.useMemo(() => getNextMatchFixture(effectivePlayer), [
    effectivePlayer.currentClub,
    effectivePlayer.currentMatchDay,
    effectivePlayer.seasonYear,
    effectivePlayer.id
  ]);

  // Tabela de Classificação ao vivo: mostra o Estadual durante as semanas 1 a 8 no Brasil e a Liga Nacional a partir da semana 9
  const isStateCupPhase = currentClubObj.country === 'Brasil' && effectiveMatchDay <= 8;
  const stateCupInfo = React.useMemo(
    () => (isStateCupPhase ? getStateCupStandings(effectivePlayer) : null),
    [isStateCupPhase, effectivePlayer.currentClub, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear]
  );

  const rawLeagueStandings = React.useMemo(() => getLeagueStandings(currentClubObj.leagueId || 'serie_b', effectivePlayer), [
    currentClubObj.leagueId,
    effectivePlayer.currentMatchDay,
    effectivePlayer.currentSeasonStats?.games,
    effectivePlayer.currentSeasonStats?.goals
  ]);

  const leagueStandings = isStateCupPhase && stateCupInfo ? stateCupInfo.standings : rawLeagueStandings;

  // Clubes oferecidos na janela de transferências com base na liga e OVR
  const availableOffers = getTransferOffersForPlayer(player.currentClub, player.ovr, player.age);

  // Totais reais e precisos da carreira (Histórico de temporadas anteriores + Temporada atual)
  const pastGames = player.history.reduce((acc, h) => acc + (h.games || 0), 0);
  const pastGoals = player.history.reduce((acc, h) => acc + (h.goals || 0), 0);
  const pastAssists = player.history.reduce((acc, h) => acc + (h.assists || 0), 0);

  const totalCareerGames = pastGames + (player.currentSeasonStats?.games || 0);
  const totalCareerGoals = pastGoals + (player.currentSeasonStats?.goals || 0);
  const totalCareerAssists = pastAssists + (player.currentSeasonStats?.assists || 0);

  // 4 Grandes Competições Oficiais da Temporada do Clube
  const activeCompetitions = React.useMemo(() => {
    return getActiveSeasonCompetitions(
      currentClubObj,
      effectivePlayer.currentMatchDay || 1,
      effectivePlayer.seasonYear || 2026,
      effectivePlayer.eliminatedCompetitions || [],
      effectivePlayer.seasonTitlesWon || []
    );
  }, [currentClubObj, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear, effectivePlayer.eliminatedCompetitions, effectivePlayer.seasonTitlesWon]);

  // Sala de Troféus consolidada
  const earnedTrophiesList = React.useMemo(() => {
    const fromHistory = player.history.flatMap(h => h.titlesWon || []);
    const fromSeason = player.seasonTitlesWon || [];
    return Array.from(new Set([...fromSeason, ...fromHistory]));
  }, [player.history, player.seasonTitlesWon]);

  const totalTrophies = (player.careerTotals?.trophies || 0) || earnedTrophiesList.length;

  // Hierarquia de elenco, concorrência interna e status de treino da rodada
  const hierarchy = React.useMemo(() => getSquadHierarchy(player), [
    player.currentClub,
    player.position,
    player.ovr,
    player.energy,
    player.relationships.coach,
    player.lifestylePersona
  ]);
  const isTrainingPending = !player.weeklyTrainingDone;
  const upcomingAgenda = React.useMemo(() => {
    const agenda = buildSeasonAgenda(effectivePlayer);
    return agenda.allRounds.filter(item => item.round >= effectiveMatchDay).slice(0, 4);
  }, [effectivePlayer.currentClub, effectivePlayer.currentMatchDay, effectivePlayer.seasonYear, effectiveMatchDay]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header Card com Visual Copero */}
      <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Lado Esquerdo: OVR Badge + Informações do Atleta */}
          <div className="flex items-center space-x-5">
            {/* OVR Box */}
            <div className="flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 shadow-lg shrink-0">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">OVR</span>
              <span className="text-3xl sm:text-4xl font-black text-white font-['Teko'] tracking-tight">
                {player.ovr}
              </span>
            </div>

            {/* Nome, Clube e Badges */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#1c2230] text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-slate-700/60 flex items-center gap-1">
                  <span>{player.flag}</span>
                  <span>#{player.number} {player.position}</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {player.name} <strong className="text-white">{player.surname}</strong>
                </span>
              </div>

              {/* Clube Atual com Escudo Oficial e Liga */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center space-x-2.5">
                  <ClubBadge club={currentClubObj} size="sm" />
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {player.currentClub}
                  </h1>
                </div>
                <span className="text-[11px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-md border border-slate-700">
                  {currentClubObj.league}
                </span>
              </div>

              {/* Status do Jogador / Atributos Rápidos */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400 pt-1">
                <div>
                  IDADE <span className="font-bold text-white ml-1">{player.age}</span>
                </div>
                <div>
                  VALOR <span className="font-bold text-emerald-400 ml-1">€{player.marketValueEur.toFixed(1)}M</span>
                </div>
                <div>
                  ENERGIA <span className="font-bold text-yellow-400 ml-1">{player.energy}%</span>
                </div>
                <div>
                  SALDO <span className="font-bold text-emerald-300 ml-1">{formatEurCurrency(player.bankBalanceEur || 0)}</span>
                </div>
                <div>
                  SALÁRIO <span className="font-bold text-sky-300 ml-1">{formatEurCurrency(player.contract?.monthlySalaryEur || 15000)}/mês</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas da Carreira (Jogos, Gols, Assistências) */}
          <div className="flex items-center justify-around w-full lg:w-auto gap-4 sm:gap-8 bg-[#181d28]/70 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center">
              <div className="text-[11px] font-bold text-slate-400 tracking-wider">JOGOS</div>
              <div className="text-2xl font-black text-white font-['Teko']">
                {totalCareerGames}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-[11px] font-bold text-slate-400 tracking-wider">GOLS</div>
              <div className="text-2xl font-black text-emerald-400 font-['Teko']">
                {totalCareerGoals}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center">
              <div className="text-[11px] font-bold text-slate-400 tracking-wider">AST</div>
              <div className="text-2xl font-black text-sky-400 font-['Teko']">
                {totalCareerAssists}
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Ações Rápidas */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenMemoryLedger}
              className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Dossiê ({player.memories?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewsFeed}
              className="px-3 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-700/50 text-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Newspaper className="w-3.5 h-3.5 text-blue-400" />
              <span>Imprensa</span>
            </button>

            <button
              type="button"
              onClick={onOpenLeagues}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ligas & Elencos</span>
            </button>

            <button
              type="button"
              onClick={onOpenTransferMarket}
              className="px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Mercado da Bola</span>
            </button>

            <button
              type="button"
              onClick={onOpenTraining}
              className="px-3 py-1.5 rounded-xl bg-teal-950/40 hover:bg-teal-900/60 border border-teal-600/60 text-teal-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Dumbbell className="w-3.5 h-3.5 text-teal-400" />
              <span>Treinos & Rotina</span>
            </button>

            {onOpenAgenda && (
              <button
                type="button"
                onClick={onOpenAgenda}
                className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-600/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Agenda</span>
              </button>
            )}

            {onOpenFinances && (
              <button
                type="button"
                onClick={onOpenFinances}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/60 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Finanças</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenTeammates}
              className="px-3 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-600/60 text-sky-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Vestiário & Afinidades</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onResetCareer && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Deseja iniciar uma nova carreira do zero? O atleta e o histórico atual serão reiniciados.')) {
                    onResetCareer();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="Reiniciar carreira com outro clube, idade ou país"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Nova Carreira</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSettings}
              className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Config / IA
            </button>
          </div>
        </div>
      </div>

      {/* Grid Principal: Modo Jogo a Jogo vs Tabela Histórica */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Lado Esquerdo (7 colunas): Próxima Partida OU Janela de Transferências */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SE ESTIVER NA JANELA DE TRANSFERÊNCIAS (FIM DE TEMPORADA) */}
          {isTransferWindowSeasonEnd ? (
            <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Janela de transferências</h2>
                  <p className="text-xs text-slate-400">
                    Chegaram ofertas depois do seu último trecho de temporada. Você pode aceitar uma ou ficar no clube.
                  </p>
                </div>
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {availableOffers.map(clubName => {
                  const offerClub = CLUBS[clubName];
                  if (!offerClub) return null;
                  const isCurrent = clubName === player.currentClub;
                  const offer = calculateContractOffer(offerClub, player, isCurrent);

                  return (
                    <div 
                      key={clubName}
                      className="bg-[#181d28] border border-slate-700/70 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-500 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {isCurrent ? 'Permanência' : 'Assinar com'}
                          </span>
                          <span className="text-[11px] font-black text-emerald-400 font-mono">
                            {formatEurCurrency(offer.monthlySalaryEur)}/mês
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: offerClub.colors.primary }}
                          />
                          <h3 className="font-bold text-white text-base">{offerClub.name}</h3>
                        </div>
                        <p className="text-[11px] text-slate-400">{offerClub.league} • {offer.years} anos • Luvas {formatEurCurrency(offer.signingBonusEur)}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectTransferClub && onSelectTransferClub(clubName)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                          isCurrent
                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-md'
                        }`}
                      >
                        {isCurrent ? `Ficar no ${offerClub.shortName}` : `Assinar com ${offerClub.shortName}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SE ESTIVER DURANTE A TEMPORADA: MODO JOGO A JOGO */
            <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
              
              {/* Alerta de Lesão & Departamento Médico */}
              {player.activeInjury && (
                <div className="bg-red-950/50 border border-red-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-red-950/40">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                      <HeartPulse className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500/30 text-red-300">
                          {player.activeInjury.level === 'grave' ? 'GRAU 3 • GRAVE' : player.activeInjury.level === 'moderada' ? 'GRAU 2 • MODERADA' : 'GRAU 1 • LEVE'}
                        </span>
                        <span className="text-xs font-bold text-red-400">
                          {player.activeInjury.roundsRemaining} {player.activeInjury.roundsRemaining === 1 ? 'rodada restante' : 'rodadas restantes'} no DM
                        </span>
                        {player.activeInjury.isPlayingOnSacrifice && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Atuando no Sacrifício
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-white mt-1">{player.activeInjury.name}</h4>
                      <p className="text-[11px] text-slate-300">{player.activeInjury.causeTitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenMedicalCenter}
                    className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-black font-black text-xs shrink-0 transition-colors w-full sm:w-auto text-center"
                  >
                    Ver Laudo & Tratamento no DM
                  </button>
                </div>
              )}

              {/* Alerta de Oportunidade / Desafio de Carreira */}
              {player.activeOpportunity && (
                <div className="bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-amber-950/40">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/30 text-amber-300">
                        {player.activeOpportunity.badge}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1">{player.activeOpportunity.title}</h4>
                      <p className="text-[11px] text-slate-300">{player.activeOpportunity.subtitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenOpportunity}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-xs shrink-0 transition-colors w-full sm:w-auto text-center"
                  >
                    Responder Desafio
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <TrophyVisual competitionName={nextFixture.competitionName} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        nextFixture.competitionType === 'state_cup' ? 'text-amber-400' :
                        nextFixture.competitionType === 'national_cup' ? 'text-orange-400' :
                        nextFixture.competitionType === 'continental_cup' ? 'text-sky-400' :
                        'text-emerald-400'
                      }`}>
                        {nextFixture.competitionName} • Temporada {player.seasonYear}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
                      <span>{nextFixture.stageName}</span>
                      {nextFixture.isCupKnockout && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-600/40">
                          Mata-Mata
                        </span>
                      )}
                    </h2>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-slate-400 block">Estádio Mandante</span>
                  <span className="text-xs font-bold text-slate-200">{currentClubObj.stadium}</span>
                </div>
              </div>

              {/* Card de Chamada para a Partida com Duelo contra o Adversário */}
              <div className={`relative overflow-hidden rounded-2xl p-5 shadow-lg border ${
                nextFixture.competitionType === 'state_cup' 
                  ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-800/50' :
                nextFixture.competitionType === 'national_cup' 
                  ? 'bg-gradient-to-r from-orange-950/60 to-slate-900 border-orange-800/50' :
                nextFixture.competitionType === 'continental_cup' 
                  ? 'bg-gradient-to-r from-sky-950/60 to-slate-900 border-sky-800/50' :
                  'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-emerald-800/50'
              }`}>
                <div className="relative z-10 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {nextFixture.isNationalTeamMatch ? (
                        <div className="flex items-center gap-1.5 text-amber-300 font-black">
                          <Globe className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span>CONVOCAÇÃO OFICIAL • SELEÇÃO NACIONAL</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-300">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>Próximo Duelo em Campo</span>
                        </div>
                      )}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      nextFixture.competitionType === 'world_cup'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-600/80 font-black'
                        : nextFixture.competitionType === 'copa_america'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80 font-black'
                        : nextFixture.competitionType === 'world_cup_qualifiers'
                        ? 'bg-blue-950/80 text-blue-300 border-blue-600/80 font-black'
                        : 'bg-black/40 text-slate-300 border-slate-700/60'
                    }`}>
                      {nextFixture.isNationalTeamMatch ? nextFixture.stageName : `Rodada ${effectiveMatchDay} de 38`}
                    </span>
                  </div>

                  {/* Confronto Visual: Seu Clube / Seleção vs Adversário */}
                  <div className={`flex items-center justify-around p-3.5 rounded-xl border ${
                    nextFixture.isNationalTeamMatch
                      ? 'bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-blue-950/60 border-blue-600/50 shadow-inner'
                      : 'bg-black/40 border-slate-700/40'
                  }`}>
                    <div className="flex items-center space-x-2.5">
                      {nextFixture.isNationalTeamMatch ? (
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-md">
                          <span>{player.flag}</span>
                        </div>
                      ) : (
                        <ClubBadge club={currentClubObj} size="md" />
                      )}
                      <div>
                        <span className="text-xs font-extrabold text-white block">
                          {nextFixture.isNationalTeamMatch ? (nextFixture.nationalTeamName || player.nationality) : currentClubObj.shortName}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {nextFixture.isNationalTeamMatch ? 'Sua Pátria' : 'Mandante'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center px-3">
                      <span className="text-sm font-black text-slate-400 font-['Teko'] tracking-wider">VS</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        nextFixture.competitionType === 'world_cup' ? 'text-amber-300' :
                        nextFixture.competitionType === 'copa_america' ? 'text-emerald-300' :
                        nextFixture.competitionType === 'world_cup_qualifiers' ? 'text-blue-300' :
                        'text-amber-300'
                      }`}>
                        {nextFixture.competitionShort}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-white block">{nextFixture.opponent.shortName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{nextFixture.opponent.league}</span>
                      </div>
                      {nextFixture.isNationalTeamMatch ? (
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-md">
                          <span>{nextFixture.nationalOpponentFlag || '🏳️'}</span>
                        </div>
                      ) : (
                        <ClubBadge club={nextFixture.opponent} size="md" />
                      )}
                    </div>
                  </div>

                  {/* Painel de Disputa de Posição & Hierarquia de Elenco */}
                  <div className="bg-black/50 p-3 rounded-xl border border-slate-700/60 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        Disputa na Posição {player.position}:
                      </span>
                      <span className="text-slate-400 font-mono text-[10px] flex flex-wrap items-center gap-1">
                        <span>Técnico: <strong className="text-white">{hierarchy.coachName}</strong></span>
                        {hierarchy.coachPersonality && (
                          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-sans text-[9px] font-bold border border-slate-700">
                            {hierarchy.coachPersonality.shortTag}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 bg-black/40 p-2 rounded-lg border border-slate-800 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-slate-300">Você: <strong className="text-white">{player.name} "{player.surname}"</strong></span>
                        <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/60 text-[10px]">{player.ovr} OVR</span>
                        <span className="text-[10px] text-slate-500">({player.age} anos)</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Titular: <strong className="text-slate-200">{hierarchy.topCompetitor?.name}</strong></span>
                        <span className="text-amber-300 font-bold bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-700/60 text-[10px]">{hierarchy.topCompetitor?.ovr} OVR</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 italic leading-snug">
                      "{player.trainingVerdict?.coachFeedback || hierarchy.coachVerdictQuote || hierarchy.statusExplanation}"
                    </p>
                  </div>

                  {/* Veredito ou Treino Pendente */}
                  {isTrainingPending ? (
                    <div className="space-y-2">
                      <div className="bg-amber-950/40 border border-amber-600/60 rounded-xl p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                            <Dumbbell className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-black text-amber-300 block">Treino Pré-Jogo Obrigatório</span>
                            <span className="text-[10px] text-slate-300">
                              {hierarchy.isGiantClub 
                                ? `Mostre serviço para ${hierarchy.coachName} para conquistar minutos no duelo!`
                                : `Defina sua postura com ${hierarchy.coachName} para a rodada.`}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Energia:</span>
                          <span className={`text-xs font-black ${player.energy >= 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                            {player.energy}%
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onOpenTraining}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 hover:scale-[1.01] active:scale-[0.98] transition-all"
                      >
                        <Dumbbell className="w-5 h-5 fill-black" />
                        <span>1º PASSO: DEFINIR FOCO DE TREINO DA SEMANA</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="bg-emerald-950/40 border border-emerald-600/60 rounded-xl p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="font-extrabold text-emerald-300">
                            {player.trainingVerdict?.earnedRoleLabel || hierarchy.naturalRoleLabel}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={onOpenTraining}
                          className="text-[10px] text-teal-400 hover:text-teal-300 font-bold underline"
                        >
                          Ajustar Treino / Descanso
                        </button>
                      </div>

                      {(player.suspensionRoundsRemaining || 0) > 0 ? (
                        <div className="space-y-2">
                          <div className="w-full py-3 px-4 rounded-2xl bg-amber-950/50 border border-amber-500/60 text-amber-200 text-xs flex items-center justify-between gap-2">
                            <span className="font-bold flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                              <span>{player.suspensionReason || 'Suspensão Automática por Cartões'}</span>
                            </span>
                            <span className="font-mono font-black text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                              {player.suspensionRoundsRemaining} Jogo Fora
                            </span>
                          </div>
                          {onSimulateInjuryRound && (
                            <button
                              type="button"
                              onClick={onSimulateInjuryRound}
                              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
                            >
                              <Clock className="w-4 h-4 fill-black/10" />
                              <span>Cumprir Suspensão na Arquibancada (Simular Rodada do Time)</span>
                            </button>
                          )}
                        </div>
                      ) : player.activeInjury && player.activeInjury.roundsRemaining > 0 && !player.activeInjury.isPlayingOnSacrifice ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={onOpenMedicalCenter}
                            className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 border-2 border-red-500/50 hover:bg-slate-700/80 text-red-300 font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg"
                          >
                            <HeartPulse className="w-5 h-5 text-red-400 animate-pulse" />
                            <span>VETADO PELO DM ({player.activeInjury.roundsRemaining} {player.activeInjury.roundsRemaining === 1 ? 'RODADA RESTANTE' : 'RODADAS RESTANTES'}) • ACESSAR DEPARTAMENTO MÉDICO</span>
                          </button>
                          {onSimulateInjuryRound && (
                            <button
                              type="button"
                              onClick={onSimulateInjuryRound}
                              className="w-full py-3 px-6 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:border-slate-500"
                            >
                              <Clock className="w-4 h-4 text-amber-400" />
                              <span>Acompanhar Partida da Tribuna (Cumprir 1 Semana de Tratamento no DM)</span>
                            </button>
                          )}
                        </div>
                      ) : player.activeInjury?.isPlayingOnSacrifice ? (
                        <button
                          type="button"
                          onClick={onPlayNextMatch}
                          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] active:scale-[0.98]"
                        >
                          <AlertTriangle className="w-5 h-5 fill-black" />
                          <span>JOGAR NO SACRIFÍCIO (SOB INFILTRAÇÃO ANALGÉSICA)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onPlayNextMatch}
                          className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.01] active:scale-[0.98] ${
                            nextFixture.isNationalTeamMatch
                              ? nextFixture.competitionType === 'world_cup'
                                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black shadow-[0_0_35px_rgba(245,158,11,0.5)]'
                                : nextFixture.competitionType === 'copa_america'
                                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-black shadow-[0_0_35px_rgba(16,185,129,0.5)]'
                                : 'bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600 text-white shadow-[0_0_35px_rgba(59,130,246,0.5)]'
                              : nextFixture.competitionType === 'state_cup'
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.35)]'
                              : nextFixture.competitionType === 'national_cup'
                              ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-black shadow-[0_0_25px_rgba(249,115,22,0.35)]'
                              : nextFixture.competitionType === 'continental_cup'
                              ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-black shadow-[0_0_25px_rgba(56,189,248,0.35)]'
                              : 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-[0_0_25px_rgba(34,197,94,0.35)]'
                          }`}
                        >
                          <Play className="w-5 h-5 fill-current" />
                          <span>
                            {nextFixture.isNationalTeamMatch
                              ? nextFixture.competitionType === 'world_cup'
                                ? 'DEFENDER A SELEÇÃO: A GRANDE FINAL DA COPA DO MUNDO!'
                                : nextFixture.competitionType === 'copa_america'
                                ? 'DEFENDER A SELEÇÃO: A GRANDE FINAL DA COPA AMÉRICA!'
                                : 'JOGAR PELA SELEÇÃO NACIONAL (DATA FIFA)'
                              : hierarchy.naturalRole === 'sub_60'
                              ? `JOGAR PARTIDA (ENTRA AOS 60' POR ORDEM DO TÉCNICO)`
                              : hierarchy.naturalRole === 'rest_full'
                              ? `ACOMPANHAR PARTIDA (POUPADO PELO TÉCNICO)`
                              : `JOGAR PARTIDA (${nextFixture.isCupKnockout ? 'DECISÃO' : 'TITULAR NO 11 INICIAL'})`}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Relações do Atleta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-[#181d28] p-2.5 rounded-xl border border-slate-800 text-center">
                  <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 block">TÉCNICO</span>
                  <span className="text-sm font-black text-white">{player.relationships.coach}%</span>
                </div>
                <div className="bg-[#181d28] p-2.5 rounded-xl border border-slate-800 text-center">
                  <Users className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 block">TORCIDA</span>
                  <span className="text-sm font-black text-white">{player.relationships.fans}%</span>
                </div>
                <div className="bg-[#181d28] p-2.5 rounded-xl border border-slate-800 text-center">
                  <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-slate-400 block">DIRETORIA</span>
                  <span className="text-sm font-black text-white">{player.relationships.board}%</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenTeammates}
                  className="bg-[#181d28] hover:bg-emerald-950/30 p-2.5 rounded-xl border border-slate-800 hover:border-emerald-700/60 text-center transition-colors group cursor-pointer"
                  title="Ver conexões e afinidades com cada companheiro do elenco"
                >
                  <Handshake className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-400 block">ELENCO</span>
                  <span className="text-sm font-black text-emerald-400">{player.relationships.teammates || 70}%</span>
                </button>
              </div>

              {/* Barra de Personalidade & Conduta Extracampo */}
              <button
                type="button"
                onClick={onOpenTeammates}
                className="w-full mt-3 p-3 rounded-2xl bg-[#141822] hover:bg-[#181d28] border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conduta Extracampo:</span>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {player.lifestylePersonaLabel || 'Profissional Obsessivo (Zero Festas)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5 font-medium">
                      <span>Respeito Veteranos: <strong className="text-amber-400 font-bold">{player.relationships.veteransRespect || 65}%</strong></span>
                      <span>•</span>
                      <span>Química Festeiros: <strong className="text-purple-400 font-bold">{player.relationships.partyCliqueChemistry || 60}%</strong></span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/50 flex items-center gap-1 shrink-0">
                  <span>Ajustar Conduta</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>

              {/* 📅 PRÓXIMOS COMPROMISSOS DA AGENDA */}
              {upcomingAgenda.length > 0 && (
                <div className="mt-3 p-3.5 rounded-2xl bg-[#141822] border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span>Próximos Jogos na Agenda</span>
                    </span>
                    {onOpenAgenda && (
                      <button
                        type="button"
                        onClick={onOpenAgenda}
                        className="text-[10px] font-bold text-purple-300 hover:text-purple-200 flex items-center gap-0.5"
                      >
                        <span>Ver Agenda Completa</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
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
                          <span className="text-[11px] font-bold text-white truncate">{item.fixture.opponent.shortName}</span>
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
          )}
        </div>

        {/* Lado Direito (5 colunas): Tabela de Histórico da Carreira */}
        <div className="lg:col-span-5">
          <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Trajetória da Carreira</h2>
              <span className="text-[11px] font-semibold text-slate-400">{player.history.length + 1} temporadas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">Idade</th>
                    <th className="pb-2.5">Clube</th>
                    <th className="pb-2.5 text-center">OVR</th>
                    <th className="pb-2.5 text-center">Jogos</th>
                    <th className="pb-2.5 text-center">Gols</th>
                    <th className="pb-2.5 text-center">Ast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {player.history.map((record, index) => (
                    <tr key={index} className="text-slate-300 hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-bold text-white">{record.age}</td>
                      <td className="py-2.5">{record.club}</td>
                      <td className="py-2.5 text-center font-bold text-emerald-400">{record.ovr}</td>
                      <td className="py-2.5 text-center">{record.games}</td>
                      <td className="py-2.5 text-center">{record.goals}</td>
                      <td className="py-2.5 text-center">{record.assists}</td>
                    </tr>
                  ))}

                  <tr className="bg-emerald-950/20 text-emerald-300 font-bold border-l-2 border-emerald-500">
                    <td className="py-2.5 pl-2 text-white">{player.age}</td>
                    <td className="py-2.5 flex items-center gap-1.5">
                      <ClubBadge club={currentClubObj} size="xs" />
                      <span>{player.currentClub}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">Atual</span>
                    </td>
                    <td className="py-2.5 text-center text-emerald-400">{player.ovr}</td>
                    <td className="py-2.5 text-center">{player.currentSeasonStats.games}</td>
                    <td className="py-2.5 text-center">{player.currentSeasonStats.goals}</td>
                    <td className="py-2.5 text-center">{player.currentSeasonStats.assists}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Vitrine de Títulos
              </span>
              {player.history.some(h => h.titlesWon && h.titlesWon.length > 0) ? (
                <div className="space-y-1.5">
                  {player.history.flatMap(h => h.titlesWon).map((title, idx) => (
                    <div key={idx} className="bg-[#181d28] rounded-xl p-2 text-center text-xs text-amber-300 font-bold border border-amber-800/40 flex items-center justify-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#181d28] rounded-xl p-3 text-center text-xs text-slate-500 border border-slate-800 flex items-center justify-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Em busca da primeira taça da carreira</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 🏆 COMPETIÇÕES OFICIAIS DA TEMPORADA & SALA DE TROFÉUS (RESPOSTA DIRETA AO USUÁRIO) */}
      <div className="bg-[#12151c] border border-amber-900/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        
        {/* Header da Sala de Troféus & Competições */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Competições Oficiais da Temporada & Sala de Troféus</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60 font-mono">
                  {effectivePlayer.seasonYear}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                As 4 frentes de batalha disputadas pelo {currentClubObj.name} e a galeria de troféus da sua carreira
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#181d28] px-3.5 py-1.5 rounded-xl border border-amber-800/40 text-xs font-bold">
            <Medal className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Sala de Troféus:</span>
            <span className="text-amber-400 font-mono font-black">{totalTrophies} {totalTrophies === 1 ? 'Taça' : 'Taças'}</span>
          </div>
        </div>

        {/* Grid das 4 Competições Ativas da Temporada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {activeCompetitions.map((comp) => {
            const isState = comp.category === 'state';
            const isLeague = comp.category === 'league';
            const isCup = comp.category === 'national_cup';
            const isCont = comp.category === 'continental';

            return (
              <div 
                key={comp.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  comp.isActiveNow 
                    ? 'bg-gradient-to-b from-[#191f2c] to-[#12151c] border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.08)]' 
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

                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                      comp.isActiveNow 
                        ? 'bg-amber-950/80 text-amber-300 border-amber-700/60' 
                        : comp.isCompleted 
                        ? 'bg-slate-800 text-slate-400 border-slate-700' 
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}>
                      {comp.isActiveNow ? 'Em Disputa' : comp.isCompleted ? 'Finalizado' : 'Aguardando'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-white leading-tight">
                      {comp.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Fase: <strong className="text-slate-200">{comp.currentStage}</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 text-[10px] font-semibold flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400/80" />
                    <span>Em jogo:</span>
                  </span>
                  <span className="font-bold text-amber-300 truncate text-[10px] max-w-[130px]" title={comp.trophyTitle}>
                    {comp.trophyTitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vitrine de Troféus Conquistados pelo Atleta */}
        <div className="bg-[#10131a] border border-slate-800/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Medal className="w-4 h-4 text-amber-400" />
              Galeria de Taças Conquistadas na Carreira
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {totalTrophies > 0 ? `${totalTrophies} títulos oficiais` : 'Nenhum título conquistado ainda'}
            </span>
          </div>

          {earnedTrophiesList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {earnedTrophiesList.map((title, idx) => (
                <div 
                  key={idx}
                  className="bg-[#181d28] border border-amber-800/40 rounded-xl p-3 flex items-center gap-2.5 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-black text-amber-300 block truncate">{title}</span>
                    <span className="text-[10px] text-slate-400">Campeão Oficial</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#181d28]/70 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Em busca do primeiro grito de campeão da carreira!
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {effectivePlayer.currentMatchDay <= 8 
                      ? `O Campeonato Estadual entra em fase de mata-mata na Rodada 6 e a Grande Final acontece na Rodada 8!`
                      : `Foco total no Brasileirão, na Copa do Brasil e na Glória Eterna Continental!`}
                  </p>
                </div>
              </div>

              {effectivePlayer.currentMatchDay <= 8 && (
                <div className="shrink-0 bg-amber-950/40 border border-amber-800/60 px-3 py-1.5 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-bold text-amber-400 block">Faltam apenas</span>
                  <span className="text-xs font-black text-white font-mono">
                    {Math.max(1, 8 - effectivePlayer.currentMatchDay)} {Math.max(1, 8 - effectivePlayer.currentMatchDay) === 1 ? 'partida' : 'partidas'}
                  </span>
                  <span className="text-[9px] text-amber-300 block">para a Final da Taça</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ⭐ PRÊMIOS INDIVIDUAIS (MOTM / JOGADOR DO MÊS / PREMIAÇÕES ANUAIS) */}
        <div className="bg-[#10131a] border border-slate-800/90 rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Prêmios Individuais (MOTM, POTM & Bolas de Ouro)
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

          {((player.awards?.potmHistory?.length || 0) > 0 || (player.awards?.seasonAwards?.length || 0) > 0) ? (
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
          ) : (
            <p className="text-[11px] text-slate-400">
              Conquiste prêmios de <strong>Jogador da Partida (MOTM)</strong> nos jogos e mantenha regularidade a cada bloco de 4 rodadas para vencer o <strong>Jogador do Mês (POTM)</strong>!
            </p>
          )}
        </div>

      </div>

      {/* Atributos Detalhados Football Manager - Seção de Largura Total (Sem vazios pretos e fluidez máxima) */}
      <FMAttributePanel attributes={player.attributes} position={player.position} />

      {/* Seção Completa: Ranking da Liga (Tabela de Classificação Ao Vivo) */}
      <div className="bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>
                  {isStateCupPhase && stateCupInfo
                    ? `Classificação do Estadual • ${stateCupInfo.cupName}`
                    : `Ranking da Liga • ${currentClubObj.league}`}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isStateCupPhase
                  ? `Fase Classificatória & Mata-Mata Estadual (${currentClubObj.league} inicia na Semana 9)`
                  : `Classificação oficial sincronizada • Temporada ${player.seasonYear}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLeagues}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/60 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>Ver Todas as 19 Ligas & Elencos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabela de Classificação */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3 pl-2 w-10">Pos</th>
                <th className="pb-3">Clube</th>
                <th className="pb-3 text-center w-12 font-black text-white">PTS</th>
                <th className="pb-3 text-center w-10">J</th>
                <th className="pb-3 text-center w-10">V</th>
                <th className="pb-3 text-center w-10">E</th>
                <th className="pb-3 text-center w-10">D</th>
                <th className="pb-3 text-center w-10">SG</th>
                <th className="pb-3 text-center w-28">Últimos Jogos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {leagueStandings.map((st) => {
                const isUserClub = st.clubName === player.currentClub;
                const clubObj = CLUBS[st.clubName] || {
                  name: st.clubName,
                  shortName: st.shortName,
                  colors: { primary: '#64748b', text: '#ffffff' }
                };

                const isG4 = st.position <= 4;
                const isZ4 = st.position >= leagueStandings.length - 3;

                return (
                  <tr
                    key={st.clubId}
                    className={`transition-colors ${
                      isUserClub
                        ? 'bg-emerald-950/40 text-white font-bold border-l-4 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                        : 'text-slate-300 hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-2.5 pl-2 font-black">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                        isUserClub ? 'bg-emerald-500 text-black font-black' :
                        isG4 ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60 font-bold' :
                        isZ4 ? 'bg-rose-950 text-rose-400 border border-rose-800/60 font-bold' :
                        'text-slate-400'
                      }`}>
                        {st.position}º
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center space-x-2.5">
                        <ClubBadge club={clubObj as any} size="xs" />
                        <span className={`truncate ${isUserClub ? 'text-emerald-300 font-extrabold text-sm' : 'text-slate-200'}`}>
                          {st.clubName}
                        </span>
                        {isUserClub && (
                          <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black tracking-wide">
                            VOCÊ
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 text-center font-black text-sm font-['Teko'] text-emerald-400">
                      {st.points}
                    </td>
                    <td className="py-2.5 text-center text-slate-300">{st.played}</td>
                    <td className="py-2.5 text-center text-slate-300">{st.won}</td>
                    <td className="py-2.5 text-center text-slate-300">{st.drawn}</td>
                    <td className="py-2.5 text-center text-slate-300">{st.lost}</td>
                    <td className={`py-2.5 text-center font-bold ${
                      st.goalDifference > 0 ? 'text-emerald-400' :
                      st.goalDifference < 0 ? 'text-rose-400' :
                      'text-slate-400'
                    }`}>
                      {st.goalDifference > 0 ? `+${st.goalDifference}` : st.goalDifference}
                    </td>
                    <td className="py-2.5 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {(st.form || []).map((f, fIdx) => (
                          <span
                            key={fIdx}
                            className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                              f === 'V' ? 'bg-emerald-500 text-black' :
                              f === 'E' ? 'bg-slate-600 text-white' :
                              'bg-rose-500 text-white'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legenda do Regulamento */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>G4: Zona de Acesso / Libertadores</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Z4: Zona de Rebaixamento</span>
            </div>
          </div>
          <span className="text-slate-500">Critérios oficiais: PTS &gt; V &gt; SG &gt; GP</span>
        </div>
      </div>
    </div>
  );
};
