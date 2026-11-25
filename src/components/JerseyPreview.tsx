import React from 'react';

interface JerseyPreviewProps {
  surname: string;
  number: number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
}

export const JerseyPreview: React.FC<JerseyPreviewProps> = ({
  surname,
  number,
  primaryColor = '#facc15', // Amarelo Brasil
  secondaryColor = '#15803d', // Verde
  textColor = '#0f172a'
}) => {
  const displayName = surname.trim().toUpperCase() || 'CRAQUE';
  const displayNumber = number || 10;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Camisa em SVG Vetorial Estilizado 3D */}
      <svg
        viewBox="0 0 200 220"
        className="w-48 h-56 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="jerseyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="shadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>
        </defs>

        {/* Mangas */}
        {/* Manga Esquerda */}
        <path
          d="M 60 45 L 15 80 L 35 110 L 65 85 Z"
          fill="url(#jerseyGrad)"
          stroke="#000000"
          strokeWidth="1.5"
        />
        {/* Borda Manga Esquerda */}
        <polygon points="15,80 35,110 40,103 22,76" fill={secondaryColor} />

        {/* Manga Direita */}
        <path
          d="M 140 45 L 185 80 L 165 110 L 135 85 Z"
          fill="url(#jerseyGrad)"
          stroke="#000000"
          strokeWidth="1.5"
        />
        {/* Borda Manga Direita */}
        <polygon points="185,80 165,110 160,103 178,76" fill={secondaryColor} />

        {/* Corpo da Camisa */}
        <path
          d="M 60 45 L 140 45 L 145 195 L 55 195 Z"
          fill="url(#jerseyGrad)"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M 60 45 L 140 45 L 145 195 L 55 195 Z"
          fill="url(#shadowGrad)"
        />

        {/* Gola / Colarinho */}
        <path
          d="M 80 45 C 80 62, 120 62, 120 45 Z"
          fill={secondaryColor}
          stroke="#000000"
          strokeWidth="1.5"
        />

        {/* Nome do Atleta */}
        <text
          x="100"
          y="90"
          fill={textColor}
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          letterSpacing="1.5"
          className="select-none"
        >
          {displayName}
        </text>

        {/* Número */}
        <text
          x="100"
          y="155"
          fill={textColor}
          textAnchor="middle"
          fontSize="54"
          fontWeight="900"
          fontFamily="'Teko', system-ui, sans-serif"
          className="select-none"
        >
          {displayNumber}
        </text>
      </svg>
    </div>
  );
};
