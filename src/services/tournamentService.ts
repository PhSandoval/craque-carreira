import { Club, PlayerProfile, MatchFixture, LeagueStanding } from '../types';
import { CLUBS } from '../data/clubs';
import { LEAGUES } from '../data/leagues';
import { NATIONAL_TEAMS, getNationalTeamForPlayer, NationalTeam } from '../data/nationalTeams';
import { getSynchronizedLeagueStandings, ensureSupplementalClubsHydrated } from './syncLeagueSimulationService';

/**
 * Mapeamento e inteligência de competições (Estaduais, Copas Nacionais e Continentais)
 */

export function getClubCompetitions(club: Club): {
  stateCupName?: string;
  stateCupShort?: string;
  nationalCupName: string;
  nationalCupShort: string;
  continentalCupName?: string;
  continentalCupShort?: string;
  continentalBadge: string;
} {
  const clubId = club.id.toLowerCase();
  const country = club.country || 'Brasil';

  // 1. Brasil: Campeonato Estadual primeiro (Paulista, Carioca, Mineiro, Gaúcho), Copa do Brasil, Libertadores e Brasileirão
  if (country === 'Brasil') {
    const isSP = ['novorizontino', 'santos', 'mirassol', 'palmeiras', 'corinthians', 'sao_paulo', 'red_bull_bragantino', 'ponte_preta', 'guarani', 'ituano', 'botafogo_sp', 'sao_bernardo'].includes(clubId);
    const isRJ = ['flamengo', 'botafogo', 'fluminense', 'vasco', 'bangu', 'madureira', 'volta_redonda'].includes(clubId);
    const isMG = ['atletico_mg', 'cruzeiro', 'america_mg'].includes(clubId);
    const isRS = ['internacional', 'gremio', 'juventude', 'caxias'].includes(clubId);
    const isPR = ['athletico_pr', 'coritiba', 'operario'].includes(clubId);

    const stateCupName = isSP 
      ? 'Campeonato Paulista' 
      : isRJ 
      ? 'Campeonato Carioca' 
      : isMG 
      ? 'Campeonato Mineiro' 
      : isRS 
      ? 'Campeonato Gaúcho' 
      : isPR
      ? 'Campeonato Paranaense'
      : 'Copa do Nordeste';

    const stateCupShort = isSP ? 'Paulistão' : isRJ ? 'Cariocão' : isMG ? 'Mineiro' : isRS ? 'Gauchão' : isPR ? 'Paranaense' : 'Nordestão';

    const isLibertadores = club.prestige >= 4 || ['palmeiras', 'flamengo', 'botafogo', 'atletico_mg', 'sao_paulo', 'fluminense', 'gremio', 'internacional', 'corinthians', 'fortaleza', 'bahia'].includes(clubId);
    const hasContinental = club.leagueId === 'serie_a' || isLibertadores;

    return {
      stateCupName,
      stateCupShort,
      nationalCupName: 'Copa do Brasil',
      nationalCupShort: 'Copa do BR',
      continentalCupName: hasContinental ? (isLibertadores ? 'CONMEBOL Libertadores' : 'CONMEBOL Sul-Americana') : undefined,
      continentalCupShort: hasContinental ? (isLibertadores ? 'Libertadores' : 'Sul-Americana') : undefined,
      continentalBadge: isLibertadores ? '⭐' : '🛡️'
    };
  }

  // 2. Argentina: Copa Argentina + Libertadores / Sul-Americana
  if (country === 'Argentina') {
    const isLibertadores = club.prestige >= 4 || ['river_plate', 'boca_juniors', 'racing_arg', 'talleres', 'velez', 'estudiantes'].includes(clubId);
    return {
      nationalCupName: 'Copa Argentina',
      nationalCupShort: 'Copa Argentina',
      continentalCupName: isLibertadores ? 'CONMEBOL Libertadores' : 'CONMEBOL Sul-Americana',
      continentalCupShort: isLibertadores ? 'Libertadores' : 'Sul-Americana',
      continentalBadge: isLibertadores ? '⭐' : '🛡️'
    };
  }

  // 3. Arábia Saudita: King's Cup + AFC Champions League Elite
  if (country === 'Arábia Saudita') {
    return {
      nationalCupName: 'King\'s Cup (Copa do Rei Saudita)',
      nationalCupShort: 'King\'s Cup',
      continentalCupName: club.prestige >= 3 ? 'AFC Champions League Elite' : undefined,
      continentalCupShort: club.prestige >= 3 ? 'AFC Champions' : undefined,
      continentalBadge: '⭐'
    };
  }

  // 4. Todas as Ligas Europeias: Champions League (Elite), Europa League (Média-Alta) e Conference League (Emergentes)
  const nationalCupsByEuroCountry: Record<string, { full: string; short: string }> = {
    'Inglaterra': { full: 'Emirates FA Cup', short: 'FA Cup' },
    'Espanha': { full: 'Copa del Rey', short: 'Copa del Rey' },
    'Itália': { full: 'Coppa Italia Frecciarossa', short: 'Coppa Italia' },
    'Alemanha': { full: 'DFB-Pokal', short: 'DFB-Pokal' },
    'França': { full: 'Coupe de France', short: 'Coupe de France' },
    'Portugal': { full: 'Taça de Portugal', short: 'Taça de Portugal' },
    'Holanda': { full: 'KNVB Beker (Copa da Holanda)', short: 'KNVB Beker' },
    'Turquia': { full: 'Türkiye Kupası', short: 'Copa da Turquia' },
    'Rússia': { full: 'FONBET Copa da Rússia', short: 'Copa da Rússia' },
    'Escócia': { full: 'Scottish Gas Scottish Cup', short: 'Scottish Cup' },
    'Bélgica': { full: 'Croky Cup (Copa da Bélgica)', short: 'Croky Cup' },
    'Grécia': { full: 'Kypello Elladas (Copa da Grécia)', short: 'Copa da Grécia' }
  };

  const natCup = nationalCupsByEuroCountry[country] || { full: `Copa Nacional (${country})`, short: 'Copa Nacional' };
  const isSecondDivEuro = club.leagueId === 'championship' || club.leagueId === 'serie_b_ita';

  if (isSecondDivEuro) {
    return {
      nationalCupName: natCup.full,
      nationalCupShort: natCup.short,
      continentalBadge: '🛡️'
    };
  }

  const uclEliteIds = [
    'mci', 'manchester_city', 'arsenal', 'liverpool', 'aston_villa', 'chelsea',
    'real_madrid', 'barcelona', 'atletico_madrid', 'girona',
    'inter', 'milan', 'juventus', 'atalanta', 'bologna', 'napoli',
    'bayern', 'leverkusen', 'dortmund', 'leipzig', 'stuttgart',
    'psg', 'monaco', 'brest', 'lille',
    'sporting', 'benfica', 'porto',
    'psv', 'feyenoord', 'ajax',
    'galatasaray', 'fenerbahce',
    'celtic', 'rangers',
    'club_brugge', 'union_sg',
    'olympiacos', 'paok',
    'zenit', 'krasnodar', 'spartak_moscow'
  ];

  const europaIds = [
    'man_utd', 'tottenham', 'newcastle',
    'athletic_bilbao', 'real_sociedad', 'betis', 'villarreal',
    'roma', 'lazio', 'fiorentina',
    'frankfurt', 'hoffenheim',
    'lyon', 'nice', 'marseille',
    'braga', 'vitoria_sc',
    'az_alkmaar', 'twente',
    'besiktas', 'trabzonspor',
    'anderlecht', 'genk',
    'panathinaikos', 'aek_athens',
    'cska_moscow', 'dynamo_moscow', 'lokomotiv_moscow'
  ];

  let contName = 'UEFA Conference League';
  let contShort = 'Conference League';
  let contBadge = '🟢';

  if (club.prestige >= 5 || uclEliteIds.includes(clubId)) {
    contName = 'UEFA Champions League';
    contShort = 'Champions League';
    contBadge = '⭐';
  } else if (club.prestige === 4 || europaIds.includes(clubId)) {
    contName = 'UEFA Europa League';
    contShort = 'Europa League';
    contBadge = '🟠';
  }

  return {
    nationalCupName: natCup.full,
    nationalCupShort: natCup.short,
    continentalCupName: contName,
    continentalCupShort: contShort,
    continentalBadge: contBadge
  };
}

export interface ActiveSeasonCompetition {
  id: string;
  name: string;
  shortName: string;
  category: 'state' | 'national_cup' | 'continental' | 'league' | 'international';
  badgeIcon: string;
  badgeUrl?: string;
  statusText: string;
  currentStage: string;
  isKnockout: boolean;
  roundsRange: string;
  trophyTitle: string;
  isActiveNow: boolean;
  isCompleted: boolean;
}

/**
 * Retorna as 4 grandes competições oficiais que o clube disputa na temporada
 * para exibição no Dashboard e na Sala de Troféus.
 */
export function getActiveSeasonCompetitions(
  club: Club,
  currentMatchDay: number,
  seasonYear: number,
  eliminatedCompetitions: string[] = [],
  seasonTitlesWon: string[] = []
): ActiveSeasonCompetition[] {
  const comps = getClubCompetitions(club);
  const isBrazil = (club.country || 'Brasil') === 'Brasil';

  const list: ActiveSeasonCompetition[] = [];

  // 1. ESTADUAL (Se clube brasileiro)
  if (isBrazil && comps.stateCupName) {
    const isEliminatedState = eliminatedCompetitions.includes('state_cup');
    const wonState = seasonTitlesWon.some(t => t.includes(comps.stateCupName!));
    const isCompleted = currentMatchDay > 8 || isEliminatedState || wonState;
    const isActiveNow = currentMatchDay <= 8 && !isEliminatedState;
    let currentStage = 'Fase de Grupos';
    if (wonState) currentStage = '🏆 Campeão Estadual!';
    else if (isEliminatedState) currentStage = 'Eliminado no Mata-Mata';
    else if (currentMatchDay === 4) currentStage = 'Clássico Regional';
    else if (currentMatchDay === 6) currentStage = 'Quartas de Final (Mata-mata)';
    else if (currentMatchDay === 7) currentStage = 'Semifinal do Estadual';
    else if (currentMatchDay === 8) currentStage = 'A Grande Final da Taça!';
    else if (isCompleted) currentStage = 'Temporada Encerrada';

    list.push({
      id: 'state_cup',
      name: comps.stateCupName,
      shortName: comps.stateCupShort || 'Estadual',
      category: 'state',
      badgeIcon: 'trophy',
      statusText: wonState
        ? '🏆 Taça Conquistada!'
        : isEliminatedState
        ? '❌ Eliminado nesta Edição'
        : isActiveNow
        ? `Em Disputa (Rodadas 1 a 8)`
        : `Finalizado (Campeão Decidido)`,
      currentStage,
      isKnockout: currentMatchDay >= 6,
      roundsRange: 'Rodadas 1 a 8',
      trophyTitle: `Taça do ${comps.stateCupName}`,
      isActiveNow,
      isCompleted
    });
  }

  // 2. LIGA NACIONAL (Brasileirão, Premier League, La Liga, etc.)
  const leagueStartRound = isBrazil ? 9 : 1;
  const isLeagueActive = currentMatchDay >= leagueStartRound && currentMatchDay <= 38;
  const isLeagueCompleted = currentMatchDay > 38;
  const currentLeagueRoundNum = isBrazil ? Math.max(1, currentMatchDay - 8) : currentMatchDay;
  list.push({
    id: 'league',
    name: club.league,
    shortName: club.league.split(' ')[0],
    category: 'league',
    badgeIcon: 'shield',
    statusText: isLeagueActive 
      ? `Em Andamento (${isBrazil ? `${currentLeagueRoundNum}ª Rodada da Liga` : `Rodada ${currentMatchDay} de 38`})`
      : currentMatchDay < leagueStartRound 
      ? `Inicia após o Estadual (Semana ${leagueStartRound})` 
      : 'Temporada Concluída',
    currentStage: isLeagueActive ? `Pontos Corridos • Classificação Viva` : `Aguardando Fim do Estadual`,
    isKnockout: false,
    roundsRange: isBrazil ? 'Semanas 9 a 38' : 'Rodadas 1 a 38',
    trophyTitle: `Troféu ${club.league}`,
    isActiveNow: isLeagueActive,
    isCompleted: isLeagueCompleted
  });

  // 3. COPA NACIONAL (Copa do Brasil, FA Cup, Copa del Rey, etc.)
  const cupRounds = isBrazil ? [11, 16, 22, 29, 34] : [6, 14, 22, 29, 35];
  const finalCupRound = cupRounds[cupRounds.length - 1];
  const isEliminatedCup = eliminatedCompetitions.includes('national_cup');
  const wonCup = seasonTitlesWon.some(t => t.includes(comps.nationalCupName));
  const isCupCompleted = currentMatchDay > finalCupRound || isEliminatedCup || wonCup;
  const isCupActive = currentMatchDay >= cupRounds[0] && !isCupCompleted;
  let cupStage = `Inicia na Semana ${cupRounds[0]}`;
  if (wonCup) cupStage = '🏆 Campeão da Copa!';
  else if (isEliminatedCup) cupStage = 'Eliminado no Mata-Mata';
  else if (currentMatchDay >= 34) cupStage = 'Grande Final da Taça!';
  else if (currentMatchDay >= 29) cupStage = 'Semifinal da Copa';
  else if (currentMatchDay >= 22) cupStage = 'Quartas de Final';
  else if (currentMatchDay >= 16) cupStage = 'Oitavas de Final';
  else if (currentMatchDay >= cupRounds[0]) cupStage = 'Fase Eliminatória Nacional';

  list.push({
    id: 'national_cup',
    name: comps.nationalCupName,
    shortName: comps.nationalCupShort,
    category: 'national_cup',
    badgeIcon: 'flame',
    statusText: wonCup
      ? '🏆 Taça Conquistada!'
      : isEliminatedCup
      ? '❌ Eliminado nesta Edição'
      : isCupActive
      ? 'Mata-Mata em Andamento'
      : isCupCompleted
      ? 'Taça Entregue'
      : `Inicia na Semana ${cupRounds[0]}`,
    currentStage: cupStage,
    isKnockout: true,
    roundsRange: `Semanas ${cupRounds.join(', ')}`,
    trophyTitle: `Taça da ${comps.nationalCupName}`,
    isActiveNow: isCupActive,
    isCompleted: isCupCompleted
  });

  // 4. COPA CONTINENTAL (Libertadores, Champions League, Sul-Americana)
  if (comps.continentalCupName) {
    const contRounds = isBrazil ? [13, 19, 25, 31, 35, 37] : [4, 11, 18, 25, 31, 37];
    const isEliminatedCont = eliminatedCompetitions.includes('continental_cup');
    const wonCont = seasonTitlesWon.some(t => t.includes(comps.continentalCupName!));
    const isContCompleted = currentMatchDay > 37 || isEliminatedCont || wonCont;
    const isContActive = currentMatchDay >= contRounds[0] && !isContCompleted;
    let contStage = `Inicia na Semana ${contRounds[0]}`;
    if (wonCont) contStage = '🏆 Campeão Continental!';
    else if (isEliminatedCont) contStage = 'Eliminado no Mata-Mata';
    else if (currentMatchDay >= 37) contStage = 'A Grande Final Continental!';
    else if (currentMatchDay >= 35) contStage = 'Semifinal Continental';
    else if (currentMatchDay >= 31) contStage = 'Quartas de Final';
    else if (currentMatchDay >= (isBrazil ? 25 : 18)) contStage = 'Oitavas de Final (Mata-Mata)';
    else if (currentMatchDay >= contRounds[0]) contStage = 'Fase de Grupos Continental';

    list.push({
      id: 'continental_cup',
      name: comps.continentalCupName,
      shortName: comps.continentalCupShort || 'Continental',
      category: 'continental',
      badgeIcon: comps.continentalBadge,
      statusText: wonCont
        ? '🏆 Glória Eterna Conquistada!'
        : isEliminatedCont
        ? '❌ Eliminado no Mata-Mata'
        : isContActive
        ? 'Fase Decisiva da Glória Eterna'
        : isContCompleted
        ? 'Temporada Encerrada'
        : `Inicia na Semana ${contRounds[0]}`,
      currentStage: contStage,
      isKnockout: currentMatchDay >= (isBrazil ? 25 : 18),
      roundsRange: `Semanas ${contRounds.join(', ')}`,
      trophyTitle: `Troféu da ${comps.continentalCupName}`,
      isActiveNow: isContActive,
      isCompleted: isContCompleted
    });
  }

  return list;
}

/**
 * Converte um objeto de Seleção Nacional para a interface compatível de Clube
 * para alimentar os motores de escalação, radar de campo e simulação de partida
 */
export function nationalTeamToClub(nt: NationalTeam): Club {
  return {
    id: nt.id,
    name: nt.name,
    shortName: nt.shortName,
    badgeUrl: nt.flag,
    leagueId: 'international',
    league: 'Futebol Internacional de Seleções',
    country: nt.country,
    stadium: nt.stadium,
    prestige: 5,
    formation: nt.formation,
    budgetEur: 500.0,
    colors: nt.colors,
    rivalClubs: ['Brasil', 'Argentina', 'França', 'Inglaterra', 'Alemanha'],
    playStyle: `Futebol internacional de seleções sob o comando de ${nt.coachName}`,
    coachName: nt.coachName,
    squad: nt.squad
  };
}

/**
 * Seleciona deterministicamente um adversário de Seleção Nacional diferente do país do atleta
 */
function pickNationalTeamOpponent(userCountry: string, seed: number): Club {
  const allNTs = Object.values(NATIONAL_TEAMS).filter(nt => nt.country !== userCountry);
  const selectedNT = allNTs[Math.abs(seed) % allNTs.length] || allNTs[0];
  return nationalTeamToClub(selectedNT);
}

/**
 * Selecionador determinístico de adversário baseado em semente matemática.
 * Garante que a rodada não mude de adversário a cada render ou movimento de mouse,
 * eliminando gargalos de performance e congelamentos de tela.
 */
function pickDeterministicOpponent(candidates: Club[], seed: number): Club {
  if (!candidates || candidates.length === 0) return Object.values(CLUBS)[0];
  const idx = Math.abs(seed) % candidates.length;
  return candidates[idx];
}

/**
 * Determina o confronto oficial da rodada atual do atleta (intercalando Liga com Taças e Seleções)
 */
export function getNextMatchFixture(player: PlayerProfile): MatchFixture {
  ensureSupplementalClubsHydrated();
  const currentClubObj = CLUBS[player.currentClub] || Object.values(CLUBS)[0];
  const comps = getClubCompetitions(currentClubObj);
  const matchDay = player.currentMatchDay;
  const allClubs = Object.values(CLUBS);

  // Semente determinística única para o jogador, ano e rodada
  const fixtureSeed = (player.seasonYear * 100 + matchDay) * 31 + (player.id ? player.id.charCodeAt(player.id.length - 1) : 7);

  // Avaliação de Convocação para a Seleção Nacional
  const userNT = getNationalTeamForPlayer(player.nationality);
  const isCalledUpForNationalTeam = player.ovr >= 74 || (player.currentSeasonStats?.goals || 0) >= 4;

  // -------------------------------------------------------------------
  // 1. DATA FIFA: ELIMINATÓRIAS DA COPA DO MUNDO (Rodadas 10 e 24)
  // -------------------------------------------------------------------
  if (isCalledUpForNationalTeam && [10, 24].includes(matchDay)) {
    const oppTeam = pickNationalTeamOpponent(userNT.country, fixtureSeed);

    return {
      competitionType: 'world_cup_qualifiers',
      competitionName: 'Eliminatórias da Copa do Mundo FIFA',
      competitionShort: 'Eliminatórias',
      stageName: matchDay === 10 ? 'Data FIFA • Superclássico de Seleções' : 'Data FIFA • Reta Decisiva das Eliminatórias',
      badgeIcon: '⭐',
      opponent: oppTeam,
      roundNumber: matchDay,
      isCupKnockout: false,
      isNationalTeamMatch: true,
      nationalTeamName: userNT.name,
      nationalTeamFlag: userNT.flag,
      nationalOpponentFlag: oppTeam.badgeUrl
    };
  }

  // -------------------------------------------------------------------
  // 2. TORNEIOS INTERNACIONAIS DE VERÃO: COPA DO MUNDO & COPA AMÉRICA (Rodada 38)
  // -------------------------------------------------------------------
  if (isCalledUpForNationalTeam && matchDay === 38) {
    const isWorldCupYear = (player.seasonYear % 2 === 0);
    const oppTeam = pickNationalTeamOpponent(userNT.country, fixtureSeed + 77);

    if (isWorldCupYear) {
      return {
        competitionType: 'world_cup',
        competitionName: 'Copa do Mundo da FIFA',
        competitionShort: 'Copa do Mundo',
        stageName: 'A Grande Final da Copa do Mundo da FIFA!',
        badgeIcon: 'trophy',
        opponent: oppTeam,
        roundNumber: matchDay,
        isCupKnockout: true,
        trophyName: `Campeão da Copa do Mundo da FIFA (${player.seasonYear})`,
        isNationalTeamMatch: true,
        nationalTeamName: userNT.name,
        nationalTeamFlag: userNT.flag,
        nationalOpponentFlag: oppTeam.badgeUrl
      };
    } else {
      const isSouthAmerica = userNT.confederation === 'CONMEBOL';
      const cupName = isSouthAmerica ? 'CONMEBOL Copa América' : 'UEFA Eurocopa';
      const cupShort = isSouthAmerica ? 'Copa América' : 'Eurocopa';

      return {
        competitionType: 'copa_america',
        competitionName: cupName,
        competitionShort: cupShort,
        stageName: `A Grande Final da ${cupShort}!`,
        badgeIcon: 'trophy',
        opponent: oppTeam,
        roundNumber: matchDay,
        isCupKnockout: true,
        trophyName: `Campeão da ${cupName} (${player.seasonYear})`,
        isNationalTeamMatch: true,
        nationalTeamName: userNT.name,
        nationalTeamFlag: userNT.flag,
        nationalOpponentFlag: oppTeam.badgeUrl
      };
    }
  }

  // -------------------------------------------------------------------
  // CALENDÁRIO MULTICOMPETIÇÃO REALISTA DE CLUBES (COM ELIMINAÇÃO REAL EM MATA-MATA)
  // -------------------------------------------------------------------
  const isBrazil = (currentClubObj.country || 'Brasil') === 'Brasil';
  const eliminated = player.eliminatedCompetitions || [];

  // 1. CALENDÁRIO BRASILEIRO OFICIAL: ESTADUAL PRIMEIRO (Rodadas 1 a 8, exceto se já eliminado no mata-mata!)
  if (isBrazil && comps.stateCupName && matchDay <= 8 && !(matchDay >= 7 && eliminated.includes('state_cup'))) {
    // Filtra clubes do mesmo estado para o Campeonato Estadual
    const clubId = currentClubObj.id.toLowerCase();
    const isSP = ['novorizontino', 'santos', 'mirassol', 'palmeiras', 'corinthians', 'sao_paulo', 'red_bull_bragantino', 'ponte_preta', 'guarani', 'ituano', 'botafogo_sp', 'sao_bernardo'].includes(clubId);
    const isRJ = ['flamengo', 'botafogo', 'fluminense', 'vasco', 'bangu', 'madureira', 'volta_redonda'].includes(clubId);
    const isMG = ['atletico_mg', 'cruzeiro', 'america_mg'].includes(clubId);
    const isRS = ['internacional', 'gremio', 'juventude', 'caxias'].includes(clubId);

    let stateClubs: Club[] = [];
    if (isSP) {
      stateClubs = allClubs.filter(c => 
        ['novorizontino', 'santos', 'mirassol', 'palmeiras', 'corinthians', 'sao_paulo', 'red_bull_bragantino', 'ponte_preta', 'guarani', 'ituano', 'botafogo_sp', 'sao_bernardo'].includes(c.id.toLowerCase()) &&
        c.name !== player.currentClub
      );
    } else if (isRJ) {
      stateClubs = allClubs.filter(c => 
        ['flamengo', 'botafogo', 'fluminense', 'vasco', 'bangu', 'madureira', 'volta_redonda'].includes(c.id.toLowerCase()) &&
        c.name !== player.currentClub
      );
    } else if (isMG) {
      stateClubs = allClubs.filter(c => 
        ['atletico_mg', 'cruzeiro', 'america_mg'].includes(c.id.toLowerCase()) &&
        c.name !== player.currentClub
      );
    } else if (isRS) {
      stateClubs = allClubs.filter(c => 
        ['internacional', 'gremio', 'juventude', 'caxias'].includes(c.id.toLowerCase()) &&
        c.name !== player.currentClub
      );
    }

    const stateCandidates = stateClubs.length > 0 ? stateClubs : allClubs.filter(c => c.country === 'Brasil' && c.name !== player.currentClub);

    let stageName = 'Fase de Grupos';
    let isFinal = false;
    let isKnockout = false;

    if (matchDay === 1) stageName = 'Fase de Grupos • Estreia do Estadual';
    else if (matchDay === 2) stageName = 'Fase de Grupos';
    else if (matchDay === 3) stageName = 'Fase de Grupos';
    else if (matchDay === 4) stageName = 'Clássico Regional Estadual';
    else if (matchDay === 5) stageName = 'Fase de Grupos • Rodada Decisiva';
    else if (matchDay === 6) { stageName = 'Quartas de Final (Mata-mata)'; isKnockout = true; }
    else if (matchDay === 7) { stageName = 'Semifinal do Estadual'; isKnockout = true; }
    else if (matchDay === 8) {
      stageName = `A Grande Final do ${comps.stateCupShort}!`;
      isFinal = true;
      isKnockout = true;
    }

    // No clássico da rodada 4, prioriza rival histórico se houver
    let opponent: Club;
    if (matchDay === 4 && currentClubObj.rivalClubs && currentClubObj.rivalClubs.length > 0) {
      const rivalName = currentClubObj.rivalClubs[fixtureSeed % currentClubObj.rivalClubs.length];
      opponent = CLUBS[rivalName] || pickDeterministicOpponent(stateCandidates, fixtureSeed);
    } else {
      opponent = pickDeterministicOpponent(stateCandidates, fixtureSeed + matchDay * 7);
    }

    return {
      competitionType: 'state_cup',
      competitionName: comps.stateCupName,
      competitionShort: comps.stateCupShort || 'Estadual',
      stageName,
      badgeIcon: 'trophy',
      opponent,
      roundNumber: matchDay,
      isCupKnockout: isKnockout,
      trophyName: isFinal ? `Campeão do ${comps.stateCupName} (${player.seasonYear})` : undefined
    };
  }

  // 2. COPA CONTINENTAL (UEFA Champions League / Europa League / Conference League / CONMEBOL Libertadores / Sul-Americana)
  const contRounds = isBrazil ? [13, 19, 25, 31, 35, 37] : [4, 11, 18, 25, 31, 37];
  const isContKnockoutPhase = matchDay >= (isBrazil ? 25 : 18);
  if (comps.continentalCupName && contRounds.includes(matchDay) && !(isContKnockoutPhase && eliminated.includes('continental_cup'))) {
    const cupName = comps.continentalCupName;
    const isChampions = cupName.includes('UEFA Champions');
    const isEuropa = cupName.includes('Europa League');
    const isConference = cupName.includes('Conference League');
    const isLiberta = cupName.includes('Libertadores');
    const isSula = cupName.includes('Sul-Americana');

    const euroCountries = ['Inglaterra', 'Espanha', 'Alemanha', 'Itália', 'França', 'Portugal', 'Holanda', 'Turquia', 'Rússia', 'Escócia', 'Bélgica', 'Grécia', 'Ucrânia', 'Áustria', 'República Tcheca', 'Croácia', 'Sérvia', 'Suíça', 'Dinamarca', 'Noruega', 'Suécia', 'Hungria', 'Polônia', 'Romênia', 'Bulgária', 'Eslováquia', 'Azerbaijão', 'Chipre'];
    const southAmCountries = ['Brasil', 'Argentina', 'Uruguai', 'Chile', 'Paraguai', 'Colômbia', 'Equador', 'Bolívia', 'Peru', 'Venezuela'];

    const pool = allClubs.filter(c => {
      if (c.name === player.currentClub) return false;
      if (isChampions) {
        return c.continentalTournament === 'champions' || (!c.isContinentalOnly && euroCountries.includes(c.country) && c.prestige >= 4);
      }
      if (isEuropa) {
        return c.continentalTournament === 'europa_league' || (!c.isContinentalOnly && euroCountries.includes(c.country) && (c.prestige === 4 || c.prestige === 3));
      }
      if (isConference) {
        return c.continentalTournament === 'conference_league' || (!c.isContinentalOnly && euroCountries.includes(c.country) && c.prestige <= 3);
      }
      if (isLiberta) {
        return c.continentalTournament === 'libertadores' || (!c.isContinentalOnly && southAmCountries.includes(c.country) && c.prestige >= 4);
      }
      if (isSula) {
        return c.continentalTournament === 'sul_americana' || (!c.isContinentalOnly && southAmCountries.includes(c.country) && c.prestige <= 3 && c.leagueId !== 'serie_c');
      }
      return c.country === 'Arábia Saudita' || c.prestige >= 4;
    });

    const opponent = pickDeterministicOpponent(pool.length > 0 ? pool : allClubs, fixtureSeed + 13 + matchDay);

    let stageName = 'Fase de Grupos Continental';
    let isFinal = false;
    let isKnockout = false;

    if (matchDay === (isBrazil ? 19 : 11)) stageName = 'Fase de Grupos • Duelo Decisivo';
    if (matchDay === (isBrazil ? 25 : 18)) { stageName = 'Oitavas de Final (Mata-Mata)'; isKnockout = true; }
    if (matchDay === (isBrazil ? 31 : 25)) { stageName = 'Quartas de Final Continental'; isKnockout = true; }
    if (matchDay === 35 || (!isBrazil && matchDay === 31)) { stageName = 'Semifinal Continental'; isKnockout = true; }
    if (matchDay === 37) {
      stageName = `A Grande Final da ${comps.continentalCupShort}!`;
      isFinal = true;
      isKnockout = true;
    }

    return {
      competitionType: 'continental_cup',
      competitionName: comps.continentalCupName,
      competitionShort: comps.continentalCupShort || 'Continental',
      stageName,
      badgeIcon: comps.continentalBadge,
      opponent,
      roundNumber: matchDay,
      isCupKnockout: isKnockout,
      trophyName: isFinal ? `Campeão da ${comps.continentalCupName} (${player.seasonYear})` : undefined
    };
  }

  // 3. COPA NACIONAL (Copa do Brasil / Emirates FA Cup / Copa del Rey / Coppa Italia / etc.)
  const cupRounds = isBrazil ? [11, 16, 22, 29, 34] : [6, 14, 22, 29, 35];
  if (cupRounds.includes(matchDay) && !eliminated.includes('national_cup')) {
    const nationalPool = allClubs.filter(c => c.country === currentClubObj.country && c.name !== player.currentClub);
    const opponent = pickDeterministicOpponent(nationalPool.length > 0 ? nationalPool : allClubs, fixtureSeed + 29);

    let stageName = isBrazil ? '3ª Fase Eliminatória da Copa' : 'Fase Classificatória da Copa';
    let isFinal = false;

    if (matchDay === (isBrazil ? 16 : 14)) stageName = 'Oitavas de Final da Taça';
    if (matchDay === 22) stageName = 'Quartas de Final da Taça';
    if (matchDay === 29) stageName = 'Semifinal da Copa';
    if (matchDay === (isBrazil ? 34 : 35)) {
      stageName = `A Grande Final da ${comps.nationalCupShort}!`;
      isFinal = true;
    }

    return {
      competitionType: 'national_cup',
      competitionName: comps.nationalCupName,
      competitionShort: comps.nationalCupShort,
      stageName,
      badgeIcon: 'flame',
      opponent,
      roundNumber: matchDay,
      isCupKnockout: true,
      trophyName: isFinal ? `Campeão da ${comps.nationalCupName} (${player.seasonYear})` : undefined
    };
  }

  // 4. LIGA NACIONAL (Campeonato de Pontos Corridos - Brasileirão Série A/B, Premier League, La Liga, etc.)
  const leagueId = currentClubObj.leagueId || 'serie_b';
  const leagueClubs = allClubs.filter(c => c.leagueId === leagueId && c.name !== player.currentClub);
  const candidates = leagueClubs.length > 0 ? leagueClubs : allClubs.filter(c => c.country === currentClubObj.country && c.name !== player.currentClub);

  // Clássico regional da liga em rodadas específicas
  const isRivalRound = [15, 24, 32].includes(matchDay);
  if (isRivalRound && currentClubObj.rivalClubs && currentClubObj.rivalClubs.length > 0) {
    const rivalName = currentClubObj.rivalClubs[fixtureSeed % currentClubObj.rivalClubs.length];
    const rivalClub = CLUBS[rivalName];
    if (rivalClub && rivalClub.leagueId === leagueId) {
      return {
        competitionType: 'league',
        competitionName: currentClubObj.league,
        competitionShort: currentClubObj.league.split(' ')[0],
        stageName: 'Clássico Regional de Alta Tensão',
        badgeIcon: 'shield',
        opponent: rivalClub,
        roundNumber: matchDay,
        isCupKnockout: false
      };
    }
  }

  const opponent = pickDeterministicOpponent(candidates.length > 0 ? candidates : allClubs, fixtureSeed);

  return {
    competitionType: 'league',
    competitionName: currentClubObj.league,
    competitionShort: currentClubObj.league.split(' ')[0],
    stageName: isBrazil ? `Brasileirão • Rodada ${matchDay - 8} de 38` : `Rodada ${matchDay} de 38`,
    badgeIcon: 'shield',
    opponent,
    roundNumber: matchDay,
    isCupKnockout: false
  };
}

export const SUPPLEMENTAL_LEAGUE_TABLES: Record<string, { id: string; name: string; shortName: string; prestige: number }[]> = {
  serie_a: [
    { id: 'bragantino', name: 'Red Bull Bragantino', shortName: 'Bragantino', prestige: 3 },
    { id: 'vitoria', name: 'EC Vitória', shortName: 'Vitória', prestige: 3 },
    { id: 'criciuma', name: 'Criciúma EC', shortName: 'Criciúma', prestige: 2 },
    { id: 'juventude', name: 'EC Juventude', shortName: 'Juventude', prestige: 2 },
    { id: 'cuiaba', name: 'Cuiabá EC', shortName: 'Cuiabá', prestige: 2 },
    { id: 'atletico_go', name: 'Atlético Goianiense', shortName: 'Atlético-GO', prestige: 2 }
  ],
  serie_b: [
    { id: 'vila_nova', name: 'Vila Nova FC', shortName: 'Vila Nova', prestige: 3 },
    { id: 'operario', name: 'Operário Ferroviário EC', shortName: 'Operário-PR', prestige: 2 },
    { id: 'avai', name: 'Avaí FC', shortName: 'Avaí', prestige: 3 },
    { id: 'amazonas', name: 'Amazonas FC', shortName: 'Amazonas', prestige: 2 },
    { id: 'paysandu', name: 'Paysandu SC', shortName: 'Paysandu', prestige: 2 },
    { id: 'botafogo_sp', name: 'Botafogo FC (SP)', shortName: 'Botafogo-SP', prestige: 2 },
    { id: 'chapecoense', name: 'Associação Chapecoense', shortName: 'Chapecoense', prestige: 3 },
    { id: 'crb', name: 'CRB', shortName: 'CRB', prestige: 2 },
    { id: 'ponte_preta', name: 'AA Ponte Preta', shortName: 'Ponte Preta', prestige: 2 },
    { id: 'brusque', name: 'Brusque FC', shortName: 'Brusque', prestige: 2 },
    { id: 'ituano', name: 'Ituano FC', shortName: 'Ituano', prestige: 2 },
    { id: 'guarani', name: 'Guarani FC', shortName: 'Guarani', prestige: 2 }
  ],
  premier_league: [
    { id: 'west_ham', name: 'West Ham United FC', shortName: 'West Ham', prestige: 4 },
    { id: 'fulham', name: 'Fulham FC', shortName: 'Fulham', prestige: 3 },
    { id: 'bournemouth', name: 'AFC Bournemouth', shortName: 'Bournemouth', prestige: 3 },
    { id: 'brentford', name: 'Brentford FC', shortName: 'Brentford', prestige: 3 },
    { id: 'nottingham', name: 'Nottingham Forest FC', shortName: 'Nottm Forest', prestige: 3 },
    { id: 'crystal_palace', name: 'Crystal Palace FC', shortName: 'Crystal Palace', prestige: 3 },
    { id: 'wolves', name: 'Wolverhampton Wanderers FC', shortName: 'Wolves', prestige: 3 },
    { id: 'everton', name: 'Everton FC', shortName: 'Everton', prestige: 3 },
    { id: 'ipswich', name: 'Ipswich Town FC', shortName: 'Ipswich Town', prestige: 2 },
    { id: 'southampton', name: 'Southampton FC', shortName: 'Southampton', prestige: 2 },
    { id: 'leicester_pl', name: 'Leicester City FC', shortName: 'Leicester', prestige: 3 }
  ],
  championship: [
    { id: 'burnley', name: 'Burnley FC', shortName: 'Burnley', prestige: 3 },
    { id: 'sheffield_utd', name: 'Sheffield United FC', shortName: 'Sheff Utd', prestige: 3 },
    { id: 'west_brom', name: 'West Bromwich Albion', shortName: 'West Brom', prestige: 3 },
    { id: 'middlesbrough', name: 'Middlesbrough FC', shortName: 'Middlesbrough', prestige: 3 },
    { id: 'norwich', name: 'Norwich City FC', shortName: 'Norwich City', prestige: 3 },
    { id: 'blackburn', name: 'Blackburn Rovers', shortName: 'Blackburn', prestige: 2 },
    { id: 'watford', name: 'Watford FC', shortName: 'Watford', prestige: 3 },
    { id: 'coventry', name: 'Coventry City FC', shortName: 'Coventry', prestige: 2 },
    { id: 'bristol_city', name: 'Bristol City FC', shortName: 'Bristol City', prestige: 2 },
    { id: 'swansea', name: 'Swansea City AFC', shortName: 'Swansea', prestige: 2 },
    { id: 'derby', name: 'Derby County FC', shortName: 'Derby County', prestige: 2 },
    { id: 'stoke', name: 'Stoke City FC', shortName: 'Stoke City', prestige: 2 },
    { id: 'qpr', name: 'Queens Park Rangers', shortName: 'QPR', prestige: 2 },
    { id: 'preston', name: 'Preston North End', shortName: 'Preston', prestige: 2 },
    { id: 'sheff_wed', name: 'Sheffield Wednesday', shortName: 'Sheff Wed', prestige: 2 },
    { id: 'millwall', name: 'Millwall FC', shortName: 'Millwall', prestige: 2 },
    { id: 'portsmouth', name: 'Portsmouth FC', shortName: 'Portsmouth', prestige: 2 }
  ],
  la_liga: [
    { id: 'villarreal', name: 'Villarreal CF', shortName: 'Villarreal', prestige: 4 },
    { id: 'girona', name: 'Girona FC', shortName: 'Girona', prestige: 4 },
    { id: 'osasuna', name: 'CA Osasuna', shortName: 'Osasuna', prestige: 3 },
    { id: 'celta', name: 'RC Celta de Vigo', shortName: 'Celta Vigo', prestige: 3 },
    { id: 'mallorca', name: 'RCD Mallorca', shortName: 'Mallorca', prestige: 3 },
    { id: 'rayo', name: 'Rayo Vallecano', shortName: 'Rayo Vallecano', prestige: 3 },
    { id: 'las_palmas', name: 'UD Las Palmas', shortName: 'Las Palmas', prestige: 2 },
    { id: 'getafe', name: 'Getafe CF', shortName: 'Getafe', prestige: 3 },
    { id: 'alaves', name: 'Deportivo Alavés', shortName: 'Alavés', prestige: 2 },
    { id: 'leganes', name: 'CD Leganés', shortName: 'Leganés', prestige: 2 },
    { id: 'espanyol', name: 'RCD Espanyol', shortName: 'Espanyol', prestige: 3 },
    { id: 'valladolid', name: 'Real Valladolid CF', shortName: 'Valladolid', prestige: 2 },
    { id: 'valencia', name: 'Valencia CF', shortName: 'Valencia', prestige: 4 }
  ],
  segunda_division: [
    { id: 'racing_santander', name: 'Racing de Santander', shortName: 'Santander', prestige: 3 },
    { id: 'sporting_gijon', name: 'Real Sporting de Gijón', shortName: 'Sporting Gijón', prestige: 3 },
    { id: 'oviedo', name: 'Real Oviedo', shortName: 'Oviedo', prestige: 3 },
    { id: 'levante', name: 'Levante UD', shortName: 'Levante', prestige: 3 },
    { id: 'granada', name: 'Granada CF', shortName: 'Granada', prestige: 3 },
    { id: 'elche', name: 'Elche CF', shortName: 'Elche', prestige: 3 },
    { id: 'eibar', name: 'SD Eibar', shortName: 'Eibar', prestige: 3 },
    { id: 'mirandes', name: 'CD Mirandés', shortName: 'Mirandés', prestige: 2 },
    { id: 'malaga', name: 'Málaga CF', shortName: 'Málaga', prestige: 3 },
    { id: 'albacete', name: 'Albacete Balompié', shortName: 'Albacete', prestige: 2 },
    { id: 'burgos', name: 'Burgos CF', shortName: 'Burgos', prestige: 2 },
    { id: 'cordoba', name: 'Córdoba CF', shortName: 'Córdoba', prestige: 2 },
    { id: 'eldense', name: 'CD Eldense', shortName: 'Eldense', prestige: 2 },
    { id: 'cartagena', name: 'FC Cartagena', shortName: 'Cartagena', prestige: 2 },
    { id: 'ferrol', name: 'Racing Club de Ferrol', shortName: 'Ferrol', prestige: 2 },
    { id: 'tenerife', name: 'CD Tenerife', shortName: 'Tenerife', prestige: 2 }
  ],
  serie_a_ita: [
    { id: 'fiorentina', name: 'ACF Fiorentina', shortName: 'Fiorentina', prestige: 4 },
    { id: 'bologna', name: 'Bologna FC 1909', shortName: 'Bologna', prestige: 4 },
    { id: 'torino', name: 'Torino FC', shortName: 'Torino', prestige: 3 },
    { id: 'udinese', name: 'Udinese Calcio', shortName: 'Udinese', prestige: 3 },
    { id: 'empoli', name: 'Empoli FC', shortName: 'Empoli', prestige: 2 },
    { id: 'verona', name: 'Hellas Verona FC', shortName: 'Verona', prestige: 2 },
    { id: 'parma', name: 'Parma Calcio 1913', shortName: 'Parma', prestige: 3 },
    { id: 'como', name: 'Como 1907', shortName: 'Como', prestige: 3 },
    { id: 'genoa', name: 'Genoa CFC', shortName: 'Genoa', prestige: 3 },
    { id: 'cagliari', name: 'Cagliari Calcio', shortName: 'Cagliari', prestige: 2 },
    { id: 'lecce', name: 'US Lecce', shortName: 'Lecce', prestige: 2 },
    { id: 'monza', name: 'AC Monza', shortName: 'Monza', prestige: 2 },
    { id: 'venezia', name: 'Venezia FC', shortName: 'Venezia', prestige: 2 }
  ],
  serie_b_ita: [
    { id: 'pisa', name: 'Pisa SC', shortName: 'Pisa', prestige: 3 },
    { id: 'spezia', name: 'Spezia Calcio', shortName: 'Spezia', prestige: 3 },
    { id: 'cremonese', name: 'US Cremonese', shortName: 'Cremonese', prestige: 3 },
    { id: 'cesena', name: 'Cesena FC', shortName: 'Cesena', prestige: 2 },
    { id: 'palermo', name: 'Palermo FC', shortName: 'Palermo', prestige: 3 },
    { id: 'brescia', name: 'Brescia Calcio', shortName: 'Brescia', prestige: 3 },
    { id: 'sudtirol', name: 'FC Südtirol', shortName: 'Südtirol', prestige: 2 },
    { id: 'juve_stabia', name: 'SS Juve Stabia', shortName: 'Juve Stabia', prestige: 2 },
    { id: 'modena', name: 'Modena FC 2018', shortName: 'Modena', prestige: 2 },
    { id: 'bari', name: 'SSC Bari', shortName: 'Bari', prestige: 3 },
    { id: 'catanzaro', name: 'US Catanzaro 1929', shortName: 'Catanzaro', prestige: 2 },
    { id: 'salernitana', name: 'US Salernitana 1919', shortName: 'Salernitana', prestige: 3 },
    { id: 'frosinone', name: 'Frosinone Calcio', shortName: 'Frosinone', prestige: 3 },
    { id: 'cittadella', name: 'AS Cittadella', shortName: 'Cittadella', prestige: 2 }
  ],
  bundesliga: [
    { id: 'stuttgart', name: 'VfB Stuttgart', shortName: 'Stuttgart', prestige: 4 },
    { id: 'freiburg', name: 'SC Freiburg', shortName: 'Freiburg', prestige: 3 },
    { id: 'union_berlin', name: '1. FC Union Berlin', shortName: 'Union Berlin', prestige: 3 },
    { id: 'werder', name: 'SV Werder Bremen', shortName: 'Werder Bremen', prestige: 3 },
    { id: 'gladbach', name: 'Borussia Mönchengladbach', shortName: 'M\'gladbach', prestige: 3 },
    { id: 'mainz', name: '1. FSV Mainz 05', shortName: 'Mainz 05', prestige: 3 },
    { id: 'augsburg', name: 'FC Augsburg', shortName: 'Augsburg', prestige: 2 },
    { id: 'wolfsburg', name: 'VfL Wolfsburg', shortName: 'Wolfsburg', prestige: 3 },
    { id: 'heidenheim', name: '1. FC Heidenheim 1846', shortName: 'Heidenheim', prestige: 2 },
    { id: 'st_pauli', name: 'FC St. Pauli', shortName: 'St. Pauli', prestige: 3 },
    { id: 'hoffenheim', name: 'TSG 1899 Hoffenheim', shortName: 'Hoffenheim', prestige: 3 },
    { id: 'holstein_kiel', name: 'Holstein Kiel', shortName: 'Holstein Kiel', prestige: 2 },
    { id: 'bochum', name: 'VfL Bochum 1848', shortName: 'Bochum', prestige: 2 }
  ],
  '2_bundesliga': [
    { id: 'duesseldorf', name: 'Fortuna Düsseldorf', shortName: 'Düsseldorf', prestige: 3 },
    { id: 'hannover', name: 'Hannover 96', shortName: 'Hannover', prestige: 3 },
    { id: 'paderborn', name: 'SC Paderborn 07', shortName: 'Paderborn', prestige: 3 },
    { id: 'magdeburg', name: '1. FC Magdeburg', shortName: 'Magdeburg', prestige: 2 },
    { id: 'koeln', name: '1. FC Köln', shortName: 'Köln', prestige: 4 },
    { id: 'karlsruhe', name: 'Karlsruher SC', shortName: 'Karlsruhe', prestige: 3 },
    { id: 'kaiserslautern', name: '1. FC Kaiserslautern', shortName: 'Kaiserslautern', prestige: 3 },
    { id: 'nuernberg', name: '1. FC Nürnberg', shortName: 'Nürnberg', prestige: 3 },
    { id: 'hertha', name: 'Hertha BSC', shortName: 'Hertha BSC', prestige: 3 },
    { id: 'darmstadt', name: 'SV Darmstadt 98', shortName: 'Darmstadt', prestige: 3 },
    { id: 'braunschweig', name: 'Eintracht Braunschweig', shortName: 'Braunschweig', prestige: 2 }
  ],
  ligue_1: [
    { id: 'lille', name: 'LOSC Lille', shortName: 'Lille', prestige: 4 },
    { id: 'rennes', name: 'Stade Rennais FC', shortName: 'Rennes', prestige: 4 },
    { id: 'nice', name: 'OGC Nice', shortName: 'Nice', prestige: 4 },
    { id: 'lens', name: 'RC Lens', shortName: 'Lens', prestige: 4 },
    { id: 'reims', name: 'Stade de Reims', shortName: 'Reims', prestige: 3 },
    { id: 'strasbourg', name: 'RC Strasbourg Alsace', shortName: 'Strasbourg', prestige: 3 },
    { id: 'brest', name: 'Stade Brestois 29', shortName: 'Brest', prestige: 4 },
    { id: 'auxerre', name: 'AJ Auxerre', shortName: 'Auxerre', prestige: 2 },
    { id: 'toulouse', name: 'Toulouse FC', shortName: 'Toulouse', prestige: 3 },
    { id: 'nantes', name: 'FC Nantes', shortName: 'Nantes', prestige: 3 },
    { id: 'angers', name: 'Angers SCO', shortName: 'Angers', prestige: 2 },
    { id: 'saint_etienne', name: 'AS Saint-Étienne', shortName: 'Saint-Étienne', prestige: 3 },
    { id: 'le_havre', name: 'Le Havre AC', shortName: 'Le Havre', prestige: 2 },
    { id: 'montpellier', name: 'Montpellier HSC', shortName: 'Montpellier', prestige: 2 }
  ],
  ligue_2: [
    { id: 'lorient', name: 'FC Lorient', shortName: 'Lorient', prestige: 3 },
    { id: 'dunkerque', name: 'USL Dunkerque', shortName: 'Dunkerque', prestige: 2 },
    { id: 'annecy', name: 'FC Annecy', shortName: 'Annecy', prestige: 2 },
    { id: 'amiens', name: 'Amiens SC', shortName: 'Amiens', prestige: 2 },
    { id: 'grenoble', name: 'Grenoble Foot 38', shortName: 'Grenoble', prestige: 2 },
    { id: 'guingamp', name: 'En Avant Guingamp', shortName: 'Guingamp', prestige: 3 },
    { id: 'laval', name: 'Stade Lavallois', shortName: 'Laval', prestige: 2 },
    { id: 'pau', name: 'Pau FC', shortName: 'Pau', prestige: 2 },
    { id: 'bastia', name: 'SC Bastia', shortName: 'Bastia', prestige: 2 },
    { id: 'rodez', name: 'Rodez AF', shortName: 'Rodez', prestige: 2 },
    { id: 'clermont', name: 'Clermont Foot 63', shortName: 'Clermont', prestige: 3 },
    { id: 'troyes', name: 'ES Troyes AC', shortName: 'Troyes', prestige: 2 }
  ],
  liga_argentina: [
    { id: 'racing_arg', name: 'Racing Club', shortName: 'Racing', prestige: 4 },
    { id: 'independiente', name: 'CA Independiente', shortName: 'Independiente', prestige: 4 },
    { id: 'san_lorenzo', name: 'CA San Lorenzo', shortName: 'San Lorenzo', prestige: 4 },
    { id: 'velez', name: 'CA Vélez Sarsfield', shortName: 'Vélez', prestige: 4 },
    { id: 'estudiantes', name: 'Estudiantes de La Plata', shortName: 'Estudiantes', prestige: 3 },
    { id: 'talleres', name: 'CA Talleres (Córdoba)', shortName: 'Talleres', prestige: 3 },
    { id: 'huracan', name: 'CA Huracán', shortName: 'Huracán', prestige: 3 },
    { id: 'lanus', name: 'CA Lanús', shortName: 'Lanús', prestige: 3 },
    { id: 'godoy_cruz', name: 'Godoy Cruz', shortName: 'Godoy Cruz', prestige: 3 },
    { id: 'defensa_justicia', name: 'Defensa y Justicia', shortName: 'Defensa', prestige: 3 },
    { id: 'argentinos_jrs', name: 'Argentinos Juniors', shortName: 'Argentinos', prestige: 3 },
    { id: 'newells', name: 'Newell\'s Old Boys', shortName: 'Newell\'s', prestige: 3 },
    { id: 'rosario_central', name: 'CA Rosario Central', shortName: 'Rosario Central', prestige: 3 },
    { id: 'belgrano', name: 'CA Belgrano', shortName: 'Belgrano', prestige: 2 }
  ],
  segunda_liga_por: [
    { id: 'tondela', name: 'CD Tondela', shortName: 'Tondela', prestige: 3 },
    { id: 'penafiel', name: 'FC Penafiel', shortName: 'Penafiel', prestige: 2 },
    { id: 'academico_viseu', name: 'Académico de Viseu FC', shortName: 'Ac. Viseu', prestige: 2 },
    { id: 'leiria', name: 'UD de Leiria', shortName: 'U. Leiria', prestige: 3 },
    { id: 'torreense', name: 'SCU Torreense', shortName: 'Torreense', prestige: 2 },
    { id: 'chaves', name: 'GD Chaves', shortName: 'Chaves', prestige: 3 },
    { id: 'portimonense', name: 'Portimonense SC', shortName: 'Portimonense', prestige: 3 },
    { id: 'alverca', name: 'FC Alverca', shortName: 'Alverca', prestige: 2 },
    { id: 'feirense', name: 'CD Feirense', shortName: 'Feirense', prestige: 2 },
    { id: 'leixoes', name: 'Leixões SC', shortName: 'Leixões', prestige: 2 }
  ],
  primeira_liga: [
    { id: 'vitoria_sc', name: 'Vitória SC', shortName: 'Vitória SC', prestige: 3 },
    { id: 'boavista', name: 'Boavista FC', shortName: 'Boavista', prestige: 3 },
    { id: 'gil_vicente', name: 'Gil Vicente FC', shortName: 'Gil Vicente', prestige: 2 },
    { id: 'famalicao', name: 'FC Famalicão', shortName: 'Famalicão', prestige: 3 },
    { id: 'rio_ave', name: 'Rio Ave FC', shortName: 'Rio Ave', prestige: 2 },
    { id: 'moreirense', name: 'Moreirense FC', shortName: 'Moreirense', prestige: 2 },
    { id: 'santa_clara', name: 'CD Santa Clara', shortName: 'Santa Clara', prestige: 2 },
    { id: 'estoril', name: 'GD Estoril Praia', shortName: 'Estoril', prestige: 2 },
    { id: 'arouca', name: 'FC Arouca', shortName: 'Arouca', prestige: 2 },
    { id: 'nacional_mad', name: 'CD Nacional (Madeira)', shortName: 'Nacional', prestige: 2 },
    { id: 'farense', name: 'SC Farense', shortName: 'Farense', prestige: 2 },
    { id: 'avs_sad', name: 'AVS Futebol SAD', shortName: 'AVS SAD', prestige: 2 },
    { id: 'estrela_amadora', name: 'CF Estrela da Amadora', shortName: 'E. Amadora', prestige: 2 },
    { id: 'casa_pia', name: 'Casa Pia AC', shortName: 'Casa Pia', prestige: 2 }
  ],
  eredivisie: [
    { id: 'twente', name: 'FC Twente', shortName: 'Twente', prestige: 3 },
    { id: 'utrecht', name: 'FC Utrecht', shortName: 'Utrecht', prestige: 3 },
    { id: 'heerenveen', name: 'sc Heerenveen', shortName: 'Heerenveen', prestige: 2 },
    { id: 'go_ahead', name: 'Go Ahead Eagles', shortName: 'GA Eagles', prestige: 2 },
    { id: 'nec', name: 'NEC Nijmegen', shortName: 'NEC', prestige: 2 },
    { id: 'fortuna_sittard', name: 'Fortuna Sittard', shortName: 'Fortuna', prestige: 2 },
    { id: 'sparta_rotterdam', name: 'Sparta Rotterdam', shortName: 'Sparta', prestige: 2 },
    { id: 'pec_zwolle', name: 'PEC Zwolle', shortName: 'PEC Zwolle', prestige: 2 },
    { id: 'willem_ii', name: 'Willem II', shortName: 'Willem II', prestige: 2 },
    { id: 'nac_breda', name: 'NAC Breda', shortName: 'NAC Breda', prestige: 2 },
    { id: 'heracles', name: 'Heracles Almelo', shortName: 'Heracles', prestige: 2 },
    { id: 'rkc_waalwijk', name: 'RKC Waalwijk', shortName: 'RKC', prestige: 1 },
    { id: 'almere_city', name: 'Almere City FC', shortName: 'Almere City', prestige: 1 },
    { id: 'groningen', name: 'FC Groningen', shortName: 'Groningen', prestige: 2 }
  ],
  super_lig: [
    { id: 'basaksehir', name: 'İstanbul Başakşehir FK', shortName: 'Başakşehir', prestige: 3 },
    { id: 'samsunspor', name: 'Samsunspor', shortName: 'Samsunspor', prestige: 2 },
    { id: 'antalyaspor', name: 'Antalyaspor', shortName: 'Antalyaspor', prestige: 2 },
    { id: 'eyupspor', name: 'Eyüpspor', shortName: 'Eyüpspor', prestige: 2 },
    { id: 'kasimpasa', name: 'Kasımpaşa SK', shortName: 'Kasımpaşa', prestige: 2 },
    { id: 'sivasspor', name: 'Sivasspor', shortName: 'Sivasspor', prestige: 2 },
    { id: 'goztepe', name: 'Göztepe SK', shortName: 'Göztepe', prestige: 2 },
    { id: 'gaziantep', name: 'Gaziantep FK', shortName: 'Gaziantep', prestige: 2 },
    { id: 'alanyaspor', name: 'Alanyaspor', shortName: 'Alanyaspor', prestige: 2 },
    { id: 'konyaspor', name: 'Konyaspor', shortName: 'Konyaspor', prestige: 2 },
    { id: 'rizespor', name: 'Çaykur Rizespor', shortName: 'Rizespor', prestige: 2 },
    { id: 'kayserispor', name: 'Kayserispor', shortName: 'Kayserispor', prestige: 2 },
    { id: 'hatayspor', name: 'Hatayspor', shortName: 'Hatayspor', prestige: 2 },
    { id: 'bodrum_fk', name: 'Bodrum FK', shortName: 'Bodrum', prestige: 1 }
  ],
  scottish_premiership: [
    { id: 'hibernian', name: 'Hibernian FC', shortName: 'Hibs', prestige: 3 },
    { id: 'motherwell', name: 'Motherwell FC', shortName: 'Motherwell', prestige: 2 },
    { id: 'dundee_united', name: 'Dundee United FC', shortName: 'Dundee Utd', prestige: 2 },
    { id: 'st_mirren', name: 'St. Mirren FC', shortName: 'St. Mirren', prestige: 2 },
    { id: 'kilmarnock', name: 'Kilmarnock FC', shortName: 'Kilmarnock', prestige: 2 },
    { id: 'dundee_fc', name: 'Dundee FC', shortName: 'Dundee', prestige: 2 },
    { id: 'st_johnstone', name: 'St. Johnstone FC', shortName: 'St. Johnstone', prestige: 1 },
    { id: 'ross_county', name: 'Ross County FC', shortName: 'Ross County', prestige: 1 }
  ],
  pro_league_bel: [
    { id: 'genk', name: 'KRC Genk', shortName: 'Genk', prestige: 4 },
    { id: 'union_sg', name: 'Royale Union Saint-Gilloise', shortName: 'Union SG', prestige: 4 },
    { id: 'standard_liege', name: 'Standard de Liège', shortName: 'Standard', prestige: 3 },
    { id: 'gent', name: 'KAA Gent', shortName: 'Gent', prestige: 3 },
    { id: 'antwerp', name: 'Royal Antwerp FC', shortName: 'Antwerp', prestige: 3 },
    { id: 'cercle_brugge', name: 'Cercle Brugge KSV', shortName: 'Cercle', prestige: 3 },
    { id: 'mechelen', name: 'KV Mechelen', shortName: 'Mechelen', prestige: 2 },
    { id: 'westerlo', name: 'KVC Westerlo', shortName: 'Westerlo', prestige: 2 },
    { id: 'sint_truiden', name: 'Sint-Truidense VV', shortName: 'STVV', prestige: 2 },
    { id: 'charleroi', name: 'Sporting Charleroi', shortName: 'Charleroi', prestige: 2 },
    { id: 'leuven', name: 'Oud-Heverlee Leuven', shortName: 'OH Leuven', prestige: 2 },
    { id: 'kortrijk', name: 'KV Kortrijk', shortName: 'Kortrijk', prestige: 1 }
  ],
  saudi_pro: [
    { id: 'al_shabab', name: 'Al-Shabab FC', shortName: 'Al-Shabab', prestige: 3 },
    { id: 'al_ettifaq', name: 'Al-Ettifaq FC', shortName: 'Al-Ettifaq', prestige: 3 },
    { id: 'al_taawoun', name: 'Al-Taawoun FC', shortName: 'Al-Taawoun', prestige: 3 },
    { id: 'al_fateh', name: 'Al-Fateh SC', shortName: 'Al-Fateh', prestige: 2 },
    { id: 'al_qadsiah', name: 'Al-Qadsiah FC', shortName: 'Al-Qadsiah', prestige: 3 },
    { id: 'al_kholood', name: 'Al-Kholood Club', shortName: 'Al-Kholood', prestige: 2 },
    { id: 'al_orobah', name: 'Al-Orobah FC', shortName: 'Al-Orobah', prestige: 2 },
    { id: 'al_riyadh', name: 'Al-Riyadh SC', shortName: 'Al-Riyadh', prestige: 2 },
    { id: 'al_fayha', name: 'Al-Fayha FC', shortName: 'Al-Fayha', prestige: 2 },
    { id: 'al_khaleej', name: 'Al-Khaleej Club', shortName: 'Al-Khaleej', prestige: 2 },
    { id: 'al_raed', name: 'Al-Raed FC', shortName: 'Al-Raed', prestige: 2 },
    { id: 'damac', name: 'Damac FC', shortName: 'Damac', prestige: 2 }
  ],
  serie_c: [
    { id: 'athletic_mg', name: 'Athletic Club (MG)', shortName: 'Athletic-MG', prestige: 2 },
    { id: 'ferroviaria', name: 'Ferroviária SAF', shortName: 'Ferroviária', prestige: 2 },
    { id: 'sao_bernardo', name: 'São Bernardo FC', shortName: 'São Bernardo', prestige: 2 },
    { id: 'volta_redonda', name: 'Volta Redonda FC', shortName: 'Volta Redonda', prestige: 2 },
    { id: 'remo', name: 'Clube do Remo', shortName: 'Remo', prestige: 3 },
    { id: 'nautico', name: 'Clube Náutico Capibaribe', shortName: 'Náutico', prestige: 3 },
    { id: 'figueirense', name: 'Figueirense FC', shortName: 'Figueirense', prestige: 3 },
    { id: 'csa', name: 'Centro Sportivo Alagoano (CSA)', shortName: 'CSA', prestige: 2 },
    { id: 'abc_rn', name: 'ABC Futebol Clube', shortName: 'ABC', prestige: 2 },
    { id: 'botafogo_pb', name: 'Botafogo FC (PB)', shortName: 'Botafogo-PB', prestige: 2 },
    { id: 'confianca', name: 'AD Confiança', shortName: 'Confiança', prestige: 2 },
    { id: 'ypiranga_rs', name: 'Ypiranga FC (Erechim)', shortName: 'Ypiranga-RS', prestige: 2 },
    { id: 'londrina', name: 'Londrina EC', shortName: 'Londrina', prestige: 2 },
    { id: 'caxias', name: 'SER Caxias do Sul', shortName: 'Caxias', prestige: 2 },
    { id: 'tombense', name: 'Tombense FC', shortName: 'Tombense', prestige: 2 },
    { id: 'sampaio_correa', name: 'Sampaio Corrêa FC', shortName: 'Sampaio Corrêa', prestige: 2 },
    { id: 'aparecidense', name: 'AA Aparecidense', shortName: 'Aparecidense', prestige: 1 },
    { id: 'floresta_ce', name: 'Floresta EC', shortName: 'Floresta', prestige: 1 },
    { id: 'sao_jose_rs', name: 'EC São José (RS)', shortName: 'São José-RS', prestige: 1 },
    { id: 'ferroviario_ce', name: 'Ferroviário AC', shortName: 'Ferroviário', prestige: 2 }
  ],
  russian_premier: [
    { id: 'zenit', name: 'FC Zenit São Petersburgo', shortName: 'Zenit', prestige: 4 },
    { id: 'spartak_moscow', name: 'FC Spartak Moscou', shortName: 'Spartak Moscou', prestige: 4 },
    { id: 'cska_moscow', name: 'PFC CSKA Moscou', shortName: 'CSKA Moscou', prestige: 4 },
    { id: 'krasnodar', name: 'FC Krasnodar', shortName: 'Krasnodar', prestige: 4 },
    { id: 'lokomotiv_moscow', name: 'FC Lokomotiv Moscou', shortName: 'Lokomotiv', prestige: 4 },
    { id: 'dynamo_moscow', name: 'FC Dynamo Moscou', shortName: 'Dynamo Moscou', prestige: 4 },
    { id: 'rostov', name: 'FC Rostov', shortName: 'Rostov', prestige: 3 },
    { id: 'rubin_kazan', name: 'FC Rubin Kazan', shortName: 'Rubin Kazan', prestige: 3 },
    { id: 'krylia_sovetov', name: 'PFC Krylia Sovetov', shortName: 'Krylia Sovetov', prestige: 2 },
    { id: 'akhmat_grozny', name: 'FC Akhmat Grozny', shortName: 'Akhmat', prestige: 2 },
    { id: 'khimki', name: 'FC Khimki', shortName: 'Khimki', prestige: 2 },
    { id: 'pari_nn', name: 'FC Pari Nizhny Novgorod', shortName: 'Pari NN', prestige: 2 },
    { id: 'fakel_voronezh', name: 'FC Fakel Voronezh', shortName: 'Fakel', prestige: 2 },
    { id: 'orenburg', name: 'FC Orenburg', shortName: 'Orenburg', prestige: 2 },
    { id: 'baltika', name: 'FC Baltika Kaliningrad', shortName: 'Baltika', prestige: 2 },
    { id: 'pfc_sochi', name: 'PFC Sochi', shortName: 'Sochi', prestige: 2 }
  ],
  super_league_gre: [
    { id: 'olympiacos', name: 'Olympiacos FC', shortName: 'Olympiacos', prestige: 4 },
    { id: 'panathinaikos', name: 'Panathinaikos FC', shortName: 'Panathinaikos', prestige: 4 },
    { id: 'paok', name: 'PAOK Salônica', shortName: 'PAOK', prestige: 4 },
    { id: 'aek_athens', name: 'AEK Atenas FC', shortName: 'AEK Atenas', prestige: 4 },
    { id: 'aris_fc', name: 'Aris Salônica FC', shortName: 'Aris', prestige: 3 },
    { id: 'asteras_tripolis', name: 'Asteras Tripolis FC', shortName: 'Asteras', prestige: 2 },
    { id: 'atromitos', name: 'Atromitos Atenas', shortName: 'Atromitos', prestige: 2 },
    { id: 'ofi_crete', name: 'OFI Creta FC', shortName: 'OFI Creta', prestige: 2 },
    { id: 'panetolikos', name: 'Panetolikos FC', shortName: 'Panetolikos', prestige: 2 },
    { id: 'panserraikos', name: 'Panserraikos FC', shortName: 'Panserraikos', prestige: 2 },
    { id: 'volos_nfc', name: 'Volos NFC', shortName: 'Volos', prestige: 2 },
    { id: 'pas_lamia', name: 'PAS Lamia 1964', shortName: 'Lamia', prestige: 1 },
    { id: 'kallithea', name: 'Athens Kallithea FC', shortName: 'Kallithea', prestige: 2 },
    { id: 'levadiakos', name: 'APO Levadiakos', shortName: 'Levadiakos', prestige: 1 }
  ]
};

/**
 * CLUBES EXCLUSIVOS DE TAÇAS CONTINENTAIS E DO MERCADO INTERNACIONAL DA BOLA:
 * Enfrentam você na UEFA Champions League, Europa League, Conference League,
 * CONMEBOL Libertadores e Sul-Americana, compram e vendem atletas no Mercado,
 * mas NUNCA enviam propostas de transferência para tirar nosso jogador das 19 ligas oficiais!
 */
export const CONTINENTAL_ONLY_CLUBS: Array<{
  id: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  prestige: 2 | 3 | 4;
  color: string;
  tournament: 'champions' | 'europa_league' | 'conference_league' | 'libertadores' | 'sul_americana';
  starName: string;
}> = [
  // UEFA Champions League
  { id: 'shakhtar', name: 'FC Shakhtar Donetsk', shortName: 'Shakhtar', country: 'Ucrânia', flag: '🇺🇦', prestige: 4, color: '#f97316', tournament: 'champions', starName: 'Georgiy Sudakov' },
  { id: 'dynamo_kyiv', name: 'FC Dynamo Kyiv', shortName: 'Dynamo Kyiv', country: 'Ucrânia', flag: '🇺🇦', prestige: 4, color: '#2563eb', tournament: 'champions', starName: 'Mykola Shaparenko' },
  { id: 'rb_salzburg', name: 'FC Red Bull Salzburg', shortName: 'RB Salzburg', country: 'Áustria', flag: '🇦🇹', prestige: 4, color: '#dc2626', tournament: 'champions', starName: 'Oscar Gloukh' },
  { id: 'sturm_graz', name: 'SK Sturm Graz', shortName: 'Sturm Graz', country: 'Áustria', flag: '🇦🇹', prestige: 3, color: '#18181b', tournament: 'champions', starName: 'Otar Kiteishvili' },
  { id: 'sparta_praga', name: 'AC Sparta Praga', shortName: 'Sparta Praga', country: 'República Tcheca', flag: '🇨🇿', prestige: 4, color: '#991b1b', tournament: 'champions', starName: 'Lukáš Haraslín' },
  { id: 'slavia_praga', name: 'SK Slavia Praga', shortName: 'Slavia Praga', country: 'República Tcheca', flag: '🇨🇿', prestige: 4, color: '#dc2626', tournament: 'champions', starName: 'Tomáš Chorý' },
  { id: 'dinamo_zagreb', name: 'GNK Dinamo Zagreb', shortName: 'Dinamo Zagreb', country: 'Croácia', flag: '🇭🇷', prestige: 4, color: '#1d4ed8', tournament: 'champions', starName: 'Martin Baturina' },
  { id: 'crvena_zvezda', name: 'FK Estrela Vermelha', shortName: 'Estrela Vermelha', country: 'Sérvia', flag: '🇷🇸', prestige: 4, color: '#dc2626', tournament: 'champions', starName: 'Mirko Ivanić' },
  { id: 'young_boys', name: 'BSC Young Boys', shortName: 'Young Boys', country: 'Suíça', flag: '🇨🇭', prestige: 3, color: '#eab308', tournament: 'champions', starName: 'Joël Monteiro' },
  { id: 'fc_copenhagen', name: 'FC Copenhagen', shortName: 'Copenhagen', country: 'Dinamarca', flag: '🇩🇰', prestige: 4, color: '#1e40af', tournament: 'champions', starName: 'Mohamed Elyounoussi' },
  { id: 'slovan_bratislava', name: 'ŠK Slovan Bratislava', shortName: 'Slovan Bratislava', country: 'Eslováquia', flag: '🇸🇰', prestige: 3, color: '#0284c7', tournament: 'champions', starName: 'Vladimír Weiss' },
  { id: 'malmo_ff', name: 'Malmö FF', shortName: 'Malmö', country: 'Suécia', flag: '🇸🇪', prestige: 3, color: '#38bdf8', tournament: 'champions', starName: 'Isaac Kiese Thelin' },

  // UEFA Europa League
  { id: 'bodo_glimt', name: 'FK Bodø/Glimt', shortName: 'Bodø/Glimt', country: 'Noruega', flag: '🇳🇴', prestige: 3, color: '#eab308', tournament: 'europa_league', starName: 'Patrick Berg' },
  { id: 'midtjylland', name: 'FC Midtjylland', shortName: 'Midtjylland', country: 'Dinamarca', flag: '🇩🇰', prestige: 3, color: '#b91c1c', tournament: 'europa_league', starName: 'Darío Osorio' },
  { id: 'ferencvaros', name: 'Ferencvárosi TC', shortName: 'Ferencváros', country: 'Hungria', flag: '🇭🇺', prestige: 3, color: '#16a34a', tournament: 'europa_league', starName: 'Barnabás Varga' },
  { id: 'qarabag', name: 'Qarabağ FK', shortName: 'Qarabağ', country: 'Azerbaijão', flag: '🇦🇿', prestige: 3, color: '#0f172a', tournament: 'europa_league', starName: 'Juninho Olávio' },
  { id: 'viktoria_plzen', name: 'FC Viktoria Plzeň', shortName: 'Viktoria Plzeň', country: 'República Tcheca', flag: '🇨🇿', prestige: 3, color: '#dc2626', tournament: 'europa_league', starName: 'Pavel Šulc' },
  { id: 'fcsb_steaua', name: 'FCSB (Bucareste)', shortName: 'FCSB', country: 'Romênia', flag: '🇷🇴', prestige: 3, color: '#dc2626', tournament: 'europa_league', starName: 'Darius Olaru' },
  { id: 'ludogorets', name: 'PFC Ludogorets', shortName: 'Ludogorets', country: 'Bulgária', flag: '🇧🇬', prestige: 3, color: '#15803d', tournament: 'europa_league', starName: 'Rwan Cruz' },
  { id: 'maccabi_ta', name: 'Maccabi Tel Aviv FC', shortName: 'Maccabi Tel Aviv', country: 'Israel', flag: '🇮🇱', prestige: 3, color: '#facc15', tournament: 'europa_league', starName: 'Dor Turgeman' },

  // UEFA Conference League
  { id: 'legia_warsaw', name: 'Legia Varsóvia', shortName: 'Legia Varsóvia', country: 'Polônia', flag: '🇵🇱', prestige: 3, color: '#15803d', tournament: 'conference_league', starName: 'Bartosz Kapustka' },
  { id: 'lech_poznan', name: 'KKS Lech Poznań', shortName: 'Lech Poznań', country: 'Polônia', flag: '🇵🇱', prestige: 3, color: '#2563eb', tournament: 'conference_league', starName: 'Mikael Ishak' },
  { id: 'rapid_wien', name: 'SK Rapid Wien', shortName: 'Rapid Wien', country: 'Áustria', flag: '🇦🇹', prestige: 3, color: '#16a34a', tournament: 'conference_league', starName: 'Guido Burgstaller' },
  { id: 'fc_basel', name: 'FC Basel 1893', shortName: 'FC Basel', country: 'Suíça', flag: '🇨🇭', prestige: 3, color: '#b91c1c', tournament: 'conference_league', starName: 'Xherdan Shaqiri' },
  { id: 'molde_fk', name: 'Molde FK', shortName: 'Molde', country: 'Noruega', flag: '🇳🇴', prestige: 3, color: '#1d4ed8', tournament: 'conference_league', starName: 'Magnus Wolff Eikrem' },
  { id: 'hajduk_split', name: 'HNK Hajduk Split', shortName: 'Hajduk Split', country: 'Croácia', flag: '🇭🇷', prestige: 3, color: '#1e40af', tournament: 'conference_league', starName: 'Marko Livaja' },
  { id: 'partizan', name: 'FK Partizan Belgrado', shortName: 'Partizan', country: 'Sérvia', flag: '🇷🇸', prestige: 3, color: '#18181b', tournament: 'conference_league', starName: 'Bibras Natcho' },
  { id: 'apoel_nicosia', name: 'APOEL Nicósia', shortName: 'APOEL', country: 'Chipre', flag: '🇨🇾', prestige: 3, color: '#eab308', tournament: 'conference_league', starName: 'Youssef El-Arabi' },
  { id: 'djurgardens', name: 'Djurgårdens IF', shortName: 'Djurgårdens', country: 'Suécia', flag: '🇸🇪', prestige: 2, color: '#1d4ed8', tournament: 'conference_league', starName: 'Deniz Hümmet' },
  { id: 'pafos_fc', name: 'Pafos FC', shortName: 'Pafos FC', country: 'Chipre', flag: '🇨🇾', prestige: 2, color: '#0284c7', tournament: 'conference_league', starName: 'Jairo da Silva' },

  // CONMEBOL Libertadores
  { id: 'penarol', name: 'CA Peñarol', shortName: 'Peñarol', country: 'Uruguai', flag: '🇺🇾', prestige: 4, color: '#eab308', tournament: 'libertadores', starName: 'Leonardo Fernández' },
  { id: 'nacional_uru', name: 'Club Nacional de Football', shortName: 'Nacional (URU)', country: 'Uruguai', flag: '🇺🇾', prestige: 4, color: '#1d4ed8', tournament: 'libertadores', starName: 'Nicolás López' },
  { id: 'colo_colo', name: 'CSD Colo-Colo', shortName: 'Colo-Colo', country: 'Chile', flag: '🇨🇱', prestige: 4, color: '#18181b', tournament: 'libertadores', starName: 'Arturo Vidal' },
  { id: 'u_de_chile', name: 'Universidad de Chile', shortName: 'U. de Chile', country: 'Chile', flag: '🇨🇱', prestige: 4, color: '#2563eb', tournament: 'libertadores', starName: 'Charles Aránguiz' },
  { id: 'olimpia_par', name: 'Club Olimpia', shortName: 'Olimpia', country: 'Paraguai', flag: '🇵🇾', prestige: 4, color: '#0f172a', tournament: 'libertadores', starName: 'Derlis González' },
  { id: 'cerro_porteno', name: 'Club Cerro Porteño', shortName: 'Cerro Porteño', country: 'Paraguai', flag: '🇵🇾', prestige: 4, color: '#dc2626', tournament: 'libertadores', starName: 'Cecilio Domínguez' },
  { id: 'libertad_par', name: 'Club Libertad', shortName: 'Libertad', country: 'Paraguai', flag: '🇵🇾', prestige: 3, color: '#18181b', tournament: 'libertadores', starName: 'Óscar Cardozo' },
  { id: 'atletico_nacional', name: 'Atlético Nacional', shortName: 'Atl. Nacional', country: 'Colômbia', flag: '🇨🇴', prestige: 4, color: '#16a34a', tournament: 'libertadores', starName: 'Edwin Cardona' },
  { id: 'millonarios', name: 'Millonarios FC', shortName: 'Millonarios', country: 'Colômbia', flag: '🇨🇴', prestige: 4, color: '#1d4ed8', tournament: 'libertadores', starName: 'Radamel Falcao' },
  { id: 'junior_baq', name: 'Junior de Barranquilla', shortName: 'Junior-COL', country: 'Colômbia', flag: '🇨🇴', prestige: 3, color: '#dc2626', tournament: 'libertadores', starName: 'Carlos Bacca' },
  { id: 'ldu_quito', name: 'LDU Quito', shortName: 'LDU Quito', country: 'Equador', flag: '🇪🇨', prestige: 4, color: '#0f172a', tournament: 'libertadores', starName: 'Álex Arce' },
  { id: 'ind_del_valle', name: 'Independiente del Valle', shortName: 'Ind. del Valle', country: 'Equador', flag: '🇪🇨', prestige: 4, color: '#1e3a8a', tournament: 'libertadores', starName: 'Kendry Páez' },
  { id: 'barcelona_sc', name: 'Barcelona SC (Guayaquil)', shortName: 'Barcelona-EQU', country: 'Equador', flag: '🇪🇨', prestige: 4, color: '#eab308', tournament: 'libertadores', starName: 'Janner Corozo' },
  { id: 'bolivar', name: 'Club Bolívar (La Paz)', shortName: 'Bolívar', country: 'Bolívia', flag: '🇧🇴', prestige: 3, color: '#0284c7', tournament: 'libertadores', starName: 'Ramiro Vaca' },
  { id: 'the_strongest', name: 'The Strongest', shortName: 'The Strongest', country: 'Bolívia', flag: '🇧🇴', prestige: 3, color: '#eab308', tournament: 'libertadores', starName: 'Enrique Triverio' },
  { id: 'universitario_pe', name: 'Universitario de Deportes', shortName: 'Universitario', country: 'Peru', flag: '🇵🇪', prestige: 3, color: '#991b1b', tournament: 'libertadores', starName: 'Edison Flores' },
  { id: 'alianza_lima', name: 'Club Alianza Lima', shortName: 'Alianza Lima', country: 'Peru', flag: '🇵🇪', prestige: 3, color: '#1e3a8a', tournament: 'libertadores', starName: 'Paolo Guerrero' },

  // CONMEBOL Sul-Americana
  { id: 'america_cali', name: 'América de Cali', shortName: 'América de Cali', country: 'Colômbia', flag: '🇨🇴', prestige: 3, color: '#dc2626', tournament: 'sul_americana', starName: 'Duván Vergara' },
  { id: 'ind_medellin', name: 'Independiente Medellín', shortName: 'Ind. Medellín', country: 'Colômbia', flag: '🇨🇴', prestige: 3, color: '#b91c1c', tournament: 'sul_americana', starName: 'Brayan León' },
  { id: 'u_catolica_chi', name: 'Universidad Católica', shortName: 'U. Católica', country: 'Chile', flag: '🇨🇱', prestige: 3, color: '#2563eb', tournament: 'sul_americana', starName: 'Fernando Zampedri' },
  { id: 'palestino', name: 'CD Palestino', shortName: 'Palestino', country: 'Chile', flag: '🇨🇱', prestige: 2, color: '#15803d', tournament: 'sul_americana', starName: 'Bryan Carrasco' },
  { id: 'defensor_uru', name: 'Defensor Sporting', shortName: 'Defensor', country: 'Uruguai', flag: '🇺🇾', prestige: 2, color: '#7c3aed', tournament: 'sul_americana', starName: 'Anderson Duarte' },
  { id: 'emelec', name: 'CS Emelec', shortName: 'Emelec', country: 'Equador', flag: '🇪🇨', prestige: 3, color: '#1d4ed8', tournament: 'sul_americana', starName: 'Pedro Ortiz' },
  { id: 'sporting_cristal', name: 'Sporting Cristal', shortName: 'Sporting Cristal', country: 'Peru', flag: '🇵🇪', prestige: 3, color: '#38bdf8', tournament: 'sul_americana', starName: 'Martín Cauteruccio' },
  { id: 'melgar', name: 'FBC Melgar (Arequipa)', shortName: 'Melgar', country: 'Peru', flag: '🇵🇪', prestige: 2, color: '#b91c1c', tournament: 'sul_americana', starName: 'Bernardo Cuesta' },
  { id: 'always_ready', name: 'Club Always Ready (El Alto)', shortName: 'Always Ready', country: 'Bolívia', flag: '🇧🇴', prestige: 2, color: '#dc2626', tournament: 'sul_americana', starName: 'Robson Matheus' },
  { id: 'dep_tachira', name: 'Deportivo Táchira FC', shortName: 'Dep. Táchira', country: 'Venezuela', flag: '🇻🇪', prestige: 2, color: '#eab308', tournament: 'sul_americana', starName: 'Maurice Cova' }
];

/**
 * Gera a tabela de classificação ao vivo (Ranking da Liga) para qualquer liga do jogo.
 * Reflete com exatidão matemática o desempenho do clube do jogador.
 */
export function getLeagueStandings(
  leagueId: string,
  player: PlayerProfile
): LeagueStanding[] {
  // Simulação Oficial Sincronizada Jogo a Jogo (Modelo Football Manager)
  return getSynchronizedLeagueStandings(leagueId, player);
}
