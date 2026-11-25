import { 
  PlayerProfile, 
  CalendarWeekDay, 
  Position, 
  PlayerAttributes, 
  WeeklyTrainingResult, 
  TrainingStatChange 
} from '../types';
import { CLUBS, findClub } from '../data/clubs';
import { hydrateFMAttributes } from './footballManagerAttributes';
import { createMemory } from './careerMemory';
import { hasSeasonalHyperbaricUpgrade } from './economyAndContractService';

/**
 * SERVIÇO DE CALENDÁRIO SEMANAL & SISTEMA DE TREINAMENTO BASEADO EM RESULTADOS
 * 
 * Regras do Sistema de Treino:
 * 1. Zero emojis na interface e nos dados.
 * 2. Exibição do Overall real de cada atributo envolvido (escala FM).
 * 3. Treinos NÃO são infinitos: 1 foco semanal por rodada (bloqueado até o próximo jogo).
 * 4. Treinos NÃO garantem evolução certa: o sistema calcula o resultado (crítico, sólido, estável ou negativo).
 * 5. Fatores determinantes: energia do atleta, idade, nível atual do atributo e moral com o técnico.
 */

export interface TrainingFocusOption {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'target' | 'compass' | 'zap' | 'shield' | 'dumbbell' | 'award';
  description: string;
  primaryStat: keyof PlayerAttributes;
  primaryStatLabel: string;
  secondaryStat: keyof PlayerAttributes;
  secondaryStatLabel: string;
  energyCost: number;
  riskNote: string;
}

/**
 * Retorna os 6 grandes focos de treinamento tático disponíveis para o jogador
 */
export function getTrainingFocusOptions(player: PlayerProfile): TrainingFocusOption[] {
  return [
    {
      id: 'focus_finishing',
      title: 'Finalizações de Chapa, Voleios & 1x1 com Goleiro',
      subtitle: 'Calibração de pontaria e frieza no último terço do campo',
      iconType: 'target',
      description: 'Treino de finalização de primeira, batidas com efeito na bochecha da rede e frieza frente a frente com o goleiro.',
      primaryStat: 'finishing',
      primaryStatLabel: 'Finalização',
      secondaryStat: 'composure',
      secondaryStatLabel: 'Compostura / Frieza',
      energyCost: 10,
      riskNote: 'Sobrecarga física e frustração se a energia estiver baixa'
    },
    {
      id: 'focus_passing',
      title: 'Passes Verticais, Trivelas & Visão de Jogo',
      subtitle: 'Quebra de linhas defensivas adversárias e passes milimétricos',
      iconType: 'compass',
      description: 'Leitura de espaços entrelinhas, inversões rápidas de jogo, lançamentos longos e peso perfeito da bola.',
      primaryStat: 'passing',
      primaryStatLabel: 'Passe',
      secondaryStat: 'vision',
      secondaryStatLabel: 'Visão de Jogo',
      energyCost: 8,
      riskNote: 'Exige alto foco mental para não cometer erros na tomada de decisão'
    },
    {
      id: 'focus_dribbling',
      title: 'Circuito de Dribles em Espaço Curto & Agilidade',
      subtitle: 'Mudança rápida de direção e desequilíbrio no um contra um',
      iconType: 'zap',
      description: 'Slalom em velocidade, cortes secos, fintas de corpo e drible vertical para desmontar marcação individual.',
      primaryStat: 'dribbling',
      primaryStatLabel: 'Drible',
      secondaryStat: 'agility',
      secondaryStatLabel: 'Agilidade',
      energyCost: 10,
      riskNote: 'Risco de desgaste muscular e dores articulares com pouca energia'
    },
    {
      id: 'focus_physical',
      title: 'Musculação Funcional, Força & Proteção de Bola',
      subtitle: 'Ganho de sustentação de carga, fôlego e potência de arranque',
      iconType: 'dumbbell',
      description: 'Trabalho de academia e campo com cargas funcionais para aguentar o tranco de defensores e sustentar intensidade os 90 minutos.',
      primaryStat: 'physical',
      primaryStatLabel: 'Força / Porte Físico',
      secondaryStat: 'stamina',
      secondaryStatLabel: 'Resistência / Fôlego',
      energyCost: 12,
      riskNote: 'Carga pesada: alto risco de fadiga se a energia estiver abaixo de 55%'
    },
    {
      id: 'focus_defense',
      title: 'Fundamentos Defensivos, Desarme Limpo & Posicionamento',
      subtitle: 'Leitura de antecipação, coberturas e rigor tático',
      iconType: 'shield',
      description: 'Bote no chão sem cometer faltas, interceptação de linhas de passe, coberturas nas laterais e fechamento do miolo de zaga.',
      primaryStat: 'tackling',
      primaryStatLabel: 'Desarme',
      secondaryStat: 'positioning',
      secondaryStatLabel: 'Posicionamento Tático',
      energyCost: 8,
      riskNote: 'Exige disciplina rigorosa cobrada pelo treinador'
    },
    {
      id: 'focus_set_pieces',
      title: 'Cobranças de Falta com Efeito, Pênaltis & Cruzamentos',
      subtitle: 'Batidas na gaveta, efeito venenoso e categoria da marca da cal',
      iconType: 'award',
      description: 'Repetição exaustiva de bolas paradas laterais e frontais, cobranças de pênalti sob pressão e cruzamentos tensos na área.',
      primaryStat: 'freeKicks',
      primaryStatLabel: 'Bolas Paradas',
      secondaryStat: 'penalties',
      secondaryStatLabel: 'Pênaltis',
      energyCost: 7,
      riskNote: 'Exige serenidade e precisão mecânica do chute'
    }
  ];
}

/**
 * Executa o cálculo oficial do foco de treino semanal da rodada.
 * NÃO É INFINITO: consome o slot semanal (weeklyTrainingDone = true).
 * NÃO GARANTE MELHORIA: calcula resultados positivos, neutros ou negativos.
 */
export function executeWeeklyTrainingFocus(
  player: PlayerProfile,
  focusId: string
): { updatedPlayer: PlayerProfile; result: WeeklyTrainingResult } {
  const options = getTrainingFocusOptions(player);
  const focus = options.find(o => o.id === focusId) || options[0];
  const club = CLUBS[player.currentClub] || Object.values(CLUBS)[0];
  const coachName = club.coachName || 'Comissão Técnica';

  // Obtém os atributos atuais hidratados na escala real FM
  const hydrated = hydrateFMAttributes(player.attributes, player.position);
  const primaryVal = (hydrated as any)[focus.primaryStat] ?? 65;
  const secondaryVal = (hydrated as any)[focus.secondaryStat] ?? 65;

  // ====================================================
  // CÁLCULO DE PROBABILIDADES BASEADO EM ENERGIA E IDADE
  // ====================================================
  const energy = player.energy;
  let probCritSuccess = 0.15;
  let probSuccess = 0.55;
  let probNeutral = 0.22;
  let probNegative = 0.08;

  if (energy >= 85) {
    probCritSuccess = 0.25;
    probSuccess = 0.55;
    probNeutral = 0.16;
    probNegative = 0.04;
  } else if (energy >= 65) {
    probCritSuccess = 0.15;
    probSuccess = 0.55;
    probNeutral = 0.22;
    probNegative = 0.08;
  } else if (energy >= 45) {
    probCritSuccess = 0.05;
    probSuccess = 0.40;
    probNeutral = 0.30;
    probNegative = 0.25;
  } else {
    // Treinar exausto (energia < 45%): altíssimo risco de desgaste negativo!
    probCritSuccess = 0.00;
    probSuccess = 0.20;
    probNeutral = 0.35;
    probNegative = 0.45;
  }

  // Bônus de desenvolvimento para jovens (16-20 anos)
  if (player.age <= 20) {
    probCritSuccess += 0.12;
    probNegative = Math.max(0.03, probNegative - 0.05);
  }

  // Penalidade de evolução se o atributo já for de elite (82+)
  if (primaryVal >= 82) {
    probCritSuccess = Math.max(0.04, probCritSuccess - 0.10);
    probSuccess = Math.max(0.25, probSuccess - 0.15);
    probNeutral += 0.20;
  }

  // Sorteio com distribuição cumulativa
  const roll = Math.random();
  let outcomeType: 'crit_success' | 'success' | 'neutral' | 'negative' = 'success';

  if (roll < probCritSuccess) {
    outcomeType = 'crit_success';
  } else if (roll < probCritSuccess + probSuccess) {
    outcomeType = 'success';
  } else if (roll < probCritSuccess + probSuccess + probNeutral) {
    outcomeType = 'neutral';
  } else {
    outcomeType = 'negative';
  }

  // ====================================================
  // DEFINIÇÃO DOS DELTAS E TEXTOS POR DESFECHO
  // ====================================================
  let primaryDelta = 0;
  let secondaryDelta = 0;
  let ovrDelta = 0;
  let coachTrustDelta = 0;
  let outcomeTitle = '';
  let outcomeDescription = '';
  let coachFeedback = '';
  let earnedRole: 'start' | 'sub_60' | 'rest_full' = 'sub_60';
  let earnedRoleLabel = 'Banco de Reservas (Opção para o 2º Tempo)';
  let effectiveEnergyCost = focus.energyCost;

  // Trava Realista da Base em Gigantes: Jovens de 16-18 anos com OVR < 76 em gigantes entram gradualmente aos 60'
  const currentClubObj = findClub(player.currentClub);
  const isGiant = currentClubObj ? currentClubObj.prestige >= 4 : false;
  const isRookieInGiant = isGiant && player.age <= 18;
  const gamesPlayed = player.careerTotals?.games || 0;
  const isPromotedToStarter = !isRookieInGiant || player.ovr >= 76 || (gamesPlayed >= 5 && player.relationships.coach >= 80);

  if (outcomeType === 'crit_success') {
    primaryDelta = player.age <= 18 && primaryVal < 75 ? 2 : 1;
    secondaryDelta = 1;
    ovrDelta = 0.4;
    coachTrustDelta = +6;
    earnedRole = isPromotedToStarter ? 'start' : 'sub_60';
    earnedRoleLabel = isPromotedToStarter 
      ? 'Titular Conquistado no Treino' 
      : '12º Jogador de Impacto (Entrará aos 60\')';
    outcomeTitle = 'Sessão de Destaque Absoluto (+)';
    outcomeDescription = `Atuação primorosa no CT do ${player.currentClub}. O atleta dominou os fundamentos de ${focus.primaryStatLabel.toLowerCase()}, mostrando maturidade, técnica refinada e intensidade de alto nível.`;
    coachFeedback = isPromotedToStarter
      ? `"${coachName}: 'Treino brilhante essa semana! Você mostrou uma precisão impressionante em ${focus.primaryStatLabel.toLowerCase()} e entendeu exatamente o que a equipe precisa. Vai para o jogo como peça titular!' "`
      : `"${coachName}: 'Treino de gala, garoto! Sua precisão em ${focus.primaryStatLabel.toLowerCase()} foi espetacular. Mas aqui no ${player.currentClub} temos hierarquia de vestiário. Você é meu 12º jogador e entra aos 60 minutos para botar fogo na partida!' "`;
  } else if (outcomeType === 'success') {
    primaryDelta = 1;
    secondaryDelta = 0;
    ovrDelta = 0.2;
    coachTrustDelta = +3;
    earnedRole = (isPromotedToStarter && player.relationships.coach >= 65) ? 'start' : 'sub_60';
    earnedRoleLabel = earnedRole === 'start' ? 'Titular Confirmado' : 'Opção Imediata no Banco (Entra aos 60\')';
    outcomeTitle = 'Evolução Sólida Aprovada (+)';
    outcomeDescription = `Treino consistente e produtivo. A comissão técnica aprovou sua dedicação em ${focus.primaryStatLabel.toLowerCase()}, gerando aprimoramento técnico perceptível.`;
    coachFeedback = earnedRole === 'start'
      ? `"${coachName}: 'Boa sessão de treinamento. Você cumpriu a rotina com disciplina e a evolução em ${focus.primaryStatLabel.toLowerCase()} é nítida. Vai para o 11 inicial!' "`
      : `"${coachName}: 'Boa sessão de treinamento. A evolução em ${focus.primaryStatLabel.toLowerCase()} é nítida. Siga concentrado no banco que aos 60 minutos você entra para decidir.' "`;
  } else if (outcomeType === 'neutral') {
    primaryDelta = 0;
    secondaryDelta = 0;
    ovrDelta = 0;
    coachTrustDelta = +1;
    earnedRole = 'sub_60';
    earnedRoleLabel = 'Banco de Reservas';
    outcomeTitle = 'Sessão Estável de Manutenção (=)';
    outcomeDescription = `O atleta cumpriu a carga física e tática estabelecida, mas sem saltos qualitativos imediatos. No futebol profissional, a evolução de fundamentos consolidados exige semanas contínuas de repetição.`;
    coachFeedback = `"${coachName}: 'Treino regular. Cumpriu o cronograma da semana, mas na próxima rodada quero ver mais sangue nos olhos e intensidade máxima.' "`;
  } else {
    // Desfecho Negativo
    primaryDelta = primaryVal > 55 ? -1 : 0;
    secondaryDelta = 0;
    ovrDelta = primaryDelta < 0 ? -0.2 : 0;
    effectiveEnergyCost += 6; // Desgaste físico a mais
    coachTrustDelta = -3;
    earnedRole = energy < 40 ? 'rest_full' : 'sub_60';
    earnedRoleLabel = earnedRole === 'rest_full' ? 'Preservado por Desgaste' : 'Banco de Reservas (Cuidado Físico)';
    outcomeTitle = 'Sobrecarga & Desgaste Negativo (-)';
    outcomeDescription = `Sessão difícil no CT. Sob desgaste físico acumulado, o atleta cometeu erros repetitivos, sentiu o ritmo pesado da atividade e teve uma leve queda de rendimento.`;
    coachFeedback = `"${coachName}: 'O treino hoje foi abaixo do esperado. Você pareceu pesado e desconcentrado em campo. O departamento físico vai monitorar sua recuperação para evitar lesão.' "`;
  }

  // ====================================================
  // APLICAÇÃO NOS ATRIBUTOS DO JOGADOR
  // ====================================================
  const newAttributes: PlayerAttributes = {
    ...hydrated,
    [focus.primaryStat]: Math.min(99, Math.max(35, primaryVal + primaryDelta)),
    [focus.secondaryStat]: Math.min(99, Math.max(35, secondaryVal + secondaryDelta))
  };

  // Também sincroniza os atributos legados básicos para manter consistência
  if (focus.primaryStat === 'finishing') newAttributes.finalization = newAttributes.finishing;
  if (focus.primaryStat === 'passing') newAttributes.passing = newAttributes.passing;
  if (focus.primaryStat === 'dribbling') newAttributes.dribbling = newAttributes.dribbling;
  if (focus.primaryStat === 'physical') newAttributes.physical = newAttributes.physical;
  if (focus.primaryStat === 'tackling') newAttributes.defense = newAttributes.tackling;

  const statChanges: TrainingStatChange[] = [
    {
      statKey: focus.primaryStat,
      statLabel: focus.primaryStatLabel,
      before: primaryVal,
      after: newAttributes[focus.primaryStat] ?? primaryVal,
      delta: primaryDelta
    }
  ];

  if (secondaryDelta !== 0) {
    statChanges.push({
      statKey: focus.secondaryStat,
      statLabel: focus.secondaryStatLabel,
      before: secondaryVal,
      after: newAttributes[focus.secondaryStat] ?? secondaryVal,
      delta: secondaryDelta
    });
  }

  const finalOvr = Number(Math.min(99, Math.max(50, player.ovr + ovrDelta)).toFixed(1));
  const newEnergy = Math.max(15, player.energy - effectiveEnergyCost);

  const result: WeeklyTrainingResult = {
    round: player.currentMatchDay || 1,
    focusId: focus.id,
    focusTitle: focus.title,
    outcomeType,
    outcomeTitle,
    description: outcomeDescription,
    statChanges,
    ovrDelta,
    coachTrustDelta,
    energyCost: effectiveEnergyCost,
    coachFeedback,
    earnedRole,
    earnedRoleLabel
  };

  const updatedPlayer: PlayerProfile = {
    ...player,
    energy: newEnergy,
    ovr: finalOvr,
    attributes: newAttributes,
    relationships: {
      ...player.relationships,
      coach: Math.min(100, Math.max(10, player.relationships.coach + coachTrustDelta))
    },
    weeklyTrainingDone: true,
    lastTrainingResult: result,
    trainingVerdict: {
      routineTitle: focus.title,
      coachFeedback,
      earnedRole,
      earnedRoleLabel,
      competitorName: 'Concorrente de Posição',
      competitorOvr: player.ovr + 2,
      trainingScore: outcomeType === 'crit_success' ? 95 : outcomeType === 'success' ? 80 : outcomeType === 'neutral' ? 65 : 45
    }
  };

  return { updatedPlayer, result };
}

/**
 * Regeneração Semanal Automática de Energia entre Partidas.
 * Garante que o atleta descanse e recupere fôlego natural entre cada rodada.
 */
export function applyWeeklyRestRecovery(player: PlayerProfile): PlayerProfile {
  const bonus = hasSeasonalHyperbaricUpgrade(player) ? 12 : 0;
  const recoveredEnergy = Math.min(100, player.energy + 25 + bonus);
  return {
    ...player,
    energy: recoveredEnergy
  };
}

/**
 * Regeneração Semanal via Fisioterapia / DM
 * Não contém emojis. Restaura energia física do atleta com responsabilidade.
 */
export function applyWeeklyPhysioRecovery(player: PlayerProfile): { updatedPlayer: PlayerProfile; message: string } {
  const currentEnergy = player.energy;
  if (currentEnergy >= 100) {
    return {
      updatedPlayer: player,
      message: 'O atleta já está com 100% de energia e fôlego no ápice para a partida.'
    };
  }

  const restored = Math.min(100, currentEnergy + 30);
  const updatedPlayer: PlayerProfile = {
    ...player,
    energy: restored
  };

  return {
    updatedPlayer,
    message: `Sessão de fisioterapia e crioterapia realizada. Sua energia física subiu de ${currentEnergy}% para ${restored}%.`
  };
}

/**
 * Retorna os dias do calendário semanal (zero emojis, apenas identificadores de ícones)
 */
export function getCleanWeeklyCalendar(player: PlayerProfile): CalendarWeekDay[] {
  const matchDay = player.currentMatchDay || 1;
  const isCupWeek = [2, 5, 8, 9, 12, 14, 16, 18, 20, 23, 27, 29, 33, 35, 37].includes(matchDay);

  return [
    {
      dayName: 'Segunda-feira',
      dateLabel: 'Início da Semana',
      title: 'Fisioterapia & Regeneração Muscular',
      type: 'physio',
      icon: 'activity',
      description: 'Banheira de gelo, massagem miofascial e recuperação de fôlego após o último confronto.',
      completed: true
    },
    {
      dayName: 'Terça-feira',
      dateLabel: 'Dia de Carga',
      title: 'Academia & Força Funcional',
      type: 'training',
      icon: 'dumbbell',
      description: 'Trabalho de impulsão, força explosiva e potência física no centro de excelência.',
      completed: true
    },
    {
      dayName: 'Quarta-feira',
      dateLabel: 'Trabalho Técnico',
      title: isCupWeek ? 'Sessão Especial de Taça (Mata-Mata)' : 'Coletivo Tático no Gramado',
      type: 'tactical',
      icon: 'target',
      description: 'Simulações de jogo reduzido, calibragem de passes e transições ofensivas rápidas.',
      completed: true
    },
    {
      dayName: 'Quinta-feira',
      dateLabel: 'Especialização',
      title: 'Treino de Foco Específico da Posição',
      type: 'training',
      icon: 'target',
      description: 'Fundamentos da sua posição, movimentação sem bola e cobranças de bola parada.',
      completed: player.weeklyTrainingDone || false
    },
    {
      dayName: 'Sexta-feira',
      dateLabel: 'Véspera do Duelo',
      title: 'Preleção Tática & Análise de Vídeo',
      type: 'pre_match',
      icon: 'clipboard',
      description: 'Estudo das fragilidades táticas do adversário da rodada e ajustes de posicionamento.',
      completed: false
    },
    {
      dayName: 'Fim de Semana',
      dateLabel: `Rodada ${matchDay}`,
      title: 'Match Day: Entrada em Campo',
      type: 'match',
      icon: 'trophy',
      description: 'Concentração no vestiário e apito inicial valendo a vitória pelo campeonato.',
      completed: false
    }
  ];
}
