import { 
  Club, 
  MatchDecisionMoment, 
  MatchDecisionOption, 
  PlayerProfile, 
  PlayerAttributes, 
  MatchLineupPlayer, 
  MatchSubstitutionEvent, 
  MatchFixture, 
  Position 
} from '../types';
import { CLUBS } from '../data/clubs';
import { getSquadHierarchy } from './squadHierarchyService';
import { applySavedClubSigningsToClubs, getSavedClubSignings } from './clubTransferAIService';

export const ATTRIBUTE_LABELS: Record<keyof PlayerAttributes, string> = {
  // Principais legados
  finalization: 'Finalização',
  passing: 'Passe',
  dribbling: 'Drible',
  pace: 'Velocidade',
  defense: 'Defesa',
  physical: 'Físico',
  vision: 'Visão de Jogo',

  // FM Técnicos
  finishing: 'Finalização',
  firstTouch: 'Primeiro Toque',
  crossing: 'Cruzamentos',
  tackling: 'Desarme',
  marking: 'Marcação',
  longShots: 'Chutes de Longe',
  heading: 'Cabeceio',
  freeKicks: 'Bolas Paradas',
  penalties: 'Pênaltis',

  // FM Mentais
  composure: 'Compostura',
  decisions: 'Tomada de Decisão',
  offTheBall: 'Sem Bola / Desmarque',
  positioning: 'Posicionamento',
  determination: 'Determinação',
  bravery: 'Bravura',
  teamwork: 'Trabalho em Equipe',
  anticipation: 'Antecipação',
  concentration: 'Concentração',

  // FM Físicos
  acceleration: 'Aceleração',
  stamina: 'Resistência / Fôlego',
  strength: 'Força',
  agility: 'Agilidade',
  balance: 'Equilíbrio',
  jumping: 'Impulsão',

  // FM Goleiro
  reflexes: 'Reflexos',
  oneOnOne: 'Um Contra Um',
  handling: 'Segurança / Jogo de Mãos',
  aerialReach: 'Alcance Aéreo'
};

export interface DecisionEvaluation {
  effectiveStat: number;
  primaryStatName: string;
  secondaryStatName: string;
  primaryVal: number;
  secondaryVal: number;
  hasStyleSynergy: boolean;
  styleBonus: number;
  isContextOptimal: boolean;
  contextBonus: number;
  totalChance: number;
  suitabilityLabel: string;
  suitabilityType: 'ideal' | 'synergy' | 'read' | 'conservative' | 'balanced';
  actionCategory: 'finalizacao' | 'drible' | 'passe' | 'cruzamento' | 'tatica' | 'raca';
  actionCategoryLabel: string;
  styleSynergyTag?: string;
}

/**
 * Avalia cientificamente a adequação de uma opção tática considerando:
 * 1. Estilo de Jogo (arquétipo)
 * 2. Atributos reais do atleta (ponderados)
 * 3. Descrição contextual do lance narrado
 * Sem rótulo 'escolha ideal' para manter a liberdade autêntica do RPG.
 */
export function evaluateOptionSuitability(
  player: PlayerProfile,
  option: MatchDecisionOption
): DecisionEvaluation {
  const pStatKey = option.primaryStat || option.requiredStat || 'passing';
  const sStatKey = option.secondaryStat || pStatKey;

  let primaryVal = player.attributes[pStatKey] ?? 60;
  let secondaryVal = player.attributes[sStatKey] ?? primaryVal;

  // Penalidade biomecânica real de lesão ativa em campo (atuando no sacrifício ou machucado na partida)
  let injuryChancePenalty = 0;
  if (player.activeInjury) {
    const debuff = player.activeInjury.statDebuff;
    if (debuff) {
      if (pStatKey === debuff.stat) primaryVal = Math.max(25, primaryVal - debuff.penalty);
      if (sStatKey === debuff.stat) secondaryVal = Math.max(25, secondaryVal - debuff.penalty);
    }
    // Dor e limitação articular geral ao atuar lesionado
    primaryVal = Math.max(25, primaryVal - 4);
    secondaryVal = Math.max(25, secondaryVal - 4);
    injuryChancePenalty = player.activeInjury.level === 'grave' ? -16 : player.activeInjury.level === 'moderada' ? -11 : -7;
  }

  // Média ponderada técnica (70% atributo principal, 30% secundário)
  const effectiveStat = Math.round(primaryVal * 0.7 + secondaryVal * 0.3);

  // 1. Sinergia com o Estilo de Jogo (Arquétipo)
  const hasStyleSynergy = (option.synergyArchetypes || []).includes(player.playStyleId) ||
                          (option.synergyArchetypes || []).includes('all');
  const styleBonus = hasStyleSynergy ? 10 : 0;

  // 2. Leitura do Contexto da Jogada (Narrativa)
  const isContextOptimal = option.contextFit === 'ideal';
  let contextBonus = 6;
  if (option.contextFit === 'ideal') {
    contextBonus = 10;
  } else if (option.contextFit === 'oportuna') {
    contextBonus = 8;
  } else if (option.contextFit === 'cautelosa') {
    contextBonus = 12; // Ações seguras têm alta taxa de retenção/segurança
  }

  // 3. Modificador de Fôlego e Energia
  const energyMod = player.energy >= 80 ? 4 : player.energy < 50 ? -8 : 0;

  // 4. Bônus de Química & Afinidade com o Companheiro de Lance
  let chemistryBonus = 0;
  if (option.label.includes('[Alta Afinidade]')) {
    chemistryBonus = 10;
  } else if (option.label.includes('[Atrito]')) {
    chemistryBonus = -8;
  }

  // Chance de sucesso calculada dinamicamente (20% a 94%), descontando limitação por lesão se houver
  const totalChance = Math.min(
    94,
    Math.max(20, Math.round((effectiveStat * 0.70) + contextBonus + styleBonus + energyMod + chemistryBonus + injuryChancePenalty))
  );

  // Categoria de ação tática para identificação visual clara
  let actionCategory: DecisionEvaluation['actionCategory'] = 'finalizacao';
  let actionCategoryLabel = 'Finalização';

  if (option.actionType === 'drible') {
    actionCategory = 'drible';
    actionCategoryLabel = 'Drible & Ousadia';
  } else if (option.actionType === 'passe') {
    actionCategory = 'passe';
    actionCategoryLabel = 'Passe & Visão';
  } else if (option.actionType === 'cruzamento') {
    actionCategory = 'cruzamento';
    actionCategoryLabel = 'Cruzamento';
  } else if (option.actionType === 'posicionamento' || option.actionType === 'retencao') {
    actionCategory = 'tatica';
    actionCategoryLabel = 'Controle Tático';
  } else if (option.actionType === 'desarme' || option.actionType === 'briga') {
    actionCategory = 'raca';
    actionCategoryLabel = 'Raça & Combate';
  }

  let styleSynergyTag: string | undefined = undefined;
  if (hasStyleSynergy) {
    styleSynergyTag = `Alinhado ao seu estilo`;
  }

  return {
    effectiveStat,
    primaryStatName: ATTRIBUTE_LABELS[pStatKey] || pStatKey,
    secondaryStatName: ATTRIBUTE_LABELS[sStatKey] || sStatKey,
    primaryVal,
    secondaryVal,
    hasStyleSynergy,
    styleBonus,
    isContextOptimal,
    contextBonus,
    totalChance,
    suitabilityLabel: actionCategoryLabel,
    suitabilityType: 'balanced',
    actionCategory,
    actionCategoryLabel,
    styleSynergyTag
  };
}

export interface MatchOdds {
  homeWinProb: number;
  drawProb: number;
  awayWinProb: number;
  unpredictabilityRate: number;
  chaosDescription: string;
  favoriteName: string;
  expectedGoalsHome: number;
  expectedGoalsAway: number;
  tacticalAnalysis: string;
}

export interface AmbientMatchEvent {
  minute: number;
  team: 'playerTeam' | 'opponentTeam';
  type: 'goal' | 'danger_attack' | 'post' | 'foul' | 'card';
  text: string;
  scorerName?: string;
}

/**
 * Calcula probabilidades de vitória com base no nível dos clubes,
 * mando de campo, estilo de jogo e taxa de imprevisibilidade (fator zebra/clássico)
 */
export function calculateMatchProbabilities(
  homeClub: Club,
  awayClub: Club,
  player: PlayerProfile
): MatchOdds {
  const homeSquadOvr = homeClub.squad?.length 
    ? homeClub.squad.reduce((acc, p) => acc + p.ovr, 0) / homeClub.squad.length 
    : homeClub.prestige * 14 + 10;
  
  const awaySquadOvr = awayClub.squad?.length 
    ? awayClub.squad.reduce((acc, p) => acc + p.ovr, 0) / awayClub.squad.length 
    : awayClub.prestige * 14 + 10;

  const isPlayerHome = player.currentClub === homeClub.name;
  let homeStrength = homeSquadOvr + (homeClub.prestige * 4) + (isPlayerHome ? (player.ovr - 65) * 0.35 : 0);
  let awayStrength = awaySquadOvr + (awayClub.prestige * 4) + (!isPlayerHome ? (player.ovr - 65) * 0.35 : 0);

  // Mando de campo tradicional (+4 pontos de força)
  homeStrength += 4;

  // Impacto do estilo de jogo do atleta no ritmo do jogo
  if (player.playStyleId === 'lateral_ofensivo') {
    if (isPlayerHome) homeStrength += 2.5;
    else awayStrength += 2.5;
  } else if (player.playStyleId === 'lateral_defensivo' || player.playStyleId === 'cao_de_guarda') {
    if (isPlayerHome) awayStrength -= 2.5;
    else homeStrength -= 2.5;
  } else if (player.playStyleId === 'camisa_10_maestro' || player.playStyleId === 'meia_infiltrador') {
    if (isPlayerHome) homeStrength += 2.0;
    else awayStrength += 2.0;
  }

  // Fator de rivalidade e imprevisibilidade (Derbi regional ou clássico)
  const isRivalry = homeClub.rivalClubs.some(r => r.toLowerCase().includes(awayClub.shortName.toLowerCase())) ||
                    awayClub.rivalClubs.some(r => r.toLowerCase().includes(homeClub.shortName.toLowerCase()));

  // Imprevisibilidade base: 10 a 16%, se for clássico salta para 24%
  const unpredictabilityRate = isRivalry ? 24 : Math.floor(Math.random() * 7) + 10;

  const diff = homeStrength - awayStrength;
  let rawHome = 42 + diff * 1.8;
  let rawAway = 32 - diff * 1.8;
  const rawDraw = 26;

  // Modificador de imprevisibilidade (simula o fator zebra e a variação do futebol real)
  const varianceSeed = (Math.random() - 0.48) * (unpredictabilityRate * 0.75);
  rawHome -= varianceSeed;
  rawAway += varianceSeed;

  const clampedHome = Math.max(12, Math.min(76, rawHome));
  const clampedAway = Math.max(12, Math.min(76, rawAway));
  const total = clampedHome + clampedAway + rawDraw;

  const homeWinProb = Math.round((clampedHome / total) * 100);
  const awayWinProb = Math.round((clampedAway / total) * 100);
  const drawProb = 100 - homeWinProb - awayWinProb;

  let chaosDescription = 'Equilíbrio Competitivo Normal';
  if (isRivalry) {
    chaosDescription = 'Clássico Regional (Alta Volatilidade & Tensão Máxima)';
  } else if (unpredictabilityRate >= 16) {
    chaosDescription = 'Fator Zebra Elevado (Jogo Aberto & Imprevisível)';
  } else if (Math.abs(diff) > 12) {
    chaosDescription = 'Favoritismo Técnico Definido';
  }

  const isHomeAttacking = homeClub.playStyle.toLowerCase().includes('ofensiv') || 
                          homeClub.playStyle.toLowerCase().includes('transição') ||
                          homeClub.playStyle.toLowerCase().includes('pressão');
  const isAwayAttacking = awayClub.playStyle.toLowerCase().includes('ofensiv') || 
                          awayClub.playStyle.toLowerCase().includes('transição') ||
                          awayClub.playStyle.toLowerCase().includes('pressão');

  let tacticalAnalysis = `Duelo tático: "${homeClub.playStyle}" vs "${awayClub.playStyle}".`;
  if (player.playStyleId === 'lateral_ofensivo') {
    tacticalAnalysis += ` Suas subidas de lateral ofensivo geram perigo no ataque, mas exigem atenção na recomposição.`;
  } else if (player.playStyleId === 'lateral_defensivo') {
    tacticalAnalysis += ` Sua postura de lateral defensivo garante solidez para fechar as descidas do adversário.`;
  }

  return {
    homeWinProb,
    drawProb,
    awayWinProb,
    unpredictabilityRate,
    chaosDescription,
    favoriteName: homeWinProb > awayWinProb + 7 ? homeClub.shortName : awayWinProb > homeWinProb + 7 ? awayClub.shortName : 'Equilíbrio Total',
    expectedGoalsHome: Math.max(0.6, Number(((homeStrength / 38) * (isHomeAttacking ? 1.15 : 0.95)).toFixed(1))),
    expectedGoalsAway: Math.max(0.5, Number(((awayStrength / 40) * (isAwayAttacking ? 1.15 : 0.9)).toFixed(1))),
    tacticalAnalysis
  };
}

/**
 * Cria a linha do tempo de acontecimentos dinâmicos ao longo dos 90 minutos
 * (gols, defesas, bolas na trave) que ocorrem com narração ao vivo
 */
export function generateMatchTimeline(
  player: PlayerProfile,
  playerClub: Club,
  opponent: Club,
  moments: MatchDecisionMoment[],
  odds: MatchOdds
): AmbientMatchEvent[] {
  const events: AmbientMatchEvent[] = [];
  const decisionMinutes = moments.map(m => m.minute);

  const oppGk = opponent.squad?.find(p => p.position === 'GOL')?.name || 'goleiro rival';
  const oppStar = opponent.squad?.find(p => p.isStar)?.name || opponent.squad?.[0]?.name || 'camisa 10 rival';
  const oppStriker = opponent.squad?.find(p => p.position === 'CA')?.name || oppStar;
  const oppMid = opponent.squad?.find(p => p.position === 'MC' || p.position === 'MEI')?.name || 'meia rival';

  const myGk = playerClub.squad?.find(p => p.position === 'GOL')?.name || 'nosso goleiro';
  const myStriker = playerClub.squad?.find(p => p.position === 'CA' && p.name !== player.name)?.name || 
                    playerClub.squad?.find(p => p.name !== player.name)?.[0]?.name || 'centroavante da equipe';

  // 1. Gols do adversário simulados ao longo dos 90 minutos
  let oppGoalsToScore = 0;
  const oppRoll = Math.random();
  if (oppRoll < (odds.awayWinProb / 100) * 0.7) {
    oppGoalsToScore = 1;
    if (Math.random() < (odds.awayWinProb > 40 ? 0.35 : 0.15)) {
      oppGoalsToScore = 2;
    }
  } else if (Math.random() < 0.22) {
    oppGoalsToScore = 1;
  }

  // 2. Gols de companheiros do time (excluindo os do próprio jogador)
  let teammateGoalsToScore = 0;
  if (Math.random() < (odds.homeWinProb / 100) * 0.55) {
    teammateGoalsToScore = 1;
  }

  // Distribui os gols do adversário em minutos aleatórios (longe dos minutos do jogador)
  for (let g = 0; g < oppGoalsToScore; g++) {
    let targetMin = Math.floor(Math.random() * 68) + 14;
    let attempts = 0;
    while (
      attempts < 10 && 
      (decisionMinutes.some(dm => Math.abs(dm - targetMin) < 4) || events.some(e => Math.abs(e.minute - targetMin) < 5))
    ) {
      targetMin = Math.floor(Math.random() * 68) + 14;
      attempts++;
    }

    const oppScorer = Math.random() < 0.65 ? oppStriker : oppMid;
    const goalPhrases = [
      `GOL DO ${opponent.shortName}! ${oppScorer} aproveita cruzamento rasteiro na área e chuta sem chances para ${myGk}!`,
      `GOL DO ${opponent.shortName}! Transição rápida de contra-ataque puxada por ${oppStar}, e ${oppScorer} desvia no cantinho!`,
      `GOL DO ${opponent.shortName}! Falha na cobertura defensiva e ${oppScorer} manda uma bomba no ângulo!`
    ];

    events.push({
      minute: targetMin,
      team: 'opponentTeam',
      type: 'goal',
      text: goalPhrases[g % goalPhrases.length],
      scorerName: oppScorer
    });
  }

  // Distribui gols de companheiros de equipe
  for (let tg = 0; tg < teammateGoalsToScore; tg++) {
    let targetMin = Math.floor(Math.random() * 65) + 16;
    let attempts = 0;
    while (
      attempts < 10 && 
      (decisionMinutes.some(dm => Math.abs(dm - targetMin) < 4) || events.some(e => Math.abs(e.minute - targetMin) < 5))
    ) {
      targetMin = Math.floor(Math.random() * 65) + 16;
      attempts++;
    }

    events.push({
      minute: targetMin,
      team: 'playerTeam',
      type: 'goal',
      text: `GOL DO ${playerClub.name}! ${myStriker} se antecipa à zaga adversária e cabeceia para o fundo das redes!`,
      scorerName: myStriker
    });
  }

  // Lances de perigo ao longo do jogo (defesas, bola na trave)
  const dangerMinutes = [18, 35, 52, 73, 83];
  dangerMinutes.forEach(dm => {
    if (!decisionMinutes.some(m => Math.abs(m - dm) < 3) && !events.some(e => Math.abs(e.minute - dm) < 3)) {
      if (Math.random() < 0.55) {
        const isOpponent = Math.random() < (odds.awayWinProb / (odds.homeWinProb + odds.awayWinProb));
        if (isOpponent) {
          const isPost = Math.random() < 0.25;
          events.push({
            minute: dm,
            team: 'opponentTeam',
            type: isPost ? 'post' : 'danger_attack',
            text: isPost
              ? `NA TRAVE! ${oppStar} chuta colocado e a bola carimba a trave de ${myGk}! Susto para a nossa zaga!`
              : `DEFESAAÇA DE ${myGk}! O goleiro do ${playerClub.shortName} espalma para escanteio a finalização de ${oppStriker}!`
          });
        } else {
          events.push({
            minute: dm,
            team: 'playerTeam',
            type: 'danger_attack',
            text: `MILAGRE DE ${oppGk}! O ataque do ${playerClub.shortName} solta a bomba da entrada da área e o goleiro adversário salva no cantinho!`
          });
        }
      }
    }
  });

  return events.sort((a, b) => a.minute - b.minute);
}

import { getNextMatchFixture } from './tournamentService';
export { getNextMatchFixture };

/**
 * Retorna o adversário da rodada, respeitando o calendário oficial (Liga ou Copas/Taças)
 */
export function pickOpponentForMatchDay(player: PlayerProfile): Club {
  return getNextMatchFixture(player).opponent;
}

/**
 * Avaliação médica pré-jogo: analisa se o atleta deve ser poupado
 * devido a desgaste físico ou proximidade de decisão de mata-mata.
 */
export interface PreMatchRestAdvice {
  shouldOfferRest: boolean;
  reason: 'fatigue' | 'cup_decider' | 'tactical';
  title: string;
  message: string;
  coachQuote: string;
  recommendedAction: 'start' | 'sub_60' | 'rest_full';
}

export function evaluatePreMatchRest(
  player: PlayerProfile,
  fixture?: MatchFixture
): PreMatchRestAdvice {
  const isLowEnergy = player.energy < 55;
  const isCupDeciderSoon = !!fixture?.isCupKnockout || fixture?.competitionType === 'state_cup' || fixture?.competitionType === 'continental_cup';
  const hierarchy = getSquadHierarchy(player);

  if (isLowEnergy && isCupDeciderSoon) {
    return {
      shouldOfferRest: true,
      reason: 'fatigue',
      title: 'ALERTA DA FISIOLOGIA: DESGASTE & MATA-MATA',
      message: `Com apenas ${player.energy}% de energia e uma decisão da ${fixture?.competitionName || 'Copa'} em jogo, a comissão técnica quer poupar você para evitar estiramento muscular.`,
      coachQuote: `"${hierarchy.coachName}: 'Você é nosso diferencial técnico, mas o calendário brasileiro não perdoa. O que acha de dosar seu esforço para chegar voando na hora da taça?'"`,
      recommendedAction: 'sub_60'
    };
  }

  if (isLowEnergy) {
    return {
      shouldOfferRest: true,
      reason: 'fatigue',
      title: 'CONTROLE DE CARGA FÍSICA',
      message: `Sua energia está em ${player.energy}%. Jogar 90 minutos em alta rotação pode comprometer seu fôlego na reta final.`,
      coachQuote: `"${hierarchy.coachName}: 'Seu corpo está dando sinais de cansaço. Podemos te dar um descanso ou te colocar no segundo tempo para pegar a zaga rival exausta.'"`,
      recommendedAction: 'sub_60'
    };
  }

  if (isCupDeciderSoon && fixture?.stageName?.toLowerCase().includes('final')) {
    return {
      shouldOfferRest: true,
      reason: 'cup_decider',
      title: 'PRESERVAÇÃO PARA A GRANDE FINAL',
      message: `A grande final está no radar. O treinador quer evitar choques e cansaço excessivo para os titulares.`,
      coachQuote: `"${hierarchy.coachName}: 'Se você concordar em ser poupado, o elenco reserva assume hoje e você chega 100% focado na taça!'"`,
      recommendedAction: 'rest_full'
    };
  }

  // Avaliação tática baseada na hierarquia do clube e treinos
  if (hierarchy.naturalRole === 'sub_60') {
    return {
      shouldOfferRest: true,
      reason: 'tactical',
      title: `PAPEL NO DUELO: ${hierarchy.naturalRoleLabel.toUpperCase()}`,
      message: hierarchy.statusExplanation,
      coachQuote: hierarchy.coachVerdictQuote,
      recommendedAction: 'sub_60'
    };
  }

  if (hierarchy.naturalRole === 'rest_full') {
    return {
      shouldOfferRest: true,
      reason: 'tactical',
      title: 'PRESERVAÇÃO / FORA DOS RELACIONADOS',
      message: hierarchy.statusExplanation,
      coachQuote: hierarchy.coachVerdictQuote,
      recommendedAction: 'rest_full'
    };
  }

  return {
    shouldOfferRest: false,
    reason: 'tactical',
    title: 'TITULAR ABSOLUTO CONFIRMADO',
    message: hierarchy.statusExplanation || 'Você está escalado como titular absoluto na posição.',
    coachQuote: hierarchy.coachVerdictQuote || `"${hierarchy.coachName}: 'Conto com sua intensidade desde o primeiro minuto!'"`,
    recommendedAction: 'start'
  };
}

/**
 * Determina dinamicamente a frequência e os minutos de decisão na partida.
 * A frequência DEPENDE do contexto:
 * - Jogos de Copa ou Clássicos: ritmo frenético (4 a 5 momentos)!
 * - Jogos truncados de meio-campo: 2 a 3 momentos bem espaçados.
 * - Se entrar no 2º tempo (super-sub aos 60'): momentos concentrados no final.
 */
export function generateMatchMomentMinutes(
  odds: MatchOdds, 
  player: PlayerProfile,
  fixture?: MatchFixture,
  userRestMode?: 'start' | 'sub_60' | 'rest_full'
): number[] {
  // Se o jogador foi poupado para descanso total, não atua no gramado
  if (userRestMode === 'rest_full') {
    return [];
  }

  // Se entra como super-sub aos 60':
  if (userRestMode === 'sub_60') {
    return [66, 78, 88];
  }

  const isRivalry = odds.chaosDescription?.includes('Clássico') || false;
  const isCup = !!fixture?.isCupKnockout || fixture?.competitionType === 'state_cup' || fixture?.competitionType === 'national_cup' || fixture?.competitionType === 'continental_cup';
  const isAttackingGame = odds.expectedGoalsHome + odds.expectedGoalsAway >= 2.4;

  let momentCount = 3;
  if (isCup || isRivalry) {
    momentCount = Math.random() < 0.75 ? 5 : 4; // Ritmo alucinante em decisões e clássicos
  } else if (isAttackingGame || odds.unpredictabilityRate >= 16) {
    momentCount = Math.random() < 0.6 ? 4 : 3;
  } else if (odds.expectedGoalsHome + odds.expectedGoalsAway < 1.4) {
    momentCount = 2; // Partida truncada de muita marcação
  }

  const minutes: number[] = [];

  if (momentCount === 5) {
    minutes.push(Math.floor(Math.random() * 10) + 12); // 12' a 21'
    minutes.push(Math.floor(Math.random() * 10) + 32); // 32' a 41'
    minutes.push(Math.floor(Math.random() * 10) + 54); // 54' a 63'
    minutes.push(Math.floor(Math.random() * 8) + 72);  // 72' a 79'
    minutes.push(Math.floor(Math.random() * 6) + 85);  // 85' a 90'
  } else if (momentCount === 4) {
    minutes.push(Math.floor(Math.random() * 14) + 16); // 16' a 29'
    minutes.push(Math.floor(Math.random() * 10) + 38); // 38' a 47'
    minutes.push(Math.floor(Math.random() * 12) + 60); // 60' a 71'
    minutes.push(Math.floor(Math.random() * 10) + 80); // 80' a 89'
  } else if (momentCount === 3) {
    minutes.push(Math.floor(Math.random() * 16) + 18); // 18' a 33'
    minutes.push(Math.floor(Math.random() * 14) + 53); // 53' a 66'
    minutes.push(Math.floor(Math.random() * 12) + 76); // 76' a 87'
  } else {
    minutes.push(Math.floor(Math.random() * 18) + 26);
    minutes.push(Math.floor(Math.random() * 18) + 72);
  }

  return minutes.sort((a, b) => a - b);
}

/**
 * Retorna as posições de campo para cada formação tática
 */
export function getPositionsForFormation(formation: string = '4-3-3'): Position[] {
  switch (formation) {
    case '3-5-2':
      return ['GOL', 'ZAG', 'ZAG', 'ZAG', 'LE', 'LD', 'VOL', 'MC', 'MEI', 'CA', 'CA'];
    case '4-2-3-1':
      return ['GOL', 'ZAG', 'ZAG', 'LE', 'LD', 'VOL', 'VOL', 'PE', 'MEI', 'PD', 'CA'];
    case '4-4-2':
      return ['GOL', 'ZAG', 'ZAG', 'LE', 'LD', 'ME', 'MC', 'MC', 'MD', 'CA', 'CA'];
    case '3-4-3':
      return ['GOL', 'ZAG', 'ZAG', 'ZAG', 'LE', 'LD', 'MC', 'MC', 'PE', 'PD', 'CA'];
    case '5-3-2':
      return ['GOL', 'ZAG', 'ZAG', 'ZAG', 'LE', 'LD', 'VOL', 'MC', 'MEI', 'CA', 'CA'];
    case '4-3-3':
    default:
      return ['GOL', 'ZAG', 'ZAG', 'LE', 'LD', 'VOL', 'MC', 'MEI', 'PE', 'PD', 'CA'];
  }
}

export function isCompatiblePosition(candidate: Position, target: Position): boolean {
  if (candidate === target) return true;
  if ((candidate === 'LE' || candidate === 'LD') && target === 'ZAG') return true;
  if (candidate === 'VOL' && target === 'MC') return true;
  if (candidate === 'MC' && (target === 'VOL' || target === 'MEI')) return true;
  if (candidate === 'MEI' && (target === 'MC' || target === 'PE' || target === 'PD')) return true;
  if ((candidate === 'PE' || candidate === 'PD') && target === 'CA') return true;
  if (candidate === 'CA' && (target === 'PE' || target === 'PD')) return true;
  return false;
}

function getJerseyNumberForPosition(pos: Position, usedNumbers: number[]): number {
  const defaults: Record<Position, number[]> = {
    'GOL': [1, 12, 22, 23],
    'LD': [2, 13, 23, 24],
    'ZAG': [3, 4, 14, 15, 25, 33],
    'LE': [6, 16, 26, 36],
    'VOL': [5, 8, 15, 17, 28],
    'MC': [8, 7, 18, 20],
    'ME': [11, 16, 21],
    'MD': [7, 17, 22],
    'MEI': [10, 20, 30, 80],
    'PE': [11, 17, 27, 77],
    'PD': [7, 19, 29, 99],
    'CA': [9, 18, 19, 21, 99]
  };

  const pool = defaults[pos] || [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  for (const num of pool) {
    if (!usedNumbers.includes(num)) return num;
  }
  let fallback = 2;
  while (usedNumbers.includes(fallback)) fallback++;
  return fallback;
}

interface NamePool {
  first: string[];
  last: string[];
}

const NAME_POOLS: Record<string, NamePool> = {
  Brasil: {
    first: ['Gabriel', 'Lucas', 'Matheus', 'Felipe', 'Bruno', 'Rafael', 'Diego', 'Thiago', 'Renan', 'Vitor', 'Caio', 'Igor', 'Eduardo', 'Guilherme', 'Arthur', 'Leo', 'Danilo', 'Murilo', 'Vinicius', 'Yuri', 'Fabricio', 'Otavio', 'Samuel', 'Kauã', 'Luan'],
    last: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Rocha', 'Barbosa', 'Nascimento', 'Menezes', 'Teixeira', 'Cardoso']
  },
  Inglaterra: {
    first: ['Oliver', 'Harry', 'Jack', 'George', 'Charlie', 'James', 'Callum', 'Archie', 'Mason', 'Ethan', 'Liam', 'Thomas', 'Jacob', 'Declan', 'Harvey', 'Finlay', 'Jude', 'Cole'],
    last: ['Smith', 'Jones', 'Taylor', 'Brown', 'Wilson', 'Evans', 'Walker', 'Davies', 'Wright', 'Robinson', 'Thompson', 'White', 'Edwards', 'Green', 'Hall', 'Wood', 'Clarke']
  },
  Espanha: {
    first: ['Alejandro', 'Daniel', 'Pablo', 'Álvaro', 'Adrián', 'David', 'Diego', 'Javier', 'Mario', 'Marcos', 'Sergio', 'Carlos', 'Manuel', 'Iker', 'Hugo', 'Pau', 'Ferran', 'Gavi'],
    last: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Navarro']
  },
  Itália: {
    first: ['Lorenzo', 'Leonardo', 'Francesco', 'Alessandro', 'Andrea', 'Mattia', 'Gabriele', 'Riccardo', 'Tommaso', 'Edoardo', 'Federico', 'Matteo', 'Nicolo', 'Giacomo', 'Davide', 'Gianluigi'],
    last: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Costa', 'Mancini', 'Rizzo']
  },
  Alemanha: {
    first: ['Lukas', 'Jonas', 'Leon', 'Maximilian', 'Finn', 'Felix', 'Elias', 'Paul', 'Ben', 'Noah', 'Florian', 'Julian', 'Niklas', 'Moritz', 'Jan', 'Timo', 'Kai', 'Joshua'],
    last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder']
  },
  Portugal: {
    first: ['Afonso', 'Rodrigo', 'Martim', 'Lourenço', 'Tomás', 'Duarte', 'Diogo', 'Tiago', 'João', 'Gonçalo', 'Bernardo', 'Ruben', 'Francisco', 'Rafael', 'Nuno', 'Vasco', 'Pedro'],
    last: ['Silva', 'Santos', 'Ferreira', 'Pereira', 'Oliveira', 'Costa', 'Rodrigues', 'Martins', 'Sousa', 'Fernandes', 'Gonçalves', 'Gomes', 'Lopes', 'Marques', 'Alves', 'Ribeiro']
  },
  França: {
    first: ['Lucas', 'Hugo', 'Louis', 'Arthur', 'Jules', 'Gabriel', 'Léo', 'Adam', 'Raphaël', 'Nathan', 'Kylian', 'Enzo', 'Mathéo', 'Clément', 'Théo', 'Maxime', 'Aurélien', 'Bradley'],
    last: ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand']
  },
  Holanda: {
    first: ['Sem', 'Lucas', 'Milan', 'Daan', 'Levi', 'Finn', 'Jesse', 'Bram', 'Luuk', 'Liam', 'Cody', 'Teun', 'Marten', 'Quinten', 'Tijjani', 'Bart', 'Wout', 'Stefan'],
    last: ['De Jong', 'Van Dijk', 'Jansen', 'Van den Berg', 'Bakker', 'Visser', 'Smit', 'Meijer', 'De Boer', 'Mulder', 'De Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'Van Leeuwen']
  },
  Turquia: {
    first: ['Yusuf', 'Arda', 'Berat', 'Emir', 'Kerem', 'Barış', 'Can', 'Emre', 'Kaan', 'Eren', 'Hakan', 'Cenk', 'Ferdi', 'Kenan', 'Semih', 'Merih', 'Uğurcan', 'İsmail'],
    last: ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt']
  },
  Escócia: {
    first: ['Callum', 'Lewis', 'Findlay', 'Cameron', 'Euan', 'Fraser', 'Rory', 'Brodie', 'Angus', 'Jamie', 'Scott', 'Kieran', 'John', 'Billy', 'Che', 'Ryan', 'Grant'],
    last: ['Campbell', 'Stewart', 'Robertson', 'Murray', 'McIntyre', 'MacDonald', 'Hamilton', 'Graham', 'McGregor', 'Tierney', 'Christie', 'Ferguson', 'Armstrong', 'Hendry', 'McTominay']
  },
  'Arábia Saudita': {
    first: ['Mohammed', 'Ali', 'Fahad', 'Salem', 'Abdullah', 'Sultan', 'Saud', 'Abdulrahman', 'Nawaf', 'Hassan', 'Firas', 'Saleh', 'Yasser', 'Abdulelah', 'Ayman'],
    last: ['Al-Dawsari', 'Al-Shahrani', 'Al-Faraj', 'Al-Buraikan', 'Al-Ghannam', 'Al-Malki', 'Al-Bulaihi', 'Al-Tambakti', 'Al-Khaibari', 'Al-Najei', 'Al-Shehri']
  },
  Argentina: {
    first: ['Mateo', 'Bautista', 'Santiago', 'Benjamín', 'Lucas', 'Thiago', 'Joaquín', 'Nicolás', 'Julián', 'Enzo', 'Alexis', 'Rodrigo', 'Lautaro', 'Nahuel', 'Cristian', 'Emiliano'],
    last: ['González', 'Rodríguez', 'López', 'Fernández', 'Gómez', 'Díaz', 'Martínez', 'Pérez', 'García', 'Sánchez', 'Romero', 'Sosa', 'Álvarez', 'Torres', 'Ruiz', 'Ramírez']
  }
};

function generateRealisticPlayerName(country: string, pos: Position, clubId: string, idx: number, matchDay: number): string {
  const pool = NAME_POOLS[country] || NAME_POOLS['Brasil'];
  let hash = 0;
  const key = `${clubId}_${pos}_${idx}_${matchDay}`;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) >>> 0;
  }
  const first = pool.first[hash % pool.first.length];
  const last = pool.last[(hash * 7 + idx + 3) % pool.last.length];
  return `${first} ${last}`;
}

/**
 * Cria a escalação titular completa (11 jogadores) e banco de reservas,
 * integrando notas ao vivo, overall, stamina, estilo do técnico,
 * rodízio de elenco e reforços contratados pelo clube.
 */
export function generateTeamLineupAndBench(
  club: Club,
  userPlayer: PlayerProfile | null,
  isUserTeam: boolean,
  userRestMode?: 'start' | 'sub_60' | 'rest_full',
  matchContext?: { matchDay?: number; isDerby?: boolean; opponentName?: string }
): { starters: MatchLineupPlayer[]; bench: MatchLineupPlayer[] } {
  // 1. Aplica contratações salvas para manter o elenco atualizado
  applySavedClubSigningsToClubs();
  const savedSignings = getSavedClubSignings();
  const signingPlayerIds = new Set(savedSignings.map(s => s.player.id));

  const formation = club.formation || '4-3-3';
  const positionsNeeded = getPositionsForFormation(formation);
  const squad = [...(club.squad || [])];
  const starters: MatchLineupPlayer[] = [];
  const usedSquadIds = new Set<string>();

  const matchDay = matchContext?.matchDay ?? (userPlayer?.currentMatchDay || 1);
  const isDerby = matchContext?.isDerby || club.rivalClubs?.some(r => matchContext?.opponentName?.includes(r));
  const coachStyle = (club.playStyle + ' ' + club.coachName).toLowerCase();

  // 1. Se for o time do usuário e ele começa jogando:
  let userInserted = false;
  if (isUserTeam && userPlayer && userRestMode !== 'sub_60' && userRestMode !== 'rest_full') {
    starters.push({
      id: userPlayer.id,
      name: `${userPlayer.name} "${userPlayer.surname}"`,
      number: userPlayer.number,
      position: userPlayer.position,
      ovr: userPlayer.ovr,
      stamina: Math.max(30, userPlayer.energy),
      rating: 6.5,
      goals: 0,
      assists: 0,
      yellowCard: false,
      redCard: false,
      isSubstituted: false,
      isUserPlayer: true
    });
    userInserted = true;
  }

  // 2. Preenche as posições restantes em DUAS PASSADAS para NUNCA improvisar lateral na zaga ou meia no ataque se houver jogador da posição exata!
  const remainingPositions = [...positionsNeeded];
  if (userInserted && userPlayer) {
    const exactIdx = remainingPositions.indexOf(userPlayer.position);
    if (exactIdx !== -1) {
      remainingPositions.splice(exactIdx, 1);
    } else {
      const compatIdx = remainingPositions.findIndex(rp => isCompatiblePosition(userPlayer.position, rp));
      if (compatIdx !== -1) remainingPositions.splice(compatIdx, 1);
      else remainingPositions.pop();
    }
  }

  const unfilledPositions: Position[] = [];

  // PASSADA 1: Somente especialistas da posição exata (ex: ZAG para ZAG, CA para CA, LE para LE)
  for (let pIdx = 0; pIdx < remainingPositions.length; pIdx++) {
    const pos = remainingPositions[pIdx];
    const exactCandidates = squad
      .filter(p => !usedSquadIds.has(p.id) && p.position === pos)
      .sort((a, b) => b.ovr - a.ovr);

    if (exactCandidates.length > 0) {
      let match = exactCandidates[0];
      let isRotated = false;

      if (!isDerby && exactCandidates.length >= 2) {
        const ovrGap = exactCandidates[0].ovr - exactCandidates[1].ovr;
        const shouldRotate = ovrGap <= 3 && (matchDay + pIdx) % 4 === 0;
        if (shouldRotate) {
          match = exactCandidates[1];
          isRotated = true;
        }
      }

      usedSquadIds.add(match.id);
      const isNewSigning = signingPlayerIds.has(match.id);

      starters.push({
        id: match.id,
        name: match.name,
        number: getJerseyNumberForPosition(pos, starters.map(s => s.number)),
        position: pos,
        ovr: match.ovr,
        stamina: Math.floor(Math.random() * 8) + 92,
        rating: 6.5,
        goals: 0,
        assists: 0,
        yellowCard: false,
        redCard: false,
        isSubstituted: false,
        isNewSigning,
        isRotated
      });
    } else {
      unfilledPositions.push(pos);
    }
  }

  // PASSADA 2: Apenas para vagas sem especialista no elenco, busca compatível tático ou atleta da base/elenco complementar
  for (let uIdx = 0; uIdx < unfilledPositions.length; uIdx++) {
    const pos = unfilledPositions[uIdx];
    const compatCandidates = squad
      .filter(p => !usedSquadIds.has(p.id) && isCompatiblePosition(p.position, pos))
      .sort((a, b) => b.ovr - a.ovr);

    const match = compatCandidates[0];
    if (match) {
      usedSquadIds.add(match.id);
      const isNewSigning = signingPlayerIds.has(match.id);

      starters.push({
        id: match.id,
        name: match.name,
        number: getJerseyNumberForPosition(pos, starters.map(s => s.number)),
        position: pos,
        ovr: Math.max(58, match.ovr - 2),
        stamina: Math.floor(Math.random() * 8) + 92,
        rating: 6.5,
        goals: 0,
        assists: 0,
        yellowCard: false,
        redCard: false,
        isSubstituted: false,
        isNewSigning,
        isRotated: false
      });
    } else {
      const compName = generateRealisticPlayerName(club.country, pos, club.id, starters.length, matchDay);
      const baseOvr = Math.min(84, Math.max(62, club.prestige * 14 + 10 + (Math.floor(Math.random() * 5) - 2)));
      starters.push({
        id: `comp_${club.id}_${pos}_${starters.length}`,
        name: compName,
        number: getJerseyNumberForPosition(pos, starters.map(s => s.number)),
        position: pos,
        ovr: baseOvr,
        stamina: Math.floor(Math.random() * 8) + 92,
        rating: 6.5,
        goals: 0,
        assists: 0,
        yellowCard: false,
        redCard: false,
        isSubstituted: false
      });
    }
  }

  // 3. Monta o Banco de Reservas
  const bench: MatchLineupPlayer[] = [];

  // Se o usuário foi poupado para entrar no 2º tempo ou descanso:
  if (isUserTeam && userPlayer && (userRestMode === 'sub_60' || userRestMode === 'rest_full')) {
    bench.push({
      id: userPlayer.id,
      name: `${userPlayer.name} "${userPlayer.surname}"`,
      number: userPlayer.number,
      position: userPlayer.position,
      ovr: userPlayer.ovr,
      stamina: userRestMode === 'sub_60' ? 100 : Math.min(100, userPlayer.energy + 35),
      rating: 6.0,
      goals: 0,
      assists: 0,
      yellowCard: false,
      redCard: false,
      isSubstituted: false,
      isUserPlayer: true,
      isRested: true,
      isBench: true
    });
  }

  // Jogadores restantes do elenco real
  for (const p of squad) {
    if (!usedSquadIds.has(p.id)) {
      bench.push({
        id: p.id,
        name: p.name,
        number: getJerseyNumberForPosition(p.position, [...starters, ...bench].map(s => s.number)),
        position: p.position,
        ovr: p.ovr,
        stamina: 100,
        rating: 6.0,
        goals: 0,
        assists: 0,
        yellowCard: false,
        redCard: false,
        isSubstituted: false,
        isBench: true
      });
      usedSquadIds.add(p.id);
    }
  }

  // Complementa banco até 6 jogadores
  while (bench.length < 6) {
    const posChoice: Position = bench.length === 0 ? 'GOL' : bench.length === 1 ? 'ZAG' : bench.length === 2 ? 'VOL' : bench.length === 3 ? 'MEI' : 'CA';
    const compName = generateRealisticPlayerName(club.country, posChoice, club.id, 100 + bench.length, matchDay);
    bench.push({
      id: `bench_${club.id}_${posChoice}_${bench.length}`,
      name: compName,
      number: getJerseyNumberForPosition(posChoice, [...starters, ...bench].map(s => s.number)),
      position: posChoice,
      ovr: Math.max(60, club.prestige * 14 + 6),
      stamina: 100,
      rating: 6.0,
      goals: 0,
      assists: 0,
      yellowCard: false,
      redCard: false,
      isSubstituted: false,
      isBench: true
    });
  }

  const posOrder: Record<Position, number> = {
    'GOL': 1, 'LE': 2, 'ZAG': 3, 'LD': 4,
    'VOL': 5, 'MC': 6, 'ME': 7, 'MD': 8, 'MEI': 9,
    'PE': 10, 'PD': 11, 'CA': 12
  };
  starters.sort((a, b) => (posOrder[a.position] || 99) - (posOrder[b.position] || 99));

  return { starters, bench };
}

/**
 * Atualiza o nível de cansaço / fôlego dos atletas minuto a minuto
 */
export function tickLineupStamina(
  lineup: MatchLineupPlayer[],
  playStyle: string = ''
): MatchLineupPlayer[] {
  const isHighPress = playStyle.toLowerCase().includes('pressão') || playStyle.toLowerCase().includes('transição');
  const pressMultiplier = isHighPress ? 1.15 : 1.0;

  return lineup.map(player => {
    if (player.isSubstituted) return player;

    let decayRate = 0.65;
    if (player.position === 'GOL') decayRate = 0.12;
    else if (player.position === 'ZAG') decayRate = 0.50;
    else if (player.position === 'LE' || player.position === 'LD') decayRate = 0.80;
    else if (player.position === 'VOL' || player.position === 'MC') decayRate = 0.85;
    else if (player.position === 'MEI') decayRate = 0.78;
    else if (player.position === 'CA' || player.position === 'PE' || player.position === 'PD') decayRate = 0.68;

    const newStamina = Math.max(15, Number((player.stamina - (decayRate * pressMultiplier)).toFixed(1)));
    return {
      ...player,
      stamina: newStamina
    };
  });
}

/**
 * Processa substituição tática ao vivo entre 58' e 78'
 */
export function triggerTacticalSubstitution(
  minute: number,
  lineup: MatchLineupPlayer[],
  bench: MatchLineupPlayer[],
  teamName: string,
  isPlayerTeam: boolean,
  userRestMode?: 'start' | 'sub_60' | 'rest_full'
): {
  updatedLineup: MatchLineupPlayer[];
  updatedBench: MatchLineupPlayer[];
  subEvent: MatchSubstitutionEvent | null;
} {
  // Caso especial: entrada do atleta usuário como Super-Sub aos 60 minutos
  if (isPlayerTeam && userRestMode === 'sub_60' && minute === 60) {
    const userInBench = bench.find(b => b.isUserPlayer);
    if (userInBench) {
      // Substitui o jogador de meio-campo ou ataque mais cansado
      const playerOutCandidates = lineup.filter(p => !p.isSubstituted && p.position !== 'GOL');
      playerOutCandidates.sort((a, b) => a.stamina - b.stamina);
      const playerOut = playerOutCandidates[0] || lineup[lineup.length - 1];

      const updatedLineup = lineup.map(p => {
        if (p.id === playerOut.id) {
          return {
            ...p,
            isSubstituted: true,
            substitutedMinute: minute,
            substituteInName: userInBench.name
          };
        }
        return p;
      });

      const activeUser: MatchLineupPlayer = {
        ...userInBench,
        isBench: false,
        isSubstituted: false,
        stamina: 100,
        rating: 6.5
      };

      updatedLineup.push(activeUser);
      const updatedBench = bench.filter(b => b.id !== userInBench.id);

      return {
        updatedLineup,
        updatedBench,
        subEvent: {
          minute,
          team: 'playerTeam',
          teamName,
          playerOut,
          playerIn: activeUser,
          reason: 'tatica'
        }
      };
    }
  }

  // Substituições normais da IA (máximo 3 por equipe)
  const currentSubsCount = lineup.filter(p => p.isSubstituted).length;
  if (currentSubsCount >= 3 || bench.length === 0) {
    return { updatedLineup: lineup, updatedBench: bench, subEvent: null };
  }

  // Critério de fadiga: procura o titular de linha mais exausto com stamina < 58%
  const fatiguedStarters = lineup.filter(p => !p.isSubstituted && !p.isUserPlayer && p.position !== 'GOL' && p.stamina <= 58);
  if (fatiguedStarters.length === 0) {
    return { updatedLineup: lineup, updatedBench: bench, subEvent: null };
  }

  fatiguedStarters.sort((a, b) => a.stamina - b.stamina);
  const playerOut = fatiguedStarters[0];

  // Busca no banco um reserva com posição afim
  let subInIndex = bench.findIndex(b => isCompatiblePosition(b.position, playerOut.position));
  if (subInIndex === -1) subInIndex = 0;
  const playerIn = bench[subInIndex];

  const updatedLineup = lineup.map(p => {
    if (p.id === playerOut.id) {
      return {
        ...p,
        isSubstituted: true,
        substitutedMinute: minute,
        substituteInName: playerIn.name
      };
    }
    return p;
  });

  const activeSub: MatchLineupPlayer = {
    ...playerIn,
    isBench: false,
    isSubstituted: false,
    stamina: 100,
    rating: 6.2
  };

  updatedLineup.push(activeSub);
  const updatedBench = bench.filter((_, idx) => idx !== subInIndex);

  return {
    updatedLineup,
    updatedBench,
    subEvent: {
      minute,
      team: isPlayerTeam ? 'playerTeam' : 'opponentTeam',
      teamName,
      playerOut,
      playerIn: activeSub,
      reason: playerOut.stamina < 45 ? 'cansaco' : 'tatica'
    }
  };
}

/**
 * Atualiza notas ao vivo quando um gol é marcado
 */
export function updateRatingsOnGoal(
  scoringLineup: MatchLineupPlayer[],
  concedingLineup: MatchLineupPlayer[],
  scorerName: string,
  assisterName?: string
): { scoring: MatchLineupPlayer[]; conceding: MatchLineupPlayer[] } {
  const scoring = scoringLineup.map(p => {
    let delta = 0.1;
    let goals = p.goals;
    let assists = p.assists;

    if (p.name.toLowerCase().includes(scorerName.toLowerCase()) || scorerName.toLowerCase().includes(p.name.toLowerCase())) {
      delta = 1.3;
      goals += 1;
    } else if (assisterName && (p.name.toLowerCase().includes(assisterName.toLowerCase()) || assisterName.toLowerCase().includes(p.name.toLowerCase()))) {
      delta = 0.8;
      assists += 1;
    }

    return {
      ...p,
      goals,
      assists,
      rating: Math.min(10.0, Number((p.rating + delta).toFixed(1)))
    };
  });

  const conceding = concedingLineup.map(p => {
    let delta = -0.1;
    if (p.position === 'GOL' || p.position === 'ZAG') {
      delta = -0.3;
    }
    return {
      ...p,
      rating: Math.max(4.0, Number((p.rating + delta).toFixed(1)))
    };
  });

  return { scoring, conceding };
}

/**
 * Cria dinamicamente um momento contextual ÚNICO, 100% influenciado pelo
 * placar atual da partida, minuto de jogo e elenco real do adversário.
 */
export function createContextualMoment(
  player: PlayerProfile,
  opponent: Club,
  minute: number,
  currentScore: { home: number; away: number },
  usedScenarioKeys: Set<string>
): MatchDecisionMoment {
  const oppGkObj = opponent.squad?.find(p => p.position === 'GOL');
  const oppGk = oppGkObj?.name || 'goleiro rival';

  const oppDefObj = opponent.squad?.find(p => p.position === 'ZAG' || p.position === 'VOL' || p.position === 'LE' || p.position === 'LD');
  const oppDef = oppDefObj?.name || 'marcador adversário';

  const oppStarObj = opponent.squad?.find(p => p.isStar) || opponent.squad?.[0];
  const oppStar = oppStarObj?.name || 'camisa 10 rival';

  // Extrai companheiros reais da equipe do atleta e suas afinidades
  const playerClub = CLUBS[player.currentClub] || CLUBS['Grêmio Novorizontino'];
  const affinities = player.teammateAffinities || {};

  // Companheiro de ataque (ex: Neto Pessoa / Waguininho)
  const strikerTeammate = playerClub.squad?.find(p => (p.position === 'CA' || p.position === 'PE' || p.position === 'PD') && !p.name.toLowerCase().includes(player.surname.toLowerCase())) || playerClub.squad?.[0];
  const strikerName = strikerTeammate?.name || 'companheiro de ataque';
  const strikerAffinityObj = strikerTeammate ? affinities[strikerTeammate.id] : null;
  const strikerAff = strikerAffinityObj ? strikerAffinityObj.affinity : 75;
  const strikerAffTag = strikerAff >= 75 ? '[Alta Afinidade]' : strikerAff < 45 ? '[Atrito]' : '[NEUTRO] Neutro';

  // Companheiro de meio-campo (ex: Marlon / Willian Farias)
  const midTeammate = playerClub.squad?.find(p => (p.position === 'VOL' || p.position === 'MC') && !p.name.toLowerCase().includes(player.surname.toLowerCase())) || playerClub.squad?.[1];
  const midName = midTeammate?.name || 'volante';
  const midAffinityObj = midTeammate ? affinities[midTeammate.id] : null;
  const midAff = midAffinityObj ? midAffinityObj.affinity : 70;
  const midAffTag = midAff >= 75 ? '[Alta Afinidade]' : midAff < 45 ? '[Atrito]' : '[NEUTRO] Neutro';

  const footStr = player.preferredFoot === 'Esquerda' ? 'esquerdo' : 'direito';
  const isLosing = currentScore.home < currentScore.away;
  const isWinning = currentScore.home > currentScore.away;
  const isTied = currentScore.home === currentScore.away;
  const isLate = minute >= 76;
  const isFlankPlayer = player.position === 'LE' || player.position === 'LD' || player.position === 'PE' || player.position === 'PD';

  // Banco rico de cenários contextuais
  interface ScenarioBlueprint {
    key: string;
    canUse: boolean;
    contextTitle: string;
    situationText: string;
    options: MatchDecisionOption[];
  }

  const blueprints: ScenarioBlueprint[] = [
    // ----------------------------------------------------
    // CENÁRIO 1: EM DESVANTAGEM - ABAFA NA ÁREA
    // ----------------------------------------------------
    {
      key: 'lose_abafa_box',
      canUse: isLosing,
      contextTitle: `[VELOCIDADE] PRESSÃO: BUSCANDO O EMPATE (${currentScore.home}x${currentScore.away})`,
      situationText: `O estádio ruge em tensão com seu time atrás no placar (${currentScore.home}x${currentScore.away})! O ${opponent.shortName} recua as linhas para segurar o resultado. Você recebe na meia-lua, o marcador ${oppDef} sai afobado para dar o combate e o ângulo de chute se abre no seu pé ${footStr}!`,
      options: [
        {
          id: 'opt_lose_shoot_curve',
          label: `Chute colocado no canto buscando o empate salvador`,
          description: `Bater com efeito na bochecha da rede tirando do alcance de ${oppGk}.`,
          primaryStat: 'finalization',
          secondaryStat: 'vision',
          actionType: 'finalizacao',
          synergyArchetypes: ['meia_infiltrador', 'centroavante_matador', 'ponta_driblador', 'lateral_ofensivo'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita o espaço aberto na meia-lua para arrematar com frieza.',
          statBonus: 14,
          tagsIfChosen: ['decisivo', 'abafa'],
          successNarrative: `[GOL!] GOLAÇO DE EMPATE! Você bateu colocado de chapa tirando da marcação de ${oppDef}. A bola fez uma curva primorosa no ângulo gaveta, sem nenhuma chance para o goleiro ${oppGk}! O estádio veio abaixo!`,
          failureNarrative: `[BLOQUEADO] NA TRAVE! Você tentou o chute colocado com curva buscando o ângulo, mas a bola caprichosamente carimbou a quina da trave de ${oppGk} e saiu para fora!`
        },
        {
          id: 'opt_lose_through_pass',
          label: `Passe de primeira furando a zaga para ${strikerName} (${strikerAffTag})`,
          description: `Enfiar a bola na pequena área para ${strikerName} desmarcado empurrar pro gol.`,
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'passe',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove'],
          contextFit: 'oportuna',
          tacticalInsight: 'Visão de jogo para encontrar o companheiro livre na pressão.',
          statBonus: 10,
          tagsIfChosen: ['garcom'],
          successNarrative: `[ASSISTÊNCIA] ASSISTÊNCIA MONUMENTAL! De primeira, você achou um passe cirúrgico no vão das pernas de ${oppDef}. ${strikerName} recebeu livre na cara do gol e fuzilou para empatar!`,
          failureNarrative: `[INTERCEPTADO] TRAVADO NA HORA H! Você tentou enfiar a bola de primeira para ${strikerName}, mas ${oppDef} esticou o pé no reflexo e interceptou o passe no último milésimo de segundo.`
        },
        {
          id: 'opt_lose_shield_foul',
          label: `Proteger com o corpo e cavar falta frontal em ${oppDef}`,
          description: 'Usar o físico para arrancar falta na risca da grande área e cartão do rival.',
          primaryStat: 'physical',
          secondaryStat: 'dribbling',
          actionType: 'posicionamento',
          synergyArchetypes: ['box_to_box', 'all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Garante bola parada de ouro sem arriscar perder a posse.',
          statBonus: 6,
          tagsIfChosen: ['malandro'],
          successNarrative: `[VELOCIDADE] FALTA PERIGOSA & CARTÃO! Você protegeu a posse com o corpo, ${oppDef} chegou afobado no tranco por trás e derrubou você na meia-lua! Falta de ouro frontal e cartão amarelo para o rival!`,
          failureNarrative: `[ARBITRAGEM] JUIZ MANDOU SEGUIR! Você tentou segurar a posse esperando o tranco de ${oppDef} para cavar a falta, mas o zagueiro tocou só na bola e o árbitro mandou o jogo seguir.`
        },
        {
          id: 'opt_lose_dribble_in',
          label: `Drible em velocidade e corte seco desmoralizando ${oppDef}`,
          description: `Quebrar o zagueiro no mano a mano e invadir a pequena área cara a cara com ${oppGk}.`,
          primaryStat: 'dribbling',
          secondaryStat: 'pace',
          actionType: 'drible',
          synergyArchetypes: ['ponta_driblador', 'meia_infiltrador'],
          contextFit: 'oportuna',
          tacticalInsight: 'Ousadia e drible vertical para desmontar o bloco defensivo.',
          statBonus: 12,
          tagsIfChosen: ['ousado', 'driblador'],
          successNarrative: `[DRIBLE] DRIBLE DESCONCERTANTE! Você deu um corte seco inacreditável em ${oppDef}, que ficou estirado no gramado! Na saída de ${oppGk}, você tocou com cavadinha de biquinho para empatar!`,
          failureNarrative: `[BLOQUEADO] TRAVADO NA COBERTURA! Você passou por ${oppDef} com um drible elástico, mas a sobra da zaga chegou na voadora e travou o lance na hora h!`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 2: EM DESVANTAGEM - REBOTE DE BOLA PARADA
    // ----------------------------------------------------
    {
      key: 'lose_rebound_clutch',
      canUse: isLosing && (isLate || minute >= 50),
      contextTitle: `[PRESSÃO] BLITZ OFENSIVA: BOLA VIVA NA ÁREA (${currentScore.home}x${currentScore.away})`,
      situationText: `Desespero no banco de reservas com o placar adverso (${currentScore.home}x${currentScore.away})! A zaga do ${opponent.shortName} corta um cruzamento pela metade e a bola sobra quicando convidativa na quina da grande área para o seu pé ${footStr}! O goleiro ${oppGk} se joga no chão tentando recompor.`,
      options: [
        {
          id: 'opt_lose_volley',
          label: `Sem pulo! Chute de primeira pegando na veia no canto de ${oppGk}`,
          description: 'Soltar a bomba de voleio buscando o ângulo para empatar a partida.',
          primaryStat: 'finalization',
          secondaryStat: 'physical',
          actionType: 'finalizacao',
          synergyArchetypes: ['meia_infiltrador', 'centroavante_matador', 'lateral_ofensivo'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita o quique limpo da bola e o goleiro completamente fora de posição.',
          statBonus: 15,
          tagsIfChosen: ['golaço', 'heroi'],
          successNarrative: `[GOL!] PINTURA DE VOLEIO! Sem deixar a bola cair, você acertou um míssil teleguiado de primeira com o pé ${footStr}! O goleiro ${oppGk} tentou voar em vão: a bola estufou a gaveta!`,
          failureNarrative: `[FINALIZAÇÃO] PEGOU EMBAIXO DEMAIS! Você emendou o voleio de primeira sem pulo, mas a bola subiu além da conta e foi parar na arquibancada sob lamento geral.`
        },
        {
          id: 'opt_lose_chip_cross',
          label: `Cavadinha sutil para infiltração de ${strikerName} (${strikerAffTag})`,
          description: `Surpreender a zaga rival e colocar a bola na cabeça de ${strikerName}.`,
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'passe',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove'],
          contextFit: 'oportuna',
          tacticalInsight: 'Pega de surpresa os defensores adiantados.',
          statBonus: 10,
          tagsIfChosen: ['garcom'],
          successNarrative: `[ASSISTÊNCIA] CAVADINHA DE MESTRE! Com extrema categoria, você deu uma cavadinha que encobriu toda a linha de zaga do ${opponent.shortName}. ${strikerName} testou firme no contrapé de ${oppGk} para o gol!`,
          failureNarrative: `[DEFESA] SAÍDA ARROJADA DO GOLEIRO! A cavadinha saiu com um pouco de altura demais e deu tempo para ${oppGk} sair do chão e agarrar no ar com firmeza.`
        },
        {
          id: 'opt_lose_control_reset',
          label: 'Dominar no peito e acionar a ponta para novo cruzamento',
          description: 'Garantir a posse no campo de ataque sem precipitação.',
          primaryStat: 'passing',
          secondaryStat: 'vision',
          actionType: 'retencao',
          synergyArchetypes: ['box_to_box', 'all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Recicla a jogada ofensiva com segurança.',
          statBonus: 5,
          tagsIfChosen: ['calmo'],
          successNarrative: `[PASSE] CONTROLE E FRIEZA! Você amorteceu no peito com categoria, girou limpando a marcação e abriu o jogo na ponta, mantendo a blitz ofensiva viva no ataque!`,
          failureNarrative: `[BLOQUEADO] BOLA ESPIRRADA! Ao tentar amortecer no peito, a bola escapou meio palmo do controle e o marcador rival chegou de bico afastando para escanteio.`
        },
        {
          id: 'opt_lose_burst_charge',
          label: 'Infiltração com raça dividindo a bola no corpo entre os zagueiros',
          description: 'Não fugir da dividida, colocar a cabeça na bola e empurrar na raça.',
          primaryStat: 'physical',
          secondaryStat: 'finalization',
          actionType: 'posicionamento',
          synergyArchetypes: ['centroavante_matador', 'box_to_box', 'all'],
          contextFit: 'oportuna',
          tacticalInsight: 'Raça e presença de área para aproveitar a bola viva.',
          statBonus: 11,
          tagsIfChosen: ['raca', 'guerreiro'],
          successNarrative: `[PRESSÃO] GOL NA RAÇA PURA! Você dividiu com dois zagueiros no ar, ganhou no tranco de cabeça e empurrou a bola pro fundo da rede! O banco de reservas explodiu em festa!`,
          failureNarrative: `[FALTA] DIVIDIDA DURA! Você colocou o corpo para disputar a sobra, mas o zagueiro rival chegou rasgando e levou a melhor na dividida.`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 3: EM VANTAGEM - CONTRAGOLPE COM CAMPO ABERTO
    // ----------------------------------------------------
    {
      key: 'win_counter_break',
      canUse: isWinning,
      contextTitle: `[VELOCIDADE] CONTRAGOLPE FATAL: CAMPO ABERTO (${currentScore.home}x${currentScore.away})`,
      situationText: `O ${opponent.shortName} se manda todo para o ataque deixando uma avenida nas costas. Seu time desarma na defesa e enfia a bola na sua corrida com muito campo livre pela frente e apenas ${oppDef} recuando na contenção!`,
      options: [
        {
          id: 'opt_win_dribble_kill',
          label: `Arrancada fulminante, corte seco em ${oppDef} e chute para matar o jogo`,
          description: `Explorar a velocidade, deixar ${oppDef} na saudade e bater colocado em ${oppGk}.`,
          primaryStat: 'dribbling',
          secondaryStat: 'pace',
          actionType: 'drible',
          synergyArchetypes: ['ponta_driblador', 'lateral_ofensivo', 'meia_infiltrador'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita a superioridade numérica e o desespero da zaga na volta.',
          statBonus: 15,
          tagsIfChosen: ['matador', 'velocista'],
          successNarrative: `[GOL!] GOL DE CONTRA-ATAQUE LETAL! Você disparou em velocidade supersônica, deu um drible desconcertante em ${oppDef} e tocou com frieza na saída de ${oppGk}! O gol que mata o jogo!`,
          failureNarrative: `[DISPUTA] RECUPERAÇÃO DESESPERADA! Você arrancou em velocidade, mas o goleiro ${oppGk} foi arrojado, saiu da área aos pés da bola e salvou o lance no carrinho!`
        },
        {
          id: 'opt_win_cross_switch',
          label: `Inversão longa de trivela na corrida de ${strikerName} (${strikerAffTag})`,
          description: `Aproveitar a visão de jogo para cruzar na medida para ${strikerName}.`,
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'passe',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove'],
          contextFit: 'oportuna',
          tacticalInsight: 'Abre todo o campo de ataque onde a defesa adversária não consegue cobrir.',
          statBonus: 10,
          tagsIfChosen: ['garcom'],
          successNarrative: `[ASSISTÊNCIA] INVERSÃO DE GALA! De trivela com o pé ${footStr}, você mandou uma virada de jogo espetacular na corrida de ${strikerName}, que dominou e guardou com categoria!`,
          failureNarrative: `[FINALIZAÇÃO] FORÇA EXCESSIVA! A intenção da inversão para ${strikerName} foi perfeita, mas a bola pegou muito efeito com o vento e correu direto para o lateral adversário.`
        },
        {
          id: 'opt_win_hold_corner',
          label: 'Conduzir para a ponta, prender no corpo e gastar o relógio',
          description: 'Proteger a bola contra a bandeirinha de escanteio com inteligência.',
          primaryStat: 'physical',
          secondaryStat: 'passing',
          actionType: 'retencao',
          synergyArchetypes: ['box_to_box', 'all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Maturidade tática para segurar a vitória sem correr riscos.',
          statBonus: 6,
          tagsIfChosen: ['experiente'],
          successNarrative: `⏱️ AULA DE MALÍCIA! Você levou a bola até a bandeirinha de escanteio, usou o corpo de escudo contra dois marcadores e arrancou um lateral a seu favor para o desespero do ${opponent.shortName}!`,
          failureNarrative: `[INTERCEPTADO] DOIS NA MARCAÇÃO! Os defensores do ${opponent.shortName} dobraram na bandeirinha e conseguiram prensar a bola, forçando o tiro de meta contra você.`
        },
        {
          id: 'opt_win_chip_gk',
          label: `Golaço antológico por cobertura! Cavadinha ao ver ${oppGk} adiantado`,
          description: `Perceber o goleiro adiantado e encobrir ${oppGk} com um toque genial de curva.`,
          primaryStat: 'finalization',
          secondaryStat: 'vision',
          actionType: 'finalizacao',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove', 'centroavante_matador'],
          contextFit: 'oportuna',
          tacticalInsight: 'Genialidade e frieza para transformar o contragolpe em obra de arte.',
          statBonus: 14,
          tagsIfChosen: ['genio', 'golaço'],
          successNarrative: `[GOL!] PINTURA POR COBERTURA! Ao perceber ${oppGk} desesperado fora da meta, você deu um leve toque por cobertura! A bola viajou em câmera lenta e morreu no fundo da rede! O banco inteiro correu para te abraçar!`,
          failureNarrative: `[FINALIZAÇÃO] POR UM TRIZ! A cavadinha teve veneno puro e quase encobriu ${oppGk}, mas o goleiro deu três passos para trás e conseguiu espalmar com a ponta dos dedos!`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 4: EM VANTAGEM - DEFESA DO RESULTADO
    // ----------------------------------------------------
    {
      key: 'win_defend_stop',
      canUse: isWinning && (isLate || minute >= 60),
      contextTitle: `[DESARME] DEFENDENDO A VANTAGEM: PRESSÃO RIVAL (${currentScore.home}x${currentScore.away})`,
      situationText: `O adversário pressiona com bolas alçadas na área aos ${minute}'! O craque rival ${oppStar} recebe livre na risca da grande área armando a finalização perigosa para tentar o empate!`,
      options: [
        {
          id: 'opt_win_clean_tackle',
          label: `Desarme cirúrgico em pé no tempo exato travando o arremate de ${oppStar}`,
          description: 'Tirar a bola limpa no segundo do chute sem cometer falta perigosa.',
          primaryStat: 'defense',
          secondaryStat: 'physical',
          actionType: 'desarme',
          synergyArchetypes: ['zagueiro_xerife', 'cao_de_guarda', 'lateral_defensivo'],
          contextFit: 'ideal',
          tacticalInsight: 'Intervenção salvadora para garantir a vitória do time.',
          statBonus: 12,
          tagsIfChosen: ['salvador', 'muralha'],
          successNarrative: `[DESARME] DESARME MONUMENTAL! Na hora exata do chute de ${oppStar}, você deu um bote cirúrgico em pé, roubou a bola limpa e puxou o contragolpe sob o delírio da torcida!`,
          failureNarrative: `[FALTA] CHEGOU UM SEGUNDO ATRASADO! Você tentou o desarme em pé, mas ${oppStar} armou o drible rápido e cavou a falta na intermediária.`
        },
        {
          id: 'opt_win_slide_tackle',
          label: 'Carrinho na bola com raça para jogar na lateral sob aplausos da torcida',
          description: 'Afastar o perigo imediato incendiando as arquibancadas.',
          primaryStat: 'physical',
          secondaryStat: 'defense',
          actionType: 'desarme',
          synergyArchetypes: ['box_to_box', 'zagueiro_xerife'],
          contextFit: 'oportuna',
          tacticalInsight: 'Imposição física que freia a blitz adversária.',
          statBonus: 10,
          tagsIfChosen: ['raca'],
          successNarrative: `[MURO] CARRINHO COM RAÇA COPERA! Você se atirou de carrinho com determinação absoluta, travou a bola limpa e jogou na lateral! Todo o estádio aplaudiu em pé!`,
          failureNarrative: `[CARTÃO AMARELO] CARTÃO AMARELO! A intenção foi na bola, mas o gramado fez o carrinho acertar as pernas de ${oppStar}. O árbitro não hesitou e aplicou o cartão amarelo.`
        },
        {
          id: 'opt_win_contain_pass',
          label: 'Cercar no posicionamento tático obrigando o passe para trás',
          description: 'Fechar a linha de finalização sem dar espaço para o drible.',
          primaryStat: 'defense',
          secondaryStat: 'vision',
          actionType: 'posicionamento',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Posicionamento conservador que esfria a jogada.',
          statBonus: 5,
          tagsIfChosen: ['posicional'],
          successNarrative: `[PASSE] DISCIPLINA TÁTICA PURA! Você fechou a linha de passe com inteligência, forçou ${oppStar} a recuar para trás e esfriou o ataque adversário!`,
          failureNarrative: `[BLOQUEADO] BOLA ENFIADA NO VÃO! Mesmo cercando bem a marcação, ${oppStar} conseguiu achar uma fresta milimétrica para descolar o passe na área.`
        },
        {
          id: 'opt_win_counter_transition',
          label: 'Interceptação limpa de cabeça erguida e esticada rápida de contra-ataque',
          description: 'Ler a trajetória do passe rival, roubar sem falta e acionar os atacantes em disparada.',
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'passe',
          synergyArchetypes: ['box_to_box', 'camisa_10_maestro', 'all'],
          contextFit: 'oportuna',
          tacticalInsight: 'Transforma uma situação de perigo em um contra-ataque fulminante.',
          statBonus: 10,
          tagsIfChosen: ['visao', 'transicao'],
          successNarrative: `[ARRANCADA] TRANSIÇÃO DE GALA! Você antecipou o passe de ${oppStar} no reflexo puro, ergueu a cabeça e disparou um lançamento de 40 metros no pé dos atacantes, armando o contragolpe fatal!`,
          failureNarrative: `[FALTA] PASSE CURTO! Você conseguiu a interceptação, mas sob a pressão imediata o passe de alívio saiu fraco e foi cortado na intermediária.`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 5: EMPATE / EQUILÍBRIO - QUEBRANDO LINHAS NO MEIO
    // ----------------------------------------------------
    {
      key: 'tied_break_lines',
      canUse: isTied,
      contextTitle: `[DISPUTA] DUELO TÁTICO: QUEBRANDO O FERROLHO (${currentScore.home}x${currentScore.away})`,
      situationText: `Partida truncada e de muita disputa no meio-campo! Você recebe entre as linhas de marcação do ${opponent.shortName}, percebe o marcador ${oppDef} hesitando na saída e tem uma fração de segundo para decidir o lance.`,
      options: [
        {
          id: 'opt_tied_trivela_pass',
          label: `Enfiada de trivela no ponto futuro para ${strikerName} (${strikerAffTag})`,
          description: `Passe milimétrico que deixa ${strikerName} cara a cara com o goleiro ${oppGk}.`,
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'passe',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita o espaço nas costas do zagueiro rival.',
          statBonus: 12,
          tagsIfChosen: ['garcom', 'magico'],
          successNarrative: `[ASSISTÊNCIA] PASSE DE CAMISA 10! Uma enfiada mágica de trivela no ponto futuro! A bola furou as duas linhas do ${opponent.shortName} e deixou ${strikerName} na cara do gol para estufar as redes!`,
          failureNarrative: `[INTERCEPTADO] ZAGA ATENTA NA COBERTURA! A intenção da trivela para ${strikerName} foi maravilhosa, mas o zagueiro adversário leu o lance e interceptou esticando a ponta da chuteira.`
        },
        {
          id: 'opt_tied_feint_shoot',
          label: `Finta curta de corpo em ${oppDef} e finalização colocada no canto de ${oppGk}`,
          description: 'Quebrar o marcador no drible curto e bater rasteiro no cantinho.',
          primaryStat: 'dribbling',
          secondaryStat: 'finalization',
          actionType: 'drible',
          synergyArchetypes: ['ponta_driblador', 'meia_infiltrador'],
          contextFit: 'oportuna',
          tacticalInsight: 'Ação individual ousada para desestabilizar a retranca.',
          statBonus: 12,
          tagsIfChosen: ['driblador'],
          successNarrative: `[GOL!] GOLAÇO INDIVIDUAL! Você gingou o corpo, deixou ${oppDef} completamente sentado no gramado e bateu com frieza no cantinho sem chances para ${oppGk}! Que pintura!`,
          failureNarrative: `[DEFESA] GRANDE DEFESA DE ${oppGk}! A finta em ${oppDef} foi primorosa, mas ${oppGk} operou um milagre no cantinho rasteiro e espalmou para escanteio!`
        },
        {
          id: 'opt_tied_switch_play',
          label: `Inversão perfeita de primeira para ${midName} (${midAffTag})`,
          description: `Mudar a dinâmica do ataque para o setor com mais espaço com ${midName}.`,
          primaryStat: 'passing',
          secondaryStat: 'vision',
          actionType: 'retencao',
          synergyArchetypes: ['box_to_box', 'all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Circulação paciente de bola para desarmar as linhas rivais.',
          statBonus: 6,
          tagsIfChosen: ['cerebro'],
          successNarrative: `[PASSE] VISÃO PANORÂMICA! Você inverteu o jogo com rapidez e precisão para ${midName}, pegando o bloco defensivo do ${opponent.shortName} totalmente desarrumado!`,
          failureNarrative: `[BLOQUEADO] MARCAÇÃO APERTOU! No momento da inversão, o volante rival bloqueou a trajetória com o corpo e a bola ficou truncada no meio-campo.`
        },
        {
          id: 'opt_tied_long_rocket',
          label: `Soltar a bomba de longe! Chute potente de fora da área buscando a bochecha da rede`,
          description: `Arriscar de média distância pegando na veia antes do bloco fechar o ângulo de ${oppGk}.`,
          primaryStat: 'finalization',
          secondaryStat: 'physical',
          actionType: 'finalizacao',
          synergyArchetypes: ['box_to_box', 'meia_infiltrador', 'centroavante_matador'],
          contextFit: 'oportuna',
          tacticalInsight: 'Chute surpresa de longa distância que desorienta defesas fechadas.',
          statBonus: 13,
          tagsIfChosen: ['bomba', 'ousado'],
          successNarrative: `[GOL!] MÍSSIL TECOGUIADO! Você soltou um canudo de 30 metros! A bola fez uma curva violentíssima no ar e explodiu na bochecha da rede de ${oppGk}! O estádio inteiro ficou de queixo caído!`,
          failureNarrative: `[FINALIZAÇÃO] TIROU TINTA DO TRAVESSÃO! O míssil saiu com violência absurda, mas subiu dois centímetros acima do travessão sob suspiros coletivos!`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 6: EMPATE / EQUILÍBRIO - BOLA PARADA DECISIVA
    // ----------------------------------------------------
    {
      key: 'tied_setpiece_clutch',
      canUse: isTied && (isLate || minute >= 40),
      contextTitle: `[ASSISTÊNCIA] BOLA PARADA: TENSÃO NO ESTÁDIO (${currentScore.home}x${currentScore.away})`,
      situationText: `Falta perigosa cavada na meia-lua aos ${minute}'! A barreira do ${opponent.shortName} fica perfilada com o goleiro ${oppGk} cobrando atenção aos gritos. O ângulo para a perna ${footStr} está perfeito!`,
      options: [
        {
          id: 'opt_setpiece_curl',
          label: `Cobrança venenosa com curva por cima da barreira buscando a gaveta de ${oppGk}`,
          description: 'Bater com efeito buscando o ângulo indefensável para abrir o placar.',
          primaryStat: 'finalization',
          secondaryStat: 'vision',
          actionType: 'finalizacao',
          synergyArchetypes: ['camisa_10_maestro', 'meia_infiltrador', 'centroavante_matador'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita a barreira mal posicionada para mandar na gaveta.',
          statBonus: 14,
          tagsIfChosen: ['especialista', 'decisivo'],
          successNarrative: `[GOL!] GOL DE FALTA ANTOLÓGICO! A bola fez a curva perfeita por cima da barreira, desceu na gaveta e tirou tinta da trave de ${oppGk}! Um golaço de falta espetacular!`,
          failureNarrative: `[BLOQUEADO] TIROU TINTA DO ÂNGULO! A batida foi com muito veneno e efeito, mas a bola tirou tinta do travessão superior de ${oppGk} e foi para fora por um suspiro!`
        },
        {
          id: 'opt_setpiece_chip',
          label: 'Cavadinha ensaiada pegando a defesa no contrapé para o companheiro',
          description: 'Passe por cima da barreira para o jogador que infiltra livre.',
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'passe',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove'],
          contextFit: 'oportuna',
          tacticalInsight: 'Engana o goleiro rival que espera o chute direto.',
          statBonus: 10,
          tagsIfChosen: ['garcom'],
          successNarrative: `[ASSISTÊNCIA] JOGADA ENSAIADA ESPETACULAR! Todo mundo esperava o chute direto, mas sua cavadinha encontrou o companheiro infiltrando livre de cabeça para balançar as redes!`,
          failureNarrative: `[INTERCEPTADO] BARREIRA SUBIU ALTO! A cavadinha não pegou a altura necessária e carimbou a cabeça do homem da barreira do ${opponent.shortName}.`
        },
        {
          id: 'opt_setpiece_short',
          label: 'Toque curto de lado para finalização forte de quem chega de trás',
          description: 'Ação coletiva para abrir o ângulo de chute.',
          primaryStat: 'passing',
          secondaryStat: 'vision',
          actionType: 'retencao',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Jogada ensaiada com menor risco de perder a bola.',
          statBonus: 5,
          tagsIfChosen: ['coletivo'],
          successNarrative: `[PASSE] ROLADA NA MEDIDA! Você rolou mansinha abrindo o ângulo ideal; o companheiro soltou uma bomba cruzada que o goleiro mal conseguiu ver passar!`,
          failureNarrative: `[BLOQUEADO] MARCADOR SAIU EM DISPARADA! A barreira se desfez rápido e o marcador saiu voando na bola para abafar o chute antes dele sair.`
        },
        {
          id: 'opt_setpiece_under_wall',
          label: `Malandragem pura! Chute rasteiro por baixo da barreira no pulo dos defensores`,
          description: `Bater rente à grama esperando o salto da barreira do ${opponent.shortName} para pegar ${oppGk} no contrapé.`,
          primaryStat: 'finalization',
          secondaryStat: 'dribbling',
          actionType: 'finalizacao',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove', 'all'],
          contextFit: 'oportuna',
          tacticalInsight: 'Astúcia genial estilo Ronaldinho Gaúcho surpreendendo o pulo da barreira.',
          statBonus: 12,
          tagsIfChosen: ['genio', 'malandro'],
          successNarrative: `[GOL!] GOL DE MALÍCIA PURA! A barreira inteira pulou em bloco e a bola passou mansinha e certeira por baixo dos pés de todos! ${oppGk} só olhou estático a bola beijar a rede! Que inteligência!`,
          failureNarrative: `[BLOQUEADO] BARREIRA NÃO SALTOU! Os zagueiros do ${opponent.shortName} ficaram plantados no chão e a bola prensou na canela do marcador.`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 7: ESPECÍFICO DE LATERAL / CORREDOR (LE, LD, PE, PD)
    // ----------------------------------------------------
    {
      key: 'flank_overlap_run',
      canUse: isFlankPlayer,
      contextTitle: `[VELOCIDADE] AVANÇO PELA ALA: CORREDOR LIVRE`,
      situationText: `Você vê o corredor lateral totalmente livre, dispara da sua defesa e chega na linha de fundo com a bola dominada enquanto o lateral ${oppDef} tenta a cobertura desesperada!`,
      options: [
        {
          id: 'opt_flank_curl_cross',
          label: 'Cruzamento com curva milimétrica na cabeça do centroavante',
          description: 'Colocar a bola com açúcar no segundo pau onde o centroavante sobe livre.',
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'cruzamento',
          synergyArchetypes: ['lateral_ofensivo', 'camisa_10_maestro', 'ponta_driblador'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita o centroavante desmarcado na área.',
          statBonus: 12,
          tagsIfChosen: ['cruzador', 'garcom'],
          successNarrative: `[ASSISTÊNCIA] CRUZAMENTO COM AÇÚCAR! Da linha de fundo, você colocou a bola milimetricamente no segundo pau. O centroavante subiu soberano de cabeça e mandou pro fundo das redes!`,
          failureNarrative: `[FINALIZAÇÃO] DEFENSOR CORTOU NO ALTO! O cruzamento foi venenoso, mas o zagueiro do ${opponent.shortName} levou vantagem na impulsão e cortou de cabeça para escanteio.`
        },
        {
          id: 'opt_flank_cut_shoot',
          label: `Corte para dentro na perna ${footStr} e bomba cruzada no primeiro pau`,
          description: `Fintar ${oppDef} para dentro e soltar o chute forte no gol de ${oppGk}.`,
          primaryStat: 'finalization',
          secondaryStat: 'dribbling',
          actionType: 'finalizacao',
          synergyArchetypes: ['lateral_ofensivo', 'ponta_driblador', 'meia_infiltrador'],
          contextFit: 'oportuna',
          tacticalInsight: 'Ação individual direta buscando o gol no contrapé.',
          statBonus: 14,
          tagsIfChosen: ['artilheiro'],
          successNarrative: `[GOL!] BOMBA INDEFENSÁVEL! Você cortou para dentro na velocidade, encheu o pé ${footStr} no primeiro pau e o míssil furou a rede de ${oppGk}! Explosão no estádio!`,
          failureNarrative: `[DEFESA] ${oppGk} ESPALMOU NO REFLEXO! O chute cruzado saiu forte e venenoso, mas ${oppGk} fez uma defesa espetacular no reflexo puro!`
        },
        {
          id: 'opt_flank_low_cutback',
          label: 'Passe rasteiro atrasado para quem vem embalado na meia-lua',
          description: 'Bola atrasada na medida tirando os zagueiros que correm para trás.',
          primaryStat: 'passing',
          secondaryStat: 'vision',
          actionType: 'retencao',
          synergyArchetypes: ['box_to_box', 'all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Passe seguro de altíssimo índice de finalização.',
          statBonus: 6,
          tagsIfChosen: ['inteligente'],
          successNarrative: `[PASSE] PASSE DE COBERTURA PERFEITO! Você fingiu que cruzaria alto e rolou rasteiro para trás; quem vinha embalado de frente soltou a pancada no gol!`,
          failureNarrative: `[INTERCEPTADO] VOLANTE LEU A JOGADA! O volante do ${opponent.shortName} acompanhou a corrida da meia-lua e cortou o passe antes da finalização.`
        },
        {
          id: 'opt_flank_dribble_byline',
          label: `Drible da vaca na linha de fundo tirando ${oppDef} e invadindo a pequena área`,
          description: `Tocar a bola de um lado, passar pelo outro na velocidade e sair na cara do gol.`,
          primaryStat: 'dribbling',
          secondaryStat: 'pace',
          actionType: 'drible',
          synergyArchetypes: ['ponta_driblador', 'lateral_ofensivo'],
          contextFit: 'oportuna',
          tacticalInsight: 'Ousadia individual na linha de fundo para desmontar a retranca.',
          statBonus: 13,
          tagsIfChosen: ['driblador', 'ousado'],
          successNarrative: `[DRIBLE] DRIBLE DA VACA ESPETACULAR! Você jogou a bola por um lado da linha e buscou pelo outro! ${oppDef} ficou parado procurando a bola! Você invadiu a pequena área e tocou no fundo das redes!`,
          failureNarrative: `[BLOQUEADO] LINHA DE FUNDO! Você aplicou o drible, mas a bola correu rápido demais pelo gramado molhado e acabou saindo em tiro de meta.`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 8: MINUTOS FINAIS DRAMÁTICOS (80'+)
    // ----------------------------------------------------
    {
      key: 'clutch_final_whistle',
      canUse: isLate,
      contextTitle: `⏱️ BOLA DECISIVA NOS ACRÉSCIMOS (${currentScore.home}x${currentScore.away})`,
      situationText: `O quarto árbitro levanta a placa de acréscimos aos ${minute}'! Todo o estádio está em pé na arquibancada. Uma bola espirrada na quina da grande área quica perfeita na sua passada com o goleiro ${oppGk} batido!`,
      options: [
        {
          id: 'opt_clutch_first_time',
          label: `Sem pulo! Chute de primeira com a perna ${footStr} buscando o gol da consagração`,
          description: 'Bater na veia aproveitando o quique perfeito da bola viva.',
          primaryStat: 'finalization',
          secondaryStat: 'physical',
          actionType: 'finalizacao',
          synergyArchetypes: ['meia_infiltrador', 'centroavante_matador', 'lateral_ofensivo', 'camisa_10_maestro'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita o momento decisivo e a bola viva na área.',
          statBonus: 15,
          tagsIfChosen: ['consagracao', 'heroi'],
          successNarrative: `[GOL!] GOL DA CONSAGRAÇÃO NOS ACRÉSCIMOS! Você emendou de primeira no quique da bola! Um tirambaço no canto que fez o estádio explodir aos ${minute}'! O craque decide o jogo no apagar das luzes!`,
          failureNarrative: `[BLOQUEADO] PRESSÃO DOS ACRÉSCIMOS! No calor do lance final, você arrematou de primeira, mas pegou mascado na bola e ela saiu lambendo a trave de ${oppGk}!`
        },
        {
          id: 'opt_clutch_heel_pass',
          label: `Passe sutil de calcanhar para o centroavante livre na pequena área`,
          description: 'Desviar a trajetória tirando o último zagueiro para deixar o gol aberto.',
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'passe',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove'],
          contextFit: 'oportuna',
          tacticalInsight: 'Visão monumental para servir o gol feito.',
          statBonus: 11,
          tagsIfChosen: ['garcom'],
          successNarrative: `[ASSISTÊNCIA] CALCANHAR GENIAL! No último suspiro da partida, um toque mágico de calcanhar tirou o goleiro ${oppGk} e deixou o gol vazio para o gol da vitória!`,
          failureNarrative: `[INTERCEPTADO] TRAVADO NO ÚLTIMO SEGUNDO! O passe de calcanhar foi genial, mas a zaga do ${opponent.shortName} se jogou de corpo e alma para travar o chute final!`
        },
        {
          id: 'opt_clutch_shield_ball',
          label: 'Dominar, proteger com o corpo e garantir a posse no ataque',
          description: 'Segurar a posse para não ceder contra-ataque no último lance.',
          primaryStat: 'physical',
          secondaryStat: 'passing',
          actionType: 'retencao',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Maturidade nos segundos finais.',
          statBonus: 5,
          tagsIfChosen: ['frio'],
          successNarrative: `⏱️ CONTROLE EMOCIONAL DE CAMPEÃO! Você colocou a bola debaixo do braço, protegeu com o corpo, sofreu a falta e garantiu o resultado com maturidade brilhante!`,
          failureNarrative: `[BLOQUEADO] BOLA PRENSADA NO CORPO! No desespero final, os adversários dobraram a marcação e ganharam o lateral nos segundos derradeiros.`
        },
        {
          id: 'opt_clutch_futsal_toe',
          label: `Biquinho rápido de futsal no contrapé de ${oppGk} antes do bote da zaga`,
          description: `Finalizar de bico sem armar o chute, antecipando o movimento de ${oppGk}.`,
          primaryStat: 'dribbling',
          secondaryStat: 'finalization',
          actionType: 'finalizacao',
          synergyArchetypes: ['centroavante_matador', 'ponta_driblador', 'meia_infiltrador'],
          contextFit: 'oportuna',
          tacticalInsight: 'Recurso imprevisível de futebol de rua para decidir sem dar chance de reação.',
          statBonus: 14,
          tagsIfChosen: ['malandro', 'decisivo'],
          successNarrative: `[GOL!] BIQUINHO DE GENIALIDADE! Sem armar a perna, você deu uma bicuda seca estilo Romário de futsal! A bola morreu mansinha na bochecha da rede enquanto ${oppGk} e ${oppDef} se entreolhavam atônitos! GOL DA VITÓRIA!`,
          failureNarrative: `[DEFESA] DEFESA NO PURO INSTINTO! O bico saiu venenoso e rápido, mas ${oppGk} esticou a perna no reflexo puro e salvou o gol no último milissegundo!`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 9: APELO À TORCIDA & CALDEIRÃO EM ERUPÇÃO
    // ----------------------------------------------------
    {
      key: 'fan_caldeirao_call',
      canUse: true,
      contextTitle: `[PRESSÃO] PULSO DA ARQUIBANCADA: INFLAMAR O CALDEIRÃO`,
      situationText: `A bola sai pela lateral com a torcida do ${player.currentClub} cantando a plenos pulmões a poucos metros de você. O momento pede raça e liderança emocional para contagiar o time!`,
      options: [
        {
          id: 'opt_fan_arms_up',
          label: 'Chamar a torcida erguendo os braços e bater no escudo!',
          description: 'Inflamar as arquibancadas, pedir apoio aos gritos e colocar o adversário sob pressão ensurdecedora.',
          primaryStat: 'physical',
          secondaryStat: 'vision',
          actionType: 'torcida',
          synergyArchetypes: ['all'],
          contextFit: 'ideal',
          tacticalInsight: 'Usa a mística da camisa para energizar o estádio inteiro.',
          statBonus: 12,
          fansBonus: +12,
          coachBonus: -1,
          tagsIfChosen: ['idolo', 'caldeirao'],
          successNarrative: `[PRESSÃO] CALDEIRÃO EM ERUPÇÃO! Você ergueu os braços, bateu com orgulho no escudo e a torcida respondeu com um rugido assustador! O estádio virou um inferno para o ${opponent.shortName}!`,
          failureNarrative: `[TORCIDA] A torcida respondeu com palmas, mas o árbitro pediu pressa para repor a bola em jogo.`
        },
        {
          id: 'opt_fan_quick_throw',
          label: 'Cobrança rápida e objetiva de cabeça fria',
          description: 'Acelerar a reposição tática pegando a defesa do adversário desarrumada.',
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'posicionamento',
          synergyArchetypes: ['camisa_10_maestro', 'box_to_box'],
          contextFit: 'oportuna',
          tacticalInsight: 'Inteligência e frieza tática para criar perigo imediato.',
          statBonus: 10,
          coachBonus: +4,
          fansBonus: +2,
          tagsIfChosen: ['frio', 'tatica'],
          successNarrative: `[PASSE] INTELIGÊNCIA TÁTICA PURA! Você cobrou o lateral em velocidade antes do ${opponent.shortName} se posicionar, criando um lance perigoso no ataque!`,
          failureNarrative: `[INTERCEPTADO] A defesa do ${opponent.shortName} foi rápida e conseguiu recompor a linha defensiva.`
        },
        {
          id: 'opt_fan_lead_talk',
          label: 'Gesticular e orientar o posicionamento dos companheiros',
          description: 'Exercer comando e orientar os volantes a adiantarem as linhas.',
          primaryStat: 'vision',
          secondaryStat: 'physical',
          actionType: 'lideranca',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Liderança dentro de campo valorizada pelo treinador.',
          statBonus: 8,
          coachBonus: +5,
          boardBonus: +3,
          tagsIfChosen: ['lideranca', 'capitao'],
          successNarrative: `[LIDERANÇA] POSTURA DE LÍDER! Com gestos firmes, você adiantou as linhas da equipe e reorganizou a marcação sob aplausos do treinador no banco!`,
          failureNarrative: `[ARBITRAGEM] Os companheiros estavam cansados e demoraram a responder à sua orientação.`
        },
        {
          id: 'opt_fan_take_charge',
          label: 'Pedir a bola com autoridade no pé e assumir o ritmo da partida',
          description: 'Aproximar da cobrança, mandar os volantes jogarem curto e comandar a armação.',
          primaryStat: 'dribbling',
          secondaryStat: 'vision',
          actionType: 'retencao',
          synergyArchetypes: ['camisa_10_maestro', 'meia_infiltrador', 'box_to_box'],
          contextFit: 'oportuna',
          tacticalInsight: 'Chama a responsabilidade do jogo para si em momento de pressão.',
          statBonus: 10,
          coachBonus: +4,
          fansBonus: +6,
          tagsIfChosen: ['personalidade', 'maestro'],
          successNarrative: `⭐ DONO DO MEIO-CAMPO! Você pediu a bola, dominou girando em cima da marcação e ditou a cadência sob aplausos calorosos de todo o estádio!`,
          failureNarrative: `[FALTA] MARCAÇÃO DOBRADA! Dois adversários vieram pressionar de perto e você foi forçado a recuar para o lateral.`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 10: CONFUSÃO EM CAMPO & DEFESA DO VESTIÁRIO
    // ----------------------------------------------------
    {
      key: 'locker_defend_teammate',
      canUse: true,
      contextTitle: `[VELOCIDADE] PRINCÍPIO DE CONFUSÃO: DEFENDER O COMPANHEIRO`,
      situationText: `O marcador ${oppDef} deu uma entrada desleal por trás no seu parceiro de time, gerando bate-boca acalorado entre os jogadores na lateral! O clima esquenta com empurrões mútuos!`,
      options: [
        {
          id: 'opt_brawl_chest_up',
          label: `Comprar a briga e peitar ${oppDef} em defesa do companheiro!`,
          description: 'Não aceitar covardia, mostrar raça no clássico e proteger quem veste a sua camisa.',
          primaryStat: 'physical',
          secondaryStat: 'dribbling',
          actionType: 'briga',
          synergyArchetypes: ['all'],
          contextFit: 'ideal',
          tacticalInsight: 'Gera idolatria instantânea com a torcida e une o vestiário.',
          statBonus: 14,
          fansBonus: +16,
          teammatesBonus: +15,
          coachBonus: -2,
          tagsIfChosen: ['raca', 'brigador', 'defensor_do_grupo']
        },
        {
          id: 'opt_brawl_calm_ref',
          label: 'Acalmar os companheiros e dialogar com autoridade com o árbitro',
          description: 'Evitar cartões para o seu time e cobrar a punição justa do agressor.',
          primaryStat: 'vision',
          secondaryStat: 'physical',
          actionType: 'lideranca',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Maturidade de líder respeitado por todos.',
          statBonus: 10,
          coachBonus: +8,
          boardBonus: +6,
          fansBonus: +4,
          teammatesBonus: +10,
          tagsIfChosen: ['lideranca', 'sereno', 'capitao']
        },
        {
          id: 'opt_brawl_lift_partner',
          label: 'Correr até o companheiro caído, prestar apoio e levantar a moral dele',
          description: 'Dar a mão para o companheiro, verificar a situação física e fortalecer a união do time.',
          primaryStat: 'vision',
          secondaryStat: 'physical',
          actionType: 'posicionamento',
          synergyArchetypes: ['all'],
          contextFit: 'oportuna',
          tacticalInsight: 'Aumenta a química do elenco e mostra espírito de grupo inegociável.',
          statBonus: 9,
          coachBonus: +5,
          boardBonus: +3,
          fansBonus: +6,
          teammatesBonus: +14,
          tagsIfChosen: ['parceria', 'vestiario']
        },
        {
          id: 'opt_brawl_quick_restart',
          label: 'Aproveitar a distração da discussão e bater a falta rápido no ataque',
          description: 'Frieza tática total: enquanto os rivais discutem, cobrar a falta veloz na frente.',
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'malandragem',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove', 'all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Visão de jogo malandra para transformar confusão em lance de perigo.',
          statBonus: 11,
          coachBonus: +6,
          fansBonus: +10,
          tagsIfChosen: ['malandro', 'visao']
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 11: DRIBLE DE EFEITO NA LATERAL (OUSADIA & ALEGRIA)
    // ----------------------------------------------------
    {
      key: 'flank_showmanship_trick',
      canUse: true,
      contextTitle: `[CATEGORIA] OUSADIA NA LATERAL: LANCE DE EFEITO`,
      situationText: `Você recebe rente à linha lateral com o marcador ${oppDef} vindo babando na marcação individual e a torcida em cima esperando um lance de gênio!`,
      options: [
        {
          id: 'opt_trick_sombrero',
          label: `Chapéu ou elástico desmoralizante em cima de ${oppDef}!`,
          description: 'Habilidade pura para levantar o estádio e viralizar nas redes sociais.',
          primaryStat: 'dribbling',
          secondaryStat: 'pace',
          actionType: 'drible',
          synergyArchetypes: ['ponta_driblador', 'camisa_10_maestro', 'falso_nove'],
          contextFit: 'ideal',
          tacticalInsight: 'Drible desconcertante que destrói a confiança do rival.',
          statBonus: 14,
          fansBonus: +15,
          tagsIfChosen: ['magia', 'viral'],
          successNarrative: `[PRESSÃO] MAGIA NAS ARQUIBANCADAS! Você deu um toque sutil por cima da cabeça de ${oppDef}, completou o chapéu com categoria e o estádio inteiro levantou aos gritos de 'OLÉ'! Lance de placa!`,
          failureNarrative: `[BLOQUEADO] ${oppDef} usou o porte físico, não caiu na finta e desarmou pela linha lateral. O técnico gesticulou pedindo seriedade.`
        },
        {
          id: 'opt_trick_safe_pass',
          label: 'Dominar com frieza e passe de primeira garantindo a posse',
          description: 'Sem firula: toque limpo de primeira para o volante desmarcado.',
          primaryStat: 'passing',
          secondaryStat: 'vision',
          actionType: 'retencao',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Segurança absoluta valorizada pelos treinadores.',
          statBonus: 8,
          coachBonus: +4,
          tagsIfChosen: ['seguranca'],
          successNarrative: `[PASSE] TOQUE DE CLASSE! Com simplicidade e rapidez, você tocou de primeira mantendo a posse viva e ditando o ritmo de jogo!`,
          failureNarrative: `[INTERCEPTADO] A bola saiu mascada e foi dividida na intermediária.`
        },
        {
          id: 'opt_trick_caneta_wall',
          label: `Caneta desmoralizante por baixo das pernas de ${oppDef} e tabela 1-2`,
          description: `Rolinho de sola passando no vão das pernas do marcador e arrancada em velocidade para receber à frente.`,
          primaryStat: 'dribbling',
          secondaryStat: 'passing',
          actionType: 'drible',
          synergyArchetypes: ['ponta_driblador', 'meia_infiltrador', 'lateral_ofensivo'],
          contextFit: 'oportuna',
          tacticalInsight: 'Recurso genial do futebol brasileiro para desmontar a linha de fundo.',
          statBonus: 13,
          fansBonus: +12,
          tagsIfChosen: ['caneta', 'drible'],
          successNarrative: `[DRIBLE] CANETA MONUMENTAL! De sola, você rolou a bola por baixo das canetas de ${oppDef}! A torcida gritou 'UH!' em peso! Você tabelou rápido de primeira e invadiu a área livre!`,
          failureNarrative: `[BLOQUEADO] FECHOU AS PERNAS! ${oppDef} percebeu a tentativa de rolinho, fechou as pernas a tempo e cometeu falta lateral para matar o lance.`
        },
        {
          id: 'opt_trick_body_feint',
          label: `Ginga de corpo desmontando ${oppDef} e cruzamento de trivela com a perna ${footStr}`,
          description: `Fingir que vai para o fundo, cortar sutilmente e mandar de trivela no segundo poste.`,
          primaryStat: 'vision',
          secondaryStat: 'dribbling',
          actionType: 'cruzamento',
          synergyArchetypes: ['camisa_10_maestro', 'lateral_ofensivo', 'ponta_driblador'],
          contextFit: 'oportuna',
          tacticalInsight: 'Usa a desorientação do marcador para cruzar com precisão cirúrgica.',
          statBonus: 11,
          fansBonus: +8,
          tagsIfChosen: ['trivela', 'garcom'],
          successNarrative: `[ASSISTÊNCIA] TRIVELA MILIMÉTRICA! Com uma finta de corpo você tirou ${oppDef} da jogada e mandou de trivela com curva no segundo pau! A bola caiu perfeita para a cabeçada fatal!`,
          failureNarrative: `[FINALIZAÇÃO] FORÇA EXCESSIVA! A trivela saiu com muito efeito e acabou passando por todo mundo na área antes de sair na lateral oposta.`
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 12: FALTA NO MEIO-CAMPO (MALANDRAGEM & COBRANÇA RÁPIDA)
    // ----------------------------------------------------
    {
      key: 'quick_freekick_malandragem',
      canUse: true,
      contextTitle: `[TÁTICA] MALANDRAGEM: COBRANÇA RÁPIDA DE FALTA`,
      situationText: `O árbitro apitou falta no meio-campo a seu favor. A zaga do ${opponent.shortName} virou as costas para reclamar e o goleiro ${oppGk} está adiantado organizando a defesa desatenta!`,
      options: [
        {
          id: 'opt_fk_quick_restart',
          label: 'Bater a falta de imediato sem esperar o apito para pegar o goleiro adiantado!',
          description: 'Malandragem pura! Surpreender a zaga rival desligada e criar uma chance clara de gol.',
          primaryStat: 'vision',
          secondaryStat: 'passing',
          actionType: 'malandragem',
          synergyArchetypes: ['camisa_10_maestro', 'falso_nove', 'all'],
          contextFit: 'ideal',
          tacticalInsight: 'Aproveita o descompasso cognitivo da defesa adversária.',
          statBonus: 13,
          coachBonus: +6,
          fansBonus: +12,
          tagsIfChosen: ['malandro', 'rapido']
        },
        {
          id: 'opt_fk_wait_cross',
          label: 'Esperar a autorização do árbitro e erguer a bola na área com precisão',
          description: 'Cruzamento medido com a perna boa procurando os zagueiros no segundo poste.',
          primaryStat: 'passing',
          secondaryStat: 'vision',
          actionType: 'cruzamento',
          synergyArchetypes: ['camisa_10_maestro', 'lateral_ofensivo'],
          contextFit: 'oportuna',
          tacticalInsight: 'Bola parada perigosa com todo o time posicionado.',
          statBonus: 10,
          coachBonus: +5,
          fansBonus: +4,
          tagsIfChosen: ['bola_parada', 'cruzamento']
        },
        {
          id: 'opt_fk_pressure_ref',
          label: `Pressionar o árbitro exigindo cartão amarelo imediato para ${oppDef}`,
          description: 'Cobrar rigor da arbitragem pela entrada forte e condicionar o critério do juiz.',
          primaryStat: 'vision',
          secondaryStat: 'physical',
          actionType: 'reclamacao',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Guerra psicológica com a arbitragem para pendurar o marcador.',
          statBonus: 8,
          fansBonus: +10,
          coachBonus: -1,
          teammatesBonus: +8,
          tagsIfChosen: ['pressao', 'arbitragem']
        },
        {
          id: 'opt_fk_play_simple',
          label: 'Rolar curto com calma, ditar o ritmo e manter o controle da posse',
          description: 'Sem precipitação: trocar passes curtos e envolver o adversário.',
          primaryStat: 'passing',
          secondaryStat: 'vision',
          actionType: 'posicionamento',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Gestão madura da posse de bola.',
          statBonus: 7,
          coachBonus: +7,
          fansBonus: +2,
          tagsIfChosen: ['controle', 'posse']
        }
      ]
    },

    // ----------------------------------------------------
    // CENÁRIO 13: FINAL DE JOGO TRUNCADO (CATIMBA NA BANDEIRINHA)
    // ----------------------------------------------------
    {
      key: 'late_game_catimba_clock',
      canUse: true,
      contextTitle: `[CATIMBA & RELÓGIO] FINAL DE JOGO NA BANDEIRINHA`,
      situationText: `Reta final de uma partida tensa! A bola corre perto da bandeirinha de escanteio e a marcação do ${opponent.shortName} vem desesperada para roubar e armar o contragolpe!`,
      options: [
        {
          id: 'opt_clock_corner_shield',
          label: 'Segurar a bola no corpo na bandeirinha de escanteio e gastar o relógio!',
          description: 'Proteger com o porte físico, sofrer faltas e comer os minutos preciosos do cronômetro.',
          primaryStat: 'physical',
          secondaryStat: 'dribbling',
          actionType: 'catimba',
          synergyArchetypes: ['all'],
          contextFit: 'ideal',
          tacticalInsight: 'Catimba clássica de futebol copeiro para garantir o resultado.',
          statBonus: 14,
          coachBonus: +9,
          fansBonus: +8,
          teammatesBonus: +8,
          tagsIfChosen: ['catimba', 'relogio']
        },
        {
          id: 'opt_clock_hard_tackle',
          label: `Dividir no chão com carrinho firme para mandar a bola pela lateral!`,
          description: 'Entrada dura na bola, limpando o lance e levantando o estádio com raça pura.',
          primaryStat: 'physical',
          secondaryStat: 'pace',
          actionType: 'dividida_firme',
          synergyArchetypes: ['volante_destruidor', 'lateral_defensivo', 'all'],
          contextFit: 'oportuna',
          tacticalInsight: 'Imposição física no momento de maior perigo.',
          statBonus: 12,
          fansBonus: +14,
          teammatesBonus: +10,
          coachBonus: +6,
          tagsIfChosen: ['raca', 'dividida']
        },
        {
          id: 'opt_clock_dribble_in',
          label: 'Arriscar drible de corte para dentro e tentar matar a partida com gol!',
          description: 'Ousadia total: em vez de gastar tempo, buscar o golpe de misericórdia.',
          primaryStat: 'dribbling',
          secondaryStat: 'finishing',
          actionType: 'drible',
          synergyArchetypes: ['ponta_driblador', 'camisa_10_maestro'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Decisão ousada que pode selar a vitória ou ceder contragolpe.',
          statBonus: 10,
          fansBonus: +10,
          coachBonus: -2,
          tagsIfChosen: ['ousadia', 'drible']
        },
        {
          id: 'opt_clock_lead_calm',
          label: 'Gesticular para a defesa recompor, tocar para trás e esfriar o jogo',
          description: 'Comandar a linha de zaga e garantir que ninguém cometa faltas perigosas.',
          primaryStat: 'vision',
          secondaryStat: 'physical',
          actionType: 'lideranca',
          synergyArchetypes: ['all'],
          contextFit: 'cautelosa',
          tacticalInsight: 'Liderança madura para congelar o ímpeto adversário.',
          statBonus: 9,
          coachBonus: +8,
          boardBonus: +5,
          teammatesBonus: +8,
          tagsIfChosen: ['lideranca', 'capitao']
        }
      ]
    }
  ];

  // Filtra cenários aplicáveis que ainda não foram usados nesta partida
  const available = blueprints.filter(b => b.canUse && !usedScenarioKeys.has(b.key));
  const chosenBlueprint = available.length > 0 
    ? available[Math.floor(Math.random() * available.length)]
    : blueprints.find(b => b.canUse) || blueprints[0];

  usedScenarioKeys.add(chosenBlueprint.key);

  return {
    id: `dyn_moment_${minute}_${chosenBlueprint.key}`,
    minute,
    contextTitle: chosenBlueprint.contextTitle,
    scoreBefore: { ...currentScore },
    situationText: chosenBlueprint.situationText,
    keyOpponentPlayer: oppStarObj,
    options: chosenBlueprint.options
  };
}

/**
 * Função mantida para compatibilidade geral caso chamada externamente
 */
export function generateMatchMoments(player: PlayerProfile, opponent: Club): MatchDecisionMoment[] {
  const used = new Set<string>();
  const dummyOdds: MatchOdds = {
    homeWinProb: 44,
    drawProb: 28,
    awayWinProb: 28,
    unpredictabilityRate: 15,
    chaosDescription: 'Normal',
    favoriteName: 'Equilíbrio',
    expectedGoalsHome: 1.2,
    expectedGoalsAway: 1.0,
    tacticalAnalysis: ''
  };
  const minutes = generateMatchMomentMinutes(dummyOdds, player);
  return minutes.map(min => createContextualMoment(player, opponent, min, { home: 0, away: 0 }, used));
}

export interface DecisionResolutionResult {
  success: boolean;
  impact: 'goal' | 'assist' | 'great_play' | 'neutral' | 'turnover' | 'yellow_card' | 'red_card' | 'clima_quente' | 'malandragem' | 'lideranca' | 'catimba' | 'reclamacao';
  title: string;
  text: string;
  cardType: 'none' | 'yellow' | 'red';
  isSentOff?: boolean;
  lockerRoomBonus?: number;
  fansBonus?: number;
  coachBonus?: number;
  boardBonus?: number;
  ratingDelta?: number;
  tagSummary?: string[];
  evaluation: DecisionEvaluation;
}

/**
 * Resolve o resultado de uma escolha do atleta considerando estilo, atributos e leitura contextual
 * Retorna título expressivo e texto de narração gerado especificamente de acordo com a decisão tomada!
 * SISTEMA NÃO-BINÁRIO REALISTA: Futebol não é apenas gol ou erro; ações como briga, malandragem,
 * catimba e reclamação trazem trade-offs de moral no vestiário, apoio da torcida e riscos de cartão!
 */
export function resolveDecision(
  player: PlayerProfile,
  option: MatchDecisionOption,
  moment?: MatchDecisionMoment | null,
  opponent?: Club | null
): DecisionResolutionResult {
  const evaluation = evaluateOptionSuitability(player, option);
  const roll = Math.random() * 100;
  const isSuccess = roll < evaluation.totalChance;

  const oppDefObj = opponent?.squad?.find(p => p.position === 'ZAG' || p.position === 'VOL' || p.position === 'LE' || p.position === 'LD');
  const oppDef = oppDefObj?.name || 'marcador adversário';

  const oppGkObj = opponent?.squad?.find(p => p.position === 'GOL');
  const oppGk = oppGkObj?.name || 'goleiro rival';

  const footStr = player.preferredFoot === 'Esquerda' ? 'esquerdo' : 'direito';
  const oppName = opponent?.shortName || 'adversário';

  const statText = evaluation.secondaryStatName !== evaluation.primaryStatName
    ? `${evaluation.primaryStatName} & ${evaluation.secondaryStatName}`
    : evaluation.primaryStatName;

  // ----------------------------------------------------
  // TRATAMENTO NÃO-BINÁRIO ESPECIAL 1: BRIGA / DEFESA DO COMPANHEIRO
  // ----------------------------------------------------
  if (option.actionType === 'briga') {
    const brawlRoll = Math.random() * 100;

    if (brawlRoll < 65) {
      // 65%: Confusão com cartão amarelo mútuo & respeito no vestiário
      return {
        success: true,
        impact: 'clima_quente',
        title: '[CLIMA QUENTE!] CONFUSÃO & DEFESA DO COMPANHEIRO',
        text: `Você peitou ${oppDef} sem recuar um milímetro, defendeu seu companheiro e comprou a bronca pelo grupo! O árbitro interveio na confusão e aplicou cartão amarelo para você e para ${oppDef}. O vestiário inteiro viu que você veste o manto com sangue nos olhos!`,
        cardType: 'yellow',
        lockerRoomBonus: 16,
        fansBonus: 15,
        coachBonus: 0,
        ratingDelta: +0.2,
        tagSummary: ['Moral com o Vestiário (+16%)', 'Torcida Inflamada (+15%)', 'Cartão Amarelo'],
        evaluation
      };
    } else if (brawlRoll < 85) {
      // 20%: Impôs respeito sem tomar cartão!
      return {
        success: true,
        impact: 'clima_quente',
        title: '[RESPEITO IMPOSTO!] VOCÊ IMPÔS RESPEITO SEM TOMAR CARTÃO',
        text: `Você entrou firme na confusão, protegeu seu companheiro de ${oppDef} e desarticulou a provocação com autoridade moral de verdadeiro líder! O árbitro interveio e apenas advertiu verbalmente sem punição com cartão!`,
        cardType: 'none',
        lockerRoomBonus: 18,
        fansBonus: 18,
        coachBonus: 6,
        ratingDelta: +0.4,
        tagSummary: ['Respeito Total no Vestiário (+18%)', 'Apoio da Torcida (+18%)', 'Moral com Treinador (+6%)'],
        evaluation
      };
    } else {
      // 15%: Perda de cabeça & Cartão Vermelho Direto (Expulsão!)
      return {
        success: false,
        impact: 'red_card',
        title: '[EXPULSÃO DIRETA!] CLIMA ESQUENTOU E O ÁRBITRO MOSTROU VERMELHO!',
        text: `Na confusão acalorada, ${oppDef} falou no seu ouvido e você perdeu a cabeça, desferindo um empurrão ríspido! O árbitro não teve dúvidas e puxou o CARTÃO VERMELHO direto! Você foi expulso da partida, mas a torcida na arquibancada cantou seu nome pela raça com que honrou a camisa!`,
        cardType: 'red',
        isSentOff: true,
        lockerRoomBonus: 20,
        fansBonus: 12,
        coachBonus: -10,
        ratingDelta: -0.6,
        tagSummary: ['Expulsão Direta (Vermelho)', 'Defendeu o Companheiro (+20% Vestiário)', 'Puxão de Orelha do Treinador (-10%)'],
        evaluation
      };
    }
  }

  // ----------------------------------------------------
  // TRATAMENTO NÃO-BINÁRIO ESPECIAL 2: MALANDRAGEM & COBRANÇA RÁPIDA
  // ----------------------------------------------------
  if (option.actionType === 'malandragem') {
    const trickRoll = Math.random() * 100;

    if (trickRoll < 55) {
      // 55%: Pegou a zaga dormindo -> Criou chance de ouro
      return {
        success: true,
        impact: 'assist',
        title: '[MALANDRAGEM TÁTICA!] COBRANÇA RÁPIDA & BRECHA ENCONTRADA!',
        text: `Malandragem e inteligência pura! Você bateu a bola parada rápido antes de ${oppDef} e do ${oppName} se posicionarem, achando o atacante em velocidade na cara de ${oppGk}!`,
        cardType: 'none',
        fansBonus: 14,
        coachBonus: 8,
        ratingDelta: +0.8,
        tagSummary: ['Malandragem Tática (+14% Torcida)', 'Elogio do Treinador (+8%)'],
        evaluation
      };
    } else if (trickRoll < 85) {
      // 30%: Árbitro mandou aguardar o apito e deu cartão amarelo
      return {
        success: false,
        impact: 'yellow_card',
        title: '[CARTÃO AMARELO] ÁRBITRO EXIGIU APITO!',
        text: `Você tentou cobrar rápido para surpreender o ${oppName}, mas o árbitro já havia ordenado aguardar o apito! Ele interrompeu a jogada e aplicou cartão amarelo por reiniciar o jogo sem autorização. A torcida aplaudiu a esperteza, mas o professor cobrou disciplina.`,
        cardType: 'yellow',
        fansBonus: 6,
        coachBonus: -2,
        ratingDelta: -0.1,
        tagSummary: ['Cobrou sem Autorização (Cartão Amarelo)', 'Apoio da Torcida (+6%)'],
        evaluation
      };
    } else {
      // 15%: Árbitro apenas mandou voltar o lance
      return {
        success: true,
        impact: 'neutral',
        title: '[ARBITRAGEM] APITO PARA VOLTAR O LANCE',
        text: `O árbitro apitou no mesmo instante em que você tocou na bola, mandando voltar a cobrança para a marca exata da falta sem aplicar cartão.`,
        cardType: 'none',
        coachBonus: 2,
        ratingDelta: 0.0,
        evaluation
      };
    }
  }

  // ----------------------------------------------------
  // TRATAMENTO NÃO-BINÁRIO ESPECIAL 3: CATIMBA & RELÓGIO
  // ----------------------------------------------------
  if (option.actionType === 'catimba') {
    const clockRoll = Math.random() * 100;

    if (clockRoll < 65) {
      // 65%: Catimba perfeita, gastou tempo com maestria
      return {
        success: true,
        impact: 'catimba',
        title: '[CATIMBA DE COPERO] PRENDEU A BOLA NA BANDEIRINHA!',
        text: `Aula de futebol copeiro! Você levou a bola para a bandeirinha de escanteio, protegeu de costas para ${oppDef}, sofreu duas faltas e fez o relógio voar sob aplausos calorosos do treinador e da torcida!`,
        cardType: 'none',
        coachBonus: 10,
        fansBonus: 8,
        lockerRoomBonus: 8,
        ratingDelta: +0.4,
        tagSummary: ['Futebol Copeiro (+10% Treinador)', 'Tempo Conquistado (+8% Torcida)'],
        evaluation
      };
    } else {
      // 35%: Cartão amarelo por retardar o reinício
      return {
        success: false,
        impact: 'yellow_card',
        title: '[CARTÃO AMARELO] CARTÃO POR RETARDAR O JOGO',
        text: `Você segurou a bola para ganhar segundos valiosos no fim da partida, mas o árbitro não perdoou e aplicou cartão amarelo por retardar o reinício do jogo. A torcida e a comissão técnica aplaudiram o sacrifício.`,
        cardType: 'yellow',
        coachBonus: 6,
        fansBonus: 5,
        ratingDelta: 0.0,
        tagSummary: ['Cera Tática (+6% Treinador)', 'Cartão Amarelo'],
        evaluation
      };
    }
  }

  // ----------------------------------------------------
  // TRATAMENTO NÃO-BINÁRIO ESPECIAL 4: RECLAMAÇÃO COM O ÁRBITRO
  // ----------------------------------------------------
  if (option.actionType === 'reclamacao') {
    const refRoll = Math.random() * 100;

    if (refRoll < 60) {
      // 60%: Pressão psicológica funcionou
      return {
        success: true,
        impact: 'reclamacao',
        title: '[PRESSÃO] VOCÊ PRESSIONOU A ARBITRAGEM!',
        text: `Você chamou a responsabilidade, contestou a decisão do juiz com autoridade e incendiou o estádio! A arbitragem sentiu a pressão e amarelou o rival no lance seguinte.`,
        cardType: 'none',
        fansBonus: 12,
        lockerRoomBonus: 8,
        ratingDelta: +0.2,
        tagSummary: ['Pressão na Arbitragem (+12% Torcida)', 'Moral com o Elenco (+8%)'],
        evaluation
      };
    } else {
      // 40%: Cartão amarelo por reclamação
      return {
        success: false,
        impact: 'yellow_card',
        title: '[CARTÃO AMARELO] CARTÃO POR RECLAMAÇÃO',
        text: `O árbitro foi intransigente com a sua reclamação acalorada e sacou o cartão amarelo por desrespeito às decisões da arbitragem.`,
        cardType: 'yellow',
        fansBonus: 6,
        coachBonus: -2,
        ratingDelta: -0.1,
        tagSummary: ['Reclamação Forte (Cartão Amarelo)', 'Apoio da Torcida (+6%)'],
        evaluation
      };
    }
  }

  // ----------------------------------------------------
  // TRATAMENTO NÃO-BINÁRIO ESPECIAL 5: DIVIDIDA FIRME / RAÇA
  // ----------------------------------------------------
  if (option.actionType === 'dividida_firme') {
    const tackleRoll = Math.random() * 100;

    if (tackleRoll < 60) {
      return {
        success: true,
        impact: 'great_play',
        title: '[RAÇA PURA!] CARRINHO LIMPO NA BOLA!',
        text: `Entrada duríssima, mas 100% na bola! Você travou o contragolpe perigoso de ${oppDef} e o estádio inteiro veio abaixo cantando seu nome!`,
        cardType: 'none',
        fansBonus: 15,
        lockerRoomBonus: 10,
        coachBonus: 8,
        ratingDelta: +0.5,
        tagSummary: ['Carrinho Perfeito (+15% Torcida)', 'Raça e Vestiário (+10%)'],
        evaluation
      };
    } else {
      return {
        success: false,
        impact: 'yellow_card',
        title: '[CARTÃO AMARELO] FALTA TÁTICA & CARTÃO',
        text: `Você chegou firme demais para matar o contragolpe e cometeu falta dura em ${oppDef}. O árbitro aplicou o cartão amarelo tático necessário para estancar o perigo.`,
        cardType: 'yellow',
        fansBonus: 8,
        lockerRoomBonus: 6,
        coachBonus: 5,
        ratingDelta: +0.1,
        tagSummary: ['Falta Tática Necessária (Cartão Amarelo)', 'Apoio da Torcida (+8%)'],
        evaluation
      };
    }
  }

  // ----------------------------------------------------
  // TRATAMENTO NÃO-BINÁRIO ESPECIAL 6: LIDERANÇA
  // ----------------------------------------------------
  if (option.actionType === 'lideranca') {
    return {
      success: true,
      impact: 'lideranca',
      title: '[LIDERANÇA] POSTURA DE CAPITÃO & COMANDO',
      text: `Com frieza e discernimento de líder, você organizou a equipe, acalmou os companheiros mais exaltados e orientou a postura tática da equipe em campo.`,
      cardType: 'none',
      coachBonus: 9,
      lockerRoomBonus: 12,
      boardBonus: 5,
      fansBonus: 4,
      ratingDelta: +0.4,
      tagSummary: ['Espírito de Liderança (+9% Treinador)', 'Respeito do Vestiário (+12%)'],
      evaluation
    };
  }

  // ----------------------------------------------------
  // AÇÕES TÉCNICAS (FINALIZAÇÃO, PASSE, DRIBLE, CRUZAMENTO)
  // ----------------------------------------------------
  if (isSuccess) {
    let impact: 'goal' | 'assist' | 'great_play' = 'great_play';
    let title = '[PASSE] JOGADA CONCLUÍDA COM SUCESSO!';
    let text = option.successNarrative || '';
    let ratingDelta = 0.4;

    const labelLower = option.label.toLowerCase();

    if (
      option.actionType === 'finalizacao' ||
      option.id.includes('shoot') ||
      option.id.includes('volley') ||
      option.id.includes('first_time') ||
      option.id.includes('curl') ||
      labelLower.includes('chute') ||
      labelLower.includes('gol') ||
      labelLower.includes('cobrança') ||
      labelLower.includes('bomba')
    ) {
      impact = 'goal';
      title = '[GOL!] GOLAÇO INDEFENSÁVEL!';
      ratingDelta = 1.2;
      if (!text) {
        text = `[GOL!] Execução perfeita de ${option.label}! Você bateu com extrema categoria no pé ${footStr}, tirando completamente do alcance de ${oppGk} e estufando as redes! (${statText}: ${evaluation.effectiveStat})`;
      }
    } else if (
      option.actionType === 'passe' ||
      option.actionType === 'cruzamento' ||
      option.id.includes('pass') ||
      option.id.includes('cross') ||
      labelLower.includes('passe') ||
      labelLower.includes('cruzamento') ||
      labelLower.includes('enfiada') ||
      labelLower.includes('inversão') ||
      labelLower.includes('cavadinha')
    ) {
      impact = 'assist';
      title = '[ASSISTÊNCIA] ASSISTÊNCIA DE CRAQUE!';
      ratingDelta = 0.8;
      if (!text) {
        text = `[ASSISTÊNCIA] Visão periférica de alto nível! Ao optar por ${option.label}, você achou a brecha perfeita nas costas da zaga do ${oppName} e serviu o gol limpo para o companheiro! (${statText}: ${evaluation.effectiveStat})`;
      }
    } else if (
      option.actionType === 'drible' ||
      option.id.includes('dribble') ||
      labelLower.includes('drible') ||
      labelLower.includes('finta') ||
      labelLower.includes('corte') ||
      labelLower.includes('arrancada')
    ) {
      impact = 'great_play';
      title = '[PRESSÃO] DRIBLE DESCONCERTANTE!';
      ratingDelta = 0.5;
      if (!text) {
        text = `[PRESSÃO] Habilidade pura de camisa 10! Você executou ${option.label}, deixou ${oppDef} rodando no chão e incendiou o estádio com seu estilo ${player.playStyleName}!`;
      }
    } else if (
      option.actionType === 'desarme' ||
      labelLower.includes('desarme') ||
      labelLower.includes('carrinho')
    ) {
      impact = 'great_play';
      title = '[DESARME] DESARME MONUMENTAL!';
      ratingDelta = 0.4;
      if (!text) {
        text = `[DESARME] Tempo de bola impecável! Você aplicou ${option.label} no segundo exato, tomou a bola limpa de ${oppDef} e frustrou o ataque rival sob aplausos!`;
      }
    } else if (option.actionType === 'torcida') {
      impact = 'great_play';
      title = '[PRESSÃO] ARQUIBANCADA EM FESTA!';
      ratingDelta = 0.3;
      if (!text) {
        text = `[PRESSÃO] A torcida atendeu ao seu chamado! As arquibancadas explodiram em festa e empurraram o time com uma energia contagiante!`;
      }
    } else {
      impact = 'great_play';
      title = '[PASSE] INTELIGÊNCIA TÁTICA!';
      ratingDelta = 0.3;
      if (!text) {
        text = `[PASSE] Decisão madura e eficiente! Ao escolher ${option.label}, você superou a pressão de ${oppDef} e manteve a equipe no comando da jogada (${statText}: ${evaluation.effectiveStat}).`;
      }
    }

    return {
      success: true,
      impact,
      title,
      text,
      cardType: 'none',
      fansBonus: option.fansBonus || 4,
      coachBonus: option.coachBonus || 4,
      lockerRoomBonus: option.teammatesBonus || 0,
      boardBonus: option.boardBonus || 0,
      ratingDelta,
      evaluation
    };
  } else {
    // FALHA TÉCNICA ESPECÍFICA (NUNCA TÍTULO GENÉRICO EM BRIGAS OU CATIMBAS)
    let impact: 'turnover' | 'yellow_card' = 'turnover';
    let title = '[BLOQUEADO] LANCE TRAVADO!';
    let text = option.failureNarrative || '';
    let cardType: 'none' | 'yellow' | 'red' = 'none';

    const labelLower = option.label.toLowerCase();

    if (option.id.includes('tackle') || option.id.includes('foul') || labelLower.includes('carrinho')) {
      impact = 'yellow_card';
      cardType = 'yellow';
      title = '[CARTÃO AMARELO] FALTA & CARTÃO AMARELO!';
      if (!text) {
        text = `[FALTA] Na tentativa de ${option.label}, você chegou uma fração de segundo atrasado no combate e atingiu o marcador rival por baixo. O árbitro parou a jogada e aplicou cartão amarelo.`;
      }
    } else if (labelLower.includes('cava') || labelLower.includes('falta')) {
      title = '[ARBITRAGEM] ÁRBITRO MANDOU SEGUIR!';
      if (!text) {
        text = `[ARBITRAGEM] Você tentou ${option.label}, mas o marcador ${oppDef} foi frio, tocou apenas na bola e o juiz mandou o jogo seguir sem marcar infração!`;
      }
    } else if (
      option.actionType === 'finalizacao' ||
      labelLower.includes('chute') ||
      labelLower.includes('voleio') ||
      labelLower.includes('bomba') ||
      labelLower.includes('cobrança')
    ) {
      title = '[DEFESA] QUASE O GOL!';
      if (!text) {
        text = `[BLOQUEADO] Você arriscou ${option.label}, mas o chute saiu com um leve desvio / raspando a trave de ${oppGk} e foi para fora por centímetros!`;
      }
    } else if (
      option.actionType === 'passe' ||
      option.actionType === 'cruzamento' ||
      labelLower.includes('passe') ||
      labelLower.includes('enfiada') ||
      labelLower.includes('cruzamento')
    ) {
      title = '[INTERCEPTADO] PASSE CORTADO PELA ZAGA!';
      if (!text) {
        text = `[INTERCEPTADO] A intenção de ${option.label} foi excelente, mas a zaga do ${oppName} leu o movimento de corpo e cortou a trajetória da bola antes do seu companheiro dominar.`;
      }
    } else if (
      option.actionType === 'drible' ||
      labelLower.includes('drible') ||
      labelLower.includes('vaca') ||
      labelLower.includes('finta')
    ) {
      title = '[DESARME] COMBATIDO NO DUELO!';
      if (!text) {
        text = `[DESARME] Você tentou ${option.label}, mas ${oppDef} usou o porte físico, fechou o ângulo de passagem e conseguiu recuperar a posse de bola.`;
      }
    } else {
      title = '[BLOQUEADO] JOGADA NEUTRALIZADA!';
      if (!text) {
        text = `[BLOQUEADO] Ao tentar ${option.label}, a marcação do ${oppName} dobrou com velocidade e conseguiu travar o lance na risca da grande área.`;
      }
    }

    return {
      success: false,
      impact,
      title,
      text,
      cardType,
      fansBonus: option.fansBonus ? Math.floor(option.fansBonus / 2) : 0,
      coachBonus: option.coachBonus ? Math.floor(option.coachBonus / 2) : 0,
      lockerRoomBonus: option.teammatesBonus ? Math.floor(option.teammatesBonus / 2) : 0,
      boardBonus: 0,
      ratingDelta: -0.3,
      evaluation
    };
  }
}

