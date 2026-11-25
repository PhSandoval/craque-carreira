import { Club, RealPlayer, Position, TacticalFormation, ClubTransferSigning } from '../types';
import { CLUBS } from '../data/clubs';

const STORAGE_KEY = 'craque_club_signings_v1';

/**
 * BANCO DE DADOS DE TALENTOS & REFORÇOS DE MERCADO
 * Abrange promessas da base, destaques de divisões de acesso e estrelas internacionais.
 */
const MARKET_TARGET_POOL: Array<{
  name: string;
  position: Position;
  ovr: number;
  age: number;
  nationality: string;
  flag: string;
  marketValueEur: number;
  fromClub: string;
  styleAffinity: 'ofensivo' | 'fisico' | 'tatica' | 'posse' | 'velocidade';
}> = [
  // Zagueiros
  { name: 'Murillo', position: 'ZAG', ovr: 81, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 28.0, fromClub: 'Nottingham Forest', styleAffinity: 'fisico' },
  { name: 'Bernardo Silva', position: 'ZAG', ovr: 77, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5, fromClub: 'Criciúma', styleAffinity: 'tatica' },
  { name: 'Pau Cubarsí', position: 'ZAG', ovr: 81, age: 18, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 40.0, fromClub: 'Barcelona B', styleAffinity: 'posse' },
  { name: 'Kaiky', position: 'ZAG', ovr: 76, age: 21, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.0, fromClub: 'Almería', styleAffinity: 'tatica' },

  // Laterais / Alas (cruciais para 3-5-2 e 3-4-3)
  { name: 'Cuiabano', position: 'LE', ovr: 77, age: 21, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 7.0, fromClub: 'Grêmio', styleAffinity: 'velocidade' },
  { name: 'Marlon Gomes', position: 'LD', ovr: 76, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0, fromClub: 'Vasco', styleAffinity: 'fisico' },
  { name: 'Álvaro Carreras', position: 'LE', ovr: 78, age: 21, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 12.0, fromClub: 'Benfica', styleAffinity: 'velocidade' },
  { name: 'William', position: 'LD', ovr: 78, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0, fromClub: 'Cruzeiro', styleAffinity: 'tatica' },

  // Volantes & Meias Centrais
  { name: 'Pablo Maia', position: 'VOL', ovr: 80, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 15.0, fromClub: 'São Paulo', styleAffinity: 'fisico' },
  { name: 'Danilo', position: 'VOL', ovr: 81, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 26.0, fromClub: 'Nottingham Forest', styleAffinity: 'posse' },
  { name: 'Matheus Pereira', position: 'MEI', ovr: 82, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 18.0, fromClub: 'Cruzeiro', styleAffinity: 'ofensivo' },
  { name: 'Rodrigo Garro', position: 'MEI', ovr: 81, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 14.0, fromClub: 'Corinthians', styleAffinity: 'posse' },
  { name: 'Alisson', position: 'MC', ovr: 77, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0, fromClub: 'São Paulo', styleAffinity: 'tatica' },

  // Pontas & Extremos (cruciais para 4-3-3 e 4-2-3-1)
  { name: 'Wesley', position: 'PE', ovr: 79, age: 20, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 18.0, fromClub: 'Al-Nassr', styleAffinity: 'velocidade' },
  { name: 'Erick Pulga', position: 'PE', ovr: 76, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.5, fromClub: 'Ceará', styleAffinity: 'velocidade' },
  { name: 'Savinho', position: 'PD', ovr: 82, age: 20, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 50.0, fromClub: 'Troyes', styleAffinity: 'ofensivo' },
  { name: 'Facundo Pellistri', position: 'PD', ovr: 77, age: 23, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 8.0, fromClub: 'Panathinaikos', styleAffinity: 'velocidade' },

  // Centroavantes Matadores
  { name: 'Kaio Jorge', position: 'CA', ovr: 79, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 8.5, fromClub: 'Juventus', styleAffinity: 'ofensivo' },
  { name: 'Samu Omorodion', position: 'CA', ovr: 80, age: 20, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 35.0, fromClub: 'Porto', styleAffinity: 'fisico' },
  { name: 'Alerrandro', position: 'CA', ovr: 75, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.8, fromClub: 'Vitória', styleAffinity: 'ofensivo' },
  { name: 'Viktor Gyökeres', position: 'CA', ovr: 85, age: 26, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 70.0, fromClub: 'Sporting CP', styleAffinity: 'fisico' }
];

/**
 * Posições vitais exigidas por cada formação tática
 */
const FORMATION_CRITICAL_POSITIONS: Record<TacticalFormation, Position[]> = {
  '3-5-2': ['ZAG', 'LE', 'LD', 'VOL', 'CA'],
  '4-3-3': ['PE', 'PD', 'CA', 'VOL', 'MC'],
  '4-2-3-1': ['MEI', 'VOL', 'PE', 'PD', 'CA'],
  '3-4-3': ['ZAG', 'LE', 'LD', 'PE', 'PD'],
  '4-4-2': ['CA', 'MC', 'VOL', 'ZAG', 'ME'],
  '5-3-2': ['ZAG', 'LE', 'LD', 'VOL', 'CA'],
  '3-4-2-1': ['ZAG', 'LE', 'LD', 'MEI', 'CA'],
  '4-4-1-1': ['MC', 'VOL', 'MEI', 'CA', 'ME'],
  '3-4-1-2': ['ZAG', 'LE', 'LD', 'MEI', 'CA'],
  '4-1-4-1': ['VOL', 'MC', 'PE', 'PD', 'CA'],
  '5-4-1': ['ZAG', 'LE', 'LD', 'VOL', 'CA']
};

/**
 * Retorna as contratações salvas da IA
 */
export function getSavedClubSignings(): ClubTransferSigning[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Aplica todas as contratações registradas aos elencos dos clubes
 */
export function applySavedClubSigningsToClubs(): void {
  const signings = getSavedClubSignings();
  signings.forEach(signing => {
    const club = CLUBS[signing.clubName];
    if (club && !club.squad.some(p => p.id === signing.player.id)) {
      club.squad.unshift(signing.player);
      // Abate o custo do orçamento do clube
      club.budgetEur = Math.max(0.5, Number((club.budgetEur - signing.transferFeeEur).toFixed(1)));
    }
  });
}

/**
 * Avalia carências do clube baseando-se em:
 * 1. Formação tática (posições indispensáveis)
 * 2. Estilo do técnico (físico, posse, velocidade, etc.)
 * 3. Orçamento disponível (budgetEur)
 */
export function evaluateClubTacticalNeed(club: Club): {
  targetPosition: Position;
  styleNeed: 'ofensivo' | 'fisico' | 'tatica' | 'posse' | 'velocidade';
  reason: string;
} {
  const formation = club.formation || '4-3-3';
  const critical = FORMATION_CRITICAL_POSITIONS[formation] || ['CA', 'ZAG'];
  const squad = club.squad || [];

  // 1. Procura posições com menor número de opções qualificadas
  let weakestPos = critical[0];
  let lowestAvgOvr = 999;

  for (const pos of critical) {
    const playersInPos = squad.filter(p => p.position === pos);
    const avg = playersInPos.length > 0 
      ? playersInPos.reduce((sum, p) => sum + p.ovr, 0) / playersInPos.length
      : 50;
    
    if (avg < lowestAvgOvr) {
      lowestAvgOvr = avg;
      weakestPos = pos;
    }
  }

  // 2. Determina o estilo exigido pelo técnico
  const styleText = (club.playStyle + ' ' + club.coachName).toLowerCase();
  let styleNeed: 'ofensivo' | 'fisico' | 'tatica' | 'posse' | 'velocidade' = 'tatica';

  if (styleText.includes('físic') || styleText.includes('intensidade') || styleText.includes('abel') || styleText.includes('simeone')) {
    styleNeed = 'fisico';
  } else if (styleText.includes('posse') || styleText.includes('guardiola') || styleText.includes('controle') || styleText.includes('filipe')) {
    styleNeed = 'posse';
  } else if (styleText.includes('velocidade') || styleText.includes('transição') || styleText.includes('contra-ataque')) {
    styleNeed = 'velocidade';
  } else if (styleText.includes('ataque') || styleText.includes('pressão') || styleText.includes('ofensiv')) {
    styleNeed = 'ofensivo';
  }

  const reason = `O técnico ${club.coachName} solicitou à diretoria um ${weakestPos} com perfil de ${styleNeed} para potencializar o esquema ${formation}.`;

  return { targetPosition: weakestPos, styleNeed, reason };
}

/**
 * Simula a movimentação do mercado para os clubes da liga pensando em formação,
 * custos, estilo e carências reais de cada time!
 */
export function simulateMarketWindowForClubs(
  currentMatchDay: number,
  userClubName: string
): ClubTransferSigning | null {
  const existing = getSavedClubSignings();
  
  // Limita a 1 nova contratação inteligente a cada 4 rodadas para manter realismo
  const alreadyDoneForRound = existing.some(s => s.matchDay === currentMatchDay);
  if (alreadyDoneForRound) return null;

  // Seleciona um clube ativo (preferencialmente rivais ou concorrentes diretos)
  const candidateClubs = Object.values(CLUBS).filter(c => c.name !== userClubName && c.budgetEur >= 2.0);
  if (candidateClubs.length === 0) return null;

  const targetClub = candidateClubs[Math.floor(Math.random() * candidateClubs.length)];
  const tacticalNeed = evaluateClubTacticalNeed(targetClub);

  // Busca candidatos no pool de mercado compatíveis com o orçamento e carência tática
  const eligiblePlayers = MARKET_TARGET_POOL.filter(target => {
    const isAffordable = target.marketValueEur <= targetClub.budgetEur * 0.75;
    const isPositionMatch = target.position === tacticalNeed.targetPosition || 
      (tacticalNeed.targetPosition === 'LE' && target.position === 'LD') ||
      (tacticalNeed.targetPosition === 'PE' && target.position === 'PD');
    const notAlreadyInSquad = !targetClub.squad.some(p => p.name === target.name);
    return isAffordable && isPositionMatch && notAlreadyInSquad;
  });

  if (eligiblePlayers.length === 0) return null;

  // Prioriza afinidade com o estilo do técnico
  eligiblePlayers.sort((a, b) => {
    const scoreA = a.styleAffinity === tacticalNeed.styleNeed ? 2 : 1;
    const scoreB = b.styleAffinity === tacticalNeed.styleNeed ? 2 : 1;
    return scoreB - scoreA;
  });

  const selectedTarget = eligiblePlayers[0];
  const finalFeeEur = Number((selectedTarget.marketValueEur * (1 + (Math.random() * 0.2 - 0.1))).toFixed(1));

  const newPlayer: RealPlayer = {
    id: `signing_${targetClub.id}_${Date.now()}`,
    name: selectedTarget.name,
    position: selectedTarget.position,
    ovr: selectedTarget.ovr,
    age: selectedTarget.age,
    nationality: selectedTarget.nationality,
    flag: selectedTarget.flag,
    marketValueEur: selectedTarget.marketValueEur,
    isStar: selectedTarget.ovr >= 80
  };

  const coachQuote = `"${targetClub.coachName}: 'O ${selectedTarget.name} é exatamente a peça que faltava para o nosso ${targetClub.formation || '4-3-3'}. Tem intensidade, entende nosso modelo e chega pronto para disputar a titularidade.' "`;

  const signing: ClubTransferSigning = {
    id: `sign_${Date.now()}`,
    clubName: targetClub.name,
    player: newPlayer,
    transferFeeEur: finalFeeEur,
    previousClub: selectedTarget.fromClub,
    reason: tacticalNeed.reason,
    coachQuote,
    matchDay: currentMatchDay,
    dateStr: `Rodada ${currentMatchDay} de 38`
  };

  // 1. Persiste no localStorage
  const updated = [signing, ...existing].slice(0, 20);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  // 2. Aplica imediatamente ao elenco em memória
  applySavedClubSigningsToClubs();

  return signing;
}
