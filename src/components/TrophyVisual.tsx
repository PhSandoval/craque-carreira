import React from 'react';

export type TrophyVisualType =
  | 'champions'
  | 'europa'
  | 'conference'
  | 'libertadores'
  | 'sul_americana'
  | 'world_cup'
  | 'copa_america'
  | 'euro'
  | 'copa_do_brasil'
  | 'brasileirao'
  | 'state_cup'
  | 'premier_league'
  | 'generic_gold'
  | 'generic_silver';

interface TrophyVisualProps {
  competitionName?: string;
  trophyKey?: TrophyVisualType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Resolve automaticamente qual arte oficial de taça exibir pelo nome da competição ou troféu
 */
export function resolveTrophyType(name: string = ''): TrophyVisualType {
  const n = name.toLowerCase();
  if (n.includes('champions')) return 'champions';
  if (n.includes('europa league')) return 'europa';
  if (n.includes('conference')) return 'conference';
  if (n.includes('libertadores')) return 'libertadores';
  if (n.includes('sul-americana') || n.includes('sulamericana') || n.includes('sula')) return 'sul_americana';
  if (n.includes('copa do mundo') || n.includes('world cup') || n.includes('fifa')) return 'world_cup';
  if (n.includes('copa américa') || n.includes('copa america')) return 'copa_america';
  if (n.includes('eurocopa') || n.includes('uefa euro')) return 'euro';
  if (n.includes('copa do brasil') || n.includes('copa do br')) return 'copa_do_brasil';
  if (n.includes('brasileir') || n.includes('série a') || n.includes('série b') || n.includes('série c')) return 'brasileirao';
  if (n.includes('paulist') || n.includes('carioc') || n.includes('mineir') || n.includes('gaúch') || n.includes('gauch') || n.includes('paranaense') || n.includes('nordest') || n.includes('estadual')) return 'state_cup';
  if (n.includes('premier league') || n.includes('championship') || n.includes('fa cup')) return 'premier_league';
  if (n.includes('copa') || n.includes('taça') || n.includes('cup') || n.includes('pokal')) return 'generic_silver';
  return 'generic_gold';
}

const SIZE_CLASSES: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20'
};

/**
 * Ilustrações vetoriais metálicas e icônicas das grandes taças do futebol mundial
 * (Zero dependência de links externos sujeitos a bloqueio ou 404).
 */
export const TrophyVisual: React.FC<TrophyVisualProps> = ({
  competitionName,
  trophyKey,
  size = 'sm',
  className = ''
}) => {
  const type = trophyKey || resolveTrophyType(competitionName);
  const dim = SIZE_CLASSES[size];

  // 1. UEFA Champions League ("A Orelhuda")
  if (type === 'champions') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-blue-950/90 to-slate-950 border border-sky-400/40 p-1 shadow-[0_0_16px_rgba(56,189,248,0.28)] shrink-0 ${dim} ${className}`} title={competitionName || 'UEFA Champions League'}>
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_2px_6px_rgba(147,197,253,0.5)]">
          <defs>
            <linearGradient id="uclSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
          {/* Orelhas gigantes icônicas */}
          <path d="M21 15 C9 12, 8 31, 22 33" fill="none" stroke="url(#uclSilver)" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M43 15 C55 12, 56 31, 42 33" fill="none" stroke="url(#uclSilver)" strokeWidth="4.2" strokeLinecap="round" />
          {/* Corpo da Ânfora */}
          <path d="M20 11 L44 11 L41 34 C40 41, 36 45, 32 45 C28 45, 24 41, 23 34 Z" fill="url(#uclSilver)" />
          <ellipse cx="32" cy="11" rx="12" ry="2.5" fill="#e2e8f0" />
          {/* Pedestal */}
          <rect x="28" y="44" width="8" height="7" fill="url(#uclSilver)" />
          <path d="M21 51 L43 51 L46 57 L18 57 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.2" />
          {/* Estrela central UCL */}
          <polygon points="32,19 33.8,24 39,24 34.8,27 36.4,32 32,29 27.6,32 29.2,27 25,24 30.2,24" fill="#0ea5e9" opacity="0.85" />
        </svg>
      </div>
    );
  }

  // 2. CONMEBOL Libertadores
  if (type === 'libertadores') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-amber-950/80 to-slate-950 border border-amber-400/50 p-1 shadow-[0_0_16px_rgba(245,158,11,0.3)] shrink-0 ${dim} ${className}`} title={competitionName || 'CONMEBOL Libertadores'}>
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_2px_6px_rgba(251,191,36,0.45)]">
          <defs>
            <linearGradient id="libSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="libWood" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>
          {/* Jogador no topo */}
          <circle cx="32" cy="7" r="2.6" fill="#fde68a" />
          <path d="M32 10 L32 15 M29 12 L35 11" stroke="#fde68a" strokeWidth="1.8" strokeLinecap="round" />
          {/* Esfera de Prata + Alças */}
          <circle cx="32" cy="24" r="10.5" fill="url(#libSilver)" />
          <path d="M21 20 C14 19, 14 29, 21 28" fill="none" stroke="#e2e8f0" strokeWidth="2.4" />
          <path d="M43 20 C50 19, 50 29, 43 28" fill="none" stroke="#e2e8f0" strokeWidth="2.4" />
          {/* Base de Madeira Escalonada com Placas de Campeões */}
          <rect x="25" y="34" width="14" height="5" fill="#94a3b8" rx="1" />
          <path d="M20 39 L44 39 L48 58 L16 58 Z" fill="url(#libWood)" stroke="#d97706" strokeWidth="1" />
          <rect x="22" y="43" width="4" height="3" fill="#e2e8f0" opacity="0.8" />
          <rect x="30" y="43" width="4" height="3" fill="#e2e8f0" opacity="0.8" />
          <rect x="38" y="43" width="4" height="3" fill="#e2e8f0" opacity="0.8" />
          <rect x="21" y="49" width="4" height="3" fill="#fde68a" opacity="0.85" />
          <rect x="30" y="49" width="4" height="3" fill="#fde68a" opacity="0.85" />
          <rect x="39" y="49" width="4" height="3" fill="#fde68a" opacity="0.85" />
        </svg>
      </div>
    );
  }

  // 3. UEFA Europa League
  if (type === 'europa') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-orange-950/90 to-slate-950 border border-orange-500/50 p-1 shadow-[0_0_16px_rgba(249,115,22,0.28)] shrink-0 ${dim} ${className}`} title={competitionName || 'UEFA Europa League'}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="uelSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="55%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <path d="M18 11 L46 11 L40 42 L24 42 Z" fill="url(#uelSilver)" />
          <path d="M21 18 L43 18 M22 28 L42 28" stroke="#f97316" strokeWidth="2.2" opacity="0.85" />
          <path d="M20 42 L44 42 L47 56 L17 56 Z" fill="#ea580c" stroke="#fed7aa" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // 4. UEFA Conference League
  if (type === 'conference') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-emerald-950/90 to-slate-950 border border-emerald-400/50 p-1 shadow-[0_0_16px_rgba(16,185,129,0.28)] shrink-0 ${dim} ${className}`} title={competitionName || 'UEFA Conference League'}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <path d="M21 12 L25 46 M27 11 L29 46 M32 10 L32 46 M37 11 L35 46 M43 12 L39 46" stroke="#e2e8f0" strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="32" cy="12" rx="12" ry="3" fill="none" stroke="#10b981" strokeWidth="2.2" />
          <rect x="20" y="46" width="24" height="9" rx="2" fill="#065f46" stroke="#34d399" strokeWidth="1.4" />
        </svg>
      </div>
    );
  }

  // 5. CONMEBOL Sul-Americana
  if (type === 'sul_americana') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-indigo-950/90 to-slate-950 border border-indigo-400/45 p-1 shadow-[0_0_14px_rgba(99,102,241,0.28)] shrink-0 ${dim} ${className}`} title={competitionName || 'CONMEBOL Sul-Americana'}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <path d="M18 14 L46 14 C46 30, 39 39, 32 39 C25 39, 18 30, 18 14 Z" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1.5" />
          <circle cx="15" cy="22" r="4" fill="none" stroke="#94a3b8" strokeWidth="2.4" />
          <circle cx="49" cy="22" r="4" fill="none" stroke="#94a3b8" strokeWidth="2.4" />
          <rect x="29" y="39" width="6" height="9" fill="#94a3b8" />
          <rect x="19" y="48" width="26" height="8" rx="2" fill="#1e293b" stroke="#818cf8" strokeWidth="1.4" />
        </svg>
      </div>
    );
  }

  // 6. Copa do Mundo FIFA
  if (type === 'world_cup') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-yellow-900/70 to-amber-950 border border-yellow-400/70 p-1 shadow-[0_0_20px_rgba(250,204,21,0.45)] shrink-0 ${dim} ${className}`} title={competitionName || 'Copa do Mundo da FIFA'}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="fifaGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="18" r="10" fill="url(#fifaGold)" />
          <path d="M23 26 C26 34, 24 44, 22 50 L42 50 C40 44, 38 34, 41 26 Z" fill="url(#fifaGold)" />
          <rect x="19" y="50" width="26" height="3.5" fill="#15803d" />
          <rect x="18" y="53.5" width="28" height="4.5" rx="1.5" fill="#a16207" />
        </svg>
      </div>
    );
  }

  // 7. Copa do Brasil
  if (type === 'copa_do_brasil') {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-emerald-950/90 to-amber-950/70 border border-amber-400/50 p-1 shadow-[0_0_16px_rgba(245,158,11,0.28)] shrink-0 ${dim} ${className}`} title={competitionName || 'Copa do Brasil'}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="cdbGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <path d="M16 11 L48 11 L41 36 C39 41, 35 44, 32 44 C29 44, 25 41, 23 36 Z" fill="url(#cdbGold)" />
          <path d="M22 22 L42 22" stroke="#16a34a" strokeWidth="3.5" />
          <rect x="28" y="44" width="8" height="6" fill="#d97706" />
          <rect x="20" y="50" width="24" height="7" rx="2" fill="#065f46" stroke="#fbbf24" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // 8. Brasileirão Série A / B / C & Ligas Nacionais (Ouro)
  if (type === 'brasileirao' || type === 'state_cup' || type === 'premier_league' || type === 'generic_gold') {
    const isPremier = type === 'premier_league';
    const isState = type === 'state_cup';
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-xl border p-1 shrink-0 ${
          isPremier
            ? 'bg-gradient-to-b from-purple-950/90 to-slate-950 border-purple-400/50 shadow-[0_0_14px_rgba(168,85,247,0.28)]'
            : isState
            ? 'bg-gradient-to-b from-amber-950/80 to-slate-950 border-amber-400/50 shadow-[0_0_14px_rgba(245,158,11,0.25)]'
            : 'bg-gradient-to-b from-emerald-950/80 to-slate-950 border-yellow-400/50 shadow-[0_0_14px_rgba(250,204,21,0.28)]'
        } ${dim} ${className}`}
        title={competitionName || 'Troféu Oficial'}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="champGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={isPremier ? '#f8fafc' : '#fef08a'} />
              <stop offset="50%" stopColor={isPremier ? '#cbd5e1' : '#f59e0b'} />
              <stop offset="100%" stopColor={isPremier ? '#64748b' : '#b45309'} />
            </linearGradient>
          </defs>
          {isPremier && (
            <path d="M22 14 L26 8 L32 13 L38 8 L42 14 Z" fill="#facc15" />
          )}
          <path d="M19 14 C11 16, 11 29, 21 31" fill="none" stroke="url(#champGold)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M45 14 C53 16, 53 29, 43 31" fill="none" stroke="url(#champGold)" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M20 14 L44 14 L41 34 C40 40, 36 43, 32 43 C28 43, 24 40, 23 34 Z" fill="url(#champGold)" />
          <rect x="28" y="43" width="8" height="7" fill="url(#champGold)" />
          <path d="M20 50 L44 50 L46 57 L18 57 Z" fill={isPremier ? '#581c87' : '#1e293b'} stroke="#f59e0b" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // 9. Copa América / Eurocopa / Copas Nacionais Europeias (Prata Clássica)
  return (
    <div className={`relative inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-slate-800/90 to-slate-950 border border-slate-400/45 p-1 shadow-[0_0_14px_rgba(148,163,184,0.25)] shrink-0 ${dim} ${className}`} title={competitionName || 'Taça Oficial'}>
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <defs>
          <linearGradient id="classicSilver" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <path d="M20 15 C12 17, 12 29, 21 31" fill="none" stroke="url(#classicSilver)" strokeWidth="3" />
        <path d="M44 15 C52 17, 52 29, 43 31" fill="none" stroke="url(#classicSilver)" strokeWidth="3" />
        <path d="M21 13 L43 13 L40 35 C39 41, 36 44, 32 44 C28 44, 25 41, 24 35 Z" fill="url(#classicSilver)" />
        <rect x="28" y="44" width="8" height="6" fill="#94a3b8" />
        <rect x="19" y="50" width="26" height="7" rx="2" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.2" />
      </svg>
    </div>
  );
};
