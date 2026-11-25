import { PlayerProfile, Position, SquadHierarchy } from '../types';
import { CLUBS, findClub } from '../data/clubs';
import { isCompatiblePosition } from './matchSimulator';
import { createMemory } from './careerMemory';
import { calculateCoachMatchDecision, getCoachPersonality } from './coachPersonalityService';

/**
 * SERVIÇO DE HIERARQUIA DE ELENCO & CONQUISTA DE ESPAÇO
 * Em clubes gigantes (Palmeiras, Flamengo, Real Madrid), jovens de 16-17 anos
 * NÃO são titulares absolutos imediatamente. A escalação e minutagem pertencem
 * 100% ao TÉCNICO, dependendo da Confiança, da concorrência de OVR e do Estilo de Personalidade do Treinador!
 */

/**
 * Obtém a análise de hierarquia do elenco para o atleta no seu clube atual
 */
export function getSquadHierarchy(player: PlayerProfile): SquadHierarchy {
  const club = findClub(player.currentClub);
  const coachName = club.coachName || 'Comissão Técnica';
  const prestige = club.prestige || 3;
  const isGiantClub = prestige >= 4;

  // Busca companheiros do elenco na mesma posição ou compatível
  const squad = club.squad || [];
  const competitors = squad
    .filter(p => isCompatiblePosition(p.position, player.position) && !p.name.toLowerCase().includes(player.surname.toLowerCase()))
    .sort((a, b) => b.ovr - a.ovr);

  // Titular principal da posição no clube
  let topCompetitor = competitors[0];

  if (!topCompetitor) {
    // Fallback realista baseado no clube
    if (club.name.includes('Palmeiras') && (player.position === 'MEI' || player.position === 'MC')) {
      topCompetitor = { id: 'pal_4', name: 'Raphael Veiga', position: 'MEI', ovr: 82, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 16, isStar: true };
    } else if (club.name.includes('Flamengo') && (player.position === 'MEI' || player.position === 'MC')) {
      topCompetitor = { id: 'fla_5', name: 'Giorgian De Arrascaeta', position: 'MEI', ovr: 83, age: 30, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 18, isStar: true };
    } else if (club.name.includes('Real Madrid')) {
      topCompetitor = { id: 'rm_star', name: 'Jude Bellingham', position: 'MEI', ovr: 90, age: 21, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 180, isStar: true };
    } else {
      const fallbackOvr = Math.min(88, Math.max(68, prestige * 13 + 12));
      topCompetitor = {
        id: `comp_${club.id}_${player.position}`,
        name: prestige >= 4 ? 'Camisa 10 Titular' : 'Meia Titular da Posição',
        position: player.position,
        ovr: fallbackOvr,
        age: 27,
        nationality: 'Brasil',
        flag: '🇧🇷',
        marketValueEur: prestige >= 4 ? 12 : 3,
        isStar: prestige >= 4
      };
    }
  }

  const ovrGap = topCompetitor.ovr - player.ovr;

  // Calcula a decisão oficial e soberana do técnico baseada em personalidade, confiança e treinos
  const coachDecision = calculateCoachMatchDecision(player, club, topCompetitor);

  return {
    clubName: club.name,
    coachName,
    prestige,
    isGiantClub,
    userPosition: player.position,
    competitors: competitors.map(c => ({ id: c.id, name: c.name, position: c.position, ovr: c.ovr, isStar: c.isStar })),
    topCompetitor,
    ovrGap,
    naturalRole: coachDecision.assignedRole,
    naturalRoleLabel: coachDecision.assignedRoleLabel,
    statusExplanation: coachDecision.tacticalExplanation,
    coachVerdictQuote: coachDecision.coachLockerRoomSpeech,
    coachPersonality: coachDecision.personality,
    coachTrustLevel: coachDecision.coachTrustLevel,
    coachRequiredTrustForStarting: coachDecision.requiredTrustForStarting
  };
}

/**
 * Tipos de postura tática no treino semanal
 */
export interface WeeklyTrainingOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  tacticalFocus: string;
  energyCost: number;
  expectedGains: {
    statName?: string;
    statBonus?: number;
    coachBonus: number;
    fansBonus?: number;
    staminaGain?: number;
  };
  coachReactionTemplate: (coach: string, competitor: string, player: PlayerProfile) => string;
}

/**
 * Retorna as 5 decisões de treino pré-jogo disponíveis nesta rodada
 */
export function getWeeklyTrainingOptions(player: PlayerProfile): WeeklyTrainingOption[] {
  const hierarchy = getSquadHierarchy(player);
  const compName = hierarchy.topCompetitor?.name || 'titular da posição';
  const compOvr = hierarchy.topCompetitor?.ovr || 78;

  return [
    {
      id: 'tactical_discipline',
      title: 'Obediência Tática & Absorção do Esquema',
      subtitle: `Seguir à risca as instruções de ${hierarchy.coachName}`,
      icon: 'tactics',
      description: `Foco total em posicionamento, compactação entre as linhas e cumprimento rigoroso das orientações do professor no coletivo tático.`,
      tacticalFocus: 'Visão de Jogo & Confiança do Treinador',
      energyCost: 6,
      expectedGains: {
        statName: 'Visão de Jogo',
        statBonus: 1,
        coachBonus: 7,
        fansBonus: 2
      },
      coachReactionTemplate: (coach, comp) =>
        `"${coach}: 'Excelente disciplina tática no treino de hoje! Você assimilou perfeitamente as transições. É exatamente esse tipo de inteligência que precisamos no confronto!' "`
    },
    {
      id: 'challenge_competitor',
      title: `Desafiar o Titular no Coletivo (1x1 com ${compName})`,
      subtitle: `Disputa acirrada pela posição no gramado`,
      icon: 'duel',
      description: `Ir pra cima do titular ${compName} (${compOvr} OVR) no treino de titulares contra reservas, mostrando drible vertical, raça e descaro de craque da base.`,
      tacticalFocus: 'Drible, Ousadia & Moral com a Torcida',
      energyCost: 12,
      expectedGains: {
        statName: 'Drible',
        statBonus: 1,
        coachBonus: 5,
        fansBonus: 8
      },
      coachReactionTemplate: (coach, comp) =>
        `"${coach}: 'Muita personalidade ao encarar o ${comp} no treino! Não se intimidou com o peso da camisa e deixou zagueiro na saudade. Garantiu vaga garantida no banco para entrar no clássico!' "`
    },
    {
      id: 'extra_finishing',
      title: 'Chutes Extras na Gaveta & Bolas Paradas após o Apito',
      subtitle: 'Ficar até mais tarde calibrando a finalização',
      icon: 'target',
      description: `Permanecer no gramado com os auxiliares técnicos treinando finalizações de chapa, voleios e cobranças de falta na bochecha da rede.`,
      tacticalFocus: 'Finalização & Fome de Gol',
      energyCost: 10,
      expectedGains: {
        statName: 'Finalização',
        statBonus: 1,
        coachBonus: 5,
        fansBonus: 4
      },
      coachReactionTemplate: (coach) =>
        `"${coach}: 'Vi você treinando cobranças depois que todos foram pro vestiário. Essa fome de bola e perfeccionismo é o que transforma promessa em titular!' "`
    },
    {
      id: 'functional_power',
      title: 'Musculação Funcional & Choque de Força',
      subtitle: 'Ganho de massa e explosão física no CT',
      icon: 'power',
      description: `Trabalho com os preparadores físicos para ganhar potência no arranque, força para aguentar tranco de zagueiro e impulsão aérea.`,
      tacticalFocus: 'Físico & Resistência ao Combate',
      energyCost: 8,
      expectedGains: {
        statName: 'Físico',
        statBonus: 2,
        coachBonus: 4,
        fansBonus: 2
      },
      coachReactionTemplate: (coach) =>
        `"${coach}: 'Seu porte físico está evoluindo visivelmente. Vai aguentar o tranco e as divididas duras dos adversários sem perder o equilíbrio.' "`
    },
    {
      id: 'physio_recovery',
      title: 'Crioterapia & Recuperação Fisiológica',
      subtitle: 'Banheira de gelo, fisioterapia e fôlego 100%',
      icon: 'physio',
      description: `Recuperar a musculatura com crioterapia, massagem miofascial e descanso orientado para chegar voando fisicamente na partida.`,
      tacticalFocus: 'Restauração de Energia Física (+35%)',
      energyCost: -35, // Recupera energia!
      expectedGains: {
        coachBonus: 2,
        fansBonus: 1,
        staminaGain: 35
      },
      coachReactionTemplate: (coach) =>
        `"${coach}: 'Fez muito bem em dosar a carga e se recuperar na fisioterapia. O calendário não dá trégua e precisamos do seu fôlego inteiro no fim de semana!' "`
    }
  ];
}

/**
 * Executa o treino semanal escolhido e define a escalação/papel para o próximo jogo
 */
export function executeWeeklyTraining(
  player: PlayerProfile,
  optionId: string
): { updatedPlayer: PlayerProfile; message: string; coachVerdict: string; earnedRole: 'start' | 'sub_60' | 'rest_full' } {
  const hierarchy = getSquadHierarchy(player);
  const options = getWeeklyTrainingOptions(player);
  const chosenOpt = options.find(o => o.id === optionId) || options[0];

  // 1. Atualiza Energia
  let newEnergy = player.energy;
  if (chosenOpt.energyCost < 0) {
    newEnergy = Math.min(100, player.energy + Math.abs(chosenOpt.energyCost));
  } else {
    newEnergy = Math.max(25, player.energy - chosenOpt.energyCost);
  }

  // 2. Atualiza Atributos
  const newAttributes = { ...player.attributes };
  if (chosenOpt.expectedGains.statName === 'Visão de Jogo') {
    newAttributes.vision = Math.min(99, newAttributes.vision + (chosenOpt.expectedGains.statBonus || 1));
  } else if (chosenOpt.expectedGains.statName === 'Drible') {
    newAttributes.dribbling = Math.min(99, newAttributes.dribbling + (chosenOpt.expectedGains.statBonus || 1));
  } else if (chosenOpt.expectedGains.statName === 'Finalização') {
    newAttributes.finalization = Math.min(99, newAttributes.finalization + (chosenOpt.expectedGains.statBonus || 1));
  } else if (chosenOpt.expectedGains.statName === 'Físico') {
    newAttributes.physical = Math.min(99, newAttributes.physical + (chosenOpt.expectedGains.statBonus || 2));
  }

  // 3. Atualiza Relações
  const newCoachTrust = Math.min(100, Math.max(10, player.relationships.coach + chosenOpt.expectedGains.coachBonus));
  const newFans = Math.min(100, Math.max(10, player.relationships.fans + (chosenOpt.expectedGains.fansBonus || 0)));

  // 4. Determina o Veredito da Escalação para o Próximo Jogo
  let earnedRole: 'start' | 'sub_60' | 'rest_full' = 'sub_60';
  let earnedRoleLabel = 'Arma Secreta (Entra no 2º Tempo aos 60\')';

  const isRookie = player.age <= 18;
  const gamesPlayed = player.careerTotals?.games || 0;
  const ovrGap = (hierarchy.topCompetitor?.ovr || 78) - player.ovr;

  if (hierarchy.isGiantClub) {
    // Em clubes grandes (Palmeiras, Flamengo, Real Madrid):
    // Jovem de 16-18 anos com concorrência pesada (ovrGap >= 6) NÃO é titular nas primeiras 5 partidas!
    const canStartInGiant = !isRookie || player.ovr >= 76 || (gamesPlayed >= 5 && newCoachTrust >= 82);
    if (canStartInGiant && newCoachTrust >= 80 && (optionId === 'challenge_competitor' || optionId === 'tactical_discipline') && newEnergy >= 65) {
      earnedRole = 'start';
      earnedRoleLabel = 'Titular Conquistado no Treino!';
    } else if (newEnergy < 40 || newCoachTrust < 30) {
      earnedRole = 'rest_full';
      earnedRoleLabel = 'Fora dos Relacionados (Transição da Base)';
    } else {
      earnedRole = 'sub_60';
      earnedRoleLabel = 'Arma Secreta (Entra aos 60\')';
    }
  } else {
    // Em clubes médios/menores (Novorizontino, Ceará, etc.):
    const canStartMedium = !isRookie || player.ovr >= 70 || gamesPlayed >= 2;
    if (canStartMedium && newCoachTrust >= 60 && newEnergy >= 55) {
      earnedRole = 'start';
      earnedRoleLabel = 'Titular da Equipe';
    } else {
      earnedRole = 'sub_60';
      earnedRoleLabel = 'Reserva Imediato (Entra aos 60\')';
    }
  }

  const coachQuote = chosenOpt.coachReactionTemplate(hierarchy.coachName, hierarchy.topCompetitor?.name || 'titular', player);

  const verdict = {
    routineTitle: chosenOpt.title,
    coachFeedback: coachQuote,
    earnedRole,
    earnedRoleLabel,
    competitorName: hierarchy.topCompetitor?.name || 'titular',
    competitorOvr: hierarchy.topCompetitor?.ovr || 78,
    trainingScore: Math.floor(Math.random() * 15) + 85
  };

  const updatedPlayer: PlayerProfile = {
    ...player,
    energy: newEnergy,
    attributes: newAttributes,
    relationships: {
      ...player.relationships,
      coach: newCoachTrust,
      fans: newFans
    },
    weeklyTrainingDone: true,
    trainingVerdict: verdict
  };

  return {
    updatedPlayer,
    message: `Treino de "${chosenOpt.title}" finalizado com sucesso!`,
    coachVerdict: coachQuote,
    earnedRole
  };
}
