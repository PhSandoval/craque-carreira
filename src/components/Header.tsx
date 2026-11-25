import React from 'react';
import { PlayerProfile } from '../types';
import type { DashboardTab } from './CareerDashboard';
import { triggerHaptic } from '../services/hapticsService';
import {
  Trophy,
  Settings,
  LayoutDashboard,
  Dumbbell,
  Shield,
  ArrowRightLeft,
  User
} from 'lucide-react';

interface HeaderProps {
  player: PlayerProfile | null;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenSettings: () => void;
}

const NAV_ITEMS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: 'resumo', label: 'Resumo', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { id: 'treino', label: 'Treino', icon: <Dumbbell className="w-3.5 h-3.5" /> },
  { id: 'ligas', label: 'Ligas', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'mercado', label: 'Mercado', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
  { id: 'perfil', label: 'Perfil', icon: <User className="w-3.5 h-3.5" /> }
];

export const Header: React.FC<HeaderProps> = ({
  player,
  activeTab,
  onSelectTab,
  onOpenSettings
}) => {
  const effectiveMatchDay = player
    ? Math.max(player.currentMatchDay || 1, (player.currentSeasonStats?.games || 0) + 1)
    : 1;
  const isTrainingPending = Boolean(player && !player.weeklyTrainingDone && effectiveMatchDay <= 38);
  const isWindowOpen = Boolean(player && effectiveMatchDay > 38);

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#0a0d12]/90 backdrop-blur-md border-b border-white/[0.06] px-4 sm:px-6 flex items-center">
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4">
        {/* Esquerda: Marca Minimalista */}
        <button
          type="button"
          onClick={() => {
            if (!player) return;
            triggerHaptic('tap');
            onSelectTab('resumo');
          }}
          className="flex items-center gap-2 text-white shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black">
            <Trophy className="w-4 h-4 fill-black" />
          </div>
          <span className="font-['Teko'] text-2xl tracking-wide leading-none mt-0.5 uppercase">
            CRAQUE
          </span>
        </button>

        {/* Centro (Desktop/Tablet): Navegação Única em 5 Abas */}
        {player && (
          <nav className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] p-1 rounded-xl">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              const showTrainDot = item.id === 'treino' && isTrainingPending && !isActive;
              const showMarketDot = item.id === 'mercado' && isWindowOpen && !isActive;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    triggerHaptic('tap');
                    onSelectTab(item.id);
                  }}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {(showTrainDot || showMarketDot) && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        showTrainDot ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Direita: Rodada discreta + Configurações */}
        {player && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono font-semibold text-slate-400 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-lg">
              {effectiveMatchDay > 38 ? 'Janela' : `R${effectiveMatchDay}/38`}
            </span>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                onOpenSettings();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Configurações, Nuvem e Novo Jogo"
              aria-label="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
