import React, { useState } from 'react';
import { Club } from '../types';

interface ClubBadgeProps {
  club: Club;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
}

const SIZE_MAP = {
  xs: { w: 'w-4 h-4', text: 'text-[7px]', svg: 16 },
  sm: { w: 'w-6 h-6', text: 'text-[9px]', svg: 24 },
  md: { w: 'w-8 h-8', text: 'text-[11px]', svg: 32 },
  lg: { w: 'w-12 h-12', text: 'text-sm', svg: 48 },
  xl: { w: 'w-16 h-16', text: 'text-lg', svg: 64 },
};

export const ClubBadge: React.FC<ClubBadgeProps> = ({
  club,
  size = 'md',
  className = '',
  showBorder = true
}) => {
  const [imgError, setImgError] = useState(false);
  const sizeObj = SIZE_MAP[size];

  // Gera uma sigla estilosa (ex: Real Madrid -> RMA, Flamengo -> FLA, Novorizontino -> NOV)
  const getMonogram = (name: string, short: string) => {
    if (short && short.length <= 4) return short.toUpperCase();
    const parts = name.split(' ').filter(p => !['FC', 'SC', 'CR', 'SE', 'EC', 'FR', 'FBPA', 'CF'].includes(p.toUpperCase()));
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0] + (parts[2] ? parts[2][0] : '')).toUpperCase();
    }
    return name.slice(0, 3).toUpperCase();
  };

  const monogram = getMonogram(club.name, club.shortName);

  // Se tiver URL de escudo e não tiver dado erro, renderiza a imagem oficial
  if (club.badgeUrl && !imgError) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${sizeObj.w} ${className}`}>
        <img
          src={club.badgeUrl}
          alt={club.name}
          onError={() => setImgError(true)}
          className={`w-full h-full object-contain filter drop-shadow-md select-none transition-transform hover:scale-105`}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback Elegante: Escudo Vetorial SVG customizado nas cores oficiais do time
  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center ${sizeObj.w} ${className}`}
      title={club.name}
    >
      <svg
        viewBox="0 0 40 46"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id={`grad_${club.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={club.colors.primary} />
            <stop offset="100%" stopColor={club.colors.secondary || club.colors.primary} />
          </linearGradient>
          <filter id={`shadow_${club.id}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Formato Clássico do Escudo de Futebol */}
        <path
          d="M 20 2 C 32 2, 38 4, 38 14 C 38 30, 26 40, 20 44 C 14 40, 2 30, 2 14 C 2 4, 8 2, 20 2 Z"
          fill={`url(#grad_${club.id})`}
          stroke={club.colors.text === '#ffffff' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'}
          strokeWidth="1.8"
        />

        {/* Faixa interna / detalhe clássico */}
        <path
          d="M 5 16 Q 20 22 35 16"
          stroke={club.colors.secondary !== club.colors.primary ? club.colors.secondary : 'rgba(255,255,255,0.4)'}
          strokeWidth="2.5"
          fill="none"
          opacity="0.8"
        />

        {/* Monograma do Clube no Centro */}
        <text
          x="20"
          y="29"
          fill={club.colors.text}
          fontSize={monogram.length > 3 ? '10' : '12'}
          fontWeight="900"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          textAnchor="middle"
          letterSpacing="0.5"
          className="select-none"
        >
          {monogram}
        </text>
      </svg>
    </div>
  );
};
