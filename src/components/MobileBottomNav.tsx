import React from 'react';
import { PlayerProfile } from '../types';
import { triggerHaptic } from '../services/hapticsService';
import type { DashboardTab } from './CareerDashboard';
import { Trophy, Calendar, Shield, Dumbbell, ArrowRightLeft } from 'lucide-react';

interface MobileBottomNavProps {
  player: PlayerProfile;
  activeTab?: DashboardTab;
  onSelectTab: (tab: DashboardTab, subTab?: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  player,
  activeTab = 'resumo',
  onSelectTab
}) => {
  const handlePress = (tab: DashboardTab, subTab?: string) => {
    triggerHaptic('tap');
    onSelectTab(tab, subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0d1117]/95 backdrop-blur-lg border-t border-slate-800/90 safe-bottom shadow-[0_-8px_25px_rgba(0,0,0,0.65)]">
      <div className="grid grid-cols-5 items-center h-14 px-1 text-[10px] font-bold">
        <button
          type="button"
          onClick={() => handlePress('resumo')}
          className={`flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform ${
            activeTab === 'resumo' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Resumo</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress('treino', 'attributes')}
          className={`relative flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform ${
            activeTab === 'treino' ? 'text-teal-300' : 'text-slate-400'
          }`}
        >
          <div className="relative">
            <Dumbbell className="w-4 h-4" />
            {!player.weeklyTrainingDone && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </div>
          <span>Treino</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress('treino', 'agenda')}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-purple-300 active:scale-95 transition-transform"
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Agenda</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress('ligas')}
          className={`flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform ${
            activeTab === 'ligas' ? 'text-sky-300' : 'text-slate-400'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Ligas</span>
        </button>

        <button
          type="button"
          onClick={() => handlePress('mercado', 'transfer')}
          className={`flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform ${
            activeTab === 'mercado' ? 'text-amber-300' : 'text-slate-400'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Mercado</span>
        </button>
      </div>
    </nav>
  );
};
