import React from 'react';
import { PlayerProfile } from '../types';
import { CLUBS } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { getPlayerKnownName } from '../utils/playerDisplay';
import type { DashboardTab } from './CareerDashboard';
import { Trophy, Settings, Brain, Shield, ArrowRightLeft, RotateCcw, Dumbbell, Users, Calendar, Briefcase } from 'lucide-react';

interface HeaderProps {
  player: PlayerProfile | null;
  activeTab?: DashboardTab;
  onSelectResumo?: () => void;
  onOpenSettings: () => void;
  onOpenMemories?: () => void;
  onOpenLeagues?: () => void;
  onOpenTransferMarket?: () => void;
  onOpenTraining?: () => void;
  onOpenAgenda?: () => void;
  onOpenFinances?: () => void;
  onOpenTeammates?: () => void;
  onResetCareer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  player,
  activeTab,
  onSelectResumo,
  onOpenSettings,
  onOpenMemories,
  onOpenLeagues,
  onOpenTransferMarket,
  onOpenTraining,
  onOpenAgenda,
  onOpenFinances,
  onOpenTeammates,
  onResetCareer
}) => {
  const knownName = player ? getPlayerKnownName(player) : '';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d1117]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Marca estilo Copero */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onSelectResumo}
            className="flex items-center space-x-1.5 text-white font-black text-xl tracking-tighter"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black shadow-md">
              <Trophy className="w-4 h-4 fill-black" />
            </div>
            <span className="font-['Teko'] text-2xl tracking-normal uppercase">CRAQUE</span>
          </button>

          {player && (
            <nav className="hidden md:flex items-center space-x-4 pl-4 text-xs font-semibold text-slate-400">
              <button
                type="button"
                onClick={onSelectResumo}
                className={`cursor-pointer transition-colors ${
                  activeTab === 'resumo' ? 'text-emerald-400 font-bold' : 'text-white hover:text-emerald-400'
                }`}
              >
                Resumo & Dia
              </button>
              <button
                type="button"
                onClick={onOpenTraining}
                className={`cursor-pointer transition-colors flex items-center gap-1 ${
                  activeTab === 'treino' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Treinos</span>
              </button>
              <button
                type="button"
                onClick={onOpenAgenda}
                className="hover:text-purple-400 cursor-pointer transition-colors flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Agenda</span>
              </button>
              <button
                type="button"
                onClick={onOpenLeagues}
                className={`cursor-pointer transition-colors flex items-center gap-1 ${
                  activeTab === 'ligas' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Ligas</span>
              </button>
              <button
                type="button"
                onClick={onOpenTransferMarket}
                className={`cursor-pointer transition-colors flex items-center gap-1 ${
                  activeTab === 'mercado' ? 'text-amber-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Mercado</span>
              </button>
              <button
                type="button"
                onClick={onOpenFinances}
                className="hover:text-emerald-400 cursor-pointer transition-colors flex items-center gap-1"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Finanças</span>
              </button>
              <button
                type="button"
                onClick={onOpenTeammates}
                className={`cursor-pointer transition-colors flex items-center gap-1 ${
                  activeTab === 'vestiario' ? 'text-sky-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Vestiário</span>
              </button>
            </nav>
          )}
        </div>

        {/* Lado Direito: Perfil Rápido + Botão Config */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {player && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onOpenMemories}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-bold hover:bg-purple-900 transition-colors"
                title="Dossiê de Memórias da Carreira"
              >
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>{player.memories?.length || 0} Memórias</span>
              </button>

              <div className="flex items-center gap-2 bg-[#181d28] border border-slate-700/80 px-2.5 py-1 rounded-full">
                {CLUBS[player.currentClub] && (
                  <ClubBadge club={CLUBS[player.currentClub]} size="xs" />
                )}
                <span className="text-sm">{player.flag}</span>
                <span className="text-xs font-bold text-white">#{player.number} {knownName}</span>
                <span className="text-[10px] bg-emerald-500 text-black font-extrabold px-1.5 py-0.5 rounded-full">
                  {player.ovr}
                </span>
              </div>
            </div>
          )}

          {player && onResetCareer && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Deseja iniciar uma nova carreira e criar um novo atleta?')) {
                  onResetCareer();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181d28] hover:bg-red-950/70 border border-slate-700/80 hover:border-red-700 text-slate-300 hover:text-red-300 text-xs font-bold transition-all shadow-sm"
              title="Criar Novo Atleta / Reiniciar Carreira"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Novo Atleta</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Configurações"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
