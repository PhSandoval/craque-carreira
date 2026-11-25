import React from 'react';
import { Position } from '../types';

interface TacticalPitchProps {
  selectedPosition: Position;
  onSelectPosition: (pos: Position) => void;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  selectedPosition,
  onSelectPosition
}) => {
  const renderPosButton = (pos: Position, label: string, extraClasses = '') => {
    const isSelected = selectedPosition === pos;

    return (
      <button
        type="button"
        onClick={() => onSelectPosition(pos)}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none ${
          isSelected
            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.7)] scale-110 z-10'
            : 'bg-emerald-950/70 text-emerald-300/80 hover:bg-emerald-900/90 hover:text-emerald-100 border border-emerald-700/40'
        } ${extraClasses}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="relative w-full max-w-[280px] h-[340px] bg-[#122316] rounded-2xl border-2 border-emerald-800/60 p-3 shadow-inner flex flex-col justify-between overflow-hidden">
      {/* Linhas do Campo */}
      <div className="absolute inset-2 border border-emerald-700/40 rounded-xl pointer-events-none" />
      
      {/* Grande Área Adversária (Ataque no topo) */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-16 border-b border-x border-emerald-700/40 pointer-events-none" />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-8 border-b border-x border-emerald-700/40 pointer-events-none" />
      
      {/* Linha do Meio de Campo e Círculo Central */}
      <div className="absolute top-1/2 left-2 right-2 -translate-y-1/2 border-t border-emerald-700/40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-emerald-700/40 pointer-events-none" />

      {/* Grande Área Defesa (Base) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-16 border-t border-x border-emerald-700/40 pointer-events-none" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-8 border-t border-x border-emerald-700/40 pointer-events-none" />

      {/* Linha de Ataque */}
      <div className="relative z-10 flex justify-around items-center pt-2">
        {renderPosButton('PE', 'PE')}
        {renderPosButton('CA', 'CA')}
        {renderPosButton('PD', 'PD')}
      </div>

      {/* Meia Ofensivo (MEI) */}
      <div className="relative z-10 flex justify-center items-center">
        {renderPosButton('MEI', 'MEI', 'px-5 py-2 text-sm shadow-md')}
      </div>

      {/* Meio-Campo (ME, MC, MD) */}
      <div className="relative z-10 flex justify-around items-center px-1">
        {renderPosButton('ME', 'ME')}
        {renderPosButton('MC', 'MC')}
        {renderPosButton('MD', 'MD')}
      </div>

      {/* Volante */}
      <div className="relative z-10 flex justify-center items-center">
        {renderPosButton('VOL', 'VOL')}
      </div>

      {/* Linha Defensiva (LE, ZAG, LD) */}
      <div className="relative z-10 flex justify-around items-center px-1">
        {renderPosButton('LE', 'LE')}
        {renderPosButton('ZAG', 'ZAG')}
        {renderPosButton('LD', 'LD')}
      </div>

      {/* Goleiro */}
      <div className="relative z-10 flex justify-center items-center pb-2">
        {renderPosButton('GOL', 'GOL')}
      </div>
    </div>
  );
};
