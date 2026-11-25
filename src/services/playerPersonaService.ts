import { PlayerProfile, MemoryEvent } from '../types';

export interface DecisionStyleProfile {
  styleName: string;
  styleBadge: string;
  tagline: string;
  tendencies: {
    boldness: number;    // % 0-100 (Ousadia & Finalização Direta / Dribles)
    teamwork: number;    // % 0-100 (Visão Coletiva & Garçom / Passes-Chave)
    tactical: number;    // % 0-100 (Controle Tático & Disciplina / Retenção)
  };
  metrics: {
    label: string;
    value: string;
    subtext: string;
    icon: string;
    color: string;
  }[];
  psychologicalReport: {
    pitchAnalysis: string;
    mediaAnalysis: string;
    coachPerception: string;
    fansPerception: string;
    tacticalAdvice: string;
  };
  recentKeyDecisions: {
    date: string;
    category: 'match' | 'interview' | 'training' | 'milestone';
    categoryLabel: string;
    title: string;
    detail: string;
    styleBadge: string;
    badgeColor: string;
  }[];
}

/**
 * Analisa todo o histórico do jogador (memórias, escolhas em lances, coletivas, treinos e atributos)
 * e gera um raio-x profundo do seu "Estilo de Escolhas" & Perfil Decisório.
 */
export function analyzePlayerDecisionProfile(player: PlayerProfile): DecisionStyleProfile {
  const memories = player.memories || [];

  // 1. Pontuação de Ousadia (Finalização, Drible, Arremates de efeito, Inflamar Torcida)
  let boldnessScore = (player.attributes.finalization * 1.4) + (player.attributes.dribbling * 1.2) + (player.attributes.pace * 0.8);
  
  // 2. Pontuação Coletiva (Passes, Visão, Assistências, Blindagem de Vestiário)
  let teamworkScore = (player.attributes.passing * 1.5) + (player.attributes.vision * 1.5) + (player.relationships.teammates || 70) * 0.4;
  
  // 3. Pontuação Tática (Posicionamento, Físico, Defesa, Disciplina com Técnico, Serenidade)
  let tacticalScore = (player.attributes.defense * 1.3) + (player.attributes.physical * 1.0) + (player.relationships.coach * 0.6);

  // Considera gols e assistências da carreira e temporada
  const totalGoals = (player.currentSeasonStats?.goals || 0) + player.history.reduce((a, b) => a + (b.goals || 0), 0);
  const totalAssists = (player.currentSeasonStats?.assists || 0) + player.history.reduce((a, b) => a + (b.assists || 0), 0);

  boldnessScore += totalGoals * 8;
  teamworkScore += totalAssists * 10;

  // Analisa tags acumuladas em todas as memórias e decisões do jogador
  for (const mem of memories) {
    const tags = mem.tags || [];
    const tLower = tags.map(t => t.toLowerCase());
    const descLower = (mem.description + ' ' + mem.title).toLowerCase();

    // Tags de Ousadia
    if (
      tLower.includes('escolha_ousadia') ||
      tLower.includes('gols') ||
      tLower.includes('drible') ||
      tLower.includes('artilheiro') ||
      tLower.includes('magia') ||
      tLower.includes('viral') ||
      tLower.includes('postura_torcida') ||
      descLower.includes('chute') ||
      descLower.includes('drible da vaca') ||
      descLower.includes('angulo')
    ) {
      boldnessScore += 18;
    }

    // Tags de Jogo Coletivo
    if (
      tLower.includes('escolha_coletiva') ||
      tLower.includes('assistencia') ||
      tLower.includes('garcom') ||
      tLower.includes('passe') ||
      tLower.includes('lealdade') ||
      tLower.includes('coletiva') ||
      tLower.includes('postura_coletiva') ||
      descLower.includes('passe de calcanhar') ||
      descLower.includes('enfiada') ||
      descLower.includes('serviu o companheiro')
    ) {
      teamworkScore += 18;
    }

    // Tags de Disciplina Tática
    if (
      tLower.includes('escolha_tatica') ||
      tLower.includes('tatica') ||
      tLower.includes('disciplina') ||
      tLower.includes('posse') ||
      tLower.includes('frio') ||
      tLower.includes('postura_foco') ||
      tLower.includes('postura_profissional') ||
      descLower.includes('domina no peito') ||
      descLower.includes('recua a posse') ||
      descLower.includes('cava a falta') ||
      descLower.includes('seguranca')
    ) {
      tacticalScore += 18;
    }
  }

  // Se o jogador tiver alta idolatria com a torcida, ganha leve traço de apelo audacioso
  if (player.relationships.fans >= 80) boldnessScore += 15;
  // Se tiver alta confiança do técnico, ganha bônus de disciplina tática
  if (player.relationships.coach >= 80) tacticalScore += 15;

  // Normalização para 100%
  const total = Math.max(1, boldnessScore + teamworkScore + tacticalScore);
  const boldness = Math.round((boldnessScore / total) * 100);
  const teamwork = Math.round((teamworkScore / total) * 100);
  const tactical = Math.max(0, 100 - boldness - teamwork);

  // Determinação do Arquétipo de Decisão Predominante
  let styleName = 'Craque Equilibrado & Polivalente';
  let styleBadge = '⭐ Camisa 10 Total';
  let tagline = 'Alterna com lucidez entre finalização, criação e controle de ritmo segundo a exigência do lance.';

  if (player.relationships.fans >= 85 && boldness >= 38) {
    styleName = 'Ídolo Passional das Arquibancadas';
    styleBadge = '👑 Voz da Torcida';
    tagline = 'Joga com o coração nas pontas dos dedos: toma decisões audazes e incendeia o estádio a cada toque.';
  } else if (player.relationships.coach >= 85 && tactical >= 38) {
    styleName = 'Homem de Confiança do Comandante';
    styleBadge = '📋 Soldado da Prancheta';
    tagline = 'Obedece com disciplina ao plano de jogo, valoriza a posse e é a segurança tática da equipe em campo.';
  } else if (boldness >= 42 && boldness >= teamwork && boldness >= tactical) {
    styleName = 'Protagonista Audacioso & Letal';
    styleBadge = '⚡ Ousadia & Fogo';
    tagline = 'Chama a responsabilidade individual nos momentos de aperto; prefere arriscar o drible ou o chute no ângulo.';
  } else if (teamwork >= 38 && teamwork >= boldness && teamwork >= tactical) {
    styleName = 'Maestro Solidário & Garçom';
    styleBadge = '🎯 Cérebro Associativo';
    tagline = 'Prioriza sempre o companheiro melhor posicionado e valoriza a vitória do grupo acima de glórias pessoais.';
  } else if (tactical >= 38 && tactical >= boldness && tactical >= teamwork) {
    styleName = 'Estrategista Frio & Cadenciador';
    styleBadge = '🛡️ Disciplina & Frieza';
    tagline = 'Não se precipita sob pressão, administra a posse nos minutos finais e dita a cadência dos 90 minutos.';
  }

  // Análise Psicológica detalhada
  let pitchAnalysis = '';
  if (boldness >= 40) {
    pitchAnalysis = `Nos momentos capitais na área adversária, seu instinto primário é o protagonismo direto. Ao receber a bola viva sob pressão, você tem preferido arriscar a finalização ao gol ou desmoralizar o marcador com dribles agudos, em vez de recuar o lance. Esse perfil atrai os holofotes e gera lances espetaculares.`;
  } else if (teamwork >= 38) {
    pitchAnalysis = `Você se destaca como um facilitador de jogo coletivo de alto nível. Quando a marcação aperta, sua leitura periférica busca imediatamente enfiadas de calcanhar, cruzamentos e inversões para alimentar seus companheiros. Você faz o ataque fluir e ganha o respeito do vestiário.`;
  } else {
    pitchAnalysis = `Sua tomada de decisão é pautada pela frieza e inteligência espacial. Não força jogadas suicidas: domina no peito para reter a posse, sabe cavar faltas para esfriar investidas rivais e cumpre com rigor os pedidos táticos da comissão técnica.`;
  }

  let mediaAnalysis = '';
  if (player.relationships.fans > player.relationships.coach + 8) {
    mediaAnalysis = `Nas coletivas e entrevistas de zona mista, suas declarações priorizam a sintonia com a torcida e a emoção das arquibancadas, fortalecendo sua imagem como xodó popular e atração de público.`;
  } else if (player.relationships.coach > player.relationships.fans + 8) {
    mediaAnalysis = `Perante a imprensa, seu discurso é blindado e focado no plano coletivo da comissão técnica, demonstrando respeito à hierarquia do clube e foco irrestrito na evolução nos treinos.`;
  } else {
    mediaAnalysis = `Você demonstra maturidade comunicativa perante os microfones: divide os louros com os companheiros nos triunfos e assume responsabilidades nas derrotas, transmitindo solidez de líder.`;
  }

  const coachPerception = player.relationships.coach >= 75
    ? `O treinador tem confiança irrestrita na sua maturidade tática e enxerga você como o pilar da equipe (${player.relationships.coach}% de prestígio).`
    : player.relationships.coach >= 50
    ? `A comissão técnica elogia seu potencial, mas cobra equilíbrio contínuo nas decisões para garantir a titularidade (${player.relationships.coach}% de prestígio).`
    : `O técnico exige maior obediência às orientações táticas e menos jogadas precipitadas (${player.relationships.coach}% de prestígio).`;

  const fansPerception = player.relationships.fans >= 80
    ? `A torcida trata você como ídolo e delira a cada lance ousado e declaração apaixonada (${player.relationships.fans}% de aprovação popular).`
    : player.relationships.fans >= 55
    ? `Os torcedores reconhecem seu talento e apoiam seu crescimento na titularidade (${player.relationships.fans}% de aprovação popular).`
    : `A arquibancada espera maior vibração e atuações mais decisivas em momentos de pressão (${player.relationships.fans}% de aprovação popular).`;

  const tacticalAdvice = boldness > teamwork
    ? `Dica para evolução: Continue letal no terço final, mas busque dosar momentos de reter a posse para poupar energia física nos minutos finais.`
    : teamwork > tactical
    ? `Dica para evolução: Sua visão coletiva é impecável; não hesite em arriscar chutes diretos de fora da área quando a zaga adversária der espaço.`
    : `Dica para evolução: Seu controle de jogo é elogiável; adicione mais arrancadas verticais para pegar as linhas de marcação desbalanceadas.`;

  // Métricas do Raio-X Decisório
  const metrics = [
    {
      label: 'Índice de Ousadia',
      value: `${boldness}%`,
      subtext: boldness >= 40 ? 'Alta agressividade ofensiva' : 'Arremates seletivos',
      icon: '🔥',
      color: 'text-rose-400'
    },
    {
      label: 'Visão Coletiva',
      value: `${teamwork}%`,
      subtext: teamwork >= 38 ? 'Garçom & jogo associativo' : 'Foco em finalizações',
      icon: '🎯',
      color: 'text-sky-400'
    },
    {
      label: 'Controle Tático',
      value: `${tactical}%`,
      subtext: tactical >= 35 ? 'Frieza & proteção de posse' : 'Ritmo acelerado',
      icon: '🛡️',
      color: 'text-emerald-400'
    },
    {
      label: 'Sintonia Externa',
      value: player.relationships.fans >= player.relationships.coach ? 'Torcida' : 'Comissão',
      subtext: `${player.relationships.fans}% torcida • ${player.relationships.coach}% técnico`,
      icon: '⚖️',
      color: 'text-amber-400'
    }
  ];

  // Extrai as decisões mais marcantes registradas no histórico de memórias
  const recentKeyDecisions: DecisionStyleProfile['recentKeyDecisions'] = [];

  for (const mem of memories) {
    const tLower = (mem.tags || []).map(t => t.toLowerCase());
    let category: 'match' | 'interview' | 'training' | 'milestone' = 'match';
    let categoryLabel = 'Lance em Campo';
    let styleBadge = 'Equilíbrio';
    let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

    if (tLower.includes('entrevista') || tLower.includes('zonamista') || mem.category === 'controversy') {
      category = 'interview';
      categoryLabel = 'Zona Mista & Imprensa';
      if (tLower.includes('postura_coletiva') || tLower.includes('coletiva')) {
        styleBadge = 'Postura Coletiva';
        badgeColor = 'bg-sky-950 text-sky-300 border-sky-800';
      } else if (tLower.includes('postura_torcida') || tLower.includes('torcida')) {
        styleBadge = 'Apelo à Torcida';
        badgeColor = 'bg-rose-950 text-rose-300 border-rose-800';
      } else {
        styleBadge = 'Foco Profissional';
        badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-800';
      }
    } else if (tLower.includes('treino') || tLower.includes('posicao') || tLower.includes('arquetipo')) {
      category = 'training';
      categoryLabel = 'Treinos & Calendário';
      styleBadge = 'Evolução Tática';
      badgeColor = 'bg-purple-950 text-purple-300 border-purple-800';
    } else if (tLower.includes('escolha_ousadia') || tLower.includes('gols') || tLower.includes('drible')) {
      category = 'match';
      categoryLabel = 'Decisão de Jogo';
      styleBadge = 'Ousadia Individual';
      badgeColor = 'bg-rose-950 text-rose-300 border-rose-800';
    } else if (tLower.includes('escolha_coletiva') || tLower.includes('assistencia') || tLower.includes('garcom')) {
      category = 'match';
      categoryLabel = 'Decisão de Jogo';
      styleBadge = 'Visão Coletiva';
      badgeColor = 'bg-sky-950 text-sky-300 border-sky-800';
    } else if (tLower.includes('escolha_tatica') || tLower.includes('posse') || tLower.includes('falta')) {
      category = 'match';
      categoryLabel = 'Decisão de Jogo';
      styleBadge = 'Disciplina Tática';
      badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-800';
    } else if (mem.category === 'milestone') {
      category = 'milestone';
      categoryLabel = 'Marco de Carreira';
      styleBadge = 'Identidade';
      badgeColor = 'bg-amber-950 text-amber-300 border-amber-800';
    }

    recentKeyDecisions.push({
      date: mem.dateStr || `Ano ${mem.seasonYear}`,
      category,
      categoryLabel,
      title: mem.title,
      detail: mem.description,
      styleBadge,
      badgeColor
    });

    if (recentKeyDecisions.length >= 5) break;
  }

  return {
    styleName,
    styleBadge,
    tagline,
    tendencies: {
      boldness,
      teamwork,
      tactical
    },
    metrics,
    psychologicalReport: {
      pitchAnalysis,
      mediaAnalysis,
      coachPerception,
      fansPerception,
      tacticalAdvice
    },
    recentKeyDecisions
  };
}
