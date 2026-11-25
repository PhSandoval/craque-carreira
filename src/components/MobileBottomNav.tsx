import React from 'react';
import { PlayerProfile } from '../types';
import { triggerHaptic } from '../services/hapticsService';
import { Trophy, Calendar, Shield, Briefcase, ArrowRightLeft } from 'lucide-react';

interface MobileBottomNavProps {
  player: PlayerProfile;
  onScrollTop: () => void;
  onOpenAgenda: () => void;
  onOpenLeagues: () => void;
  onOpenFinances: () => void;
  onOpenTransferMarket: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  player,
  onScrollTop,
  onOpenAgenda,
  onOpenLeagues,
  onOpenFinances,
  onOpenTransferMarket
}) => {
  const handlePress = (cb: () => void) => {
    triggerHaptic('tap');
    cb();
  };

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d1117]/95 backdrop-blur-lg border-t border-slate-800/90 safe-bottom shadow-[0_-8px_25px_rgba(0,0,0,0.65)]">
      <div className="grid grid-cols-5 items-center h-14 px-1 text-[10px] font-bold">
        <button
          type="button"
          onClick={() => handlePress(onScrollTop)}
          className="flex flex-col items-center justify-center gap-0.5 text-emerald-400 active:scale-95 transition-transform"
        >
          <Trophy className="w-4 h-4" />
          <span>Carreira</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress(onOpenAgenda)}
          className="relative flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-purple-300 active:scale-95 transition-transform"
        >
          <div className="relative">
            <Calendar className="w-4 h-4 text-purple-400" />
            {!player.weeklyTrainingDone && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <span>Agenda</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress(onOpenLeagues)}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-emerald-300 active:scale-95 transition-transform"
        >
          <Shield className="w-4 h-4 text-sky-400" />
          <span>Ligas</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress(onOpenFinances)}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-emerald-300 active:scale-95 transition-transform"
        >
          <Briefcase className="w-4 h-4 text-emerald-400" />
          <span>Finanças</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress(onOpenTransferMarket)}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-amber-300 active:scale-95 transition-transform"
        >
          <ArrowRightLeft className="w-4 h-4 text-amber-400" />
          <span>Mercado</span>
        </button>
      </div>
    </nav>
  );
};
