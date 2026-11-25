import { PlayerAttributes, Position } from '../types';

/**
 * SERVIÇO DE ATRIBUTOS REAIS DO FOOTBALL MANAGER (FM)
 * 
 * Modela os 3 grandes pilares clássicos do Football Manager:
 * 1. Atributos Técnicos (Finalização, Primeiro Toque, Passe, Drible, Cruzamento, Desarme, Marcação, Chute Longe, Cabeceio, Bola Parada, Pênalti)
 * 2. Atributos Mentais (Visão de Jogo, Compostura/Frieza, Decisões, Sem Bola/Desmarque, Posicionamento, Determinação, Bravura/Raça, Trabalho em Equipe, Antecipação, Concentração)
 * 3. Atributos Físicos (Aceleração, Velocidade, Resistência/Fôlego, Força, Agilidade, Equilíbrio, Impulsão)
 */

export interface FMAttributeMeta {
  key: keyof PlayerAttributes;
  label: string;
  shortLabel: string;
  category: 'technical' | 'mental' | 'physical';
  description: string;
}

export const FM_TECHNICAL_ATTRIBUTES: FMAttributeMeta[] = [
  { key: 'finishing', label: 'Finalização', shortLabel: 'Fin', category: 'technical', description: 'Capacidade de colocar a bola no fundo das redes na cara do gol.' },
  { key: 'firstTouch', label: 'Primeiro Toque', shortLabel: 'Dom', category: 'technical', description: 'Qualidade do domínio e controle imediato sob pressão.' },
  { key: 'passing', label: 'Passe', shortLabel: 'Pas', category: 'technical', description: 'Precisão e peso da bola em passes curtos e longos.' },
  { key: 'dribbling', label: 'Drible', shortLabel: 'Dri', category: 'technical', description: 'Habilidade para desequilibrar no um contra um e passar pelo marcador.' },
  { key: 'crossing', label: 'Cruzamentos', shortLabel: 'Cru', category: 'technical', description: 'Precisão de bolas alçadas das laterais para a grande área.' },
  { key: 'tackling', label: 'Desarme', shortLabel: 'Des', category: 'technical', description: 'Eficácia em roubar a bola no chão de forma limpa sem cometer falta.' },
  { key: 'marking', label: 'Marcação', shortLabel: 'Mar', category: 'technical', description: 'Capacidade de colar no adversário e anular suas movimentações.' },
  { key: 'longShots', label: 'Chutes de Longe', shortLabel: 'C.Lon', category: 'technical', description: 'Poder de fogo e perigo em finalizações de fora da grande área.' },
  { key: 'heading', label: 'Cabeceio', shortLabel: 'Cab', category: 'technical', description: 'Precisão e direção em cabeçadas ofensivas e defensivas.' },
  { key: 'freeKicks', label: 'Bolas Paradas', shortLabel: 'B.Par', category: 'technical', description: 'Cobranças perigosas e com efeito em faltas e escanteios.' },
  { key: 'penalties', label: 'Pênaltis', shortLabel: 'Pên', category: 'technical', description: 'Frieza e categoria na marca da cal.' }
];

export const FM_MENTAL_ATTRIBUTES: FMAttributeMeta[] = [
  { key: 'vision', label: 'Visão de Jogo', shortLabel: 'Vis', category: 'mental', description: 'Capacidade de enxergar linhas de passe e opções que outros não veem.' },
  { key: 'composure', label: 'Compostura / Frieza', shortLabel: 'Fri', category: 'mental', description: 'Serenidade mental sob marcação pesada e em momentos decisivos.' },
  { key: 'decisions', label: 'Tomada de Decisão', shortLabel: 'Dec', category: 'mental', description: 'Inteligência para escolher a jogada correta na fração de segundo certa.' },
  { key: 'offTheBall', label: 'Sem Bola / Desmarque', shortLabel: 'Desm', category: 'mental', description: 'Movimentação inteligente no ataque para receber livre.' },
  { key: 'positioning', label: 'Posicionamento Tático', shortLabel: 'Pos', category: 'mental', description: 'Leitura tática para estar exatamente no local correto na defesa.' },
  { key: 'determination', label: 'Determinação / Raça', shortLabel: 'Det', category: 'mental', description: 'Vontade de vencer, buscar viradas e lutar até o último minuto.' },
  { key: 'bravery', label: 'Bravura / Divididas', shortLabel: 'Bra', category: 'mental', description: 'Coragem para disputar bolas divididas ríspidas e arriscar o corpo.' },
  { key: 'teamwork', label: 'Trabalho em Equipe', shortLabel: 'Equ', category: 'mental', description: 'Dedicação ao coletivo, cumprimento tático e disciplina com o técnico.' },
  { key: 'anticipation', label: 'Antecipação', shortLabel: 'Ant', category: 'mental', description: 'Prever o movimento de companheiros e adversários antes de acontecer.' },
  { key: 'concentration', label: 'Concentração', shortLabel: 'Con', category: 'mental', description: 'Foco nos 90 minutos para evitar desatenção e erros fatais.' }
];

export const FM_PHYSICAL_ATTRIBUTES: FMAttributeMeta[] = [
  { key: 'acceleration', label: 'Aceleração', shortLabel: 'Ace', category: 'physical', description: 'Velocidade instantânea com que o atleta atinge seu sprint máximo.' },
  { key: 'pace', label: 'Velocidade de Ponta', shortLabel: 'Vel', category: 'physical', description: 'Velocidade máxima em corridas longas.' },
  { key: 'stamina', label: 'Resistência / Fôlego', shortLabel: 'Res', category: 'physical', description: 'Capacidade de sustentar intensidade física do minuto 1 ao 90.' },
  { key: 'strength', label: 'Força / Porte Físico', shortLabel: 'For', category: 'physical', description: 'Capacidade de usar o corpo para proteger a bola e ganhar divididas.' },
  { key: 'agility', label: 'Agilidade', shortLabel: 'Agi', category: 'physical', description: 'Facilidade para mudar de direção e rodar o corpo em espaço curto.' },
  { key: 'balance', label: 'Equilíbrio', shortLabel: 'Equi', category: 'physical', description: 'Sustentação do corpo sob tranco para não cair facilmente.' },
  { key: 'jumping', label: 'Impulsão Aérea', shortLabel: 'Imp', category: 'physical', description: 'Altura alcançada em saltos verticais.' }
];

/**
 * Garante que qualquer jogador (mesmo de saves antigos) tenha todos os atributos do Football Manager
 * preenchidos com valores harmônicos e realistas de acordo com sua posição!
 */
export function hydrateFMAttributes(
  rawAttrs: Partial<PlayerAttributes>,
  position: Position
): PlayerAttributes {
  const baseFinalization = rawAttrs.finalization ?? 65;
  const basePassing = rawAttrs.passing ?? 65;
  const baseDribbling = rawAttrs.dribbling ?? 65;
  const basePace = rawAttrs.pace ?? 68;
  const baseDefense = rawAttrs.defense ?? 50;
  const basePhysical = rawAttrs.physical ?? 60;
  const baseVision = rawAttrs.vision ?? 66;

  // Ajustes de posição
  const isDefender = ['ZAG', 'LE', 'LD'].includes(position);
  const isMidfielder = ['VOL', 'MC', 'MEI', 'ME', 'MD'].includes(position);
  const isAttacker = ['CA', 'PE', 'PD'].includes(position);
  const isFlank = ['LE', 'LD', 'PE', 'PD'].includes(position);

  const hydrated: PlayerAttributes = {
    // Principais
    finalization: baseFinalization,
    passing: basePassing,
    dribbling: baseDribbling,
    pace: basePace,
    defense: baseDefense,
    physical: basePhysical,
    vision: baseVision,

    // Técnicos
    finishing: rawAttrs.finishing ?? (isAttacker ? baseFinalization : Math.max(45, baseFinalization - 4)),
    firstTouch: rawAttrs.firstTouch ?? Math.round((baseDribbling + basePassing) / 2),
    crossing: rawAttrs.crossing ?? (isFlank ? Math.min(99, basePassing + 6) : Math.max(40, basePassing - 6)),
    tackling: rawAttrs.tackling ?? (isDefender ? Math.min(99, baseDefense + 4) : baseDefense),
    marking: rawAttrs.marking ?? (isDefender ? Math.min(99, baseDefense + 3) : Math.max(35, baseDefense - 5)),
    longShots: rawAttrs.longShots ?? Math.round((baseFinalization + basePhysical) / 2),
    heading: rawAttrs.heading ?? (position === 'ZAG' || position === 'CA' ? Math.min(99, basePhysical + 6) : Math.max(45, basePhysical - 6)),
    freeKicks: rawAttrs.freeKicks ?? (isMidfielder ? Math.min(99, basePassing + 4) : basePassing),
    penalties: rawAttrs.penalties ?? baseFinalization,

    // Mentais
    composure: rawAttrs.composure ?? baseVision,
    decisions: rawAttrs.decisions ?? baseVision,
    offTheBall: rawAttrs.offTheBall ?? (isAttacker ? Math.min(99, baseDribbling + 5) : baseVision),
    positioning: rawAttrs.positioning ?? (isDefender ? Math.min(99, baseDefense + 6) : baseVision),
    determination: rawAttrs.determination ?? 76,
    bravery: rawAttrs.bravery ?? basePhysical,
    teamwork: rawAttrs.teamwork ?? basePassing,
    anticipation: rawAttrs.anticipation ?? baseVision,
    concentration: rawAttrs.concentration ?? (isDefender ? 74 : 70),

    // Físicos
    acceleration: rawAttrs.acceleration ?? (isFlank ? Math.min(99, basePace + 4) : basePace),
    stamina: rawAttrs.stamina ?? basePhysical,
    strength: rawAttrs.strength ?? (position === 'ZAG' || position === 'CA' ? Math.min(99, basePhysical + 6) : basePhysical),
    agility: rawAttrs.agility ?? baseDribbling,
    balance: rawAttrs.balance ?? Math.round((basePhysical + baseDribbling) / 2),
    jumping: rawAttrs.jumping ?? (position === 'ZAG' || position === 'CA' ? Math.min(99, basePhysical + 5) : Math.max(45, basePhysical - 4))
  };

  return hydrated;
}

/**
 * Cores e badges no estilo Football Manager oficial
 */
export function getFMAttributeBadge(val: number): {
  colorClass: string;
  badgeBg: string;
  badgeBorder: string;
  tierLabel: string;
} {
  if (val >= 82) {
    return {
      colorClass: 'text-emerald-400 font-black',
      badgeBg: 'bg-emerald-500/20',
      badgeBorder: 'border-emerald-500/40',
      tierLabel: 'Elite'
    };
  }
  if (val >= 73) {
    return {
      colorClass: 'text-sky-300 font-bold',
      badgeBg: 'bg-sky-500/20',
      badgeBorder: 'border-sky-500/40',
      tierLabel: 'Muito Bom'
    };
  }
  if (val >= 64) {
    return {
      colorClass: 'text-amber-300 font-semibold',
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-500/40',
      tierLabel: 'Médio'
    };
  }
  return {
    colorClass: 'text-slate-400 font-medium',
    badgeBg: 'bg-slate-800/40',
    badgeBorder: 'border-slate-700/40',
    tierLabel: 'Básico'
  };
}
