import { PlayerProfile, Club, Position, MatchFixture } from '../types';
import { CLUBS } from '../data/clubs';

/**
 * SERVIÇO DE PERSONALIDADE DO TÉCNICO & ESCALAÇÃO OFICIAL
 * 
 * Regra de Ouro (User Request):
 * - O tempo de jogo e a condição de atuação NÃO SÃO ESCOLHA DO JOGADOR. São do TÉCNICO!
 * - A titularidade depende diretamente da Confiança do Técnico (player.relationships.coach),
 *   da concorrência de OVR na posição, da energia e do Estilo de Personalidade do Treinador.
 */

export type CoachPersonalityType = 
  | 'disciplinador_tatico'       // Abel Ferreira, Diego Simeone, Antonio Conte, Jorge Jesus, Fábio Carille
  | 'desenvolvedor_base'         // Hansi Flick, Filipe Luís, Mikel Arteta, Xabi Alonso, Fabian Hürzeler
  | 'pragmatico_hierarquico'     // Ramón Díaz, Simone Inzaghi, Carlo Ancelotti, Roger Machado, Mano Menezes
  | 'doutrinador_autoral'        // Pep Guardiola, Fernando Diniz, Roberto De Zerbi, Luis Enrique, Gabriel Milito
  | 'relacional_paizao'          // Renato Gaúcho, Carlo Ancelotti, Dorival Júnior
  | 'estrategista_competitivo';  // Luis Zubeldía, Artur Jorge, Gian Piero Gasperini, Eduardo Baptista

export interface CoachPersonality {
  id: CoachPersonalityType;
  title: string;
  shortTag: string;
  tagline: string;
  philosophy: string;
  youthPhilosophy: string;
  startingTrustThresholdGiant: number; // Exigência de confiança para ser titular em gigantes (16-18 anos)
  startingTrustThresholdMedium: number; // Exigência para clubes médios/pequenos
  preferredStyleName: string;
  keyDemands: string[];
  penalizesPartying: boolean; // Se atrito com vida noturna penaliza titularidade
  rewardsDiscipline: boolean; // Se conduta 'disciplinado_extremo' gera bônus
}

export const COACH_PERSONALITIES: Record<CoachPersonalityType, CoachPersonality> = {
  disciplinador_tatico: {
    id: 'disciplinador_tatico',
    title: 'General Tático & Disciplina de Ferro',
    shortTag: 'General Tático',
    tagline: 'Intensidade física máxima, rigor tático e zero tolerância a desleixo ou estrelismo.',
    philosophy: 'Cabeça fria, coração quente. Para jogar no meu time, o atleta precisa cumprir a função tática nos 90 minutos, recompor sem bola e treinar no limite da exaustão.',
    youthPhilosophy: 'Jovem de 16-18 anos precisa "comer grama" e provar maturidade de homem. Só vira titular com confiança altíssima (78%+). Caso contrário, ganha minutos aos poucos no segundo tempo.',
    startingTrustThresholdGiant: 78,
    startingTrustThresholdMedium: 62,
    preferredStyleName: 'Intensidade Física & Linhas Compactas',
    keyDemands: ['Recomposição defensiva', 'Entrega física máxima', 'Foco 24h no futebol'],
    penalizesPartying: true,
    rewardsDiscipline: true
  },
  desenvolvedor_base: {
    id: 'desenvolvedor_base',
    title: 'Mestre da Base & Meritocrata Jovem',
    shortTag: 'Formador Meritocrata',
    tagline: 'Ousadia, intensidade moderna e coragem para lançar jovens sem olhar a idade.',
    philosophy: 'Se o garoto treina com personalidade e entrega intensidade, ele vai para o campo! Futebol moderno é velocidade, pressão pós-perda e coragem no um contra um.',
    youthPhilosophy: 'Idade é apenas um número. Se o jovem de 17 anos mostrar talento e intensidade no treino, ganha a vaga de titular rapidamente (exige apenas 64% de confiança).',
    startingTrustThresholdGiant: 64,
    startingTrustThresholdMedium: 50,
    preferredStyleName: 'Pressão Alta & Transição Ofensiva',
    keyDemands: ['Pressão imediata', 'Drible vertical', 'Coragem com a bola'],
    penalizesPartying: false,
    rewardsDiscipline: true
  },
  pragmatico_hierarquico: {
    id: 'pragmatico_hierarquico',
    title: 'Pragmático & Fidelidade aos Medalhões',
    shortTag: 'Hierarquia & Casca Grossa',
    tagline: 'Prioridade aos veteranos cascudos e paciência de ferro na maturação de promessas.',
    philosophy: 'Jogo pesado e clássico se ganha com experiência e casca. Medalhão tem história e suporta a pressão da arquibancada.',
    youthPhilosophy: 'O jovem tem talento, mas precisa queimar etapas com calma. Enquanto o veterano consagrado estiver saudável, o jovem é a arma de segundo tempo (entra aos 60\'). Titular só com 82%+ de moral.',
    startingTrustThresholdGiant: 82,
    startingTrustThresholdMedium: 68,
    preferredStyleName: 'Equilíbrio Tático & Bola Parada',
    keyDemands: ['Experiência sob pressão', 'Paciência no banco', 'Respeito à hierarquia'],
    penalizesPartying: true,
    rewardsDiscipline: true
  },
  doutrinador_autoral: {
    id: 'doutrinador_autoral',
    title: 'Filósofo Autoral & Jogo Posicional',
    shortTag: 'Filósofo Posicional',
    tagline: 'Fidelidade obsessiva ao modelo conceitual, aproximação curta e posse de bola.',
    philosophy: 'A bola é a nossa vida. Não admito chutão nem perda de posse boba. Todo jogador precisa dominar o mapa de espaços e criar linhas de passe constantes.',
    youthPhilosophy: 'O jovem precisa assimilar o modelo antes de ser solto no campo. Se tentar dribles inconsequentes e perder a bola na saída, volta pro banco. Exige 72% de confiança tática.',
    startingTrustThresholdGiant: 72,
    startingTrustThresholdMedium: 58,
    preferredStyleName: 'Futebol Conceitual & Posse Curta',
    keyDemands: ['Precisão de passe', 'Ocupação de espaços', 'Tomada de decisão madura'],
    penalizesPartying: false,
    rewardsDiscipline: false
  },
  relacional_paizao: {
    id: 'relacional_paizao',
    title: 'Gestor Humano & Líder da Resenha',
    shortTag: 'Gestor & Paizão',
    tagline: 'Confiança no talento nato, liberdade criativa e gestão de vestiário no diálogo.',
    philosophy: 'Futebol se resolve com boleiro feliz, confiança no olhar e vestiário unido. Tática ajuda, mas o talento e a ousadia do craque decidem o clássico.',
    youthPhilosophy: 'Protege o garoto da cobrança exagerada da torcida e dá moral: "Pega a bola e vai pra dentro, moleque!". Conquista a titularidade com carisma e bom rendimento (60%+ de confiança).',
    startingTrustThresholdGiant: 60,
    startingTrustThresholdMedium: 48,
    preferredStyleName: 'Liberdade Criativa & Talento Individual',
    keyDemands: ['Alegria e ousadia', 'União do vestiário', 'Decisão no mano a mano'],
    penalizesPartying: false,
    rewardsDiscipline: false
  },
  estrategista_competitivo: {
    id: 'estrategista_competitivo',
    title: 'Estrategista Intenso & Duelos Físicos',
    shortTag: 'Competitividade & Vigor',
    tagline: 'Duelos individuais, agressividade competitiva e transição veloz.',
    philosophy: 'Cada palmo de grama é uma guerra. Quem ganha mais duelos individuais e segundas bolas, ganha a partida. Corra mais que o adversário.',
    youthPhilosophy: 'Não importa a idade, importa quem ganha as divididas e corre os 90 minutos. Exige vigor físico e 70% de confiança para começar como titular.',
    startingTrustThresholdGiant: 70,
    startingTrustThresholdMedium: 55,
    preferredStyleName: 'Duelos Físicos & Transição Letal',
    keyDemands: ['Vigor nos combates', 'Velocidade de transição', 'Raça nas divididas'],
    penalizesPartying: true,
    rewardsDiscipline: true
  }
};

/**
 * Mapeia o treinador real ao seu perfil de personalidade
 */
export function getCoachPersonality(coachName: string, clubName?: string): CoachPersonality {
  const normCoach = coachName.toLowerCase();
  const normClub = (clubName || '').toLowerCase();

  // Abel Ferreira, Simeone, Conte, Jorge Jesus, Carille, Eduardo Baptista
  if (
    normCoach.includes('abel ferreira') ||
    normCoach.includes('simeone') ||
    normCoach.includes('conte') ||
    normCoach.includes('jesus') ||
    normCoach.includes('carille') ||
    normCoach.includes('eduardo baptista') ||
    normCoach.includes('mancini') ||
    normCoach.includes('bausá')
  ) {
    return COACH_PERSONALITIES.disciplinador_tatico;
  }

  // Hansi Flick, Filipe Luís, Arteta, Xabi Alonso, Fabian Hürzeler, Nuri Şahin
  if (
    normCoach.includes('filipe luís') ||
    normCoach.includes('flick') ||
    normCoach.includes('arteta') ||
    normCoach.includes('xabi alonso') ||
    normCoach.includes('hürzeler') ||
    normCoach.includes('sahin') ||
    normCoach.includes('kompany')
  ) {
    return COACH_PERSONALITIES.desenvolvedor_base;
  }

  // Ramón Díaz, Simone Inzaghi, Roger Machado, Mano Menezes, Ranieri
  if (
    normCoach.includes('ramón díaz') ||
    normCoach.includes('ramon diaz') ||
    normCoach.includes('inzaghi') ||
    normCoach.includes('roger machado') ||
    normCoach.includes('mano menezes') ||
    normCoach.includes('ranieri') ||
    normCoach.includes('silas')
  ) {
    return COACH_PERSONALITIES.pragmatico_hierarquico;
  }

  // Pep Guardiola, Fernando Diniz, De Zerbi, Luis Enrique, Gabriel Milito, Thiago Motta
  if (
    normCoach.includes('guardiola') ||
    normCoach.includes('diniz') ||
    normCoach.includes('de zerbi') ||
    normCoach.includes('luis enrique') ||
    normCoach.includes('milito') ||
    normCoach.includes('thiago motta') ||
    normCoach.includes('céni') ||
    normCoach.includes('ceni')
  ) {
    return COACH_PERSONALITIES.doutrinador_autoral;
  }

  // Renato Gaúcho / Portaluppi, Carlo Ancelotti, Dorival
  if (
    normCoach.includes('renato') ||
    normCoach.includes('portaluppi') ||
    normCoach.includes('ancelotti') ||
    normCoach.includes('dorival') ||
    normCoach.includes('pellegrini')
  ) {
    return COACH_PERSONALITIES.relacional_paizao;
  }

  // Zubeldía, Artur Jorge, Gasperini, Arne Slot, Postecoglou, Gallardo
  if (
    normCoach.includes('zubeldía') ||
    normCoach.includes('zubeldia') ||
    normCoach.includes('artur jorge') ||
    normCoach.includes('gasperini') ||
    normCoach.includes('slot') ||
    normCoach.includes('postecoglou') ||
    normCoach.includes('gallardo') ||
    normCoach.includes('gago') ||
    normCoach.includes('amorim')
  ) {
    return COACH_PERSONALITIES.estrategista_competitivo;
  }

  // Fallback inteligente baseado no clube
  if (normClub.includes('palmeiras') || normClub.includes('atletico de madrid') || normClub.includes('santos')) {
    return COACH_PERSONALITIES.disciplinador_tatico;
  }
  if (normClub.includes('barcelona') || normClub.includes('arsenal') || normClub.includes('leverkusen') || normClub.includes('flamengo')) {
    return COACH_PERSONALITIES.desenvolvedor_base;
  }
  if (normClub.includes('manchester city') || normClub.includes('cruzeiro') || normClub.includes('psg')) {
    return COACH_PERSONALITIES.doutrinador_autoral;
  }
  if (normClub.includes('real madrid') || normClub.includes('grêmio')) {
    return COACH_PERSONALITIES.relacional_paizao;
  }

  return COACH_PERSONALITIES.disciplinador_tatico;
}

/**
 * ESTRUTURA DO VEREDITO DO TÉCNICO PARA A PARTIDA
 */
export interface CoachMatchDecision {
  assignedRole: 'start' | 'sub_60' | 'rest_full';
  assignedRoleLabel: string;
  coachName: string;
  personality: CoachPersonality;
  coachTrustLevel: number;
  requiredTrustForStarting: number;
  isStartingAllowed: boolean;
  coachLockerRoomSpeech: string;
  tacticalExplanation: string;
  factors: {
    trustFactor: { value: number; required: number; met: boolean; text: string };
    competitorFactor: { name: string; ovr: number; playerOvr: number; text: string };
    physioFactor: { energy: number; isFit: boolean; text: string };
    trainingFactor: { completed: boolean; impactText: string };
    conductFactor: { persona: string; impactText: string };
  };
}

/**
 * CALCULA A DECISÃO OFICIAL DO TÉCNICO PARA A PARTIDA
 * 
 * Regra do Usuário:
 * Não é o jogador quem escolhe a minutagem. É o técnico quem escala com base em:
 * 1. Sua confiança com ele (player.relationships.coach)
 * 2. O estilo de personalidade do técnico
 * 3. A concorrência da posição no elenco
 * 4. A energia física do jogador
 * 5. O desempenho no último treino da semana
 */
export function calculateCoachMatchDecision(
  player: PlayerProfile,
  club: Club,
  topCompetitor?: { name: string; ovr: number; position: Position; isStar?: boolean },
  fixture?: MatchFixture
): CoachMatchDecision {
  const coachName = club.coachName || 'Comissão Técnica';
  const personality = getCoachPersonality(coachName, club.name);
  const isGiant = club.prestige >= 4;

  const trustLevel = player.relationships?.coach ?? 60;
  const energy = player.energy ?? 100;
  const ovrGap = (topCompetitor?.ovr ?? 78) - player.ovr;

  // Limiar de confiança exigido pelo estilo deste técnico específico
  let requiredTrust = isGiant 
    ? personality.startingTrustThresholdGiant 
    : personality.startingTrustThresholdMedium;

  // Ajustes de exigência contextual:
  // 1. Se concorre com uma estrela consolidada (ex: Veiga 82, Bellingham 90, Arrascaeta 83)
  if (topCompetitor?.isStar && ovrGap >= 6) {
    requiredTrust += 5;
  }

  // 2. Se for jovem de 16-17 anos em clube gigante
  if (player.age <= 18 && isGiant) {
    if (personality.id === 'disciplinador_tatico' || personality.id === 'pragmatico_hierarquico') {
      requiredTrust += 3;
    } else if (personality.id === 'desenvolvedor_base') {
      requiredTrust -= 4; // Mestre da base facilita para jovens ousados
    }
  }

  // 3. Impacto da conduta extracampo (User Request de Personalidade)
  let conductBonus = 0;
  let conductText = 'Conduta neutra';
  if (player.lifestylePersona === 'disciplinado_extremo') {
    if (personality.rewardsDiscipline) {
      conductBonus = +8;
      conductText = 'Bônus: Sua disciplina rígida e recusa a festas agrada em cheio a comissão técnica (+8% moral).';
    } else {
      conductBonus = +3;
      conductText = 'Sua postura focada é elogiada no CT.';
    }
  } else if (player.lifestylePersona === 'festeiro_resenha') {
    if (personality.penalizesPartying) {
      conductBonus = -12;
      conductText = 'Penalidade: O técnico reprova sua vida noturna e exige foco antes de te dar a titularidade (-12% moral).';
    } else {
      conductBonus = -4;
      conductText = 'O técnico pede mais discrição nas comemorações noturnas.';
    }
  }

  // 4. Impacto do treino semanal
  let trainingBonus = 0;
  let trainingText = 'Nenhum foco de treino executado antes desta partida.';
  if (player.lastTrainingResult) {
    if (player.lastTrainingResult.outcomeType === 'crit_success') {
      trainingBonus = +15;
      trainingText = `Treino de gala nesta semana (${player.lastTrainingResult.focusTitle}) encheu os olhos do treinador (+15% moral).`;
    } else if (player.lastTrainingResult.outcomeType === 'success') {
      trainingBonus = +8;
      trainingText = `Evolução sólida no treino de ${player.lastTrainingResult.focusTitle} somou pontos com o técnico (+8% moral).`;
    } else if (player.lastTrainingResult.outcomeType === 'negative') {
      trainingBonus = -10;
      trainingText = `Dificuldade ou desgaste excessivo no treino gerou alerta na comissão técnica (-10% moral).`;
    }
  }

  const effectiveTrust = Math.min(100, Math.max(10, trustLevel + conductBonus + trainingBonus));
  const meetsTrustRequirement = effectiveTrust >= requiredTrust;

  // Trava Realista da Base em Gigantes:
  // Um jovem de 16-18 anos com OVR distante do titular (ovrGap >= 6) em clube gigante (Palmeiras, Flamengo, Real Madrid)
  // NÃO joga 90 min de cara no início de temporada (1º ao 5º jogo). Ele entra como 12º Jogador aos 60' para não queimar etapas.
  // A titularidade inicial só é destravada com 5+ jogos e 80%+ de moral, ou atingindo 76+ OVR.
  const isRookieInGiant = isGiant && player.age <= 18 && ovrGap >= 6;
  const gamesPlayed = (player.careerTotals?.games || 0);
  const hasEarnedStartingSpot = player.ovr >= 76 || (gamesPlayed >= 5 && effectiveTrust >= 80);

  // DETERMINAÇÃO DO PAPEL DECIDIDO PELO TÉCNICO:
  let assignedRole: 'start' | 'sub_60' | 'rest_full' = 'sub_60';
  let assignedRoleLabel = 'Banco de Reservas: Entrará aos 60\'';
  let lockerRoomSpeech = '';
  let tacticalExplanation = '';

  // CASO 1: Fisiologia e Fadiga Crítica (Menos de 55% de energia)
  if (energy < 55) {
    assignedRole = 'rest_full';
    assignedRoleLabel = 'Poupado pelo Técnico (Gestão Física / Fisiologia)';
    lockerRoomSpeech = `"${coachName}: 'O departamento médico me avisou que seu músculo está no limite com ${energy}% de energia. Não vou queimar você por vaidade. Você fica no descanso hoje para voltar voando!'"`;
    tacticalExplanation = `Decisão do treinador motivada pelo relatório da fisiologia. Risco alto de estiramento ou lesão de grau moderado.`;
  }
  // CASO 2: Conquistou a vaga de Titular Absoluto no 11 Inicial
  else if (meetsTrustRequirement && energy >= 65 && (!isRookieInGiant || hasEarnedStartingSpot)) {
    assignedRole = 'start';
    assignedRoleLabel = 'Titular do 11 Inicial (Decisão do Técnico)';
    
    if (personality.id === 'disciplinador_tatico') {
      lockerRoomSpeech = `"${coachName}: 'Você treinou com seriedade e me provou que cumpre o plano tático. A camisa titular é sua hoje. Jogue com intensidade e marque a saída deles!'"`;
    } else if (personality.id === 'desenvolvedor_base') {
      lockerRoomSpeech = `"${coachName}: 'Gosto de jogador com coragem e personalidade! Você tem ${player.age} anos, mas joga bola de veterano. Vai para o campo de início e mostra a ousadia da nossa base!'"`;
    } else if (personality.id === 'pragmatico_hierarquico') {
      lockerRoomSpeech = `"${coachName}: 'Você superou minhas exigências mais difíceis e conquistou respeito no vestiário. Hoje você começa jogando no 11 principal. Honre essa camisa!'"`;
    } else if (personality.id === 'doutrinador_autoral') {
      lockerRoomSpeech = `"${coachName}: 'Você compreendeu o desenho dos espaços e a circulação da bola nos treinos. Confio na sua visão de jogo para ditar o ritmo no primeiro minuto!'"`;
    } else if (personality.id === 'relacional_paizao') {
      lockerRoomSpeech = `"${coachName}: 'Tá com moral comigo e com a rapaziada, garoto! Coloca a camisa de titular, joga o que você sabe e traz esses três pontos pra nós!'"`;
    } else {
      lockerRoomSpeech = `"${coachName}: 'Sua dedicação nos treinos me convenceu. Você inicia a partida hoje no 11 titular. Quero ver sangue nos olhos em cada dividida!'"`;
    }

    tacticalExplanation = `O técnico escalou você como titular por atingir ${effectiveTrust}% de moral efetiva (exigência: ${requiredTrust}%) e estar em boas condições físicas (${energy}% energia).`;
  }
  // CASO 3: Reserva de Impacto / Arma Secreta no 2º Tempo (Entra aos 60')
  else if (effectiveTrust >= 35 && energy >= 50) {
    assignedRole = 'sub_60';
    assignedRoleLabel = '12º Jogador: Entrará aos 60\' (Decisão do Técnico)';

    const competitorName = topCompetitor?.name || 'O titular da posição';
    const competitorOvr = topCompetitor?.ovr || 80;

    if (isRookieInGiant && !hasEarnedStartingSpot) {
      lockerRoomSpeech = `"${coachName}: 'Calma, garoto! Você tem só ${player.age} anos e um futuro brilhante pela frente, mas aqui no ${club.name} respeitamos a hierarquia do ${competitorName} (${competitorOvr} OVR). Você entra aos 60 minutos para botar fogo no jogo contra a zaga cansada deles!' "`;
      tacticalExplanation = `Gestão de base: Em clubes gigantes, jovens talentos de ${player.age} anos entram gradualmente no 2º tempo para ganhar maturidade antes da titularidade fixa (${gamesPlayed}/5 jogos para promoção ao 11 inicial).`;
    } else if (personality.id === 'disciplinador_tatico') {
      lockerRoomSpeech = `"${coachName}: 'O ${competitorName} (${competitorOvr} OVR) tem mais casca e começa o combate. Mas você entra aos 60 minutos para botar pressão na zaga cansada deles. Fique concentrado no banco!'"`;
      tacticalExplanation = `O treinador optou por iniciar com ${competitorName} (${competitorOvr} OVR). Sua moral atual (${effectiveTrust}%) ainda está abaixo dos ${requiredTrust}% exigidos por ${coachName} (${personality.shortTag}) para desbancar o titular de início.`;
    } else if (personality.id === 'desenvolvedor_base') {
      lockerRoomSpeech = `"${coachName}: 'Você ainda precisa de mais uma pitada de intensidade nos treinos para passar o ${competitorName}. Hoje você entra no 2º tempo aos 60\' para incendiar o jogo!'"`;
      tacticalExplanation = `O treinador optou por iniciar com ${competitorName} (${competitorOvr} OVR). Sua moral atual (${effectiveTrust}%) ainda está abaixo dos ${requiredTrust}% exigidos por ${coachName} (${personality.shortTag}) para desbancar o titular de início.`;
    } else if (personality.id === 'pragmatico_hierarquico') {
      lockerRoomSpeech = `"${coachName}: 'Hierarquia de vestiário: ${competitorName} inicia a batalha. Você é meu trunfo aos 60 minutos. Não quero cara feia no banco, quero concentração!'"`;
      tacticalExplanation = `O treinador optou por iniciar com ${competitorName} (${competitorOvr} OVR). Sua moral atual (${effectiveTrust}%) ainda está abaixo dos ${requiredTrust}% exigidos por ${coachName} (${personality.shortTag}) para desbancar o titular de início.`;
    } else if (personality.id === 'doutrinador_autoral') {
      lockerRoomSpeech = `"${coachName}: 'Observe a movimentação deles do banco no primeiro tempo. Aos 60 minutos você entra para explorar o setor que eu identificar como ponto fraco!'"`;
      tacticalExplanation = `O treinador optou por iniciar com ${competitorName} (${competitorOvr} OVR). Sua moral atual (${effectiveTrust}%) ainda está abaixo dos ${requiredTrust}% exigidos por ${coachName} (${personality.shortTag}) para desbancar o titular de início.`;
    } else {
      lockerRoomSpeech = `"${coachName}: 'Fique atento ao meu olhar no banco. Aos 60 minutos eu te chamo para resolver o jogo no mano a mano!'"`;
      tacticalExplanation = `O treinador optou por iniciar com ${competitorName} (${competitorOvr} OVR). Sua moral atual (${effectiveTrust}%) ainda está abaixo dos ${requiredTrust}% exigidos por ${coachName} (${personality.shortTag}) para desbancar o titular de início.`;
    }
  }
  // CASO 4: Não Utilizado / Poupado por Falta de Confiança ou Desgaste Leve
  else {
    assignedRole = 'rest_full';
    assignedRoleLabel = 'Poupado / Banco Sem Minutagem (Decisão do Técnico)';
    lockerRoomSpeech = `"${coachName}: 'Sua moral no dia a dia (${effectiveTrust}%) está longe do que exijo da minha equipe. Hoje você assiste a partida do banco/tribuna e repensa sua entrega nos treinamentos.'"`;
    tacticalExplanation = `O treinador barrou sua entrada nesta partida por falta de confiança e comprometimento tático.`;
  }

  return {
    assignedRole,
    assignedRoleLabel,
    coachName,
    personality,
    coachTrustLevel: trustLevel,
    requiredTrustForStarting: requiredTrust,
    isStartingAllowed: meetsTrustRequirement && energy >= 65,
    coachLockerRoomSpeech: lockerRoomSpeech,
    tacticalExplanation,
    factors: {
      trustFactor: {
        value: trustLevel,
        required: requiredTrust,
        met: meetsTrustRequirement,
        text: `Confiança com ${coachName}: ${trustLevel}% (Exigência deste técnico: ${requiredTrust}%)`
      },
      competitorFactor: {
        name: topCompetitor?.name || 'Titular',
        ovr: topCompetitor?.ovr || 78,
        playerOvr: player.ovr,
        text: `Disputa direta com ${topCompetitor?.name || 'Titular'} (${topCompetitor?.ovr || 78} OVR vs seus ${player.ovr} OVR)`
      },
      physioFactor: {
        energy,
        isFit: energy >= 65,
        text: `Energia física: ${energy}% (${energy >= 65 ? 'Liberado para 90 min' : 'Gestão de carga ativada'})`
      },
      trainingFactor: {
        completed: !!player.lastTrainingResult,
        impactText: trainingText
      },
      conductFactor: {
        persona: player.lifestylePersonaLabel || 'Profissional',
        impactText: conductText
      }
    }
  };
}
