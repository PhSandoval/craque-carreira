import { PlayerProfile, Position, PlayerAttributes, MemoryEvent } from '../types';
import { createMemory } from './careerMemory';

/**
 * SERVIÇO DE ENVELHECIMENTO, EVOLUÇÃO E ADAPTAÇÃO TÁTICA DE POSIÇÃO
 * 
 * Regras Biomecânicas e de Tempo:
 * - Jovens (16 a 21 anos): Curva explosiva de desenvolvimento (+2 a +5 OVR/ano)
 * - Auge (22 a 28 anos): Força máxima e estabilidade (+0 a +2 OVR/ano)
 * - Maturidade (29 a 32 anos): Queda leve de sprint, ganho de visão de jogo
 * - Veteranos (33+ anos): Declínio físico acentuado (perda de velocidade e estamina)
 *   e convite para migrar para posições menos desgastantes (Ponta ➔ Meia/CA; Meia ➔ MC/Volante; Lateral ➔ Zagueiro/Volante).
 */

export interface PositionTransitionRecommendation {
  eligible: boolean;
  currentPosition: Position;
  currentPositionLabel: string;
  recommendedPosition: Position;
  recommendedPositionLabel: string;
  tacticalRoleName: string;
  coachAdvice: string;
  explanation: string;
  historicalPrecedents: string; // Ex: "Como Cristiano Ronaldo, Messi e Pirlo fizeram"
}

/**
 * Posições que exigem intensidade física e arranque extremo nas alas
 */
const PHYSICALLY_DEMANDING_POSITIONS: Position[] = ['PE', 'PD', 'LD', 'LE', 'MEI'];

/**
 * Mapeamento de transições naturais para prolongar carreiras de veteranos
 */
const POSITION_TRANSITIONS: Record<Position, { newPos: Position; label: string; role: string; precedent: string }> = {
  'PE': { 
    newPos: 'CA', 
    label: 'Centroavante / Segundo Atacante', 
    role: 'Artilheiro de Área & Finalizador Nato',
    precedent: 'Assim como Cristiano Ronaldo que começou como ponta veloz e migrou para a grande área.'
  },
  'PD': { 
    newPos: 'MEI', 
    label: 'Camisa 10 / Meia-Armador Central', 
    role: 'Cérebro da Equipe & Distribuidor de Bolas',
    precedent: 'Assim como Lionel Messi que recuou das pontas para reger o meio-campo com passes cirúrgicos.'
  },
  'MEI': { 
    newPos: 'MC', 
    label: 'Meio-Campista Distribuidor / Volante Maestro', 
    role: 'Regente Central / Saída de Bola Clássica',
    precedent: 'Assim como Andrea Pirlo, Luka Modrić e Toni Kroos que recuaram para jogar de cabeça erguida.'
  },
  'LD': { 
    newPos: 'ZAG', 
    label: 'Zagueiro Construtor / Líder de Defesa', 
    role: 'Zagueiro Técnico & Cobertura',
    precedent: 'Assim como Sergio Ramos e Carles Puyol que vieram da lateral para comandar a zaga central.'
  },
  'LE': { 
    newPos: 'VOL', 
    label: 'Primeiro Volante / Meio-Campista Defensivo', 
    role: 'Proteção de Zaga & Passe Qualificado',
    precedent: 'Assim como David Alaba e Philipp Lahm que prolongaram suas carreiras migrando para o meio.'
  },
  'ME': { 
    newPos: 'MC', 
    label: 'Meio-Campista Central', 
    role: 'Distribuição Central & Controle',
    precedent: 'Recuo da ala esquerda para a faixa central de criação.'
  },
  'MD': { 
    newPos: 'MC', 
    label: 'Meio-Campista Central', 
    role: 'Distribuição Central & Controle',
    precedent: 'Recuo da ala direita para a faixa central de criação.'
  },
  'MC': { newPos: 'VOL', label: 'Volante Posicional', role: 'Primeiro Combate & Organização', precedent: 'Recuo posicional clássico.' },
  'VOL': { newPos: 'ZAG', label: 'Zagueiro Central', role: 'Líbero / Defensor Construtor', precedent: 'Estilo Mascherano e Fernandinho.' },
  'CA': { newPos: 'CA', label: 'Centroavante Fixo / Pivô', role: 'Pivô Clássico de Área', precedent: 'Estilo Giroud e Lewandowski.' },
  'ZAG': { newPos: 'ZAG', label: 'Zagueiro Experiente', role: 'Liderança Aérea e Posicionamento', precedent: 'Estilo Thiago Silva.' },
  'GOL': { newPos: 'GOL', label: 'Goleiro Experiente', role: 'Paredão & Colocação', precedent: 'Estilo Fábio e Buffon.' }
};

/**
 * Avalia se o atleta veterano deve receber a proposta de adaptação tática de posição
 */
export function checkPositionTransitionOpportunity(player: PlayerProfile): PositionTransitionRecommendation {
  const age = player.age;
  const pos = player.position;

  // Elegível a partir dos 32 anos em posições de alto desgaste
  if (age >= 32 && PHYSICALLY_DEMANDING_POSITIONS.includes(pos)) {
    const trans = POSITION_TRANSITIONS[pos];
    if (trans && trans.newPos !== pos) {
      return {
        eligible: true,
        currentPosition: pos,
        currentPositionLabel: pos,
        recommendedPosition: trans.newPos,
        recommendedPositionLabel: trans.label,
        tacticalRoleName: trans.role,
        coachAdvice: `Você tem uma leitura de jogo impecável aos ${age} anos, mas a intensidade dos pontas e laterais de 19 anos é brutal. Recuar para ${trans.newPos} vai te dar mais tempo com a bola nos pés e prolongar sua carreira por mais 3 ou 4 temporadas em alto nível!`,
        explanation: `Ao mudar para ${trans.label}, sua perda de velocidade deixará de ser um problema e seu passe e visão de jogo se tornarão a principal arma do time.`,
        historicalPrecedents: trans.precedent
      };
    }
  }

  return {
    eligible: false,
    currentPosition: pos,
    currentPositionLabel: pos,
    recommendedPosition: pos,
    recommendedPositionLabel: pos,
    tacticalRoleName: 'Titular da Posição',
    coachAdvice: '',
    explanation: '',
    historicalPrecedents: ''
  };
}

/**
 * Aplica a transição de posição ao jogador
 */
export function applyPositionTransition(
  player: PlayerProfile,
  newPosition: Position
): PlayerProfile {
  const oldPos = player.position;
  const newAttrs: PlayerAttributes = { ...player.attributes };

  // Rebalanceamento biomecânico inteligente:
  // Alivia o peso da velocidade pura e potencializa visão e passe!
  if (newPosition === 'MC' || newPosition === 'VOL' || newPosition === 'MEI') {
    newAttrs.vision = Math.min(99, (newAttrs.vision || 70) + 4);
    newAttrs.passing = Math.min(99, (newAttrs.passing || 70) + 3);
  } else if (newPosition === 'CA') {
    newAttrs.finalization = Math.min(99, (newAttrs.finalization || 70) + 4);
    newAttrs.physical = Math.min(99, (newAttrs.physical || 70) + 2);
  } else if (newPosition === 'ZAG') {
    newAttrs.defense = Math.min(99, (newAttrs.defense || 70) + 5);
    newAttrs.physical = Math.min(99, (newAttrs.physical || 70) + 3);
  }

  // Recalcula o OVR adaptado à nova função
  const recalculatedOvr = Math.round(
    (newAttrs.finalization + newAttrs.passing + newAttrs.dribbling + newAttrs.pace + newAttrs.defense + newAttrs.physical + newAttrs.vision) / 7
  );

  const transitionMemory = createMemory(player, {
    title: `Transição de Posição aos ${player.age} anos: de ${oldPos} para ${newPosition}`,
    description: `Decidiu conscientemente reinventar seu futebol aos ${player.age} anos, migrando da posição ${oldPos} para ${newPosition} para ditar o ritmo de jogo com sua experiência e visão tática.`,
    category: 'milestone',
    impactSummary: `Adaptação elogiada por comentaristas esportivos como demonstração de inteligência e longevidade.`,
    tags: ['reinvecao', 'posicao', newPosition.toLowerCase(), 'longevidade'],
    importance: 'alta'
  });

  return {
    ...player,
    position: newPosition,
    ovr: recalculatedOvr,
    attributes: newAttrs,
    memories: [transitionMemory, ...(player.memories || [])]
  };
}

/**
 * Calcula a evolução anual baseada na idade e no rendimento da temporada
 */
export function calculatePlayerYearlyProgression(
  player: PlayerProfile,
  seasonAverageRating: number
): {
  newOvr: number;
  newAttributes: PlayerAttributes;
  progressionSummary: string;
  ageCategory: 'jovem' | 'auge' | 'maturidade' | 'veterano';
} {
  const age = player.age + 1; // Idade após a virada
  let attrs = { ...player.attributes };
  let ovrDelta = 0;
  let summary = '';
  let category: 'jovem' | 'auge' | 'maturidade' | 'veterano' = 'auge';

  const isGoodSeason = seasonAverageRating >= 7.0;
  const isMasterclassSeason = seasonAverageRating >= 7.8;

  // 1. FASE JOVEM PROMESSA (16 a 21 anos) - Desenvolvimento Acelerado!
  if (age <= 21) {
    category = 'jovem';
    const boost = isMasterclassSeason ? 4 : isGoodSeason ? 3 : 2;
    ovrDelta = boost;

    attrs.pace = Math.min(99, attrs.pace + 2);
    attrs.dribbling = Math.min(99, attrs.dribbling + 3);
    attrs.finalization = Math.min(99, attrs.finalization + 2);
    attrs.passing = Math.min(99, attrs.passing + 2);
    attrs.physical = Math.min(99, attrs.physical + 2);
    attrs.vision = Math.min(99, attrs.vision + 2);

    summary = `Fase de explosão biológica aos ${age} anos! Seu desenvolvimento foi acelerado (+${ovrDelta} OVR), com ganhos notáveis em arranque, drible e resistência física.`;
  }
  // 2. FASE DO AUGE DA CARREIRA (22 a 28 anos) - Força Máxima
  else if (age <= 28) {
    category = 'auge';
    ovrDelta = isMasterclassSeason ? 2 : isGoodSeason ? 1 : 0;

    attrs.passing = Math.min(99, attrs.passing + 1);
    attrs.finalization = Math.min(99, attrs.finalization + 1);
    attrs.vision = Math.min(99, attrs.vision + 1);

    summary = `No auge físico e maturidade técnica da carreira aos ${age} anos (+${ovrDelta} OVR). Estabilidade de elite em todos os fundamentos.`;
  }
  // 3. FASE DE MATURIDADE (29 a 32 anos) - Leve desaceleração de sprint, alta visão
  else if (age <= 32) {
    category = 'maturidade';
    ovrDelta = isMasterclassSeason ? 1 : 0;

    attrs.pace = Math.max(40, attrs.pace - 1);
    attrs.vision = Math.min(99, attrs.vision + 2);
    attrs.passing = Math.min(99, attrs.passing + 1);

    summary = `Maturidade tática aos ${age} anos. Pequena perda natural de velocidade pura (-1), compensada com visão periférica aguçada e passes milimétricos.`;
  }
  // 4. FASE VETERANO (33+ anos) - Declínio Físico Realista
  else {
    category = 'veterano';
    ovrDelta = isMasterclassSeason ? 0 : -1;

    attrs.pace = Math.max(35, attrs.pace - 3);
    attrs.physical = Math.max(45, attrs.physical - 2);
    attrs.vision = Math.min(99, attrs.vision + 1);
    attrs.passing = Math.min(99, attrs.passing + 1);

    summary = `Veterano consagrado aos ${age} anos. O declínio físico se acentua (-3 Velocidade, -2 Físico), mas a inteligência com a bola permanece intacta.`;
  }

  const calculatedOvr = Math.min(99, Math.max(50, player.ovr + ovrDelta));

  return {
    newOvr: calculatedOvr,
    newAttributes: attrs,
    progressionSummary: summary,
    ageCategory: category
  };
}
