import { PlayerProfile, PlayerInjury, InjuryCause, InjuryLevel, NewsArticle } from '../types';
import { CLUBS } from '../data/clubs';
import { createMemory } from './careerMemory';

/**
 * SERVIÇO DE LESÕES, DEPARTAMENTO MÉDICO (DM) & BIOMECÂNICA ESPORTIVA
 * 
 * Modela os motivos reais pelos quais jogadores profissionais se lesionam:
 * 1. Sobrecarga e Fadiga Muscular (energia baixa < 60% e sequência pesada)
 * 2. Entradas Violentas e Choques (carrinhos desleais, soladas, disputas ríspidas)
 * 3. Sprints Explosivos sem Aquecimento Completo
 * 4. Gramado Ruim ou Clima Adverso (grama encharcada, piso sintético duro)
 */

interface InjuryTemplate {
  name: string;
  cause: InjuryCause;
  causeTitle: string;
  causeDescription: string;
  level: InjuryLevel;
  grade: 1 | 2 | 3;
  rounds: number;
  isSacrificeAllowed: boolean;
  bodyPart: PlayerInjury['bodyPart'];
  doctorReport: string;
  penaltyStat: keyof PlayerProfile['attributes'];
  penaltyValue: number;
}

const INJURY_TEMPLATES: InjuryTemplate[] = [
  // 1. Fadiga / Sobrecarga
  {
    name: 'Fadiga Muscular Aguda no Adutor',
    cause: 'fadiga_sobrecarga',
    causeTitle: 'Sobrecarga de Partidas & Fadiga Acumulada',
    causeDescription: 'O atleta entrou em campo com desgaste muscular excessivo e o músculo adutor travou após sequência de mudanças de direção.',
    level: 'leve',
    grade: 1,
    rounds: 1,
    isSacrificeAllowed: true,
    bodyPart: 'adutor',
    doctorReport: 'Exame de ultrassonografia constatou edema muscular leve sem ruptura de fibras. Necessita de repouso regenerativo e liberação miofascial.',
    penaltyStat: 'physical',
    penaltyValue: 8
  },
  {
    name: 'Estiramento Grau 2 no Isquiotibial Direito',
    cause: 'fadiga_sobrecarga',
    causeTitle: 'Fadiga Extrema & Desgaste da Posterior da Coxa',
    causeDescription: 'A musculatura posterior da coxa não suportou a exigência física em alta velocidade com energia reduzida, provocando estiramento visível na ressonância.',
    level: 'moderada',
    grade: 2,
    rounds: 3,
    isSacrificeAllowed: false,
    bodyPart: 'coxa',
    doctorReport: 'Ressonância Magnética evidenciou lesão muscular de Grau 2 com descontinuidade parcial das fibras da posterior da coxa e presença de hematoma.',
    penaltyStat: 'pace',
    penaltyValue: 12
  },
  {
    name: 'Lesão Muscular Complexa com Desinserção Tendínea',
    cause: 'fadiga_sobrecarga',
    causeTitle: 'Exaustão Biomecânica & Sobrecarga Limite',
    causeDescription: 'O acúmulo de minutos sem descanso culminou em lesão severa de fibras profundas da coxa.',
    level: 'grave',
    grade: 3,
    rounds: 5,
    isSacrificeAllowed: false,
    bodyPart: 'coxa',
    doctorReport: 'Laudo médico aponta lesão muscular de Grau 3 com afastamento das bordas tendíneas. Tratamento requer protocolo estrito de regeneração biológica no DM.',
    penaltyStat: 'physical',
    penaltyValue: 16
  },

  // 2. Entrada Violenta de Marcador Rival
  {
    name: 'Contusão Óssea na Tíbia com Edema Traumático',
    cause: 'entrada_violenta',
    causeTitle: 'Trauma Direto após Entrada Ríspida do Zagueiro',
    causeDescription: 'Levou uma solada frontal violenta do marcador adversário que atingiu em cheio a canela, gerando forte inchaço e dor ao apoiar o pé.',
    level: 'leve',
    grade: 1,
    rounds: 1,
    isSacrificeAllowed: true,
    bodyPart: 'tornozelo',
    doctorReport: 'Radiografia descartou fratura óssea. Diagnosticada contusão periosteal com hematoma localizado. Permite infiltração analgésica se o atleta optar por atuar no sacrifício.',
    penaltyStat: 'dribbling',
    penaltyValue: 10
  },
  {
    name: 'Entorse de Tornozelo Direito com Estiramento Ligamentar',
    cause: 'entrada_violenta',
    causeTitle: 'Carrinho Maldoso por Trás com Torção da Articulação',
    causeDescription: 'Ao proteger a bola na linha de fundo, recebeu um carrinho imprudente que prendeu a chuteira na grama e torceu o tornozelo violentamente.',
    level: 'moderada',
    grade: 2,
    rounds: 3,
    isSacrificeAllowed: false,
    bodyPart: 'tornozelo',
    doctorReport: 'Ressonância aponta entorse de Grau 2 com estiramento significativo do ligamento talofibular anterior e derrame articular moderado.',
    penaltyStat: 'dribbling',
    penaltyValue: 14
  },
  {
    name: 'Lesão Parcial no Menisco Medial por Hiperextensão Traumática',
    cause: 'entrada_violenta',
    causeTitle: 'Choque Brutal e Travamento Articular',
    causeDescription: 'Choque direto entre joelhos em disputa aérea forçada no segundo tempo gerou estalo audível no gramado.',
    level: 'grave',
    grade: 3,
    rounds: 6,
    isSacrificeAllowed: false,
    bodyPart: 'joelho',
    doctorReport: 'Exames detalhados confirmam fissura meniscal medial com bloqueio articular intermitente. Afastamento compulsório para reabilitação fisioterapêutica e fortalecimento.',
    penaltyStat: 'pace',
    penaltyValue: 18
  },

  // 3. Sprint Explosivo sem Aquecimento
  {
    name: 'Contratura no Músculo Reto Femoral',
    cause: 'sprint_explosivo',
    causeTitle: 'Arrancada Explosiva em Contra-Ataque',
    causeDescription: 'Arrancou aos 80 minutos em sprint de 40 metros para alcançar passe longo e sentiu a parte frontal da coxa fisgar.',
    level: 'leve',
    grade: 1,
    rounds: 1,
    isSacrificeAllowed: true,
    bodyPart: 'coxa',
    doctorReport: 'Espasmo muscular de defesa sem ruptura fibrilar aparente. Requer gelo imediato, sessões de drenagem e retorno progressivo.',
    penaltyStat: 'pace',
    penaltyValue: 8
  },
  {
    name: 'Fisgada no Músculo da Panturrilha (Grau 2)',
    cause: 'sprint_explosivo',
    causeTitle: 'Impulsão Brusca em Disputa Ofensiva',
    causeDescription: 'Ao tentar saltar na área para cabecear, o músculo gastrocnêmio da panturrilha sofreu estiramento agudo.',
    level: 'moderada',
    grade: 2,
    rounds: 2,
    isSacrificeAllowed: false,
    bodyPart: 'panturrilha',
    doctorReport: 'Ultrassom muscular indicou microrrupturas no ventre medial do gastrocnêmio. Imobilização preventiva e protocolo intensivo de fisioterapia.',
    penaltyStat: 'finalization',
    penaltyValue: 10
  },

  // 4. Gramado Ruim ou Clima Adverso
  {
    name: 'Entorse Leve do Joelho por Trava no Gramado Encharcado',
    cause: 'gramado_ruim',
    causeTitle: 'Piso Pesado e Escorregão em Poça d\'Água',
    causeDescription: 'A chuteira travou na lama do gramado pesado sob forte temporal, causando torção repentina da articulação.',
    level: 'leve',
    grade: 1,
    rounds: 1,
    isSacrificeAllowed: true,
    bodyPart: 'joelho',
    doctorReport: 'Estabilidade ligamentar preservada. Presença de sinovite reacional decorrente do estresse mecânico do piso. Tratamento com anti-inflamatórios e repouso.',
    penaltyStat: 'passing',
    penaltyValue: 8
  },
  {
    name: 'Lombalgia Traumática por Choque no Solo Duro',
    cause: 'gramado_ruim',
    causeTitle: 'Queda de Mau Jeito em Piso Irregular',
    causeDescription: 'Caiu de costas após dividida pelo alto sobre campo duro e irregular, travando as vértebras lombares.',
    level: 'moderada',
    grade: 2,
    rounds: 2,
    isSacrificeAllowed: false,
    bodyPart: 'costela',
    doctorReport: 'Espasmo paravertebral agudo com limitação de flexão e rotação de tronco. Terapia analgésica e liberação quiroprática indicadas.',
    penaltyStat: 'physical',
    penaltyValue: 12
  }
];

export interface InMatchInjuryContext {
  opponentClub?: string;
  opponentPlayerName?: string;
  isGoalkeeperInvolved?: boolean;
  situationText?: string;
  decisionTitle?: string;
  isCleanPlayByOpponent?: boolean;
}

/**
 * Avalia se há ocorrência de lesão em um momento de jogo
 */
export function evaluateInMatchInjuryRisk(
  player: PlayerProfile,
  minute: number,
  actionChosenLabel: string,
  isViolentFoul: boolean = false,
  context?: InMatchInjuryContext
): PlayerInjury | null {
  // Se o jogador já estiver machucado e NÃO estiver jogando no sacrifício, não há nova lesão
  if (player.activeInjury && !player.activeInjury.isPlayingOnSacrifice) {
    return null;
  }

  const energy = player.energy ?? 80;
  let injuryChance = 0;
  let probableCause: InjuryCause = 'fadiga_sobrecarga';

  // 1. Jogando no sacrifício: risco altíssimo de recidiva / agravamento
  if (player.activeInjury?.isPlayingOnSacrifice) {
    injuryChance = 0.35; // 35% de chance de agravar
    probableCause = player.activeInjury.cause;
  } 
  // 2. Fadiga extrema (energia < 55% no final do jogo)
  else if (energy < 55 && minute >= 65) {
    injuryChance = 0.22; // 22% de chance se exaurido
    probableCause = 'fadiga_sobrecarga';
  }
  // 3. Entrada violenta ou choque direto em dividida
  else if (isViolentFoul || context?.isGoalkeeperInvolved || actionChosenLabel.toLowerCase().includes('corpo') || actionChosenLabel.toLowerCase().includes('dividida')) {
    injuryChance = 0.18;
    probableCause = 'entrada_violenta';
  }
  // 4. Arrancada explosiva com energia abaixo de 70%
  else if (actionChosenLabel.toLowerCase().includes('velocidade') || actionChosenLabel.toLowerCase().includes('arrancada') || actionChosenLabel.toLowerCase().includes('contra-ataque')) {
    injuryChance = energy < 70 ? 0.16 : 0.06;
    probableCause = 'sprint_explosivo';
  } else {
    // Risco basal muito baixo em condições normais (1.5%)
    injuryChance = 0.015;
    probableCause = Math.random() > 0.5 ? 'gramado_ruim' : 'sprint_explosivo';
  }

  // Sorteia se a lesão se materializa
  if (Math.random() > injuryChance) {
    return null;
  }

  // Filtra templates compatíveis com a causa provável
  const candidates = INJURY_TEMPLATES.filter(t => t.cause === probableCause);
  const selectedTemplate = candidates[Math.floor(Math.random() * candidates.length)] || INJURY_TEMPLATES[0];

  let dynamicCauseTitle = selectedTemplate.causeTitle;
  let dynamicCauseDescription = selectedTemplate.causeDescription;
  let dynamicDoctorReport = selectedTemplate.doctorReport;

  // Personalização Contextual Hiper-Realista: adapta se o lance envolveu o goleiro adversário
  if (context?.isGoalkeeperInvolved) {
    const gkName = context.opponentPlayerName || 'o goleiro';
    dynamicCauseTitle = `Choque Traumático com o Goleiro ${gkName}`;
    dynamicCauseDescription = `O goleiro ${gkName} saiu arrojado aos seus pés e tocou na bola com o carrinho; no choque frontal da inércia em velocidade, você sofreu o impacto direto na perna. O árbitro mandou o jogo seguir (sem falta, bola limpa!), mas a pancada gerou trauma ósseo na tíbia.`;
    dynamicDoctorReport = `Radiografia descartou fratura óssea. Diagnosticada contusão periosteal na tíbia com hematoma localizado decorrente do choque limpo com o goleiro ${gkName}.`;
  } else if (context?.opponentPlayerName && selectedTemplate.cause === 'entrada_violenta') {
    dynamicCauseTitle = `Trauma Direto após Dividida Ríspida com ${context.opponentPlayerName}`;
    dynamicCauseDescription = `Disputa acirrada pela posse de bola na intermediária contra ${context.opponentPlayerName}. O árbitro julgou o lance, mas a pancada gerou inchaço e dor imediata.`;
  }

  const injury: PlayerInjury = {
    id: `inj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: selectedTemplate.name,
    cause: selectedTemplate.cause,
    causeTitle: dynamicCauseTitle,
    causeDescription: dynamicCauseDescription,
    level: selectedTemplate.level,
    grade: selectedTemplate.grade,
    roundsRemaining: selectedTemplate.rounds,
    initialRounds: selectedTemplate.rounds,
    isSacrificeAllowed: selectedTemplate.isSacrificeAllowed,
    doctorReport: dynamicDoctorReport,
    occurredAtRound: player.currentMatchDay || 1,
    occurredAtMinute: minute,
    bodyPart: selectedTemplate.bodyPart,
    statDebuff: {
      stat: selectedTemplate.penaltyStat,
      penalty: selectedTemplate.penaltyValue
    }
  };

  return injury;
}

/**
 * Cria a notícia de imprensa oficial do Departamento Médico e repercussão no X
 */
export function createInjuryNewsArticle(player: PlayerProfile, injury: PlayerInjury): NewsArticle {
  const club = CLUBS[player.currentClub] || { shortName: player.currentClub };
  const doctorName = 'Dr. Paulo Rogério (Chefe do DM)';

  const headline = injury.level === 'grave'
    ? `BOLETIM MÉDICO: ${player.surname.toUpperCase()} sofre ${injury.name.toLowerCase()} e vira desfalque por semanas no ${club.shortName}`
    : injury.level === 'moderada'
    ? `DM DO ${club.shortName.toUpperCase()}: Exames confirmam ${injury.name.toLowerCase()} de ${player.surname}`
    : `ALERTA NO ${club.shortName.toUpperCase()}: ${player.surname} sente ${injury.bodyPart} e é dúvida para a próxima rodada`;

  const snippet = `${doctorName} confirmou em nota oficial que o camisa #${player.number} teve constatada ${injury.name}. A causa apontada pela comissão técnica foi ${injury.causeTitle.toLowerCase()} (${injury.causeDescription}). O tempo estimado de recuperação inicial é de ${injury.initialRounds} rodada(s) no Departamento Médico.`;

  return {
    id: `art_inj_${Date.now()}`,
    round: player.currentMatchDay,
    matchDay: player.currentMatchDay,
    dateStr: new Date().toLocaleDateString('pt-BR'),
    outlet: 'ge.globo',
    badgeColor: '#EF4444',
    category: 'match',
    categoryLabel: '🚨 Boletim Médico Oficial',
    headline,
    snippet,
    socialMediaPost: {
      author: 'Central do Craque',
      handle: '@central_craque_fc',
      text: `Péssima notícia para a torcida do ${club.shortName}! ${player.surname} sentiu a ${injury.bodyPart} e o DM confirmou ${injury.name}. Sem o nosso jovem camisa 10, o time perde muito em criação! Força garoto! 🙏⚽`,
      likes: '9.4k'
    }
  };
}

/**
 * Aplica a conduta de tratamento escolhida pelo jogador no DM
 */
export function applyInjuryTreatment(
  player: PlayerProfile,
  treatmentChoice: 'conservative' | 'accelerate' | 'sacrifice'
): {
  updatedPlayer: PlayerProfile;
  message: string;
  success: boolean;
} {
  if (!player.activeInjury) {
    return { updatedPlayer: player, message: 'Nenhuma lesão ativa no momento.', success: false };
  }

  const currentInj = { ...player.activeInjury };
  let newPlayer = { ...player };
  let message = '';

  if (treatmentChoice === 'conservative') {
    // Protocolo Seguro: Cumpre a fisioterapia normal sem forçar
    currentInj.isPlayingOnSacrifice = false;
    newPlayer.moral = Math.min(100, (newPlayer.moral || 80) + 2);
    message = 'Você optou pelo protocolo conservador de recuperação. Fisioterapia diária, hidratação e zero risco de agravamento.';
  } else if (treatmentChoice === 'accelerate') {
    // Tratamento Intensivo (3 períodos): Reduz 1 rodada no DM, gasta energia/moral
    if (currentInj.roundsRemaining > 1) {
      currentInj.roundsRemaining -= 1;
    }
    currentInj.isPlayingOnSacrifice = false;
    newPlayer.energy = Math.max(40, (newPlayer.energy || 80) - 10);
    newPlayer.moral = Math.max(30, (newPlayer.moral || 80) - 5);
    message = 'Tratamento intensivo em 3 períodos com câmara hiperbárica e crioterapia! Você reduziu 1 rodada do seu tempo de recuperação no DM.';
  } else if (treatmentChoice === 'sacrifice') {
    // Jogar no Sacrifício sob Infiltração
    if (!currentInj.isSacrificeAllowed && currentInj.level === 'grave') {
      return {
        updatedPlayer: player,
        message: 'O Departamento Médico vetou categoricamente sua ida a campo com lesão Grau 3.',
        success: false
      };
    }

    currentInj.isPlayingOnSacrifice = true;
    newPlayer.relationships = {
      ...newPlayer.relationships,
      fans: Math.min(100, (newPlayer.relationships?.fans || 70) + 8),
      coach: Math.min(100, (newPlayer.relationships?.coach || 65) + 6)
    };
    message = 'Você tomou a decisão corajosa de atuar no sacrifício com infiltração analgésica! A torcida e o técnico aplaudiram sua raça, mas você jogará com atributos físicos reduzidos e risco de agravamento.';
  }

  newPlayer.activeInjury = currentInj;
  return { updatedPlayer: newPlayer, message, success: true };
}

/**
 * Avança uma rodada do tempo de recuperação do jogador machucado
 */
export function advanceInjuryRound(player: PlayerProfile): {
  updatedPlayer: PlayerProfile;
  healed: boolean;
  recoveryMemory?: any;
} {
  if (!player.activeInjury) {
    return { updatedPlayer: player, healed: false };
  }

  const remaining = player.activeInjury.roundsRemaining - 1;
  const newPlayer = { ...player };

  if (remaining <= 0) {
    // Totalmente curado! Liberado pelo DM
    const pastInjury = player.activeInjury;
    newPlayer.activeInjury = null;
    newPlayer.injuryHistory = [...(player.injuryHistory || []), pastInjury];

    // Cria memória de superação médica
    const recMemory = createMemory(player, {
      title: 'Liberado pelo DM após superação de lesão',
      description: `Após período em tratamento de ${pastInjury.name}, o chefe do departamento médico deu alta ao camisa #${player.number}, liberando-o para voltar 100% aos gramados.`,
      impactSummary: 'Retorno aos gramados 100% recuperado',
      category: 'milestone',
      tags: ['#recuperado', '#superacao', '#voltaAosCampos', '#saude'],
      importance: 'media'
    });
    newPlayer.memories = [recMemory, ...(player.memories || [])];

    return { updatedPlayer: newPlayer, healed: true, recoveryMemory: recMemory };
  } else {
    // Ainda em tratamento
    newPlayer.activeInjury = {
      ...player.activeInjury,
      roundsRemaining: remaining,
      isPlayingOnSacrifice: false // Reseta sacrifício a cada rodada
    };
    return { updatedPlayer: newPlayer, healed: false };
  }
}
