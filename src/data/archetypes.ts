import { Position, PlayerAttributes } from '../types';

export interface PlayerArchetype {
  id: string;
  name: string;
  description: string;
  pros: string;
  cons: string;
  positions: Position[];
  attributeModifiers: Partial<PlayerAttributes>;
  tags: string[];
}

export const PLAYER_ARCHETYPES: PlayerArchetype[] = [
  // ==========================================
  // LATERAIS (LE, LD)
  // ==========================================
  {
    id: 'lateral_ofensivo',
    name: 'Lateral / Ala Ofensivo',
    description: 'Apoia o ataque a todo instante, busca a linha de fundo e finaliza.',
    pros: 'Mais gols, assistências e cruzamentos perigosos no ataque.',
    cons: 'Deixa as costas desprotegidas e sofre mais com contra-ataques.',
    positions: ['LE', 'LD'],
    attributeModifiers: {
      pace: +6,
      dribbling: +5,
      passing: +6,
      finalization: +6,
      defense: -10,
      physical: -2
    },
    tags: ['ultraofensivo', 'ala', 'cruzamento']
  },
  {
    id: 'lateral_defensivo',
    name: 'Lateral Defensivo / Construtor',
    description: 'Prioriza fechar a linha de 4 zagueiros, desarme firme e saída com passes seguros.',
    pros: 'Muralha defensiva nos duelos 1 contra 1 e poucas falhas atrás.',
    cons: 'Raramente pisa na área adversária para fazer gols.',
    positions: ['LE', 'LD'],
    attributeModifiers: {
      defense: +10,
      physical: +6,
      passing: +3,
      finalization: -12,
      dribbling: -4
    },
    tags: ['marcador', 'solido', 'equilibrado']
  },

  // ==========================================
  // MEIAS (MEI, MC, ME, MD)
  // ==========================================
  {
    id: 'camisa_10_maestro',
    name: 'Camisa 10 Clássico (Maestro)',
    description: 'O cérebro da equipe. Dita o ritmo, distribui passes milimétricos e bate faltas com veneno.',
    pros: 'Chuva de assistências e visão de jogo extraordinária.',
    cons: 'Baixa intensidade física e pouca contribuição defensiva.',
    positions: ['MEI', 'MC', 'ME', 'MD'],
    attributeModifiers: {
      vision: +12,
      passing: +10,
      finalization: +4,
      pace: -6,
      defense: -8,
      physical: -4
    },
    tags: ['maestro', 'cerebro', 'criativo']
  },
  {
    id: 'meia_infiltrador',
    name: 'Meia-Atacante Infiltrador',
    description: 'Aparece como elemento surpresa na grande área para empurrar pro gol.',
    pros: 'Alto número de gols por temporada e agressividade no último terço.',
    cons: 'Cria menos jogadas para os companheiros.',
    positions: ['MEI', 'MC'],
    attributeModifiers: {
      finalization: +10,
      pace: +6,
      dribbling: +4,
      vision: -4,
      defense: -6
    },
    tags: ['artilheiro', 'infiltrador', 'ofensivo']
  },
  {
    id: 'box_to_box',
    name: 'Motorzinho (Box-to-Box)',
    description: 'Corre de área a área durante os 90 minutos, desarmando na defesa e apoiando na frente.',
    pros: 'Fôlego infinito, muita imposição física e regularidade nas notas.',
    cons: 'Menos refino técnico para passes de ruptura.',
    positions: ['MC', 'ME', 'MD', 'VOL'],
    attributeModifiers: {
      physical: +10,
      pace: +5,
      defense: +5,
      passing: +4,
      finalization: -4
    },
    tags: ['raca', 'motorzinho', 'incansavel']
  },

  // ==========================================
  // ATACANTES (CA, PE, PD)
  // ==========================================
  {
    id: 'ponta_driblador',
    name: 'Ponta Driblador (1v1)',
    description: 'Habilidade desconcertante, parte pra cima no mano a mano e entorta laterais.',
    pros: 'Gera expulsões, pênaltis, faltas e lances de plástico.',
    cons: 'Às vezes prende demais a bola e pode sofrer com desarmes.',
    positions: ['PE', 'PD'],
    attributeModifiers: {
      dribbling: +12,
      pace: +6,
      finalization: +4,
      defense: -10,
      physical: -4
    },
    tags: ['driblador', 'habilidoso', 'ousado']
  },
  {
    id: 'ponta_velocista',
    name: 'Ponta Velocista (Flecha / Facão)',
    description: 'Explosão pura em velocidade máxima e diagonais em profundidade nas costas da zaga.',
    pros: 'Letal em contra-ataques e infiltrações rápidas na área.',
    cons: 'Sofre mais em jogos contra defesas muito recuadas sem espaço.',
    positions: ['PE', 'PD'],
    attributeModifiers: {
      pace: +14,
      finalization: +8,
      physical: +4,
      dribbling: +2,
      passing: -4,
      vision: -4
    },
    tags: ['velocista', 'contra_ataque', 'vertical']
  },
  {
    id: 'centroavante_matador',
    name: 'Centroavante Matador (Homem de Área)',
    description: 'O 9 clássico. Qualquer sobra dentro da área é rede, seja de perna boa, ruim ou cabeça.',
    pros: 'Taxa de conversão altíssima, artilharia garantida.',
    cons: 'Pouca mobilidade fora da grande área e baixo número de passes.',
    positions: ['CA'],
    attributeModifiers: {
      finalization: +14,
      physical: +6,
      passing: -8,
      dribbling: -4,
      defense: -12
    },
    tags: ['matador', 'artilheiro', 'frio']
  },
  {
    id: 'falso_nove',
    name: 'Falso 9 Associativo',
    description: 'Sai da área para dialogar com os pontas e meias, abrindo clarões na zaga adversária.',
    pros: 'Muitos gols e assistências combinados, fluidez ofensiva.',
    cons: 'Menor presença física no confronto direto contra zagueiros altos.',
    positions: ['CA', 'MEI'],
    attributeModifiers: {
      vision: +8,
      passing: +8,
      dribbling: +6,
      finalization: +2,
      physical: -6
    },
    tags: ['inteligente', 'falso9', 'garcom']
  },

  // ==========================================
  // VOLANTES & ZAGUEIROS (VOL, ZAG)
  // ==========================================
  {
    id: 'cao_de_guarda',
    name: 'Primeiro Volante (Cão de Guarda)',
    description: 'Varredor à frente da zaga, morde a todo momento e impõe respeito com desarmes.',
    pros: 'Desarma tudo, desarma contra-ataques e protege a zaga.',
    cons: 'Risco frequente de cartões e menor chegada ao ataque.',
    positions: ['VOL'],
    attributeModifiers: {
      defense: +12,
      physical: +10,
      passing: +2,
      finalization: -15,
      dribbling: -6
    },
    tags: ['xerife', 'pitbull', 'raca']
  },
  {
    id: 'volante_construtor',
    name: 'Volante Construtor (Regista)',
    description: 'Recebe entre os zagueiros e organiza toda a saída de bola com passes verticais e visão.',
    pros: 'Controla o ritmo do time e quebra linhas com lançamentos.',
    cons: 'Menor pegada física nos choques mais duros de meio-campo.',
    positions: ['VOL'],
    attributeModifiers: {
      passing: +12,
      vision: +10,
      dribbling: +4,
      defense: +2,
      physical: -4,
      finalization: -4
    },
    tags: ['regista', 'saida_de_bola', 'cerebral']
  },
  {
    id: 'zagueiro_xerife',
    name: 'Zagueiro Xerife (Imposição & Bola Aérea)',
    description: 'Líder nato na defesa, soberano nas disputas de cabeça e divididas fortes.',
    pros: 'Gols de cabeça em escanteios e trava quase todos os atacantes.',
    cons: 'Dificuldade contra atacantes baixos e muito velozes em campo aberto.',
    positions: ['ZAG'],
    attributeModifiers: {
      defense: +14,
      physical: +10,
      passing: -4,
      pace: -4,
      finalization: -10
    },
    tags: ['xerife', 'muralha', 'lider']
  },
  {
    id: 'zagueiro_construtor',
    name: 'Zagueiro Construtor (Passes Longos)',
    description: 'Inicia as jogadas desde trás com lançamentos precisos quebrando linhas.',
    pros: 'Começa contra-ataques e acha companheiros em profundidade.',
    cons: 'Pode se expor em desarmes arriscados na saída de bola.',
    positions: ['ZAG'],
    attributeModifiers: {
      passing: +10,
      vision: +8,
      defense: +6,
      physical: +2,
      finalization: -8
    },
    tags: ['armador_recuado', 'tecnico', 'elegante']
  },

  // ==========================================
  // GOLEIRO (GOL)
  // ==========================================
  {
    id: 'goleiro_paredao',
    name: 'Goleiro Paredão (Debaixo das Traves)',
    description: 'Reflexos assustadores em chutes à queima-roupa e segurança nas finalizações rivais.',
    pros: 'Operador de milagres e notas altíssimas em defesas difíceis.',
    cons: 'Menor agilidade saindo da área para cortar bolas longas.',
    positions: ['GOL'],
    attributeModifiers: {
      defense: +15,
      physical: +8,
      passing: -6,
      pace: -8
    },
    tags: ['paredao', 'milagreiro']
  },
  {
    id: 'goleiro_libero',
    name: 'Goleiro Líbero (Jogo com os Pés)',
    description: 'Sai rápido da meta para antecipar enfiadas e participa da saída de bola como um zagueiro.',
    pros: 'Lançamentos precisos para contra-ataques e cobertura agressiva.',
    cons: 'Assume maior risco em bolas alçadas e saídas divididas.',
    positions: ['GOL'],
    attributeModifiers: {
      passing: +12,
      vision: +10,
      pace: +8,
      defense: +4
    },
    tags: ['libero', 'saida_com_pes', 'moderno']
  }
];

export type CoreAttributeKey =
  | 'finalization'
  | 'passing'
  | 'dribbling'
  | 'pace'
  | 'defense'
  | 'physical'
  | 'vision';

export const CORE_ATTRIBUTE_LABELS: Record<CoreAttributeKey, { label: string; short: string; color: string }> = {
  finalization: { label: 'Finalização', short: 'FIN', color: '#f43f5e' },
  passing: { label: 'Passe', short: 'PAS', color: '#38bdf8' },
  dribbling: { label: 'Drible', short: 'DRI', color: '#a855f7' },
  pace: { label: 'Velocidade', short: 'VEL', color: '#f59e0b' },
  defense: { label: 'Defesa / Reflexos', short: 'DEF', color: '#10b981' },
  physical: { label: 'Físico', short: 'FIS', color: '#fb923c' },
  vision: { label: 'Visão de Jogo', short: 'VIS', color: '#22d3ee' }
};

export function getPositionBaseAttributes(position: Position): Record<CoreAttributeKey, number> {
  switch (position) {
    case 'GOL':
      return { finalization: 32, passing: 56, dribbling: 40, pace: 50, defense: 66, physical: 62, vision: 56 };
    case 'ZAG':
      return { finalization: 44, passing: 56, dribbling: 48, pace: 58, defense: 66, physical: 65, vision: 54 };
    case 'LE':
    case 'LD':
      return { finalization: 54, passing: 60, dribbling: 60, pace: 65, defense: 60, physical: 60, vision: 57 };
    case 'VOL':
      return { finalization: 50, passing: 62, dribbling: 56, pace: 58, defense: 64, physical: 64, vision: 60 };
    case 'MC':
    case 'ME':
    case 'MD':
      return { finalization: 58, passing: 64, dribbling: 62, pace: 61, defense: 55, physical: 60, vision: 63 };
    case 'MEI':
      return { finalization: 61, passing: 64, dribbling: 64, pace: 61, defense: 45, physical: 56, vision: 65 };
    case 'PE':
    case 'PD':
      return { finalization: 62, passing: 58, dribbling: 65, pace: 66, defense: 40, physical: 56, vision: 59 };
    case 'CA':
    default:
      return { finalization: 66, passing: 55, dribbling: 60, pace: 62, defense: 38, physical: 62, vision: 56 };
  }
}

export function getArchetypesForPosition(position: Position): PlayerArchetype[] {
  const matches = PLAYER_ARCHETYPES.filter(a => a.positions.includes(position));
  return matches.length > 0 ? matches : [PLAYER_ARCHETYPES[0]];
}

export function deriveArchetypeFromAttributes(
  position: Position,
  attrs: Record<CoreAttributeKey, number>
): {
  archetype: PlayerArchetype;
  matchPct: number;
  dominantTraits: string[];
  reason: string;
} {
  const candidates = getArchetypesForPosition(position);
  const base = getPositionBaseAttributes(position);
  const keys = Object.keys(CORE_ATTRIBUTE_LABELS) as CoreAttributeKey[];

  const deltas: Record<CoreAttributeKey, number> = {
    finalization: attrs.finalization - base.finalization,
    passing: attrs.passing - base.passing,
    dribbling: attrs.dribbling - base.dribbling,
    pace: attrs.pace - base.pace,
    defense: attrs.defense - base.defense,
    physical: attrs.physical - base.physical,
    vision: attrs.vision - base.vision
  };

  let best = candidates[0];
  let bestScore = -Infinity;

  candidates.forEach(arch => {
    let score = 0;
    keys.forEach(k => {
      const mod = arch.attributeModifiers[k] || 0;
      const d = deltas[k];
      if (mod > 0) {
        score += d * mod * 1.3;
      } else if (mod < 0) {
        // Bônus leve por seguir o perfil esperado, penalidade se investir pesado no oposto
        score += d * mod * 0.4;
      }
    });
    if (score > bestScore) {
      bestScore = score;
      best = arch;
    }
  });

  const sortedByDelta = [...keys]
    .filter(k => deltas[k] > 0)
    .sort((a, b) => deltas[b] - deltas[a]);
  const topTraits = (sortedByDelta.length > 0
    ? sortedByDelta.slice(0, 3)
    : [...keys].sort((a, b) => attrs[b] - attrs[a]).slice(0, 3)
  ).map(k => CORE_ATTRIBUTE_LABELS[k].label);

  const matchPct = Math.min(99, Math.max(68, Math.round(74 + Math.max(0, bestScore) * 0.14)));
  const reason =
    sortedByDelta.length > 0
      ? `Sua distribuição destacou ${topTraits.join(', ')}, encaixando perfeitamente no perfil "${best.name}".`
      : `Equilíbrio técnico natural na posição ${position} com foco em ${topTraits.join(', ')}.`;

  return {
    archetype: best,
    matchPct,
    dominantTraits: topTraits,
    reason
  };
}

export function getSuggestedPointsForArchetype(
  position: Position,
  archetype: PlayerArchetype,
  totalPoints = 28
): Record<CoreAttributeKey, number> {
  const keys = Object.keys(CORE_ATTRIBUTE_LABELS) as CoreAttributeKey[];
  const pts: Record<CoreAttributeKey, number> = {
    finalization: 0,
    passing: 0,
    dribbling: 0,
    pace: 0,
    defense: 0,
    physical: 0,
    vision: 0
  };
  const positiveWeights = keys
    .map(k => ({ key: k, weight: Math.max(1, (archetype.attributeModifiers[k] || 0) + (position === 'GOL' && k === 'defense' ? 6 : 2)) }))
    .filter(w => (archetype.attributeModifiers[w.key] || 0) >= 0);

  const totalWeight = positiveWeights.reduce((acc, w) => acc + w.weight, 0) || 1;
  let allocated = 0;
  positiveWeights.forEach((w, idx) => {
    const share = idx === positiveWeights.length - 1
      ? Math.max(0, totalPoints - allocated)
      : Math.min(18, Math.round((w.weight / totalWeight) * totalPoints));
    const clamped = Math.min(totalPoints - allocated, share);
    pts[w.key] = clamped;
    allocated += clamped;
  });

  if (allocated < totalPoints && positiveWeights[0]) {
    pts[positiveWeights[0].key] += totalPoints - allocated;
  }
  return pts;
}
