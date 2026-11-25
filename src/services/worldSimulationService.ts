import { 
  Club, 
  RealPlayer, 
  Position, 
  PlayerProfile,
  WorldTransferMovement, 
  WorldSeasonTransitionReport 
} from '../types';
import { CLUBS } from '../data/clubs';
import { LEAGUES } from '../data/leagues';
import { createNewsArticle } from './newsService';
import {
  getActiveLeagueIds as getUnifiedActiveLeagueIds,
  setActiveLeagueIds as setUnifiedActiveLeagueIds,
  getSynchronizedLeagueStandings,
  resetLeagueSimulationState,
  ensureSupplementalClubsHydrated
} from './syncLeagueSimulationService';

const WORLD_STATE_STORAGE_KEY = 'craque_world_state_v1';

export function getActiveLeagueIds(): string[] {
  return getUnifiedActiveLeagueIds();
}

export function setActiveLeagueIds(leagueIds: string[]): void {
  setUnifiedActiveLeagueIds(leagueIds);
}

/**
 * Estado salvo das alterações do mundo (elencos, orçamentos e acessos/rebaixamentos por temporada)
 */
interface WorldSaveState {
  version: number;
  seasonYear: number;
  clubSquads: Record<string, RealPlayer[]>;
  clubBudgets: Record<string, number>;
  clubLeagues?: Record<string, { leagueId: string; league: string }>;
  transferHistory: WorldTransferMovement[];
}

/**
 * Carrega o estado salvo do mundo do save
 */
export function loadWorldSaveState(): WorldSaveState | null {
  try {
    const raw = localStorage.getItem(WORLD_STATE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Salva o estado do mundo do save no armazenamento local
 */
export function saveWorldSaveState(state: WorldSaveState): void {
  try {
    localStorage.setItem(WORLD_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Erro ao salvar estado do mundo:', err);
  }
}

/**
 * Aplica o estado dinâmico do mundo nos objetos CLUBS em memória
 * Chamado na inicialização do aplicativo
 */
export function applyWorldStateToClubs(): void {
  ensureSupplementalClubsHydrated();
  const state = loadWorldSaveState();
  if (!state) return;

  if (state.clubSquads) {
    Object.entries(state.clubSquads).forEach(([clubName, customSquad]) => {
      const club = CLUBS[clubName];
      if (club && Array.isArray(customSquad) && customSquad.length > 0) {
        club.squad = [...customSquad];
      }
    });
  }

  if (state.clubBudgets) {
    Object.entries(state.clubBudgets).forEach(([clubName, budget]) => {
      const club = CLUBS[clubName];
      if (club && typeof budget === 'number') {
        club.budgetEur = budget;
      }
    });
  }

  if (state.clubLeagues) {
    Object.entries(state.clubLeagues).forEach(([clubName, divInfo]) => {
      const club = CLUBS[clubName];
      if (club && divInfo?.leagueId) {
        club.leagueId = divInfo.leagueId;
        club.league = divInfo.league;
      }
    });
  }
}

/**
 * Nomes comuns para regens e promessas da base gerados pelo sistema
 */
const YOUTH_NAMES_BY_COUNTRY: Record<string, { first: string[]; last: string[]; flag: string }> = {
  'Brasil': {
    first: ['Cauã', 'Enzo', 'Matheuzinho', 'Breno', 'Kaiky', 'Arthur', 'Igor', 'Davi', 'Lucca', 'Gabriel', 'Murilo'],
    last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Ribeiro'],
    flag: '🇧🇷'
  },
  'Inglaterra': {
    first: ['Archie', 'Jude', 'Cole', 'Harvey', 'Kieran', 'Callum', 'Declan', 'Ethan', 'Lewis', 'Harry'],
    last: ['Palmer', 'Bellingham', 'Smith', 'Taylor', 'Walker', 'Green', 'Evans', 'Hughes', 'Wilson', 'Clarke'],
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'
  },
  'Espanha': {
    first: ['Pau', 'Lamine', 'Gavi', 'Fermín', 'Alejandro', 'Pablo', 'Unai', 'Mikel', 'Nico', 'Álvaro'],
    last: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Navarro'],
    flag: '🇪🇸'
  },
  'Itália': {
    first: ['Francesco', 'Lorenzo', 'Federico', 'Nicolò', 'Matteo', 'Gianluca', 'Davide', 'Alessandro', 'Andrea', 'Samuele'],
    last: ['Rossi', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Conti'],
    flag: '🇮🇹'
  },
  'Arábia Saudita': {
    first: ['Firas', 'Saud', 'Nawaf', 'Salem', 'Sultan', 'Fahad', 'Musab', 'Abdullah', 'Ziyad', 'Ali'],
    last: ['Al-Buraikan', 'Abdulhamid', 'Al-Dawsari', 'Al-Ghamdi', 'Al-Shehri', 'Al-Najei', 'Al-Khaibari'],
    flag: '🇸🇦'
  }
};

function generateYouthProspect(club: Club, year: number): RealPlayer {
  const countryData = YOUTH_NAMES_BY_COUNTRY[club.country] || YOUTH_NAMES_BY_COUNTRY['Brasil'];
  const first = countryData.first[Math.floor(Math.random() * countryData.first.length)];
  const last = countryData.last[Math.floor(Math.random() * countryData.last.length)];
  
  const positions: Position[] = ['CA', 'PE', 'PD', 'MEI', 'VOL', 'MC', 'ZAG', 'LE', 'LD'];
  const position = positions[Math.floor(Math.random() * positions.length)];
  
  // OVR proporcional ao prestígio do clube (ex: La Masia / Real Madrid gera 72-76; Série B gera 65-70)
  const baseOvr = 63 + (club.prestige * 2) + Math.floor(Math.random() * 4);
  const ovr = Math.min(78, Math.max(63, baseOvr));
  const isStar = Math.random() < 0.22; // 22% de chance de ser uma joia cotada

  return {
    id: `regen_${club.id}_${year}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name: `${first} ${last}`,
    position,
    ovr,
    age: 17 + Math.floor(Math.random() * 2), // 17 ou 18 anos
    nationality: club.country,
    flag: countryData.flag,
    marketValueEur: Number((ovr >= 74 ? (ovr - 70) * 4.5 : (ovr - 60) * 0.8).toFixed(1)),
    isStar
  };
}

/**
 * MOTOR DE SIMULAÇÃO DO MUNDO DO FUTEBOL A CADA VIRADA DE TEMPORADA
 * Simula o universo vivo das 5 a 6 ligas ativas:
 * 1. Envelhecimento biológico dos jogadores adversários
 * 2. Evolução de jovens e declínio/aposentadoria de veteranos
 * 3. Revelações da base (Regens) promovidas ao elenco
 * 4. Janela de transferências inteligente entre clubes (Europa, Brasil e Mundo Árabe)
 */
export function simulateWorldSeasonAdvance(
  currentYear: number,
  playerClubName: string,
  playerRef?: PlayerProfile
): WorldSeasonTransitionReport {
  ensureSupplementalClubsHydrated();
  const nextYear = currentYear + 1;
  const activeLeagueIds = getActiveLeagueIds();
  const allClubs = Object.values(CLUBS);

  // =========================================================================
  // FASE 0: ACESSO E REBAIXAMENTO REAL EM TODA A PIRÂMIDE (Série A ↔ B ↔ C, Premier ↔ Championship, Serie A ↔ B Itália)
  // =========================================================================
  const seasonEndProbe: PlayerProfile = playerRef
    ? { ...playerRef, currentMatchDay: 39, seasonYear: currentYear }
    : ({ currentClub: playerClubName, currentMatchDay: 39, seasonYear: currentYear } as PlayerProfile);

  const standingsSnapshot: Record<string, ReturnType<typeof getSynchronizedLeagueStandings>> = {};
  Object.values(LEAGUES).forEach(lg => {
    if (lg.relegatesTo || lg.promotesTo) {
      standingsSnapshot[lg.id] = getSynchronizedLeagueStandings(lg.id, seasonEndProbe);
    }
  });

  Object.values(LEAGUES).forEach(upperLeague => {
    if (!upperLeague.relegatesTo) return;
    const lowerLeague = LEAGUES[upperLeague.relegatesTo];
    if (!lowerLeague) return;
    if (!activeLeagueIds.includes(upperLeague.id) && !activeLeagueIds.includes(lowerLeague.id)) return;

    const stUpper = standingsSnapshot[upperLeague.id] || [];
    const stLower = standingsSnapshot[lowerLeague.id] || [];
    const spots = Math.min(upperLeague.relegationSpots || 3, lowerLeague.promotionSpots || 3, Math.floor(stUpper.length / 3), Math.floor(stLower.length / 3));
    if (spots <= 0) return;

    const relegated = stUpper.slice(-spots);
    const promoted = stLower.slice(0, spots);

    relegated.forEach(item => {
      const c = CLUBS[item.clubId] || CLUBS[item.clubName];
      if (c) {
        c.leagueId = lowerLeague.id;
        c.league = lowerLeague.name;
      }
    });

    promoted.forEach(item => {
      const c = CLUBS[item.clubId] || CLUBS[item.clubName];
      if (c) {
        c.leagueId = upperLeague.id;
        c.league = upperLeague.name;
      }
    });

    if (promoted.length > 0 && relegated.length > 0) {
      createNewsArticle({
        outlet: 'ge.globo',
        headline: `${upperLeague.shortName}: ${promoted.map(p => p.shortName).join(', ')} sobem; ${relegated.map(r => r.shortName).join(', ')} caem para a ${lowerLeague.shortName}!`,
        snippet: `Encerrada a temporada ${currentYear}, estão definidos os acessos e rebaixamentos oficiais entre ${upperLeague.name} e ${lowerLeague.name} para ${nextYear}.`,
        category: 'milestone',
        categoryLabel: 'Acesso & Rebaixamento',
        badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
        dateStr: `Fim da Temporada ${currentYear}`
      });
    }
  });
  
  // Clubes das ligas ativas + todos os clubes de Copas Continentais participam do Mercado da Bola da IA!
  const activeClubs = allClubs.filter(c => activeLeagueIds.includes(c.leagueId || '') || c.isContinentalOnly);
  const targetClubs = activeClubs.length > 0 ? activeClubs : allClubs;

  const retirements: Array<{ playerName: string; clubName: string; age: number; ovr: number }> = [];
  const breakoutYouths: Array<{ playerName: string; clubName: string; age: number; ovr: number; position: Position }> = [];
  const worldTransfers: WorldTransferMovement[] = [];

  // =========================================================================
  // FASE 1: ENVELHECIMENTO, EVOLUÇÃO E APOSENTADORIA NOS CLUBES ATIVOS
  // =========================================================================
  targetClubs.forEach(club => {
    const updatedSquad: RealPlayer[] = [];

    club.squad.forEach(player => {
      const newAge = player.age + 1;
      let newOvr = player.ovr;

      // Curva Biomecânica de Desenvolvimento:
      if (newAge <= 21) {
        // Jovens Promessas: salto de desenvolvimento (+2 a +4 OVR; estrelas até +5)
        const gain = player.isStar ? 3 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 3);
        newOvr = Math.min(94, player.ovr + gain);
        if (gain >= 3) {
          breakoutYouths.push({
            playerName: player.name,
            clubName: club.name,
            age: newAge,
            ovr: newOvr,
            position: player.position
          });
        }
      } else if (newAge >= 22 && newAge <= 28) {
        // Auge Físico e Técnico: estabilidade (-1 a +2)
        const delta = Math.floor(Math.random() * 4) - 1; // -1, 0, 1, 2
        newOvr = Math.min(94, Math.max(65, player.ovr + delta));
      } else if (newAge >= 29 && newAge <= 32) {
        // Maturidade: conservação de técnica, perda leve de ritmo (-1 a 0)
        const delta = Math.random() < 0.4 ? -1 : 0;
        newOvr = Math.max(65, player.ovr + delta);
      } else {
        // Veteranos (33+ anos): declínio físico (-1 a -3 OVR)
        const loss = 1 + Math.floor(Math.random() * 3);
        newOvr = Math.max(58, player.ovr - loss);
      }

      // Verificação de Aposentadoria (36+ anos ou 34+ com baixo rendimento)
      const shouldRetire = (newAge >= 37) || (newAge >= 35 && Math.random() < 0.45) || (newAge >= 33 && newOvr < 70 && Math.random() < 0.5);

      if (shouldRetire) {
        retirements.push({
          playerName: player.name,
          clubName: club.name,
          age: newAge,
          ovr: newOvr
        });
      } else {
        // Atualiza valor de mercado de acordo com OVR e idade
        const ageMultiplier = newAge <= 23 ? 1.6 : newAge <= 28 ? 1.2 : newAge <= 32 ? 0.7 : 0.3;
        const calcValue = Number((Math.max(0.3, (newOvr - 65) * 1.8 * ageMultiplier)).toFixed(1));

        updatedSquad.push({
          ...player,
          age: newAge,
          ovr: newOvr,
          marketValueEur: calcValue
        });
      }
    });

    // =========================================================================
    // FASE 2: PROMOÇÃO DE NOVAS REVELAÇÕES DA BASE (REGENS)
    // =========================================================================
    // Se o time perdeu atletas por aposentadoria ou tem elenco curto (< 6), promove da base
    const vacancies = Math.max(1, 6 - updatedSquad.length);
    for (let i = 0; i < vacancies; i++) {
      if (updatedSquad.length < 9) {
        const youth = generateYouthProspect(club, nextYear);
        updatedSquad.push(youth);
        breakoutYouths.push({
          playerName: youth.name,
          clubName: club.name,
          age: youth.age,
          ovr: youth.ovr,
          position: youth.position
        });
      }
    }

    club.squad = updatedSquad;
  });

  // =========================================================================
  // FASE 3: JANELA DE TRANSFERÊNCIAS GLOBAL ENTRE CLUBES ATIVOS
  // =========================================================================
  // Simula 12 a 18 transferências impactantes entre clubes no mundo
  const numTransfers = 10 + Math.floor(Math.random() * 8);

  for (let i = 0; i < numTransfers; i++) {
    // Escolhe clube comprador com orçamento disponível
    const buyers = targetClubs.filter(c => c.budgetEur >= 5.0 && c.name !== playerClubName);
    if (buyers.length === 0) break;
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];

    // Escolhe clube vendedor diferente
    const sellers = targetClubs.filter(c => c.name !== buyer.name && c.squad.length > 5);
    if (sellers.length === 0) continue;
    const seller = sellers[Math.floor(Math.random() * sellers.length)];

    // Seleciona um atleta negociável do vendedor
    const targetPlayer = seller.squad[Math.floor(Math.random() * seller.squad.length)];
    if (!targetPlayer) continue;

    // Calcula valor e viabilidade
    const fee = Number((targetPlayer.marketValueEur * (0.9 + Math.random() * 0.4)).toFixed(1));
    if (buyer.budgetEur < fee && fee > 2.0) continue;

    // Executa a transferência nos elencos em memória
    seller.squad = seller.squad.filter(p => p.id !== targetPlayer.id);
    buyer.squad.unshift({ ...targetPlayer });

    buyer.budgetEur = Math.max(1.0, Number((buyer.budgetEur - fee).toFixed(1)));
    seller.budgetEur = Number((seller.budgetEur + fee).toFixed(1));

    // Determina o tipo de negócio
    let dealType: WorldTransferMovement['type'] = 'giant_signing';
    let headline = `${buyer.name} acerta contratação bombástica de ${targetPlayer.name} por €${fee}M!`;

    if (buyer.leagueId === 'saudi_pro') {
      dealType = 'saudi_mega_deal';
      headline = `Mundo Árabe: ${buyer.name} investe pesado e tira ${targetPlayer.name} do ${seller.shortName}.`;
    } else if (targetPlayer.age <= 21 && targetPlayer.ovr >= 75) {
      dealType = 'young_prospect';
      headline = `Jóia da base: ${buyer.name} garante a compra da revelação ${targetPlayer.name} (#${targetPlayer.position}).`;
    }

    worldTransfers.push({
      id: `w_trans_${nextYear}_${i}_${Date.now()}`,
      playerName: targetPlayer.name,
      position: targetPlayer.position,
      ovr: targetPlayer.ovr,
      age: targetPlayer.age,
      fromClub: seller.name,
      toClub: buyer.name,
      feeEur: fee,
      seasonYear: nextYear,
      headline,
      type: dealType
    });
  }

  // =========================================================================
  // FASE 4: PERSISTÊNCIA DO SAVE DO MUNDO NO STORAGE LOCAL
  // =========================================================================
  const clubSquadsMap: Record<string, RealPlayer[]> = {};
  const clubBudgetsMap: Record<string, number> = {};
  const clubLeaguesMap: Record<string, { leagueId: string; league: string }> = {};

  allClubs.forEach(club => {
    clubSquadsMap[club.name] = [...club.squad];
    clubBudgetsMap[club.name] = club.budgetEur;
    if (club.leagueId) {
      clubLeaguesMap[club.name] = { leagueId: club.leagueId, league: club.league };
    }
  });

  const existingState = loadWorldSaveState();
  const accumulatedHistory = [
    ...worldTransfers,
    ...(existingState?.transferHistory || [])
  ].slice(0, 100);

  saveWorldSaveState({
    version: 2,
    seasonYear: nextYear,
    clubSquads: clubSquadsMap,
    clubBudgets: clubBudgetsMap,
    clubLeagues: clubLeaguesMap,
    transferHistory: accumulatedHistory
  });

  // Zera as tabelas de classificação para a nova temporada (mantendo cada clube em sua nova divisão!)
  resetLeagueSimulationState();

  // Notícias das maiores transações para o feed da imprensa
  worldTransfers.slice(0, 3).forEach(transfer => {
    createNewsArticle({
      outlet: transfer.type === 'saudi_mega_deal' ? 'TNT Sports' : 'ge.globo',
      headline: transfer.headline,
      snippet: `Em movimentação expressiva na virada de temporada, o ${transfer.toClub} confirmou o acerto com ${transfer.playerName} (${transfer.age} anos, OVR ${transfer.ovr}). O valor da negociação girou em torno de €${transfer.feeEur.toFixed(1)} milhões.`,
      category: 'transfer',
      categoryLabel: 'Mercado da Bola',
      badgeColor: 'text-amber-400 border-amber-800 bg-amber-950/60',
      dateStr: `Ano ${nextYear} • Janela da Temporada`
    });
  });

  return {
    seasonYear: nextYear,
    retirements,
    breakoutYouths,
    transfers: worldTransfers,
    activeLeagueIds
  };
}
