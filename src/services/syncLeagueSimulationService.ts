import { Club, LeagueStanding, PlayerProfile } from '../types';
import { CLUBS } from '../data/clubs';
import { LEAGUES } from '../data/leagues';
import { SUPPLEMENTAL_LEAGUE_TABLES, CONTINENTAL_ONLY_CLUBS, getClubCompetitions } from './tournamentService';

const ACTIVE_LEAGUES_STORAGE_KEY = 'craque_active_leagues_v2';
const LEAGUES_SIM_STATE_KEY = 'craque_sync_leagues_v2';
const STATE_CUP_RESULTS_KEY = 'craque_state_cup_results_v1';

/**
 * Ligas padrão ativas caso o jogador não tenha customizado (entre 5 e 10 ligas no total)
 */
export const DEFAULT_FM_ACTIVE_LEAGUES: string[] = [
  'serie_a',        // Brasileirão Série A
  'serie_b',        // Brasileirão Série B
  'premier_league', // Premier League
  'la_liga',        // La Liga EA Sports
  'serie_a_ita',    // Serie A (Itália)
  'bundesliga',     // Bundesliga
  'ligue_1',        // Ligue 1
  'primeira_liga'   // Liga Portugal
];

export interface MatchScorerItem {
  name: string;
  minute: number;
  isPenalty?: boolean;
}

export interface MatchScoreResult {
  homeClubId: string;
  homeClubName: string;
  awayClubId: string;
  awayClubName: string;
  homeScore: number;
  awayScore: number;
  homeScorers?: MatchScorerItem[];
  awayScorers?: MatchScorerItem[];
  played: boolean;
}

export interface StoredLeagueStanding {
  position: number;
  clubId: string;
  clubName: string;
  shortName: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: ('V' | 'E' | 'D')[];
}

export interface StoredLeagueState {
  leagueId: string;
  seasonYear: number;
  lastSimulatedRound: number;
  standings: Record<string, StoredLeagueStanding>;
  roundMatches: Record<number, MatchScoreResult[]>;
}

export interface WorldSyncState {
  version: number;
  seasonYear: number;
  leagues: Record<string, StoredLeagueState>;
}

/**
 * Retorna a lista de IDs de ligas ativas escolhidas pelo jogador (sempre entre 5 e 10 ligas)
 */
export function getActiveLeagueIds(playerCurrentLeagueId?: string): string[] {
  try {
    const raw = localStorage.getItem(ACTIVE_LEAGUES_STORAGE_KEY);
    let list: string[] = raw ? JSON.parse(raw) : DEFAULT_FM_ACTIVE_LEAGUES;
    if (!Array.isArray(list)) list = [...DEFAULT_FM_ACTIVE_LEAGUES];
    // Mantém apenas ligas válidas dentre as 19 ligas oficiais
    list = list.filter(id => Boolean(LEAGUES[id]));
    for (const defId of DEFAULT_FM_ACTIVE_LEAGUES) {
      if (list.length >= 5) break;
      if (LEAGUES[defId] && !list.includes(defId)) list.push(defId);
    }
    if (playerCurrentLeagueId && LEAGUES[playerCurrentLeagueId] && !list.includes(playerCurrentLeagueId)) {
      list.unshift(playerCurrentLeagueId);
      if (list.length > 10) {
        list.pop();
      }
    }
    return list.slice(0, 10);
  } catch {
    return DEFAULT_FM_ACTIVE_LEAGUES;
  }
}

/**
 * Salva a seleção de ligas ativas (validação estrita: entre 5 e 10 ligas)
 */
export function setActiveLeagueIds(leagueIds: string[], playerCurrentLeagueId?: string): { success: boolean; error?: string } {
  let list = Array.from(new Set(leagueIds));
  if (playerCurrentLeagueId && !list.includes(playerCurrentLeagueId)) {
    list.unshift(playerCurrentLeagueId);
  }

  if (list.length < 5) {
    return { success: false, error: 'Selecione no mínimo 5 ligas para a simulação ativa do mundo.' };
  }
  if (list.length > 10) {
    return { success: false, error: 'O limite máximo é de 10 ligas ativas simultâneas.' };
  }

  try {
    localStorage.setItem(ACTIVE_LEAGUES_STORAGE_KEY, JSON.stringify(list));
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Falha ao salvar preferências no armazenamento local.' };
  }
}

/**
 * Hash determinístico de string para número pseudoaleatório estável
 */
function pseudoHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

let supplementalHydrated = false;

/**
 * Hidrata preguiçosamente todos os clubes complementares das 24 ligas (1ª e 2ª divisões)
 * para garantir que NENHUMA liga selecionada no modo Football Manager fique com tabela vazia!
 */
export function ensureSupplementalClubsHydrated(): void {
  if (supplementalHydrated) return;
  if (!SUPPLEMENTAL_LEAGUE_TABLES) return;
  supplementalHydrated = true;

  const palette = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2', '#e11d48', '#0f766e'];

  // 1. Clubes remanescentes de divisões não selecionáveis viram clubes de Mercado & Copas (isContinentalOnly)
  Object.values(CLUBS).forEach(existingClub => {
    if (existingClub && existingClub.leagueId && !LEAGUES[existingClub.leagueId]) {
      existingClub.isContinentalOnly = true;
      if (!existingClub.continentalTournament) {
        existingClub.continentalTournament = ['Brasil', 'Argentina'].includes(existingClub.country) ? 'sul_americana' : 'conference_league';
      }
    }
  });

  // 2. Hidrata os clubes das 19 ligas jogáveis oficiais (incluindo Série C, Rússia, Grécia, Serie B Itália, etc.)
  Object.entries(SUPPLEMENTAL_LEAGUE_TABLES).forEach(([lid, entries]) => {
    const leagueMeta = LEAGUES[lid];
    if (!leagueMeta) return; // Ignora divisões removidas do catálogo jogável
    const country = leagueMeta.country;
    const leagueName = leagueMeta.name;
    const flag = leagueMeta.countryFlag;

    entries.forEach((entry, idx) => {
      const existing = CLUBS[entry.id] || CLUBS[entry.name];
      if (!existing) {
        const baseOvr = Math.min(81, Math.max(64, 61 + entry.prestige * 4));
        const color = palette[(idx + lid.length) % palette.length];
        const newClub: Club = {
          id: entry.id,
          name: entry.name,
          shortName: entry.shortName,
          leagueId: lid,
          league: leagueName,
          country,
          stadium: `Estádio ${entry.shortName}`,
          prestige: entry.prestige as 1 | 2 | 3 | 4 | 5,
          formation: idx % 2 === 0 ? '4-3-3' : '4-2-3-1',
          budgetEur: Number((entry.prestige * 6.5).toFixed(1)),
          colors: { primary: color, secondary: '#ffffff', text: '#ffffff' },
          rivalClubs: [],
          playStyle: 'Intensidade tática competitiva e transições rápidas',
          coachName: `Comissão Técnica (${entry.shortName})`,
          squad: [
            { id: `${entry.id}_gk`, name: `${entry.shortName} Goleiro`, position: 'GOL', ovr: baseOvr, age: 27, nationality: country, flag, marketValueEur: 2.0 },
            { id: `${entry.id}_zag1`, name: `${entry.shortName} Capitão`, position: 'ZAG', ovr: baseOvr + 1, age: 28, nationality: country, flag, marketValueEur: 2.5 },
            { id: `${entry.id}_vol`, name: `${entry.shortName} Volante`, position: 'VOL', ovr: baseOvr, age: 25, nationality: country, flag, marketValueEur: 2.2 },
            { id: `${entry.id}_mei`, name: `${entry.shortName} Camisa 10`, position: 'MEI', ovr: baseOvr + 1, age: 24, nationality: country, flag, marketValueEur: 3.5, isStar: true },
            { id: `${entry.id}_pd`, name: `${entry.shortName} Ponta`, position: 'PD', ovr: baseOvr, age: 22, nationality: country, flag, marketValueEur: 3.0 },
            { id: `${entry.id}_ca`, name: `${entry.shortName} Artilheiro`, position: 'CA', ovr: baseOvr + 2, age: 26, nationality: country, flag, marketValueEur: 4.0, isStar: true }
          ]
        };
        (CLUBS as any)[entry.name] = newClub;
      }
    });
  });

  // 3. Hidrata todos os clubes internacionais de Champions, Europa League, Conference, Libertadores e Sul-Americana!
  if (Array.isArray(CONTINENTAL_ONLY_CLUBS)) {
    CONTINENTAL_ONLY_CLUBS.forEach(cEntry => {
      const existing = CLUBS[cEntry.id] || CLUBS[cEntry.name];
      if (existing) {
        if (!LEAGUES[existing.leagueId]) existing.isContinentalOnly = true;
        existing.continentalTournament = cEntry.tournament;
        return;
      }
      const baseOvr = Math.min(82, Math.max(69, 64 + cEntry.prestige * 4));
      const cupLabelMap: Record<string, string> = {
        champions: 'UEFA Champions League',
        europa_league: 'UEFA Europa League',
        conference_league: 'UEFA Conference League',
        libertadores: 'CONMEBOL Libertadores',
        sul_americana: 'CONMEBOL Sul-Americana'
      };
      const contClub: Club = {
        id: cEntry.id,
        name: cEntry.name,
        shortName: cEntry.shortName,
        leagueId: `continental_${cEntry.tournament}`,
        league: `${cEntry.country} (${cupLabelMap[cEntry.tournament]})`,
        country: cEntry.country,
        stadium: `Arena ${cEntry.shortName}`,
        prestige: cEntry.prestige,
        formation: '4-2-3-1',
        budgetEur: Number((cEntry.prestige * 9.0).toFixed(1)),
        colors: { primary: cEntry.color, secondary: '#ffffff', text: '#ffffff' },
        rivalClubs: [],
        playStyle: 'Tradição copeira continental e pressão em jogos eliminatórios',
        coachName: `Técnico do ${cEntry.shortName}`,
        isContinentalOnly: true,
        continentalTournament: cEntry.tournament,
        squad: [
          { id: `${cEntry.id}_star`, name: cEntry.starName, position: 'MEI', ovr: baseOvr + 3, age: 25, nationality: cEntry.country, flag: cEntry.flag, marketValueEur: Number((cEntry.prestige * 4.5).toFixed(1)), isStar: true },
          { id: `${cEntry.id}_ca`, name: `${cEntry.shortName} Camisa 9`, position: 'CA', ovr: baseOvr + 2, age: 26, nationality: cEntry.country, flag: cEntry.flag, marketValueEur: Number((cEntry.prestige * 3.5).toFixed(1)), isStar: true },
          { id: `${cEntry.id}_zag`, name: `${cEntry.shortName} Xerife`, position: 'ZAG', ovr: baseOvr + 1, age: 29, nationality: cEntry.country, flag: cEntry.flag, marketValueEur: 3.0 },
          { id: `${cEntry.id}_vol`, name: `${cEntry.shortName} Volante`, position: 'VOL', ovr: baseOvr, age: 24, nationality: cEntry.country, flag: cEntry.flag, marketValueEur: 2.8 },
          { id: `${cEntry.id}_gk`, name: `${cEntry.shortName} Goleiro`, position: 'GOL', ovr: baseOvr + 1, age: 28, nationality: cEntry.country, flag: cEntry.flag, marketValueEur: 2.5 }
        ]
      };
      (CLUBS as any)[cEntry.name] = contClub;
    });
  }
}

/**
 * Retorna os clubes cadastrados de uma liga (incluindo clubes hidratados das 19 divisões oficiais)
 */
export function getClubsForLeague(leagueId: string): Club[] {
  ensureSupplementalClubsHydrated();
  const norm = normalizeLeagueId(leagueId);
  const all = Object.values(CLUBS);
  const seenIds = new Set<string>();
  return all.filter(c => {
    if (c.isContinentalOnly) return false;
    const cLid = normalizeLeagueId(c.leagueId);
    const matches = cLid === norm || c.league === leagueId;
    if (!matches || seenIds.has(c.id)) return false;
    seenIds.add(c.id);
    return true;
  });
}

export function normalizeLeagueId(leagueId: string): string {
  if (!leagueId) return 'serie_a';
  const l = leagueId.toLowerCase();
  if (l === 'saudi_pro_league' || l === 'saudi league' || l === 'roshn saudi league') return 'saudi_pro';
  if (l === 'liga portugal' || l === 'primeira liga') return 'primeira_liga';
  if (l === 'premier league') return 'premier_league';
  if (l === 'efl championship' || l === 'championship') return 'championship';
  if (l === 'la liga' || l === 'la liga ea sports') return 'la_liga';
  if (l === 'serie a' || l === 'serie a (itália)' || l === 'serie_a_italy') return 'serie_a_ita';
  if (l === 'brasileirão série a' || l === 'brasileirao serie a') return 'serie_a';
  if (l === 'brasileirão série b' || l === 'brasileirao serie b') return 'serie_b';
  if (l === 'brasileirão série c' || l === 'brasileirao serie c') return 'serie_c';
  if (l === 'russian premier liga' || l === 'premier liga (rus)') return 'russian_premier';
  if (l === 'stoiximan super league grécia' || l === 'super league (gre)') return 'super_league_gre';
  if (l === 'bundesliga') return 'bundesliga';
  if (l === 'ligue 1') return 'ligue_1';
  if (l === 'eredivisie') return 'eredivisie';
  if (l === 'süper lig' || l === 'super lig') return 'super_lig';
  if (l === 'liga argentina' || l === 'liga profesional') return 'liga_argentina';
  if (l === 'pro league' || l === 'jupiler pro league') return 'pro_league_bel';
  if (l === 'premiership' || l === 'scottish premiership') return 'scottish_premiership';
  return leagueId;
}

/**
 * Gera o calendário completo (Round-Robin ida e volta) para os clubes da liga
 */
export function generateLeagueSchedule(leagueId: string): { round: number; homeClubId: string; awayClubId: string }[][] {
  const clubs = getClubsForLeague(leagueId);
  if (clubs.length < 2) return [];

  // Se o número de clubes for ímpar (ex: Süper Lig com 19 times), adiciona folga ('BYE')
  const teamList = [...clubs.map(c => c.id)];
  if (teamList.length % 2 !== 0) {
    teamList.push('BYE');
  }

  const n = teamList.length;
  const numRounds = (n - 1) * 2;
  const matchesPerRound = n / 2;
  const schedule: { round: number; homeClubId: string; awayClubId: string }[][] = [];

  let rotating = [...teamList];

  for (let r = 0; r < numRounds; r++) {
    const isReturnLeg = r >= (n - 1);
    const baseRound = r % (n - 1);
    const roundMatches: { round: number; homeClubId: string; awayClubId: string }[] = [];

    for (let i = 0; i < matchesPerRound; i++) {
      let home = rotating[i];
      let away = rotating[n - 1 - i];

      // Alternância de mandos de campo
      if ((baseRound + i) % 2 === 1 || (i === 0 && baseRound % 2 === 1)) {
        [home, away] = [away, home];
      }

      // No segundo turno (volta), inverte o mando de campo
      if (isReturnLeg) {
        [home, away] = [away, home];
      }

      // Desconsidera folgas
      if (home !== 'BYE' && away !== 'BYE') {
        roundMatches.push({
          round: r + 1,
          homeClubId: home,
          awayClubId: away
        });
      }
    }

    schedule.push(roundMatches);

    // Rotaciona a tabela em círculo (mantém o elemento 0 fixo)
    const fixed = rotating[0];
    const rest = rotating.slice(1);
    rest.unshift(rest.pop()!);
    rotating = [fixed, ...rest];
  }

  return schedule;
}

/**
 * Gera marcadores de gol verossímeis e distribuídos por tempo para uma equipe
 */
function generateScorersForClub(club: Club, goalCount: number, seed: number): MatchScorerItem[] {
  if (goalCount <= 0) return [];
  const squad = club.squad || [];

  const candidates: { name: string; weight: number }[] = squad.length > 0
    ? squad.map(p => {
        let weight = 1;
        if (p.position === 'CA') weight = 12;
        else if (p.position === 'PE' || p.position === 'PD') weight = 8;
        else if (p.position === 'MEI') weight = 6;
        else if (p.position === 'MC') weight = 3.5;
        else if (p.position === 'VOL') weight = 1.8;
        else if (p.position === 'ZAG' || p.position === 'LE' || p.position === 'LD') weight = 1.2;
        else weight = 0;
        return { name: p.name, weight };
      }).filter(c => c.weight > 0)
    : [
        { name: `${club.shortName} Camisa 9`, weight: 12 },
        { name: `${club.shortName} Ponta`, weight: 8 },
        { name: `${club.shortName} Meia`, weight: 6 }
      ];

  const scorers: MatchScorerItem[] = [];
  const usedMinutes = new Set<number>();
  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);

  for (let g = 0; g < goalCount; g++) {
    const s = Math.abs(pseudoHash(`${seed}_goal_${g}_${club.id}`));
    let min = (s % 90) + 1;
    while (usedMinutes.has(min)) {
      min = (min + 7) % 92 + 1;
    }
    usedMinutes.add(min);

    let target = ((s % 1000) / 1000) * totalWeight;
    let chosenName = candidates[0]?.name || `${club.shortName} Artilheiro`;
    for (const c of candidates) {
      target -= c.weight;
      if (target <= 0) {
        chosenName = c.name;
        break;
      }
    }

    const isPenalty = (s % 10) === 0;
    scorers.push({
      name: chosenName,
      minute: min,
      isPenalty
    });
  }

  return scorers.sort((a, b) => a.minute - b.minute);
}

/**
 * Simula um placar realista de futebol baseado em prestígio, força e mando de campo
 */
function simulateMatchScore(
  homeClub: Club, 
  awayClub: Club, 
  seasonYear: number, 
  roundNumber: number
): { homeScore: number; awayScore: number; homeScorers: MatchScorerItem[]; awayScorers: MatchScorerItem[] } {
  const seedStr = `fm_match_${seasonYear}_${homeClub.leagueId}_r${roundNumber}_${homeClub.id}_vs_${awayClub.id}`;
  const h = pseudoHash(seedStr);

  const homePrestige = homeClub.prestige || 3;
  const awayPrestige = awayClub.prestige || 3;
  const prestigeDiff = (homePrestige - awayPrestige);

  // Média de gols esperada (fator casa médio de +0.35 gols)
  const expHome = Math.min(3.8, Math.max(0.4, 1.45 + (prestigeDiff * 0.35)));
  const expAway = Math.min(3.2, Math.max(0.2, 1.05 - (prestigeDiff * 0.30)));

  const r1 = (h % 1000) / 1000;
  const r2 = (Math.floor(h / 1000) % 1000) / 1000;

  const poissonApprox = (exp: number, rand: number): number => {
    const p0 = Math.exp(-exp);
    const p1 = p0 * (1 + exp);
    const p2 = p0 * (1 + exp + (exp * exp) / 2);
    const p3 = p0 * (1 + exp + (exp * exp) / 2 + (exp * exp * exp) / 6);
    const p4 = p3 + p0 * (Math.pow(exp, 4) / 24);

    if (rand < p0) return 0;
    if (rand < p1) return 1;
    if (rand < p2) return 2;
    if (rand < p3) return 3;
    if (rand < p4) return 4;
    return rand < 0.99 ? 5 : 6;
  };

  const homeScore = poissonApprox(expHome, r1);
  const awayScore = poissonApprox(expAway, r2);

  return {
    homeScore,
    awayScore,
    homeScorers: generateScorersForClub(homeClub, homeScore, h),
    awayScorers: generateScorersForClub(awayClub, awayScore, h + 999)
  };
}

/**
 * Carrega o estado de todas as ligas sincronizadas do localStorage
 */
function loadWorldSyncState(): WorldSyncState | null {
  try {
    const raw = localStorage.getItem(LEAGUES_SIM_STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Salva o estado consolidado
 */
function saveWorldSyncState(state: WorldSyncState): void {
  try {
    localStorage.setItem(LEAGUES_SIM_STATE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Erro ao salvar estado sincronizado das ligas:', err);
  }
}

/**
 * Inicializa a tabela zerada de uma liga
 */
function initializeLeagueStandings(leagueId: string): Record<string, StoredLeagueStanding> {
  const clubs = getClubsForLeague(leagueId);
  const standings: Record<string, StoredLeagueStanding> = {};

  clubs.forEach((club, idx) => {
    standings[club.id] = {
      position: idx + 1,
      clubId: club.id,
      clubName: club.name,
      shortName: club.shortName,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      form: []
    };
  });

  return standings;
}

/**
 * Recalcula e ordena as posições oficiais da tabela
 */
function sortStandings(standings: Record<string, StoredLeagueStanding>): StoredLeagueStanding[] {
  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (b.won !== a.won) return b.won - a.won;
    return a.clubName.localeCompare(b.clubName);
  }).map((standing, index) => ({
    ...standing,
    position: index + 1
  }));
}

/**
 * Garante que todas as ligas ativas estejam simuladas sincronizadamente até a rodada solicitada
 */
export function syncActiveLeaguesUpToRound(
  targetRound: number,
  player: PlayerProfile,
  playerMatchResult?: {
    round: number;
    homeClubId: string;
    awayClubId: string;
    homeScore: number;
    awayScore: number;
    homeScorers?: MatchScorerItem[];
    awayScorers?: MatchScorerItem[];
  },
  forceExtraLeagueId?: string
): WorldSyncState {
  const seasonYear = player.seasonYear || 2026;
  const currentClubObj = CLUBS[player.currentClub];
  const playerLeagueId = normalizeLeagueId(currentClubObj?.leagueId || 'serie_a');
  const activeLeagueIds = getActiveLeagueIds(playerLeagueId);

  const leagueSet = new Set<string>(activeLeagueIds.map(normalizeLeagueId));
  leagueSet.add(playerLeagueId);
  if (forceExtraLeagueId) {
    leagueSet.add(normalizeLeagueId(forceExtraLeagueId));
  }

  let state = loadWorldSyncState();
  if (!state || state.seasonYear !== seasonYear) {
    state = {
      version: 2,
      seasonYear,
      leagues: {}
    };
  }

  // Para cada liga ativa / solicitada: simula da última rodada processada até a targetRound
  Array.from(leagueSet).forEach(normLid => {
    let lState = state!.leagues[normLid];

    if (!lState) {
      lState = {
        leagueId: normLid,
        seasonYear,
        lastSimulatedRound: 0,
        standings: initializeLeagueStandings(normLid),
        roundMatches: {}
      };
      state!.leagues[normLid] = lState;
    }

    const schedule = generateLeagueSchedule(normLid);
    const maxRounds = schedule.length;
    const playerInBrazil = (currentClubObj?.country || 'Brasil') === 'Brasil';
    const isBrLeague = normLid === 'serie_a' || normLid === 'serie_b' || normLid === 'serie_c';
    // No Brasil, as semanas 1 a 8 do calendário pertencem aos Campeonatos Estaduais; o Brasileirão começa na Semana 9!
    const effectiveTargetForLeague = (playerInBrazil && isBrLeague)
      ? Math.max(0, targetRound - 8)
      : targetRound;
    const endRound = Math.min(effectiveTargetForLeague, maxRounds);

    while (lState.lastSimulatedRound < endRound) {
      const nextRound = lState.lastSimulatedRound + 1;
      const roundFixtures = schedule[nextRound - 1] || [];
      const matchesResults: MatchScoreResult[] = [];

      roundFixtures.forEach(fix => {
        const homeClub = CLUBS[fix.homeClubId];
        const awayClub = CLUBS[fix.awayClubId];
        if (!homeClub || !awayClub) return;

        let homeScore = 0;
        let awayScore = 0;
        let homeScorers: MatchScorerItem[] = [];
        let awayScorers: MatchScorerItem[] = [];

        // Se for a partida disputada pelo atleta neste round: usa o placar real do jogo
        const isPlayerMatch = playerMatchResult && 
          playerMatchResult.round === nextRound &&
          (playerMatchResult.homeClubId === homeClub.id || playerMatchResult.awayClubId === awayClub.id);

        if (isPlayerMatch && playerMatchResult) {
          homeScore = playerMatchResult.homeScore;
          awayScore = playerMatchResult.awayScore;
          homeScorers = playerMatchResult.homeScorers || [];
          awayScorers = playerMatchResult.awayScorers || [];
        } else {
          const sim = simulateMatchScore(homeClub, awayClub, seasonYear, nextRound);
          homeScore = sim.homeScore;
          awayScore = sim.awayScore;
          homeScorers = sim.homeScorers || [];
          awayScorers = sim.awayScorers || [];
        }

        matchesResults.push({
          homeClubId: homeClub.id,
          homeClubName: homeClub.name,
          awayClubId: awayClub.id,
          awayClubName: awayClub.name,
          homeScore,
          awayScore,
          homeScorers,
          awayScorers,
          played: true
        });

        // Atualiza a tabela do mandante
        const hs = lState.standings[homeClub.id] || {
          position: 1,
          clubId: homeClub.id,
          clubName: homeClub.name,
          shortName: homeClub.shortName,
          points: 0,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          form: []
        };
        hs.played += 1;
        hs.goalsFor += homeScore;
        hs.goalsAgainst += awayScore;
        hs.goalDifference = hs.goalsFor - hs.goalsAgainst;

        // Atualiza a tabela do visitante
        const as = lState.standings[awayClub.id] || {
          position: 1,
          clubId: awayClub.id,
          clubName: awayClub.name,
          shortName: awayClub.shortName,
          points: 0,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          form: []
        };
        as.played += 1;
        as.goalsFor += awayScore;
        as.goalsAgainst += homeScore;
        as.goalDifference = as.goalsFor - as.goalsAgainst;

        if (homeScore > awayScore) {
          hs.won += 1;
          hs.points += 3;
          hs.form.push('V');
          as.lost += 1;
          as.form.push('D');
        } else if (homeScore === awayScore) {
          hs.drawn += 1;
          hs.points += 1;
          hs.form.push('E');
          as.drawn += 1;
          as.points += 1;
          as.form.push('E');
        } else {
          as.won += 1;
          as.points += 3;
          as.form.push('V');
          hs.lost += 1;
          hs.form.push('D');
        }

        // Mantém apenas os últimos 5 jogos na forma
        if (hs.form.length > 5) hs.form.shift();
        if (as.form.length > 5) as.form.shift();

        lState.standings[homeClub.id] = hs;
        lState.standings[awayClub.id] = as;
      });

      lState.roundMatches[nextRound] = matchesResults;
      lState.lastSimulatedRound = nextRound;
    }

    // Reordena as posições
    const sorted = sortStandings(lState.standings);
    const updatedMap: Record<string, StoredLeagueStanding> = {};
    sorted.forEach(s => { updatedMap[s.clubId] = s; });
    lState.standings = updatedMap;
  });

  saveWorldSyncState(state);
  return state;
}

/**
 * Retorna a tabela oficial sincronizada de qualquer liga
 */
export function getSynchronizedLeagueStandings(
  leagueId: string, 
  player: PlayerProfile
): LeagueStanding[] {
  const norm = normalizeLeagueId(leagueId);
  const targetCompletedRound = Math.max(0, (player.currentMatchDay || 1) - 1);

  // Sincroniza garantindo que a liga solicitada esteja incluída e simulada
  const state = syncActiveLeaguesUpToRound(targetCompletedRound, player, undefined, norm);
  const lState = state.leagues[norm];

  if (!lState || Object.keys(lState.standings).length === 0) {
    return [];
  }

  return sortStandings(lState.standings);
}

/**
 * Retorna os resultados dos jogos de uma rodada específica
 */
export function getRoundMatchResults(leagueId: string, roundNumber: number): MatchScoreResult[] {
  const norm = normalizeLeagueId(leagueId);
  const state = loadWorldSyncState();
  if (!state || !state.leagues[norm]) return [];
  return state.leagues[norm].roundMatches[roundNumber] || [];
}

/**
 * Reinicia a simulação para início de nova temporada ou novo save
 */
export function resetLeagueSimulationState(): void {
  try {
    localStorage.removeItem(LEAGUES_SIM_STATE_KEY);
    localStorage.removeItem(STATE_CUP_RESULTS_KEY);
  } catch (err) {
    console.error('Erro ao resetar estado de simulação das ligas:', err);
  }
}

interface StoredStateCupMatch {
  seasonYear: number;
  round: number;
  homeClubId: string;
  awayClubId: string;
  homeScore: number;
  awayScore: number;
}

/**
 * Registra o resultado real do atleta em partidas do Campeonato Estadual (Rodadas 1 a 5 - Fase Classificatória)
 */
export function recordStateCupPlayerMatch(
  seasonYear: number,
  round: number,
  homeClubId: string,
  awayClubId: string,
  homeScore: number,
  awayScore: number
): void {
  if (round > 5) return;
  try {
    const raw = localStorage.getItem(STATE_CUP_RESULTS_KEY);
    const list: StoredStateCupMatch[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(m => m.seasonYear === seasonYear && m.round !== round);
    filtered.push({ seasonYear, round, homeClubId, awayClubId, homeScore, awayScore });
    localStorage.setItem(STATE_CUP_RESULTS_KEY, JSON.stringify(filtered));
  } catch {}
}

/**
 * Gera a tabela VIVA e REAL do Campeonato Estadual correspondente ao estado do clube do jogador
 * (Paulistão, Cariocão, Mineiro, Gauchão, Paranaense ou Copa do Nordeste)
 */
export function getStateCupStandings(player: PlayerProfile): {
  cupName: string;
  shortName: string;
  completedRounds: number;
  standings: LeagueStanding[];
} {
  ensureSupplementalClubsHydrated();
  const currentClub = CLUBS[player.currentClub] || Object.values(CLUBS)[0];
  const comps = getClubCompetitions(currentClub);
  const cupName = comps.stateCupName || 'Campeonato Estadual';
  const shortName = comps.stateCupShort || 'Estadual';
  const seasonYear = player.seasonYear || 2026;

  const clubId = currentClub.id.toLowerCase();
  const spIds = ['palmeiras', 'corinthians', 'sao_paulo', 'santos', 'red_bull_bragantino', 'bragantino', 'novorizontino', 'mirassol', 'ponte_preta', 'guarani', 'ituano', 'botafogo_sp'];
  const rjIds = ['flamengo', 'botafogo', 'fluminense', 'vasco', 'volta_redonda', 'bangu', 'madureira'];
  const mgIds = ['atletico_mg', 'cruzeiro', 'america_mg'];
  const rsIds = ['internacional', 'gremio', 'juventude', 'caxias'];
  const prIds = ['athletico_pr', 'coritiba', 'operario'];

  let targetIds = spIds;
  if (rjIds.includes(clubId)) targetIds = rjIds;
  else if (mgIds.includes(clubId)) targetIds = mgIds;
  else if (rsIds.includes(clubId)) targetIds = rsIds;
  else if (prIds.includes(clubId)) targetIds = prIds;
  else if (!spIds.includes(clubId)) {
    targetIds = ['bahia', 'fortaleza', 'vitoria', 'sport', 'ceara', 'crb', 'america_mg', 'cuiaba'];
  }

  const allClubs = Object.values(CLUBS);
  const seen = new Set<string>();
  const stateClubs: Club[] = [];

  [currentClub, ...allClubs.filter(c => targetIds.includes(c.id.toLowerCase()))].forEach(c => {
    if (c && !seen.has(c.id)) {
      seen.add(c.id);
      stateClubs.push(c);
    }
  });

  const extraNames = ['AA Internacional', 'Portuguesa', 'São Bernardo FC', 'EC Água Santa', 'CA Juventus', 'XV de Piracicaba'];
  let eIdx = 0;
  while (stateClubs.length < 8 && eIdx < extraNames.length) {
    const label = extraNames[eIdx++];
    const fakeId = `est_extra_${eIdx}`;
    stateClubs.push({
      ...currentClub,
      id: fakeId,
      name: label,
      shortName: label,
      prestige: 2,
      colors: { primary: '#475569', secondary: '#ffffff', text: '#ffffff' }
    });
  }

  const participants = stateClubs.slice(0, 8);
  const completedRounds = Math.min(5, Math.max(0, (player.currentMatchDay || 1) - 1));

  let playerMatches: StoredStateCupMatch[] = [];
  try {
    const raw = localStorage.getItem(STATE_CUP_RESULTS_KEY);
    if (raw) {
      playerMatches = (JSON.parse(raw) as StoredStateCupMatch[]).filter(m => m.seasonYear === seasonYear);
    }
  } catch {}

  const map: Record<string, StoredLeagueStanding> = {};
  participants.forEach((c, idx) => {
    map[c.id] = {
      position: idx + 1,
      clubId: c.id,
      clubName: c.name,
      shortName: c.shortName,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      form: []
    };
  });

  let rot = participants.map(p => p.id);
  for (let r = 1; r <= completedRounds; r++) {
    const usedInRound = new Set<string>();
    const userMatch = playerMatches.find(m => m.round === r);

    if (userMatch && map[userMatch.homeClubId]) {
      usedInRound.add(userMatch.homeClubId);
      const hs = map[userMatch.homeClubId];
      hs.played += 1;
      hs.goalsFor += userMatch.homeScore;
      hs.goalsAgainst += userMatch.awayScore;
      hs.goalDifference = hs.goalsFor - hs.goalsAgainst;
      if (userMatch.homeScore > userMatch.awayScore) { hs.won += 1; hs.points += 3; hs.form.push('V'); }
      else if (userMatch.homeScore === userMatch.awayScore) { hs.drawn += 1; hs.points += 1; hs.form.push('E'); }
      else { hs.lost += 1; hs.form.push('D'); }

      if (map[userMatch.awayClubId]) {
        usedInRound.add(userMatch.awayClubId);
        const as = map[userMatch.awayClubId];
        as.played += 1;
        as.goalsFor += userMatch.awayScore;
        as.goalsAgainst += userMatch.homeScore;
        as.goalDifference = as.goalsFor - as.goalsAgainst;
        if (userMatch.awayScore > userMatch.homeScore) { as.won += 1; as.points += 3; as.form.push('V'); }
        else if (userMatch.awayScore === userMatch.homeScore) { as.drawn += 1; as.points += 1; as.form.push('E'); }
        else { as.lost += 1; as.form.push('D'); }
      }
    }

    const n = rot.length;
    for (let i = 0; i < n / 2; i++) {
      const hId = rot[i];
      const aId = rot[n - 1 - i];
      if (usedInRound.has(hId) || usedInRound.has(aId)) continue;
      const hClub = participants.find(p => p.id === hId)!;
      const aClub = participants.find(p => p.id === aId)!;
      const sim = simulateMatchScore(hClub, aClub, seasonYear, r + 50);

      const hs = map[hId];
      const as = map[aId];
      hs.played += 1; hs.goalsFor += sim.homeScore; hs.goalsAgainst += sim.awayScore; hs.goalDifference = hs.goalsFor - hs.goalsAgainst;
      as.played += 1; as.goalsFor += sim.awayScore; as.goalsAgainst += sim.homeScore; as.goalDifference = as.goalsFor - as.goalsAgainst;
      if (sim.homeScore > sim.awayScore) { hs.won += 1; hs.points += 3; hs.form.push('V'); as.lost += 1; as.form.push('D'); }
      else if (sim.homeScore === sim.awayScore) { hs.drawn += 1; hs.points += 1; as.drawn += 1; as.points += 1; hs.form.push('E'); as.form.push('E'); }
      else { as.won += 1; as.points += 3; as.form.push('V'); hs.lost += 1; hs.form.push('D'); }
    }

    const fixed = rot[0];
    const rest = rot.slice(1);
    rest.unshift(rest.pop()!);
    rot = [fixed, ...rest];
  }

  return {
    cupName,
    shortName,
    completedRounds,
    standings: sortStandings(map)
  };
}

export interface LeaguePlayerStatRow {
  playerName: string;
  clubId: string;
  clubName: string;
  shortName: string;
  goals: number;
  assists: number;
  isUser?: boolean;
}

/**
 * Consolida Artilharia e Líderes de Assistências de uma liga a partir das partidas simuladas
 * e reconcilia com as estatísticas reais do jogador.
 */
export function getLeagueTopScorersAndAssists(
  leagueId: string,
  player?: PlayerProfile
): { topScorers: LeaguePlayerStatRow[]; topAssisters: LeaguePlayerStatRow[] } {
  ensureSupplementalClubsHydrated();
  const normLeagueId = normalizeLeagueId(leagueId);
  const seasonYear = player?.seasonYear || 2026;
  const userClub = player ? CLUBS[player.currentClub] : undefined;
  const worldState = loadWorldSyncState();
  const leagueState = worldState && worldState.seasonYear === seasonYear ? worldState.leagues?.[normLeagueId] : undefined;

  const playerMap: Record<string, LeaguePlayerStatRow> = {};

  const addEntry = (
    name: string,
    clubId: string,
    clubName: string,
    shortName: string,
    goalsDelta: number,
    assistsDelta: number,
    isUser = false
  ) => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const key = isUser ? '__USER__' : `${clubId}::${cleanName.toLowerCase()}`;
    if (!playerMap[key]) {
      playerMap[key] = {
        playerName: cleanName,
        clubId,
        clubName,
        shortName,
        goals: 0,
        assists: 0,
        isUser
      };
    }
    playerMap[key].goals += goalsDelta;
    playerMap[key].assists += assistsDelta;
  };

  const pickAssister = (club: Club | undefined, scorerName: string, seed: number): string | undefined => {
    if (!club || !club.squad || club.squad.length < 2) return undefined;
    const candidates = club.squad.filter(p => p.position !== 'GOL' && p.name !== scorerName);
    if (candidates.length === 0) return undefined;
    return candidates[Math.abs(seed) % candidates.length]?.name;
  };

  const userFullName = player ? `${player.name} ${player.surname}`.toLowerCase() : '';
  const userSurname = player ? player.surname.toLowerCase() : '';

  const isUserNameMatch = (candidateName: string, clubId: string): boolean => {
    if (!player || !userClub || clubId !== userClub.id) return false;
    const lower = candidateName.trim().toLowerCase();
    return lower === userFullName || lower === userSurname;
  };

  const roundMatchesMap: Record<string, MatchScoreResult[]> = (leagueState?.roundMatches as any) || {};
  Object.entries(roundMatchesMap).forEach(([roundKey, matches]) => {
    (matches || []).forEach((m: MatchScoreResult, mIdx: number) => {
      const homeClub = CLUBS[m.homeClubId] || CLUBS[m.homeClubName];
      const awayClub = CLUBS[m.awayClubId] || CLUBS[m.awayClubName];

      (m.homeScorers || []).forEach((s, sIdx) => {
        const isUser = isUserNameMatch(s.name, m.homeClubId);
        addEntry(
          isUser && player ? `${player.name} "${player.surname}"` : s.name,
          m.homeClubId,
          m.homeClubName,
          homeClub?.shortName || m.homeClubName,
          1,
          0,
          isUser
        );
        if (!s.isPenalty && pseudoHash(`${seasonYear}_${roundKey}_${mIdx}_ha_${sIdx}`) % 10 < 7) {
          const assister = pickAssister(homeClub, s.name, pseudoHash(`${roundKey}_${mIdx}_${sIdx}_h`));
          if (assister && !isUserNameMatch(assister, m.homeClubId)) {
            addEntry(assister, m.homeClubId, m.homeClubName, homeClub?.shortName || m.homeClubName, 0, 1, false);
          }
        }
      });

      (m.awayScorers || []).forEach((s, sIdx) => {
        const isUser = isUserNameMatch(s.name, m.awayClubId);
        addEntry(
          isUser && player ? `${player.name} "${player.surname}"` : s.name,
          m.awayClubId,
          m.awayClubName,
          awayClub?.shortName || m.awayClubName,
          1,
          0,
          isUser
        );
        if (!s.isPenalty && pseudoHash(`${seasonYear}_${roundKey}_${mIdx}_aa_${sIdx}`) % 10 < 7) {
          const assister = pickAssister(awayClub, s.name, pseudoHash(`${roundKey}_${mIdx}_${sIdx}_a`));
          if (assister && !isUserNameMatch(assister, m.awayClubId)) {
            addEntry(assister, m.awayClubId, m.awayClubName, awayClub?.shortName || m.awayClubName, 0, 1, false);
          }
        }
      });
    });
  });

  // Reconcilia estatísticas totais da temporada do jogador se pertencer a esta liga
  if (player && userClub && normalizeLeagueId(userClub.leagueId) === normLeagueId) {
    const g = player.currentSeasonStats?.goals || 0;
    const a = player.currentSeasonStats?.assists || 0;
    if (g > 0 || a > 0 || playerMap['__USER__']) {
      playerMap['__USER__'] = {
        playerName: `${player.name} "${player.surname}"`,
        clubId: userClub.id,
        clubName: userClub.name,
        shortName: userClub.shortName,
        goals: Math.max(g, playerMap['__USER__']?.goals || 0),
        assists: Math.max(a, playerMap['__USER__']?.assists || 0),
        isUser: true
      };
    }
  }

  // Fallback informativo antes da primeira rodada simulada
  const entries = Object.values(playerMap);
  const topScorers = entries
    .filter(e => e.goals > 0)
    .sort((a, b) => (b.goals - a.goals) || (b.assists - a.assists) || a.playerName.localeCompare(b.playerName))
    .slice(0, 15);

  const topAssisters = entries
    .filter(e => e.assists > 0)
    .sort((a, b) => (b.assists - a.assists) || (b.goals - a.goals) || a.playerName.localeCompare(b.playerName))
    .slice(0, 15);

  return { topScorers, topAssisters };
}
