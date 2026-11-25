import {
  PlayerProfile,
  PotmAward,
  SeasonAwardRecord,
  NewsArticle,
  MemoryEvent
} from '../types';
import { findClub } from '../data/clubs';
import { getClubsForLeague, getLeagueTopScorersAndAssists } from './syncLeagueSimulationService';
import { createMemory } from './careerMemory';

export interface MonthScheduleInfo {
  monthIndex: number;
  shortLabel: string;
  fullLabel: string;
  startRound: number;
  endRound: number;
  potmRound: number | null;
}

export const MONTH_SCHEDULE: MonthScheduleInfo[] = [
  { monthIndex: 1, shortLabel: 'Jan', fullLabel: 'Janeiro', startRound: 1, endRound: 4, potmRound: 4 },
  { monthIndex: 2, shortLabel: 'Fev', fullLabel: 'Fevereiro', startRound: 5, endRound: 8, potmRound: 8 },
  { monthIndex: 3, shortLabel: 'Mar', fullLabel: 'Março', startRound: 9, endRound: 12, potmRound: 12 },
  { monthIndex: 4, shortLabel: 'Abr', fullLabel: 'Abril', startRound: 13, endRound: 16, potmRound: 16 },
  { monthIndex: 5, shortLabel: 'Mai', fullLabel: 'Maio', startRound: 17, endRound: 20, potmRound: 20 },
  { monthIndex: 6, shortLabel: 'Jun', fullLabel: 'Junho', startRound: 21, endRound: 24, potmRound: 24 },
  { monthIndex: 7, shortLabel: 'Jul', fullLabel: 'Julho', startRound: 25, endRound: 28, potmRound: 28 },
  { monthIndex: 8, shortLabel: 'Ago', fullLabel: 'Agosto', startRound: 29, endRound: 32, potmRound: 32 },
  { monthIndex: 9, shortLabel: 'Set', fullLabel: 'Setembro', startRound: 33, endRound: 36, potmRound: 36 },
  { monthIndex: 10, shortLabel: 'Out/Nov', fullLabel: 'Outubro / Reta Final', startRound: 37, endRound: 38, potmRound: null }
];

export function getMonthInfoForRound(round: number): MonthScheduleInfo {
  const found = MONTH_SCHEDULE.find(m => round >= m.startRound && round <= m.endRound);
  return found || MONTH_SCHEDULE[MONTH_SCHEDULE.length - 1];
}

export interface PotmEvaluationResult {
  triggered: boolean;
  won: boolean;
  monthLabel: string;
  award?: PotmAward;
  winnerName?: string;
  winnerClub?: string;
  newsArticle?: NewsArticle;
  memory?: MemoryEvent;
  marketValueDelta: number;
  moralDelta: number;
  fansDelta: number;
  boardDelta: number;
}

export function evaluatePlayerOfTheMonth(
  player: PlayerProfile,
  completedRound: number
): PotmEvaluationResult {
  if (completedRound % 4 !== 0 || completedRound < 4 || completedRound > 36) {
    return {
      triggered: false,
      won: false,
      monthLabel: '',
      marketValueDelta: 0,
      moralDelta: 0,
      fansDelta: 0,
      boardDelta: 0
    };
  }

  const monthInfo = getMonthInfoForRound(completedRound);
  const currentClub = findClub(player.currentClub);
  const leagueId = currentClub.leagueId || 'serie_a';
  const startR = completedRound - 3;

  const windowMatches = (player.matchHistory || []).filter(
    m => m.seasonYear === player.seasonYear && m.round >= startR && m.round <= completedRound && !m.skippedReason
  );

  if (windowMatches.length === 0) {
    return {
      triggered: false,
      won: false,
      monthLabel: monthInfo.fullLabel,
      marketValueDelta: 0,
      moralDelta: 0,
      fansDelta: 0,
      boardDelta: 0
    };
  }

  const games = windowMatches.length;
  const goals = windowMatches.reduce((s, m) => s + (m.goals || 0), 0);
  const assists = windowMatches.reduce((s, m) => s + (m.assists || 0), 0);
  const motmCount = windowMatches.filter(m => m.isMotm).length;
  const avgRating = Number((windowMatches.reduce((s, m) => s + (m.rating || 6.5), 0) / games).toFixed(1));

  const userScore = avgRating * 10 + goals * 3.5 + assists * 2.5 + motmCount * 3.5;

  // Concorrentes reais da mesma liga
  const leagueClubs = getClubsForLeague(leagueId).filter(c => c.name !== player.currentClub);
  const seedBase = player.seasonYear * 100 + completedRound;
  const contenders: Array<{ name: string; club: string; score: number }> = [];

  for (let i = 0; i < Math.min(3, leagueClubs.length); i++) {
    const rivalClub = leagueClubs[(seedBase + i * 5) % leagueClubs.length];
    const star = rivalClub.squad?.find(s => s.isStar || s.position === 'CA' || s.position === 'MEI') || rivalClub.squad?.[0];
    if (star) {
      const rivalBase = 68 + ((seedBase + i * 17) % 19); // ~68..86 pontos equivalentes
      contenders.push({ name: star.name, club: rivalClub.shortName, score: rivalBase });
    }
  }

  const sortedContenders = contenders.sort((a, b) => b.score - a.score);
  const topRival = sortedContenders[0] || { name: 'Artilheiro da Liga', club: 'Rival', score: 75 };
  const won = userScore >= topRival.score && avgRating >= 7.1;

  if (won) {
    const award: PotmAward = {
      id: `potm_${player.seasonYear}_r${completedRound}`,
      monthLabel: monthInfo.fullLabel,
      seasonYear: player.seasonYear,
      roundEnd: completedRound,
      ratingAvg: avgRating,
      goals,
      assists,
      motmCount,
      leagueName: currentClub.league
    };

    const memory = createMemory(player, {
      title: `🏆 Craque do Mês de ${monthInfo.fullLabel} (${player.seasonYear})`,
      description: `Eleito o melhor jogador de ${monthInfo.fullLabel} na ${currentClub.league} com nota média ${avgRating.toFixed(1)}, ${goals} gol(s) e ${assists} assistência(s).`,
      category: 'milestone',
      impactSummary: '+€0.8M em Valor de Mercado, +8% Torcida e prestígio nacional',
      tags: ['potm', 'craque_do_mes', monthInfo.shortLabel.toLowerCase()],
      importance: 'alta'
    });

    const newsArticle: NewsArticle = {
      id: `news_potm_${player.seasonYear}_${completedRound}`,
      round: completedRound,
      matchDay: completedRound,
      dateStr: new Date().toLocaleDateString('pt-BR'),
      outlet: 'ge.globo',
      badgeColor: 'text-amber-300 border-amber-600/60 bg-amber-950/60',
      category: 'milestone',
      categoryLabel: `Jogador do Mês • ${monthInfo.fullLabel}`,
      headline: `PRÊMIO OFICIAL: ${player.surname.toUpperCase()} é eleito o Craque do Mês de ${monthInfo.fullLabel}!`,
      snippet: `Superando ${topRival.name} (${topRival.club}) na votação de treinadores e jornalistas, a joia do ${currentClub.shortName} fechou o mês com nota ${avgRating.toFixed(1)}, ${goals} gol(s) e ${assists} assistência(s).`
    };

    return {
      triggered: true,
      won: true,
      monthLabel: monthInfo.fullLabel,
      award,
      winnerName: `${player.name} "${player.surname}"`,
      winnerClub: currentClub.shortName,
      newsArticle,
      memory,
      marketValueDelta: 0.8,
      moralDelta: 6,
      fansDelta: 8,
      boardDelta: 5
    };
  }

  const newsArticle: NewsArticle = {
    id: `news_potm_nom_${player.seasonYear}_${completedRound}`,
    round: completedRound,
    matchDay: completedRound,
    dateStr: new Date().toLocaleDateString('pt-BR'),
    outlet: 'ESPN Brasil',
    badgeColor: 'text-sky-300 border-sky-700/60 bg-sky-950/60',
    category: 'milestone',
    categoryLabel: `Prêmio Mensal • ${monthInfo.fullLabel}`,
    headline: `${topRival.name} (${topRival.club}) vence Craque de ${monthInfo.fullLabel}; ${player.surname} figura entre os finalistas`,
    snippet: `Com média ${avgRating.toFixed(1)} e ${goals} gol(s) no mês, ${player.surname} esteve na lista final da ${currentClub.league}, mas o troféu ficou com ${topRival.name}.`
  };

  return {
    triggered: true,
    won: false,
    monthLabel: monthInfo.fullLabel,
    winnerName: topRival.name,
    winnerClub: topRival.club,
    newsArticle,
    marketValueDelta: 0,
    moralDelta: 1,
    fansDelta: 2,
    boardDelta: 0
  };
}

export interface EndOfSeasonAwardsSummary {
  awards: SeasonAwardRecord[];
  wonBallonDor: boolean;
  trophiesBonus: number;
  marketValueBonus: number;
  memory?: MemoryEvent;
  newsArticle?: NewsArticle;
}

export function evaluateEndOfSeasonAwards(
  player: PlayerProfile,
  wonLeagueTitle: boolean
): EndOfSeasonAwardsSummary {
  const club = findClub(player.currentClub);
  const leagueId = club.leagueId || 'serie_a';
  const stats = player.currentSeasonStats;
  const avgRating = stats.games > 0 ? Number((stats.ratingSum / stats.games).toFixed(2)) : 6.5;
  const seasonMotms = player.awards?.seasonMotmCount || 0;
  const potmsThisYear = (player.awards?.potmHistory || []).filter(p => p.seasonYear === player.seasonYear).length;

  const { topScorers, topAssisters } = getLeagueTopScorersAndAssists(leagueId, player);
  const leaderGoals = topScorers[0];
  const leaderAssists = topAssisters[0];

  const awards: SeasonAwardRecord[] = [];
  let trophiesBonus = 0;
  let marketValueBonus = 0;

  if (stats.goals >= 10 && (!leaderGoals || leaderGoals.isUser || stats.goals >= leaderGoals.goals)) {
    awards.push({
      id: `aw_scorer_${player.seasonYear}`,
      seasonYear: player.seasonYear,
      title: `⚽ Artilheiro da Temporada (${stats.goals} gols)`,
      category: 'top_scorer',
      detail: `${club.league} • ${stats.goals} gols em ${stats.games} jogos`
    });
    trophiesBonus += 1;
    marketValueBonus += 1.5;
  }

  if (stats.assists >= 8 && (!leaderAssists || leaderAssists.isUser || stats.assists >= leaderAssists.assists)) {
    awards.push({
      id: `aw_assist_${player.seasonYear}`,
      seasonYear: player.seasonYear,
      title: `🎯 Garçom / Rei das Assistências (${stats.assists} ast)`,
      category: 'top_assister',
      detail: `${club.league} • ${stats.assists} assistências`
    });
    marketValueBonus += 0.8;
  }

  if ((avgRating >= 7.6 && stats.games >= 15) || seasonMotms >= 6 || potmsThisYear >= 2) {
    awards.push({
      id: `aw_mvp_${player.seasonYear}`,
      seasonYear: player.seasonYear,
      title: `🏅 Melhor Jogador da Liga (MVP)`,
      category: 'mvp',
      detail: `Nota média ${avgRating.toFixed(1)} • ${seasonMotms}x MOTM`
    });
    trophiesBonus += 1;
    marketValueBonus += 2.0;
  }

  if (player.age <= 21 && avgRating >= 7.1 && stats.games >= 12) {
    awards.push({
      id: `aw_young_${player.seasonYear}`,
      seasonYear: player.seasonYear,
      title: `🌟 Revelação do Ano (${player.age} anos)`,
      category: 'young_player',
      detail: `Destaque Sub-21 da ${club.league}`
    });
    marketValueBonus += 1.0;
  }

  if (avgRating >= 7.2 && stats.games >= 14) {
    awards.push({
      id: `aw_xi_${player.seasonYear}`,
      seasonYear: player.seasonYear,
      title: `🛡️ Seleção do Campeonato (XI Ideal)`,
      category: 'team_of_season',
      detail: `Eleito melhor ${player.position} da temporada`
    });
    marketValueBonus += 0.6;
  }

  const hasContinentalOrWorld = (player.seasonTitlesWon || []).some(t =>
    t.includes('Champions') || t.includes('Libertadores') || t.includes('Copa do Mundo') || t.includes('Copa América') || t.includes('Eurocopa')
  );
  const wonBallonDor =
    club.prestige >= 4 &&
    player.ovr >= 84 &&
    avgRating >= 7.8 &&
    (stats.goals + stats.assists >= 22 || hasContinentalOrWorld || (wonLeagueTitle && seasonMotms >= 8));

  if (wonBallonDor) {
    awards.push({
      id: `aw_bdo_${player.seasonYear}`,
      seasonYear: player.seasonYear,
      title: `🥇 BOLA DE OURO MUNDIAL (${player.seasonYear})`,
      category: 'ballon_dor',
      detail: `Eleito o Melhor Jogador do Mundo pelo ${club.shortName}!`
    });
    trophiesBonus += 1;
    marketValueBonus += 8.0;
  }

  if (awards.length === 0) {
    return { awards, wonBallonDor: false, trophiesBonus: 0, marketValueBonus: 0 };
  }

  const memory = createMemory(player, {
    title: wonBallonDor
      ? `🥇 BOLA DE OURO! Cerimônia de Premiação ${player.seasonYear}`
      : `🏅 Premiações Individuais da Temporada ${player.seasonYear}`,
    description: `Conquistou ${awards.length} prêmio(s) oficial(is) na cerimônia de encerramento: ${awards.map(a => a.title).join(', ')}.`,
    category: 'milestone',
    impactSummary: `+€${marketValueBonus.toFixed(1)}M em valorização histórica`,
    tags: wonBallonDor ? ['bola_de_ouro', 'lenda', 'premios'] : ['premios', 'selecao_da_liga'],
    importance: wonBallonDor ? 'lendaria' : 'alta'
  });

  const newsArticle: NewsArticle = {
    id: `news_awards_${player.seasonYear}`,
    round: 38,
    matchDay: 38,
    dateStr: new Date().toLocaleDateString('pt-BR'),
    outlet: 'TNT Sports',
    badgeColor: 'text-amber-300 border-amber-500/60 bg-amber-950/60',
    category: 'milestone',
    categoryLabel: 'Premiação de Gala',
    headline: wonBallonDor
      ? `HISTÓRICO! ${player.name} "${player.surname}" vence a Bola de Ouro ${player.seasonYear}!`
      : `NOITE DE GALA: ${player.surname} fatura ${awards.length} prêmio(s) no encerramento da temporada`,
    snippet: `Na festa oficial de premiação, o craque do ${club.name} brilhou e recebeu: ${awards.map(a => a.title).join(' • ')}.`
  };

  return {
    awards,
    wonBallonDor,
    trophiesBonus,
    marketValueBonus: Number(marketValueBonus.toFixed(1)),
    memory,
    newsArticle
  };
}
