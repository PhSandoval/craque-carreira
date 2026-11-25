import React, { useState } from 'react';
import { Club, League, RealPlayer, PlayerProfile } from '../types';
import { CLUBS, findClub } from '../data/clubs';
import { LEAGUES } from '../data/leagues';
import { getLeagueStandings, getActiveSeasonCompetitions } from '../services/tournamentService';
import { getActiveLeagueIds, setActiveLeagueIds, getRoundMatchResults, normalizeLeagueId, MatchScoreResult, getClubsForLeague, getStateCupStandings, getLeagueTopScorersAndAssists } from '../services/syncLeagueSimulationService';
import { ClubBadge } from './ClubBadge';
import { TrophyVisual } from './TrophyVisual';
import { Shield, Users, Trophy, Star, X, MapPin, DollarSign, Filter, ChevronRight, ChevronLeft, Calendar, Activity, Check, Crown, Flame, Settings, AlertCircle } from 'lucide-react';

interface LeaguesAndSquadsModalProps {
  player: PlayerProfile;
  onClose: () => void;
  onSelectClubToScout?: (club: Club) => void;
  embedded?: boolean;
}

export const LeaguesAndSquadsModal: React.FC<LeaguesAndSquadsModalProps> = ({
  player,
  onClose,
  embedded = false
}) => {
  const currentClubObj = findClub(player.currentClub);
  const currentLeagueId = currentClubObj?.leagueId || 'serie_a';

  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(
    currentLeagueId
  );
  const [selectedClubName, setSelectedClubName] = useState<string>(player.currentClub);
  const [tierFilter, setTierFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [activeTab, setActiveTab] = useState<'standings' | 'matches' | 'stats' | 'squads' | 'cups'>('standings');
  const [showFmManager, setShowFmManager] = useState<boolean>(false);

  const effectiveMatchDay = Math.max(player.currentMatchDay || 1, (player.currentSeasonStats?.games || 0) + 1);
  const effectivePlayer: PlayerProfile = player.currentMatchDay !== effectiveMatchDay
    ? { ...player, currentMatchDay: effectiveMatchDay }
    : player;

  const [selectedRound, setSelectedRound] = useState<number>(Math.max(1, effectiveMatchDay - 1));

  const [activeLeagueIds, setActiveLeagueIdsState] = useState<string[]>(() => getActiveLeagueIds(currentLeagueId));
  const [selectedFmLeagues, setSelectedFmLeagues] = useState<string[]>(() => getActiveLeagueIds(currentLeagueId));
  const [fmError, setFmError] = useState<string | null>(null);

  const leagueList = Object.values(LEAGUES).filter(l => 
    tierFilter === 'all' ? true : l.tier === tierFilter
  );
  const clubsInLeague = getClubsForLeague(selectedLeagueId);
  const stateCupData = currentClubObj.country === 'Brasil' ? getStateCupStandings(effectivePlayer) : null;
  const activeClub = CLUBS[selectedClubName] || clubsInLeague[0] || Object.values(CLUBS)[0];
  const selectedLeague = LEAGUES[selectedLeagueId];

  // Gera a classificação oficial ao vivo e estatísticas de artilharia/assistências
  const standings = getLeagueStandings(selectedLeagueId, effectivePlayer);
  const roundMatches = getRoundMatchResults(selectedLeagueId, selectedRound);
  const { topScorers, topAssisters } = getLeagueTopScorersAndAssists(selectedLeagueId, effectivePlayer);

  const cardContent = (
    <div
      className={
        embedded
          ? 'relative w-full bg-[#12151c] border border-slate-800/80 rounded-3xl shadow-xl overflow-hidden flex flex-col'
          : 'relative w-full max-w-4xl bg-[#12151c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]'
      }
    >
        
        {/* Header */}
        <div className="bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Central de Ligas & Elencos Oficiais</span>
              </h2>
              <p className="text-xs text-slate-400">
                19 divisões oficiais pelo mundo + Artilharia, Assistências, Taças & Elencos completos.
              </p>
            </div>
          </div>

          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filtro de Divisão (Todos / 1ª Divisão / 2ª Divisão) */}
        <div className="bg-[#11141c] px-4 py-2 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-400">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Divisão:</span>
          </div>

          <div className="flex items-center gap-1 bg-[#181d28] p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setTierFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                tierFilter === 'all' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas (19 Ligas)
            </button>
            <button
              type="button"
              onClick={() => setTierFilter(1)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                tierFilter === 1 ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              1ª Divisão (Elite)
            </button>
            <button
              type="button"
              onClick={() => setTierFilter(2)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                tierFilter === 2 ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              2ª Divisão (Acesso)
            </button>
            <button
              type="button"
              onClick={() => setTierFilter(3)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                tierFilter === 3 ? 'bg-orange-400 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              3ª Divisão (Série C)
            </button>
          </div>
        </div>

        {/* Seletor de Ligas */}
        <div className="bg-[#151922] px-4 py-2.5 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {leagueList.map(league => {
            const isSelected = selectedLeagueId === league.id;
            const isLiveActive = activeLeagueIds.includes(league.id);

            return (
              <button
                key={league.id}
                type="button"
                onClick={() => {
                  setSelectedLeagueId(league.id);
                  const firstInLeague = Object.values(CLUBS).find(c => c.leagueId === league.id);
                  if (firstInLeague) setSelectedClubName(firstInLeague.name);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'bg-[#1e2430] text-slate-300 hover:bg-[#252d3d] border border-slate-700/50'
                }`}
              >
                <span>{league.countryFlag}</span>
                <span>{league.name}</span>
                <span className={`text-[9px] px-1 rounded font-black ${league.tier === 1 ? 'bg-emerald-950/90 text-emerald-300' : 'bg-amber-950/90 text-amber-300'}`}>
                  {league.tier}ª Div
                </span>
                {isLiveActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Simulação Viva Ativa" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-Tabs: Tabela de Classificação vs Jogos da Rodada vs Elencos vs Taças & Copas */}
        <div className="bg-[#12151c] px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('standings')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'standings'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-[#181d28] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Classificação</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'matches'
                  ? 'bg-sky-400 text-black shadow-md'
                  : 'bg-[#181d28] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jogos da Rodada</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'stats'
                  ? 'bg-purple-400 text-black shadow-md'
                  : 'bg-[#181d28] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Artilharia & Assist.</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cups')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'cups'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                  : 'bg-[#181d28] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Taças & Copas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('squads')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'squads'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'bg-[#181d28] text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Elencos & Clubes ({clubsInLeague.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedFmLeagues([...activeLeagueIds]);
                setFmError(null);
                setShowFmManager(true);
              }}
              className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-1.5 transition-all shadow"
            >
              <Settings className="w-3 h-3 text-emerald-400" />
              <span>Ligas FM ({activeLeagueIds.length}/10 ativas)</span>
            </button>
          </div>
        </div>

        {/* Conteúdo Dinâmico com Base na Aba Selecionada */}
        {activeTab === 'standings' ? (
          /* ABA 1: TABELA DE CLASSIFICAÇÃO / RANKING DA LIGA */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-[#10131a]">
            <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{selectedLeague?.countryFlag}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">{selectedLeague?.name}</h3>
                    <p className="text-xs text-slate-400">Classificação Oficial ao Vivo • Temporada {player.seasonYear}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                  {selectedLeague?.tier}ª Divisão ({selectedLeague?.country})
                </span>
              </div>

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
                      <th className="pb-3 text-center w-10">GP</th>
                      <th className="pb-3 text-center w-10">GC</th>
                      <th className="pb-3 text-center w-10">SG</th>
                      <th className="pb-3 text-center w-28">Últimos Jogos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {standings.map((st) => {
                      const isUserClub = st.clubName === player.currentClub;
                      const clubObj = CLUBS[st.clubName] || {
                        name: st.clubName,
                        shortName: st.shortName,
                        colors: { primary: '#64748b', text: '#ffffff' }
                      };

                      const isG4 = st.position <= 4;
                      const isZ4 = st.position >= standings.length - 3;

                      return (
                        <tr
                          key={st.clubId}
                          className={`transition-colors ${
                            isUserClub
                              ? 'bg-emerald-950/40 text-white font-bold border-l-4 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
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
                          <td className="py-2.5 text-center text-slate-300">{st.goalsFor}</td>
                          <td className="py-2.5 text-center text-slate-300">{st.goalsAgainst}</td>
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
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>G4: Acesso à 1ª Divisão / Vaga em Copas Continentais</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Z4: Zona de Rebaixamento</span>
                  </div>
                </div>
                <span className="text-slate-500">Critérios: PTS &gt; V &gt; SG &gt; GP</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'matches' ? (
          /* ABA 2: JOGOS E RESULTADOS DA RODADA */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-[#10131a]">
            <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{selectedLeague?.countryFlag}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">{selectedLeague?.name}</h3>
                    <p className="text-xs text-slate-400">Resultados Oficiais dos Confrontos da Liga</p>
                  </div>
                </div>

                {/* Seletor de Rodada */}
                <div className="flex items-center gap-2 bg-[#12151c] p-1.5 rounded-xl border border-slate-700/80 self-start sm:self-auto">
                  <button
                    type="button"
                    disabled={selectedRound <= 1}
                    onClick={() => setSelectedRound(r => Math.max(1, r - 1))}
                    className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-black text-amber-400 font-mono px-2">
                    Rodada {selectedRound} de 38
                  </span>
                  <button
                    type="button"
                    disabled={selectedRound >= Math.max(1, effectiveMatchDay - 1)}
                    onClick={() => setSelectedRound(r => r + 1)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de Partidas da Rodada */}
              {roundMatches.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">
                    A Rodada {selectedRound} ainda não foi disputada. Dispute a próxima partida da sua carreira para avançar o calendário!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {roundMatches.map((match, idx) => {
                    const homeClub = CLUBS[match.homeClubId] || { name: match.homeClubName, shortName: match.homeClubName };
                    const awayClub = CLUBS[match.awayClubId] || { name: match.awayClubName, shortName: match.awayClubName };
                    const isPlayerInvolved = match.homeClubName === player.currentClub || match.awayClubName === player.currentClub;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                          isPlayerInvolved
                            ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/50'
                            : 'bg-[#12151c] border-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          {/* Mandante */}
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <ClubBadge club={homeClub as any} size="xs" />
                            <span className={`text-xs truncate font-bold ${
                              match.homeScore > match.awayScore ? 'text-white' : 'text-slate-400'
                            }`}>
                              {homeClub.shortName || homeClub.name}
                            </span>
                          </div>

                          {/* Placar */}
                          <div className="flex items-center justify-center space-x-2 px-3 shrink-0">
                            <span className={`text-sm font-black font-['Teko'] px-2 py-0.5 rounded-lg border ${
                              match.homeScore > match.awayScore
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80'
                                : 'bg-black/40 text-slate-300 border-slate-800'
                            }`}>
                              {match.homeScore}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">x</span>
                            <span className={`text-sm font-black font-['Teko'] px-2 py-0.5 rounded-lg border ${
                              match.awayScore > match.homeScore
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80'
                                : 'bg-black/40 text-slate-300 border-slate-800'
                            }`}>
                              {match.awayScore}
                            </span>
                          </div>

                          {/* Visitante */}
                          <div className="flex items-center justify-end space-x-2 flex-1 min-w-0 text-right">
                            <span className={`text-xs truncate font-bold ${
                              match.awayScore > match.homeScore ? 'text-white' : 'text-slate-400'
                            }`}>
                              {awayClub.shortName || awayClub.name}
                            </span>
                            <ClubBadge club={awayClub as any} size="xs" />
                          </div>
                        </div>

                        {/* Autores dos Gols da Partida (Exibição Sofascore) */}
                        {((match.homeScorers && match.homeScorers.length > 0) || (match.awayScorers && match.awayScorers.length > 0)) && (
                          <div className="w-full mt-2.5 pt-2 border-t border-slate-800/80 flex items-start justify-between text-[10px] text-slate-400 font-mono">
                            {/* Marcadores Mandante */}
                            <div className="flex-1 text-left space-y-0.5 pr-1">
                              {match.homeScorers && match.homeScorers.length > 0 ? (
                                match.homeScorers.map((s, sIdx) => (
                                  <div key={sIdx} className="truncate text-slate-300 flex items-center gap-1">
                                    <span className="text-[9px]">⚽</span>
                                    <span className="font-semibold truncate">{s.name}</span>
                                    <span className="text-emerald-400 font-bold">{s.minute}'{s.isPenalty ? '(P)' : ''}</span>
                                  </div>
                                ))
                              ) : null}
                            </div>

                            {/* Marcadores Visitante */}
                            <div className="flex-1 text-right space-y-0.5 pl-1">
                              {match.awayScorers && match.awayScorers.length > 0 ? (
                                match.awayScorers.map((s, sIdx) => (
                                  <div key={sIdx} className="truncate text-slate-300 flex items-center justify-end gap-1">
                                    <span className="text-rose-400 font-bold">{s.minute}'{s.isPenalty ? '(P)' : ''}</span>
                                    <span className="font-semibold truncate">{s.name}</span>
                                    <span className="text-[9px]">⚽</span>
                                  </div>
                                ))
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'stats' ? (
          /* ABA EXTRA: ARTILHARIA E LÍDERES EM ASSISTÊNCIAS DA LIGA */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar bg-[#10131a]">
            <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{selectedLeague?.countryFlag}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">Artilharia & Garçons • {selectedLeague?.name}</h3>
                    <p className="text-xs text-slate-400">Gols e assistências acumulados em todas as rodadas simuladas da temporada</p>
                  </div>
                </div>
              </div>

              {topScorers.length === 0 && topAssisters.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 bg-[#12151c] rounded-2xl border border-slate-800 p-6">
                  Dispute a primeira rodada da liga para gerar os rankings oficiais de artilheiros e líderes em assistências!
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Artilheiros */}
                  <div className="bg-[#12151c] border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <span>⚽ Artilheiros da Liga</span>
                    </h4>
                    <div className="space-y-1.5">
                      {topScorers.map((row, idx) => {
                        const cObj = CLUBS[row.clubName] || CLUBS[row.clubId] || { name: row.clubName, shortName: row.shortName, colors: { primary: '#64748b', text: '#fff' } };
                        return (
                          <div
                            key={`sc_${idx}_${row.playerName}`}
                            className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                              row.isUser
                                ? 'bg-emerald-950/50 border-emerald-500/60 text-white font-bold'
                                : 'bg-[#181d28]/70 border-slate-800/80 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${
                                idx === 0 ? 'bg-amber-400 text-black' : idx < 3 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {idx + 1}
                              </span>
                              <ClubBadge club={cObj as any} size="xs" />
                              <div className="min-w-0">
                                <span className="truncate block font-bold">{row.playerName}</span>
                                <span className="text-[10px] text-slate-400 truncate block">{row.shortName}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 pl-2">
                              <span className="text-sm font-black font-mono text-emerald-400">{row.goals}</span>
                              <span className="text-[10px] text-slate-400 ml-1">gols</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Assistências */}
                  <div className="bg-[#12151c] border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                      <span>🎯 Líderes em Assistências</span>
                    </h4>
                    <div className="space-y-1.5">
                      {topAssisters.map((row, idx) => {
                        const cObj = CLUBS[row.clubName] || CLUBS[row.clubId] || { name: row.clubName, shortName: row.shortName, colors: { primary: '#64748b', text: '#fff' } };
                        return (
                          <div
                            key={`as_${idx}_${row.playerName}`}
                            className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                              row.isUser
                                ? 'bg-sky-950/50 border-sky-500/60 text-white font-bold'
                                : 'bg-[#181d28]/70 border-slate-800/80 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-5 h-5 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${
                                idx === 0 ? 'bg-amber-400 text-black' : idx < 3 ? 'bg-sky-500/20 text-sky-300 border border-sky-700' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {idx + 1}
                              </span>
                              <ClubBadge club={cObj as any} size="xs" />
                              <div className="min-w-0">
                                <span className="truncate block font-bold">{row.playerName}</span>
                                <span className="text-[10px] text-slate-400 truncate block">{row.shortName}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0 pl-2">
                              <span className="text-sm font-black font-mono text-sky-400">{row.assists}</span>
                              <span className="text-[10px] text-slate-400 ml-1">ast</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'cups' ? (
          /* ABA 3: TAÇAS, ESTADUAIS & COPAS (PAULISTÃO, COPA DO BRASIL, LIBERTADORES, CHAMPIONS, SELEÇÕES) */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar bg-[#10131a]">
            {/* Header da Galeria de Torneios */}
            <div className="bg-gradient-to-r from-amber-950/40 via-[#181d28] to-slate-900 border border-amber-600/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>Central de Taças & Copas da Temporada {effectivePlayer.seasonYear || 2026}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Todas as 4 competições oficiais disputadas pelo {currentClubObj.name} e pela Seleção Nacional.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-300">
                  {effectivePlayer.currentMatchDay <= 8 ? 'Fase Inicial (Estaduais)' : 'Reta Nacional & Mata-Mata'}
                </span>
              </div>
            </div>

            {/* Grid das 4 Grandes Competições da Temporada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getActiveSeasonCompetitions(
                currentClubObj,
                effectivePlayer.currentMatchDay || 1,
                effectivePlayer.seasonYear || 2026,
                effectivePlayer.eliminatedCompetitions || [],
                effectivePlayer.seasonTitlesWon || []
              ).map(comp => (
                <div
                  key={comp.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    comp.isActiveNow
                      ? 'bg-[#151a26] border-emerald-500/60 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                      : comp.isCompleted
                      ? 'bg-[#10141e] border-slate-800 opacity-80'
                      : 'bg-[#121620] border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <TrophyVisual competitionName={comp.name} size="sm" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {comp.category === 'state' ? 'Campeonato Estadual' : comp.category === 'national_cup' ? 'Copa Nacional (Mata-Mata)' : comp.category === 'continental' ? 'Glória Continental' : 'Liga Nacional'}
                        </span>
                        <h4 className="text-sm font-black text-white">{comp.name}</h4>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                      comp.isActiveNow
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700/80 animate-pulse'
                        : comp.isCompleted
                        ? 'bg-slate-900 text-slate-400 border-slate-700'
                        : 'bg-amber-950/70 text-amber-300 border-amber-800/60'
                    }`}>
                      {comp.isActiveNow ? 'EM DISPUTA' : comp.isCompleted ? 'ENCERRADA' : 'EM BREVE'}
                    </span>
                  </div>

                  {/* Informações de Fase e Chaveamento */}
                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Fase Atual:</span>
                      <span className="font-bold text-amber-300">{comp.currentStage}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Calendário Oficial:</span>
                      <span className="font-mono text-slate-300">{comp.roundsRange}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-semibold">Troféu em Jogo:</span>
                      <span className="font-bold text-emerald-400 truncate max-w-[170px]" title={comp.trophyTitle}>
                        {comp.trophyTitle}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 italic">
                    {comp.statusText}
                  </div>
                </div>
              ))}
            </div>

            {/* Destaque Especial: Tabela Viva e Sincronizada do Campeonato Estadual Real do Clube */}
            {currentClubObj.country === 'Brasil' && stateCupData && (
              <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-black text-white">
                      {stateCupData.cupName} ({effectivePlayer.seasonYear || 2026}) • Fase Classificatória
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    {effectivePlayer.currentMatchDay <= 5
                      ? `Rodada ${Math.max(1, effectivePlayer.currentMatchDay)} de 5 (Grupos)`
                      : effectivePlayer.currentMatchDay <= 8
                      ? 'Mata-Mata em Disputa (Rodadas 6 a 8)'
                      : 'Classificação Final da 1ª Fase'}
                  </span>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#12151c] text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3 text-center w-10">POS</th>
                        <th className="py-2 px-3">CLUBE DO {stateCupData.shortName.toUpperCase()}</th>
                        <th className="py-2 px-3 text-center">J</th>
                        <th className="py-2 px-3 text-center">V</th>
                        <th className="py-2 px-3 text-center">E</th>
                        <th className="py-2 px-3 text-center">D</th>
                        <th className="py-2 px-3 text-center">SG</th>
                        <th className="py-2 px-3 text-center text-amber-400 font-bold">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {stateCupData.standings.map(row => {
                        const isUserClub = player.currentClub.toLowerCase() === row.clubName.toLowerCase() || row.clubId === currentClubObj.id;
                        const clubObj = CLUBS[row.clubName] || CLUBS[row.clubId] || { name: row.clubName, shortName: row.shortName };

                        return (
                          <tr
                            key={row.clubId}
                            className={`transition-colors ${
                              isUserClub 
                                ? 'bg-emerald-950/50 font-bold text-white' 
                                : 'hover:bg-slate-800/40 text-slate-300'
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center">
                              <span className={`inline-block w-5 h-5 rounded-full text-[10px] leading-5 font-black ${
                                row.position <= 4 ? 'bg-emerald-500 text-black' : 'text-slate-500'
                              }`}>
                                {row.position}º
                              </span>
                            </td>
                            <td className="py-2.5 px-3 flex items-center space-x-2">
                              <ClubBadge club={clubObj as any} size="xs" />
                              <span className="truncate">{row.clubName}</span>
                              {isUserClub && (
                                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-1 rounded">
                                  VOCÊ
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">{row.played}</td>
                            <td className="py-2.5 px-3 text-center">{row.won}</td>
                            <td className="py-2.5 px-3 text-center">{row.drawn}</td>
                            <td className="py-2.5 px-3 text-center">{row.lost}</td>
                            <td className="py-2.5 px-3 text-center">{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                            <td className="py-2.5 px-3 text-center font-black text-amber-400">{row.points}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="text-[10px] text-slate-400 italic pt-1">
                  Regulamento: Os 4 primeiros colocados da fase de grupos avançam para Quartas, Semifinal e Grande Final do {stateCupData.cupName}!
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ABA 4: ELENCOS & CLUBES DA LIGA */
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Coluna de Clubes da Liga (4 colunas) */}
          <div className="md:col-span-4 bg-[#141822] border-r border-slate-800 p-3 overflow-y-auto max-h-[35vh] md:max-h-none space-y-1.5 custom-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
              Clubes ({clubsInLeague.length})
            </span>

            {clubsInLeague.map(club => {
              const isSelected = selectedClubName === club.name;
              const isPlayerClub = player.currentClub === club.name;

              return (
                <button
                  key={club.id}
                  type="button"
                  onClick={() => setSelectedClubName(club.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-950/80 border border-emerald-500/80 text-white shadow'
                      : 'bg-[#181d28]/70 hover:bg-[#202736] text-slate-300 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <ClubBadge club={club} size="sm" />
                    <span className="truncate font-bold">{club.name}</span>
                  </div>

                  {isPlayerClub && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold shrink-0">
                      Seu Time
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Coluna do Elenco e Detalhes do Clube (8 colunas) */}
          <div className="md:col-span-8 p-4 sm:p-5 overflow-y-auto space-y-5 custom-scrollbar bg-[#10131a]">
            
            {/* Detalhes do Clube Selecionado */}
            <div className="bg-[#181d28] border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3.5">
                  <ClubBadge club={activeClub} size="lg" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">{activeClub.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{activeClub.stadium}</span>
                      <span className="text-slate-600">•</span>
                      <span>{activeClub.league}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Orçamento</span>
                  <span className="text-base font-black text-emerald-400 font-['Teko']">€{activeClub.budgetEur}M</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">COMANDANTE</span>
                  <span className="font-bold text-slate-200">{activeClub.coachName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ESTILO DE JOGO</span>
                  <span className="font-bold text-slate-200 truncate block">{activeClub.playStyle}</span>
                </div>
              </div>
            </div>

            {/* Lista de Jogadores Reais */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Elenco Principal ({activeClub.squad?.length || 0} Atletas)</span>
                </span>
                <span className="text-[11px] text-slate-500">Média OVR: {
                  activeClub.squad?.length 
                    ? Math.round(activeClub.squad.reduce((acc, p) => acc + p.ovr, 0) / activeClub.squad.length) 
                    : 70
                }</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeClub.squad?.map(realPlayer => (
                  <div
                    key={realPlayer.id}
                    className="bg-[#181d28] border border-slate-800/80 hover:border-slate-700 p-3 rounded-xl flex items-center justify-between space-x-3 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      {/* OVR Pill */}
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg font-['Teko'] text-base ${
                        realPlayer.ovr >= 85
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : realPlayer.ovr >= 78
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {realPlayer.ovr}
                      </span>

                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white text-xs">{realPlayer.name}</span>
                          {realPlayer.isStar && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {realPlayer.position} • {realPlayer.age} anos • {realPlayer.flag}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400 block">
                        €{realPlayer.marketValueEur}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
        )}

        {/* Rodapé */}
        <div className="bg-[#181d28] border-t border-slate-800 p-3.5 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Simulador Sincronizado FM Ativo: {activeLeagueIds.length} ligas rodando em tempo real</span>
          </div>

          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-colors"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
  );

  const fmManagerOverlay = showFmManager ? (
        <div
          onClick={() => setShowFmManager(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#141822] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88dvh]"
          >
            {/* Header */}
            <div className="bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-600/60 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>Ligas Ativas para Simulação Viva (FM Style)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecione entre 5 e 10 ligas para rodar rodada a rodada em sincronia perfeita com sua carreira.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFmManager(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contador & Alertas */}
            <div className="bg-[#0e121a] px-5 py-3 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Total Selecionado:</span>
                <span className={`text-xs font-mono font-black px-2.5 py-0.5 rounded-full border ${
                  selectedFmLeagues.length >= 5 && selectedFmLeagues.length <= 10
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-rose-950 text-rose-300 border-rose-700'
                }`}>
                  {selectedFmLeagues.length} / 10 Ligas (Mínimo: 5)
                </span>
              </div>

              {fmError && (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {fmError}
                </span>
              )}
            </div>

            {/* Grid de Escolha de Ligas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(LEAGUES).map(league => {
                  const isChecked = selectedFmLeagues.includes(league.id);
                  const isPlayerLeague = normalizeLeagueId(league.id) === normalizeLeagueId(currentLeagueId);

                  return (
                    <button
                      key={league.id}
                      type="button"
                      onClick={() => {
                        setFmError(null);
                        if (isChecked) {
                          if (isPlayerLeague) {
                            setFmError('A liga do seu clube atual é obrigatória e não pode ser desativada.');
                            return;
                          }
                          if (selectedFmLeagues.length <= 5) {
                            setFmError('Mínimo de 5 ligas ativas obrigatórias.');
                            return;
                          }
                          setSelectedFmLeagues(prev => prev.filter(id => id !== league.id));
                        } else {
                          if (selectedFmLeagues.length >= 10) {
                            setFmError('Máximo de 10 ligas simultâneas atingido.');
                            return;
                          }
                          setSelectedFmLeagues(prev => [...prev, league.id]);
                        }
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-[#181d28]/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="text-lg">{league.countryFlag}</span>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold truncate block ${isChecked ? 'text-white' : 'text-slate-300'}`}>
                            {league.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {league.country} • {league.tier}ª Divisão
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {isPlayerLeague && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 rounded font-bold">
                            SEU CLUBE
                          </span>
                        )}
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ações */}
            <div className="bg-[#181d28] border-t border-slate-800 p-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFmManager(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedFmLeagues.length < 5) {
                    setFmError('Selecione pelo menos 5 ligas.');
                    return;
                  }
                  if (selectedFmLeagues.length > 10) {
                    setFmError('Máximo de 10 ligas permitido.');
                    return;
                  }
                  const res = setActiveLeagueIds(selectedFmLeagues, currentLeagueId);
                  if (res.success) {
                    setActiveLeagueIdsState(selectedFmLeagues);
                    setShowFmManager(false);
                  } else {
                    setFmError(res.error || 'Erro ao salvar preferências.');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-lg shadow-emerald-950/40"
              >
                Salvar e Sincronizar Ligas ({selectedFmLeagues.length})
              </button>
            </div>
          </div>
        </div>
  ) : null;

  if (embedded) {
    return (
      <>
        {cardContent}
        {fmManagerOverlay}
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      {cardContent}
      {fmManagerOverlay}
    </div>
  );
};
