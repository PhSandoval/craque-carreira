import React from 'react';
import { Club, MatchLineupPlayer } from '../types';
import { ClubBadge } from './ClubBadge';
import { Zap, ShieldAlert, Award, Battery, BatteryCharging, BatteryWarning, ArrowRightLeft } from 'lucide-react';

interface MatchLineupSidebarProps {
  club: Club;
  lineup: MatchLineupPlayer[];
  bench: MatchLineupPlayer[];
  isHome: boolean;
  isUserTeam: boolean;
}

export const MatchLineupSidebar: React.FC<MatchLineupSidebarProps> = ({
  club,
  lineup,
  bench,
  isHome,
  isUserTeam
}) => {
  // Ordenação das posições clássica no campinho
  const posOrder: Record<string, number> = {
    'GOL': 1,
    'LE': 2, 'ZAG': 3, 'LD': 4,
    'VOL': 5, 'MC': 6, 'ME': 7, 'MD': 8, 'MEI': 9,
    'PE': 10, 'PD': 11, 'CA': 12
  };

  const sortedStarters = [...lineup].sort(
    (a, b) => (posOrder[a.position] || 99) - (posOrder[b.position] || 99)
  );

  return (
    <div className="flex flex-col h-full bg-[#11141c]/95 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl text-xs select-none">
      
      {/* Topo do Clube com Escudo e Formação */}
      <div 
        className="p-3 border-b border-slate-800 flex items-center justify-between"
        style={{ borderTop: `3px solid ${club.colors.primary}` }}
      >
        <div className="flex items-center space-x-2">
          <ClubBadge club={club} size="xs" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white truncate text-xs sm:text-sm">
                {club.shortName}
              </span>
              {isUserTeam && (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 py-0.5 rounded font-extrabold uppercase">
                  Seu Clube
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block truncate" title={club.playStyle}>
              Téc: {club.coachName} • {club.playStyle.split(',')[0]}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold bg-[#181d28] text-slate-300 border border-slate-700/80 px-2 py-0.5 rounded-md">
          {club.formation || '4-3-3'}
        </span>
      </div>

      {/* Cabeçalho da Tabela de Titulares */}
      <div className="bg-[#151923] px-2.5 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 flex items-center justify-between uppercase tracking-wider">
        <span>Titulares (11)</span>
        <div className="flex items-center gap-3">
          <span title="Overall do Atleta">OVR</span>
          <span title="Nota da Partida ao Vivo">NOTA</span>
          <span title="Fôlego / Nível de Cansaço">FÔLEGO</span>
        </div>
      </div>

      {/* Lista de 11 Titulares com Notas e Cansaço */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50 p-1 space-y-0.5 custom-scrollbar">
        {sortedStarters.map(player => {
          const isUser = player.isUserPlayer;
          const isSubbed = player.isSubstituted;
          const stamina = Math.round(player.stamina);

          // Cor da nota da partida
          const ratingColor = 
            player.rating >= 8.0 ? 'text-emerald-400 bg-emerald-950/80 border-emerald-700' :
            player.rating >= 7.0 ? 'text-teal-300 bg-teal-950/60 border-teal-800' :
            player.rating >= 6.3 ? 'text-slate-200 bg-slate-800/80 border-slate-700' :
            'text-rose-400 bg-rose-950/80 border-rose-800';

          // Cor e ícone do cansaço
          const staminaColor = 
            stamina >= 70 ? 'bg-emerald-500' :
            stamina >= 45 ? 'bg-yellow-500' :
            'bg-rose-500 animate-pulse';

          const staminaTextColor = 
            stamina >= 70 ? 'text-emerald-400' :
            stamina >= 45 ? 'text-yellow-400' :
            'text-rose-400 font-black';

          // Cor da posição
          const posBadgeColor =
            player.position === 'GOL' ? 'bg-amber-950/80 text-amber-300 border-amber-700' :
            player.position === 'ZAG' || player.position === 'LE' || player.position === 'LD' ? 'bg-purple-950/80 text-purple-300 border-purple-800' :
            player.position === 'VOL' || player.position === 'MC' || player.position === 'MEI' ? 'bg-sky-950/80 text-sky-300 border-sky-800' :
            'bg-emerald-950/80 text-emerald-300 border-emerald-800';

          return (
            <div
              key={player.id}
              className={`p-1.5 rounded-xl transition-all flex items-center justify-between gap-1.5 ${
                isUser 
                  ? 'bg-emerald-950/40 border border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30' 
                  : isSubbed 
                    ? 'opacity-60 bg-slate-900/40' 
                    : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Esquerda: Número + Posição + Nome */}
              <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold w-4 text-center shrink-0">
                  {player.number}
                </span>

                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${posBadgeColor}`}>
                  {player.position}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`truncate text-xs font-semibold ${isUser ? 'text-emerald-300 font-black' : isSubbed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {player.name}
                    </span>
                    {isUser && (
                      <span className="text-[8px] bg-emerald-500 text-black px-1 rounded font-black shrink-0">
                        VOCÊ
                      </span>
                    )}
                    {player.isNewSigning && (
                      <span className="text-[8px] bg-amber-500/25 text-amber-300 border border-amber-500/50 px-1 rounded font-black shrink-0" title="Reforço recente contratado pelo clube">
                        REFORÇO
                      </span>
                    )}
                    {player.isRotated && (
                      <span className="text-[8px] bg-sky-500/25 text-sky-300 border border-sky-500/50 px-1 rounded font-bold shrink-0" title="Titular por rodízio/gestão do técnico">
                        RODÍZIO
                      </span>
                    )}
                  </div>

                  {/* Detalhes de gols, cartões ou substituição */}
                  <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                    {player.goals > 0 && (
                      <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800 flex items-center gap-0.5">
                        <span>GOL</span>
                        {player.goals > 1 && <span>x{player.goals}</span>}
                      </span>
                    )}
                    {player.assists > 0 && (
                      <span className="text-sky-400 font-bold bg-sky-950/80 px-1 py-0.5 rounded border border-sky-800 flex items-center gap-0.5">
                        <span>AST</span>
                        {player.assists > 1 && <span>x{player.assists}</span>}
                      </span>
                    )}
                    {player.yellowCard && (
                      <span className="inline-block w-2.5 h-3.5 bg-yellow-400 rounded-[2px] shadow-sm" title="Cartão Amarelo" />
                    )}
                    {player.redCard && (
                      <span className="inline-block w-2.5 h-3.5 bg-rose-600 rounded-[2px] shadow-sm" title="Cartão Vermelho" />
                    )}
                    {isSubbed && (
                      <span className="text-amber-400 text-[8px] flex items-center gap-0.5">
                        <ArrowRightLeft className="w-2.5 h-2.5" />
                        <span>Saiu {player.substitutedMinute}'</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Direita: OVR + Nota ao Vivo + Barra de Fôlego */}
              <div className="flex items-center gap-2 shrink-0">
                {/* OVR */}
                <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800/90 px-1.5 py-0.5 rounded">
                  {player.ovr}
                </span>

                {/* Nota ao Vivo da Partida */}
                <span className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded border min-w-[28px] text-center shadow-sm ${ratingColor}`}>
                  {player.rating.toFixed(1)}
                </span>

                {/* Barra e % de Cansaço / Stamina */}
                <div className="flex flex-col items-end w-11">
                  <span className={`text-[9px] font-mono leading-none ${staminaTextColor}`}>
                    {stamina}%
                  </span>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5 border border-slate-700/60">
                    <div 
                      className={`h-full transition-all duration-300 ${staminaColor}`}
                      style={{ width: `${stamina}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservas / Banco de Substituição */}
      {bench && bench.length > 0 && (
        <div className="border-t border-slate-800 bg-[#0d1017] p-2 space-y-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block px-1">
            Banco de Reservas ({bench.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {bench.slice(0, 5).map(sub => (
              <span 
                key={sub.id} 
                className="text-[9px] bg-slate-800/80 text-slate-300 border border-slate-700/70 px-1.5 py-0.5 rounded-md flex items-center gap-1"
                title={`${sub.name} (${sub.position}, ${sub.ovr} OVR) - 100% fôlego`}
              >
                <span className="text-slate-400">{sub.position}</span>
                <span className="font-semibold truncate max-w-[80px]">{sub.name.split(' ')[0]}</span>
                <span className="text-amber-400 font-mono text-[8px]">{sub.ovr}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
