import React from 'react';
import { PlayerProfile } from '../types';
import { triggerHaptic } from '../services/hapticsService';
import type { DashboardTab } from './CareerDashboard';
import { LayoutDashboard, Dumbbell, Shield, ArrowRightLeft, User } from 'lucide-react';

interface MobileBottomNavProps {
  player: PlayerProfile;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  player,
  activeTab,
  onSelectTab
}) => {
  const effectiveMatchDay = Math.max(player.currentMatchDay || 1, (player.currentSeasonStats?.games || 0) + 1);
  const isTrainingPending = !player.weeklyTrainingDone && effectiveMatchDay <= 38;
  const isWindowOpen = effectiveMatchDay > 38;

  const items: { id: DashboardTab; label: string; icon: React.ReactNode; dot?: 'amber' | 'emerald' }[] = [
    { id: 'resumo', label: 'Resumo', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'treino',
      label: 'Treino',
      icon: <Dumbbell className="w-4 h-4" />,
      dot: isTrainingPending ? 'amber' : undefined
    },
    { id: 'ligas', label: 'Ligas', icon: <Shield className="w-4 h-4" /> },
    {
      id: 'mercado',
      label: 'Mercado',
      icon: <ArrowRightLeft className="w-4 h-4" />,
      dot: isWindowOpen ? 'emerald' : undefined
    },
    { id: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> }
  ];

  const handlePress = (tab: DashboardTab) => {
    triggerHaptic('tap');
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0d12]/95 backdrop-blur-lg border-t border-white/[0.07] safe-bottom">
      <div className="grid grid-cols-5 items-center h-14 px-1 text-[10px] font-semibold">
        {items.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePress(item.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.dot && !isActive && (
                  <span
                    className={`absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full ${
                      item.dot === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
