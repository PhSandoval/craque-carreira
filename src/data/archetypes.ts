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
      pace: +8,
      finalization: +4,
      defense: -10,
      physical: -4
    },
    tags: ['driblador', 'habilidoso', 'ousado']
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
  }
];

export function getArchetypesForPosition(position: Position): PlayerArchetype[] {
  const matches = PLAYER_ARCHETYPES.filter(a => a.positions.includes(position));
  return matches.length > 0 ? matches : [PLAYER_ARCHETYPES[0]];
}
