import React from 'react';
import { Position, TacticalFormation } from '../types';

interface MatchPitchRadarProps {
  playerPosition: Position;
  playerNumber: number;
  playerSurname: string;
  ballCoords: { x: number; y: number }; // x: 0..100 (da esquerda p/ direita), y: 0..100 (de cima p/ baixo)
  isBallWithPlayer: boolean;
  homeTeamColor?: string;
  awayTeamColor?: string;
  homeFormation?: TacticalFormation;
  awayFormation?: TacticalFormation;
  homeTeamName?: string;
  awayTeamName?: string;
  isUserOnBench?: boolean;
  starterNameInPosition?: string;
}

interface FormationSlot {
  pos: Position;
  x: number; // 0..100
  y: number; // 0..100
  roleLabel: string;
}

/**
 * 11 posições rigorosamente calculadas para cada formação tática no futebol moderno.
 * Cada formação possui EXATAMENTE 11 jogadores de linha + goleiro.
 */
const FORMATION_TEMPLATES: Record<TacticalFormation, FormationSlot[]> = {
  // 4-3-3 clássico: 1 GOL, 4 defensores, 3 meias (1 vol, 2 meias), 2 pontas abertos e 1 CA
  '4-3-3': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'LE',  x: 28, y: 18, roleLabel: 'LE' },
    { pos: 'ZAG', x: 22, y: 36, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 22, y: 64, roleLabel: 'ZAG' },
    { pos: 'LD',  x: 28, y: 82, roleLabel: 'LD' },
    { pos: 'VOL', x: 40, y: 50, roleLabel: 'VOL' },
    { pos: 'MC',  x: 54, y: 34, roleLabel: 'MC' },
    { pos: 'MEI', x: 54, y: 66, roleLabel: 'MEI' },
    { pos: 'PE',  x: 74, y: 22, roleLabel: 'PE' },
    { pos: 'CA',  x: 84, y: 50, roleLabel: 'CA' },
    { pos: 'PD',  x: 74, y: 78, roleLabel: 'PD' }
  ],

  // 4-2-3-1 moderno: 1 GOL, 4 defensores, 2 volantes duplos, linha de 3 meias e 1 CA
  '4-2-3-1': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'LE',  x: 28, y: 18, roleLabel: 'LE' },
    { pos: 'ZAG', x: 22, y: 36, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 22, y: 64, roleLabel: 'ZAG' },
    { pos: 'LD',  x: 28, y: 82, roleLabel: 'LD' },
    { pos: 'VOL', x: 40, y: 38, roleLabel: 'VOL' },
    { pos: 'VOL', x: 40, y: 62, roleLabel: 'VOL' },
    { pos: 'PE',  x: 62, y: 20, roleLabel: 'PE' },
    { pos: 'MEI', x: 64, y: 50, roleLabel: 'MEI' },
    { pos: 'PD',  x: 62, y: 80, roleLabel: 'PD' },
    { pos: 'CA',  x: 84, y: 50, roleLabel: 'CA' }
  ],

  // 4-4-2 tradicional: 1 GOL, 4 defensores, 4 meias em linha, 2 atacantes
  '4-4-2': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'LE',  x: 28, y: 18, roleLabel: 'LE' },
    { pos: 'ZAG', x: 22, y: 36, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 22, y: 64, roleLabel: 'ZAG' },
    { pos: 'LD',  x: 28, y: 82, roleLabel: 'LD' },
    { pos: 'ME',  x: 50, y: 18, roleLabel: 'ME' },
    { pos: 'MC',  x: 48, y: 38, roleLabel: 'MC' },
    { pos: 'MC',  x: 48, y: 62, roleLabel: 'MC' },
    { pos: 'MD',  x: 50, y: 82, roleLabel: 'MD' },
    { pos: 'CA',  x: 82, y: 38, roleLabel: 'CA' },
    { pos: 'CA',  x: 82, y: 62, roleLabel: 'CA' }
  ],

  // 3-5-2 (Novorizontino, Inter de Milão): 3 zagueiros, 2 alas soltos, 3 meias centrais, 2 atacantes
  '3-5-2': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'ZAG', x: 20, y: 28, roleLabel: 'ZAG E' },
    { pos: 'ZAG', x: 18, y: 50, roleLabel: 'LÍBERO' },
    { pos: 'ZAG', x: 20, y: 72, roleLabel: 'ZAG D' },
    { pos: 'LE',  x: 38, y: 15, roleLabel: 'ALA E' },
    { pos: 'LD',  x: 38, y: 85, roleLabel: 'ALA D' },
    { pos: 'VOL', x: 38, y: 50, roleLabel: 'VOL' },
    { pos: 'MC',  x: 52, y: 36, roleLabel: 'MC' },
    { pos: 'MEI', x: 60, y: 50, roleLabel: 'MEI' },
    { pos: 'CA',  x: 82, y: 38, roleLabel: 'CA' },
    { pos: 'CA',  x: 82, y: 62, roleLabel: 'CA' }
  ],

  // 3-4-3 (Bayer Leverkusen, Sporting CP): 3 zagueiros, 4 no meio, 3 no ataque
  '3-4-3': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'ZAG', x: 20, y: 28, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 18, y: 50, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 20, y: 72, roleLabel: 'ZAG' },
    { pos: 'LE',  x: 44, y: 15, roleLabel: 'ALA E' },
    { pos: 'MC',  x: 46, y: 40, roleLabel: 'MC' },
    { pos: 'MC',  x: 46, y: 60, roleLabel: 'MC' },
    { pos: 'LD',  x: 44, y: 85, roleLabel: 'ALA D' },
    { pos: 'PE',  x: 74, y: 22, roleLabel: 'PE' },
    { pos: 'CA',  x: 84, y: 50, roleLabel: 'CA' },
    { pos: 'PD',  x: 74, y: 78, roleLabel: 'PD' }
  ],

  // 5-3-2 defensivo: linha de 5, 3 no meio, 2 na frente
  '5-3-2': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'LE',  x: 26, y: 14, roleLabel: 'LE' },
    { pos: 'ZAG', x: 20, y: 32, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 18, y: 50, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 20, y: 68, roleLabel: 'ZAG' },
    { pos: 'LD',  x: 26, y: 86, roleLabel: 'LD' },
    { pos: 'VOL', x: 40, y: 50, roleLabel: 'VOL' },
    { pos: 'MC',  x: 52, y: 36, roleLabel: 'MC' },
    { pos: 'MEI', x: 55, y: 64, roleLabel: 'MEI' },
    { pos: 'CA',  x: 80, y: 38, roleLabel: 'CA' },
    { pos: 'CA',  x: 80, y: 62, roleLabel: 'CA' }
  ],

  // 3-4-2-1 (Amorim, Alonso): 3 zagueiros, 2 alas, 2 meias centrais, 2 meias-atacantes entrelinhas e 1 CA
  '3-4-2-1': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'ZAG', x: 20, y: 28, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 18, y: 50, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 20, y: 72, roleLabel: 'ZAG' },
    { pos: 'LE',  x: 44, y: 15, roleLabel: 'ALA E' },
    { pos: 'MC',  x: 44, y: 40, roleLabel: 'MC' },
    { pos: 'MC',  x: 44, y: 60, roleLabel: 'MC' },
    { pos: 'LD',  x: 44, y: 85, roleLabel: 'ALA D' },
    { pos: 'MEI', x: 66, y: 32, roleLabel: 'MEI' },
    { pos: 'MEI', x: 66, y: 68, roleLabel: 'MEI' },
    { pos: 'CA',  x: 84, y: 50, roleLabel: 'CA' }
  ],

  // 4-4-1-1: 4 defensores, 4 meias em linha, 1 segundo atacante/meia e 1 centroavante
  '4-4-1-1': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'LE',  x: 28, y: 18, roleLabel: 'LE' },
    { pos: 'ZAG', x: 22, y: 36, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 22, y: 64, roleLabel: 'ZAG' },
    { pos: 'LD',  x: 28, y: 82, roleLabel: 'LD' },
    { pos: 'ME',  x: 50, y: 18, roleLabel: 'ME' },
    { pos: 'MC',  x: 48, y: 38, roleLabel: 'MC' },
    { pos: 'MC',  x: 48, y: 62, roleLabel: 'MC' },
    { pos: 'MD',  x: 50, y: 82, roleLabel: 'MD' },
    { pos: 'MEI', x: 68, y: 50, roleLabel: 'MEI' },
    { pos: 'CA',  x: 84, y: 50, roleLabel: 'CA' }
  ],

  // 3-4-1-2: 3 zagueiros, 2 alas, 2 volantes, 1 camisa 10 e 2 atacantes
  '3-4-1-2': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'ZAG', x: 20, y: 28, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 18, y: 50, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 20, y: 72, roleLabel: 'ZAG' },
    { pos: 'LE',  x: 44, y: 15, roleLabel: 'ALA E' },
    { pos: 'VOL', x: 44, y: 40, roleLabel: 'VOL' },
    { pos: 'VOL', x: 44, y: 60, roleLabel: 'VOL' },
    { pos: 'LD',  x: 44, y: 85, roleLabel: 'ALA D' },
    { pos: 'MEI', x: 64, y: 50, roleLabel: 'MEI' },
    { pos: 'CA',  x: 82, y: 38, roleLabel: 'CA' },
    { pos: 'CA',  x: 82, y: 62, roleLabel: 'CA' }
  ],

  // 4-1-4-1: 4 defensores, 1 primeiro volante fixo, 4 meias adiantados e 1 centroavante
  '4-1-4-1': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'LE',  x: 28, y: 18, roleLabel: 'LE' },
    { pos: 'ZAG', x: 22, y: 36, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 22, y: 64, roleLabel: 'ZAG' },
    { pos: 'LD',  x: 28, y: 82, roleLabel: 'LD' },
    { pos: 'VOL', x: 38, y: 50, roleLabel: 'VOL' },
    { pos: 'PE',  x: 60, y: 18, roleLabel: 'PE' },
    { pos: 'MC',  x: 58, y: 38, roleLabel: 'MC' },
    { pos: 'MC',  x: 58, y: 62, roleLabel: 'MC' },
    { pos: 'PD',  x: 60, y: 82, roleLabel: 'PD' },
    { pos: 'CA',  x: 84, y: 50, roleLabel: 'CA' }
  ],

  // 5-4-1 ferrolho: 5 defensores, 4 meias e 1 atacante de referência
  '5-4-1': [
    { pos: 'GOL', x: 8,  y: 50, roleLabel: 'GOL' },
    { pos: 'LE',  x: 26, y: 14, roleLabel: 'LE' },
    { pos: 'ZAG', x: 20, y: 32, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 18, y: 50, roleLabel: 'ZAG' },
    { pos: 'ZAG', x: 20, y: 68, roleLabel: 'ZAG' },
    { pos: 'LD',  x: 26, y: 86, roleLabel: 'LD' },
    { pos: 'ME',  x: 50, y: 18, roleLabel: 'ME' },
    { pos: 'VOL', x: 48, y: 38, roleLabel: 'VOL' },
    { pos: 'VOL', x: 48, y: 62, roleLabel: 'VOL' },
    { pos: 'MD',  x: 50, y: 82, roleLabel: 'MD' },
    { pos: 'CA',  x: 84, y: 50, roleLabel: 'CA' }
  ]
};

/**
 * Retorna as coordenadas do jogador dentro da formação do seu clube.
 */
export function getCoordinatesForPosition(pos: Position, formation: TacticalFormation = '4-3-3'): { x: number; y: number } {
  const slots = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES['4-3-3'];
  const matchIdx = matchPlayerSlotIndex(slots, pos);
  return { x: slots[matchIdx].x, y: slots[matchIdx].y };
}

/**
 * Encontra exatamente a vaga tática que o jogador ocupa no esquema do time
 */
function matchPlayerSlotIndex(slots: FormationSlot[], playerPos: Position): number {
  // 1. Tenta correspondência exata
  const exact = slots.findIndex(s => s.pos === playerPos);
  if (exact !== -1) return exact;

  // 2. Mapeamento de afinidade posicional caso a formação não tenha o nome exato da posição
  const COMPATIBILITY: Record<Position, Position[]> = {
    'GOL': ['GOL'],
    'ZAG': ['ZAG', 'VOL'],
    'LE': ['LE', 'ZAG'],
    'LD': ['LD', 'ZAG'],
    'VOL': ['VOL', 'MC', 'ZAG'],
    'MC': ['MC', 'MEI', 'VOL'],
    'ME': ['ME', 'PE', 'MC'],
    'MD': ['MD', 'PD', 'MC'],
    'MEI': ['MEI', 'MC', 'PE', 'PD'],
    'PE': ['PE', 'ME', 'CA'],
    'PD': ['PD', 'MD', 'CA'],
    'CA': ['CA', 'PE', 'PD']
  };

  const fallbacks = COMPATIBILITY[playerPos] || [];
  for (const f of fallbacks) {
    const idx = slots.findIndex(s => s.pos === f);
    if (idx !== -1) return idx;
  }

  return slots.length > 5 ? 5 : 0;
}

export const MatchPitchRadar: React.FC<MatchPitchRadarProps> = ({
  playerPosition,
  playerNumber,
  playerSurname,
  ballCoords,
  isBallWithPlayer,
  homeTeamColor = '#22c55e',
  awayTeamColor = '#ef4444',
  homeFormation = '4-3-3',
  awayFormation = '4-3-3',
  homeTeamName = 'Seu Time',
  awayTeamName = 'Adversário',
  isUserOnBench = false,
  starterNameInPosition
}) => {
  // 1. Slots oficiais da formação do time da casa (11 vagas)
  const homeTemplate = FORMATION_TEMPLATES[homeFormation] || FORMATION_TEMPLATES['4-3-3'];
  
  // 2. Encontra qual vaga é a SUA na formação do time
  const playerSlotIndex = matchPlayerSlotIndex(homeTemplate, playerPosition);
  const playerSlot = homeTemplate[playerSlotIndex];
  const playerCoords = { x: playerSlot.x, y: playerSlot.y };

  // 3. Os companheiros são EXATAMENTE as outras 10 vagas do time (10 companheiros + 1 você = 11 jogadores!)
  const teammates = homeTemplate.filter((_, idx) => idx !== playerSlotIndex);

  // 4. Time adversário (EXATAMENTE 11 jogadores espelhados no campo de ataque)
  const awayTemplate = FORMATION_TEMPLATES[awayFormation] || FORMATION_TEMPLATES['4-3-3'];
  const opponents = awayTemplate.map(slot => ({
    ...slot,
    x: 100 - slot.x, // Espelhamento horizontal de campo
    y: slot.y
  }));

  return (
    <div className="relative w-full h-36 sm:h-44 bg-[#0e2113] rounded-2xl border border-emerald-700/60 shadow-inner overflow-hidden select-none">
      
      {/* Listras do gramado estilo Premier League */}
      <div className="absolute inset-0 grid grid-cols-10 pointer-events-none opacity-20">
        <div className="bg-black/30" />
        <div className="bg-white/10" />
        <div className="bg-black/30" />
        <div className="bg-white/10" />
        <div className="bg-black/30" />
        <div className="bg-white/10" />
        <div className="bg-black/30" />
        <div className="bg-white/10" />
        <div className="bg-black/30" />
        <div className="bg-white/10" />
      </div>

      {/* Linhas demarcatórias do campo */}
      <div className="absolute inset-2 border border-emerald-500/40 rounded-lg pointer-events-none" />
      
      {/* Linha do Meio de Campo e Círculo Central */}
      <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 border-l border-emerald-500/40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-emerald-500/40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full pointer-events-none" />

      {/* Grande Área Defesa (Esquerda) */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 w-12 sm:w-16 h-20 sm:h-24 border-r border-y border-emerald-500/40 pointer-events-none" />
      <div className="absolute top-1/2 left-2 -translate-y-1/2 w-6 sm:w-8 h-10 sm:h-12 border-r border-y border-emerald-500/40 pointer-events-none" />

      {/* Grande Área Ataque (Direita) */}
      <div className="absolute top-1/2 right-2 -translate-y-1/2 w-12 sm:w-16 h-20 sm:h-24 border-l border-y border-emerald-500/40 pointer-events-none" />
      <div className="absolute top-1/2 right-2 -translate-y-1/2 w-6 sm:w-8 h-10 sm:h-12 border-l border-y border-emerald-500/40 pointer-events-none" />

      {/* Confronto Tático em Tempo Real no Topo do Radar */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none max-w-[94%]">
        <div className="bg-[#0b0f17]/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80 shadow-2xl flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-white whitespace-nowrap">
          <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] inline-block"></span>
            <span className="truncate max-w-[110px] sm:max-w-[150px]">{homeTeamName}</span>
            <span className="text-emerald-300 font-mono text-[9px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700">
              {homeFormation}
            </span>
          </span>

          <span className="text-amber-400 font-['Teko'] text-sm tracking-wider px-0.5">vs</span>

          <span className="text-rose-400 font-extrabold flex items-center gap-1.5">
            <span className="text-rose-300 font-mono text-[9px] bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-700">
              {awayFormation}
            </span>
            <span className="truncate max-w-[110px] sm:max-w-[150px]">{awayTeamName}</span>
            <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)] inline-block"></span>
          </span>
        </div>
      </div>

      {/* 10 Companheiros de Equipe (Pontos Ciano/Azul) - Total com você: 11! */}
      {teammates.map((tm, idx) => (
        <div
          key={`tm_${idx}`}
          className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/60 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 shadow-sm"
          style={{ 
            left: `${tm.x}%`, 
            top: `${tm.y}%`,
            backgroundColor: homeTeamColor !== '#000000' && homeTeamColor !== '#18181b' ? homeTeamColor : '#38bdf8'
          }}
          title={tm.roleLabel}
        />
      ))}

      {/* 11 Adversários (Pontos Vermelhos/Cores do Rival) - Total: 11! */}
      {opponents.map((op, idx) => (
        <div
          key={`op_${idx}`}
          className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-black/60 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 shadow-sm"
          style={{ 
            left: `${op.x}%`, 
            top: `${op.y}%`,
            backgroundColor: awayTeamColor !== '#ffffff' ? awayTeamColor : '#ef4444'
          }}
          title={op.roleLabel}
        />
      ))}

      {/* VOCÊ ou TITULAR DA POSIÇÃO */}
      {!isUserOnBench ? (
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-500 ${
            isBallWithPlayer ? 'scale-125' : 'scale-100'
          }`}
          style={{ left: `${playerCoords.x}%`, top: `${playerCoords.y}%` }}
        >
          <div className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full font-bold text-[10px] text-black border-2 border-white shadow-xl transition-all ${
            isBallWithPlayer
              ? 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.95)] animate-bounce'
              : 'bg-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.7)]'
          }`}>
            {playerNumber}
          </div>
          <span className="text-[9px] font-black tracking-tight text-white bg-black/90 px-1.5 py-0.5 rounded mt-0.5 border border-white/30 whitespace-nowrap shadow">
            {playerSurname}
          </span>
        </div>
      ) : (
        /* O Titular jogando no 1º tempo enquanto você está no banco */
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none transition-all duration-500"
          style={{ left: `${playerCoords.x}%`, top: `${playerCoords.y}%` }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full border border-black/80 shadow-sm"
            style={{ backgroundColor: homeTeamColor !== '#000000' && homeTeamColor !== '#18181b' ? homeTeamColor : '#38bdf8' }}
          />
          {starterNameInPosition && (
            <span className="text-[8px] font-bold text-slate-300 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap">
              {starterNameInPosition.split(' ').pop()}
            </span>
          )}
        </div>
      )}

      {/* Indicador de que você está no banco aguardando o 2º tempo */}
      {isUserOnBench && (
        <div className="absolute bottom-2 left-2 z-20 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/70 shadow-lg flex items-center gap-1.5 text-[9px] text-amber-300 font-bold pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>No Banco: #{playerNumber} {playerSurname} (Entra aos 60')</span>
        </div>
      )}

      {/* A BOLA DE FUTEBOL (Animada e com Efeito de Domínio) */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-400 ease-out pointer-events-none"
        style={{ 
          left: `${isBallWithPlayer ? playerCoords.x : ballCoords.x}%`, 
          top: `${isBallWithPlayer ? playerCoords.y : ballCoords.y}%` 
        }}
      >
        <div className="relative">
          <span className="text-base sm:text-lg block drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] animate-spin-slow">
            ⚽
          </span>
          {isBallWithPlayer && (
            <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-ping opacity-80" />
          )}
        </div>
      </div>
    </div>
  );
};
