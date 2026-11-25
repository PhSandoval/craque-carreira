import React, { useState, useMemo } from 'react';
import { PlayerAttributes, Position } from '../types';
import { 
  hydrateFMAttributes, 
  FM_TECHNICAL_ATTRIBUTES, 
  FM_MENTAL_ATTRIBUTES, 
  FM_PHYSICAL_ATTRIBUTES,
  getFMAttributeBadge,
  FMAttributeMeta
} from '../services/footballManagerAttributes';
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Zap, 
  Info, 
  Shield, 
  Activity, 
  Award, 
  Compass, 
  CheckCircle2, 
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface FMAttributePanelProps {
  attributes: PlayerAttributes;
  position: Position;
}

interface RadarMetric {
  label: string;
  key: string;
  value: number;
}

export const FMAttributePanel: React.FC<FMAttributePanelProps> = React.memo(({
  attributes,
  position
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'mental' | 'physical'>('all');
  const [hoveredAttr, setHoveredAttr] = useState<FMAttributeMeta | null>(null);

  // Memoiza os atributos hidratados para evitar recálculo a cada frame/render
  const hydrated = useMemo(() => {
    return hydrateFMAttributes(attributes, position);
  }, [attributes, position]);

  const techAvg = useMemo(() => {
    const sum = FM_TECHNICAL_ATTRIBUTES.reduce((acc, m) => acc + ((hydrated as any)[m.key] ?? 65), 0);
    return Math.round(sum / FM_TECHNICAL_ATTRIBUTES.length);
  }, [hydrated]);

  const mentalAvg = useMemo(() => {
    const sum = FM_MENTAL_ATTRIBUTES.reduce((acc, m) => acc + ((hydrated as any)[m.key] ?? 65), 0);
    return Math.round(sum / FM_MENTAL_ATTRIBUTES.length);
  }, [hydrated]);

  const physAvg = useMemo(() => {
    const sum = FM_PHYSICAL_ATTRIBUTES.reduce((acc, m) => acc + ((hydrated as any)[m.key] ?? 65), 0);
    return Math.round(sum / FM_PHYSICAL_ATTRIBUTES.length);
  }, [hydrated]);

  // Métricas do Hexágono de Habilidades (Radar Polígono FM)
  const radarMetrics = useMemo<RadarMetric[]>(() => {
    const h = hydrated as any;

    const vel = Math.round(((h.aceleracao || 65) + (h.velocidade_ponta || 65) + (h.agilidade || 65)) / 3);
    const fin = Math.round(((h.finalizacao || 60) + (h.chutes_longe || 60) + (h.compostura || 65) + (h.cabeceio || 55)) / 4);
    const cri = Math.round(((h.visao_jogo || 65) + (h.passe || 65) + (h.cruzamentos || 60) + (h.bolas_paradas || 60)) / 4);
    const tec = Math.round(((h.drible || 65) + (h.primeiro_toque || 65) + (h.agilidade || 65)) / 3);
    const def = Math.round(((h.desarme || 40) + (h.marcacao || 40) + (h.posicionamento || 60) + (h.antecipacao || 60)) / 4);
    const fis = Math.round(((h.forca || 60) + (h.resistencia || 65) + (h.determinacao || 70) + (h.bravura || 60)) / 4);

    return [
      { label: 'Velocidade', key: 'vel', value: vel },
      { label: 'Finalização', key: 'fin', value: fin },
      { label: 'Criação', key: 'cri', value: cri },
      { label: 'Técnica', key: 'tec', value: tec },
      { label: 'Defesa', key: 'def', value: def },
      { label: 'Físico / Mental', key: 'fis', value: fis }
    ];
  }, [hydrated]);

  // Função recomendada e análise do olheiro / adjunto
  const scoutReport = useMemo(() => {
    const h = hydrated as any;

    // Detecta pontos mais fortes (top 2 atributos com maior nota)
    const allAttrEntries = [
      ...FM_TECHNICAL_ATTRIBUTES,
      ...FM_MENTAL_ATTRIBUTES,
      ...FM_PHYSICAL_ATTRIBUTES
    ].map(meta => ({
      ...meta,
      val: h[meta.key] ?? 65
    }));

    allAttrEntries.sort((a, b) => b.val - a.val);
    const topPros = allAttrEntries.slice(0, 3);
    const bottomCons = allAttrEntries.slice(-2);

    let bestRole = 'Meia Articulador';
    if (position === 'CA') bestRole = h.finalizacao >= 72 ? 'Atacante Avançado (Matador)' : 'Pivô de Referência';
    else if (position === 'PD' || position === 'PE') bestRole = h.drible >= 72 ? 'Extremo Invertido Incisivo' : 'Ponta Agudo de Linha de Fundo';
    else if (position === 'MEI') bestRole = h.visao_jogo >= 72 ? 'Camisa 10 Clássico (Maestro)' : 'Meia-Atacante Infiltrador';
    else if (position === 'MC') bestRole = h.passe >= 72 ? 'Construtor de Jogo Recuado (Regista)' : 'Médio Centro Completo';
    else if (position === 'VOL') bestRole = h.desarme >= 70 ? 'Primeiro Volante Destruidor' : 'Volante Construtor Moderno';
    else if (position === 'LD' || position === 'LE') bestRole = h.cruzamentos >= 68 ? 'Lateral Ofensivo Apoiador' : 'Lateral Defensivo Posicional';
    else if (position === 'ZAG') bestRole = h.antecipacao >= 70 ? 'Zagueiro Construtor de Saída' : 'Zagueiro Central Rebatedor';
    else if (position === 'GOL') bestRole = 'Goleiro Clássico Sob a Trave';

    return {
      bestRole,
      topPros,
      bottomCons
    };
  }, [hydrated, position]);

  const renderAttributeRow = (meta: FMAttributeMeta) => {
    const val = (hydrated as any)[meta.key] ?? 65;
    const badge = getFMAttributeBadge(val);

    return (
      <div
        key={meta.key}
        onMouseEnter={() => setHoveredAttr(meta)}
        className="group relative flex items-center justify-between p-2 rounded-xl bg-[#141822] hover:bg-[#1a202e] border border-slate-800/80 hover:border-slate-700 transition-colors cursor-help"
      >
        <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate pr-2">
          {meta.label}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-lg border font-mono font-bold ${badge.badgeBg} ${badge.badgeBorder} ${badge.colorClass}`}>
            {val}
          </span>
        </div>
      </div>
    );
  };

  // Cálculo dos pontos do SVG do Radar Hexagonal
  const radarSvgData = useMemo(() => {
    const size = 260;
    const center = size / 2;
    const radius = 95;
    const count = radarMetrics.length;

    // Níveis de fundo (25%, 50%, 75%, 100%)
    const levels = [0.25, 0.5, 0.75, 1.0];
    const gridPolygons = levels.map(level => {
      const points = radarMetrics.map((_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
        const r = radius * level;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return { level, points };
    });

    // Polígono de valor real do jogador
    const playerPoints = radarMetrics.map((m, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
      // Normaliza 0..100 para 0.2..1.0 para visualização agradável
      const normalizedRatio = Math.max(0.15, Math.min(1.0, m.value / 100));
      const r = radius * normalizedRatio;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Coordenadas das etiquetas
    const labelCoords = radarMetrics.map((m, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
      const r = radius + 22;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { ...m, x, y };
    });

    return { size, center, gridPolygons, playerPoints, labelCoords };
  }, [radarMetrics]);

  return (
    <div className="w-full bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-800/80 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Atributos Reais • Football Manager</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 font-mono">
                Posição: {position}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Grade completa de 28 atributos individuais calibrados por função tática e polígono de habilidades
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[#181d28] p-1 rounded-xl border border-slate-800 text-xs font-bold overflow-x-auto self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos (28)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap ${
              activeTab === 'technical'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Técnicos (11)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mental')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap ${
              activeTab === 'mental'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Mentais (10)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('physical')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap ${
              activeTab === 'physical'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Físicos (7)</span>
          </button>
        </div>
      </div>

      {/* 3 Pilares Rápidos: Técnicos, Mentais e Físicos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#181d28]/90 border border-purple-900/40 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-700/60 flex items-center justify-center text-purple-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilar Técnico</span>
              <span className="text-xs font-bold text-white">Refinamento & Gestos</span>
            </div>
          </div>
          <span className="text-base font-black text-purple-400 font-mono bg-purple-950/40 px-2.5 py-0.5 rounded-lg border border-purple-800/60">
            {techAvg}
          </span>
        </div>

        <div className="bg-[#181d28]/90 border border-sky-900/40 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-950/80 border border-sky-700/60 flex items-center justify-center text-sky-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilar Mental</span>
              <span className="text-xs font-bold text-white">Visão & Tomada de Decisão</span>
            </div>
          </div>
          <span className="text-base font-black text-sky-400 font-mono bg-sky-950/40 px-2.5 py-0.5 rounded-lg border border-sky-800/60">
            {mentalAvg}
          </span>
        </div>

        <div className="bg-[#181d28]/90 border border-amber-900/40 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilar Físico</span>
              <span className="text-xs font-bold text-white">Motor, Arranque & Força</span>
            </div>
          </div>
          <span className="text-base font-black text-amber-400 font-mono bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-800/60">
            {physAvg}
          </span>
        </div>
      </div>

      {/* Explicação flutuante do atributo selecionado ou hovered */}
      {hoveredAttr && (
        <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 flex items-center gap-2.5 animate-in fade-in duration-150">
          <Info className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong className="text-white font-bold">{hoveredAttr.label}:</strong> {hoveredAttr.description}
          </span>
        </div>
      )}

      {/* CORPO PRINCIPAL: 2 BLOCOS HARMONIOSOS NO DESKTOP (SEM VAZIOS PRETOS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* BLOCO ESQUERDO (7 COLUNAS): OS ATRIBUTOS DETALHADOS EM 3 COLUNAS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Coluna 1: TÉCNICOS */}
            {(activeTab === 'all' || activeTab === 'technical') && (
              <div className="bg-[#10131a] p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5" />
                    Técnicos
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">11 atributos</span>
                </div>
                <div className="space-y-1.5">
                  {FM_TECHNICAL_ATTRIBUTES.map(renderAttributeRow)}
                </div>
              </div>
            )}

            {/* Coluna 2: MENTAIS */}
            {(activeTab === 'all' || activeTab === 'mental') && (
              <div className="bg-[#10131a] p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Brain className="w-3.5 h-3.5" />
                    Mentais
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">10 atributos</span>
                </div>
                <div className="space-y-1.5">
                  {FM_MENTAL_ATTRIBUTES.map(renderAttributeRow)}
                </div>
              </div>
            )}

            {/* Coluna 3: FÍSICOS */}
            {(activeTab === 'all' || activeTab === 'physical') && (
              <div className="bg-[#10131a] p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" />
                    Físicos
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">7 atributos</span>
                </div>
                <div className="space-y-1.5">
                  {FM_PHYSICAL_ATTRIBUTES.map(renderAttributeRow)}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* BLOCO DIREITO (5 COLUNAS): RADAR POLÍGONO DE HABILIDADES + SCOUTING REPORT ESTILO FM */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Polígono Hexagonal de Habilidades (Radar SVG FM) */}
          <div className="bg-[#10131a] border border-slate-800/90 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-emerald-400" />
                Polígono de Habilidades (FM)
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                6 Eixos Táticos
              </span>
            </div>

            {/* Render do Radar SVG */}
            <div className="flex items-center justify-center py-2">
              <svg 
                viewBox={`0 0 ${radarSvgData.size} ${radarSvgData.size}`} 
                className="w-full max-w-[260px] h-auto drop-shadow-md"
              >
                {/* Linhas da grade concêntrica */}
                {radarSvgData.gridPolygons.map(({ level, points }) => (
                  <polygon
                    key={level}
                    points={points}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth={level === 1 ? '1.5' : '1'}
                    strokeDasharray={level === 1 ? 'none' : '2,2'}
                  />
                ))}

                {/* Eixos radiais do centro para os vértices */}
                {radarMetrics.map((_, i) => {
                  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / radarMetrics.length;
                  const x = radarSvgData.center + 95 * Math.cos(angle);
                  const y = radarSvgData.center + 95 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1={radarSvgData.center}
                      y1={radarSvgData.center}
                      x2={x}
                      y2={y}
                      stroke="#334155"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Polígono preenchido dos atributos do jogador */}
                <polygon
                  points={radarSvgData.playerPoints}
                  fill="rgba(16, 185, 129, 0.25)"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Vértices destacados com pequenos círculos */}
                {radarSvgData.playerPoints.split(' ').map((pt, i) => {
                  const [px, py] = pt.split(',').map(Number);
                  return (
                    <circle
                      key={i}
                      cx={px}
                      cy={py}
                      r="3.5"
                      fill="#10b981"
                      stroke="#0d1117"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Rótulos das Métricas ao redor do radar */}
                {radarSvgData.labelCoords.map((coord, i) => {
                  const isTop = coord.y < radarSvgData.center - 30;
                  const isBottom = coord.y > radarSvgData.center + 30;
                  const isLeft = coord.x < radarSvgData.center - 20;
                  const isRight = coord.x > radarSvgData.center + 20;

                  const textAnchor = isLeft ? 'end' : isRight ? 'start' : 'middle';
                  const dy = isTop ? '-6' : isBottom ? '14' : '4';

                  return (
                    <text
                      key={i}
                      x={coord.x}
                      y={coord.y}
                      dy={dy}
                      textAnchor={textAnchor}
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="system-ui"
                    >
                      {coord.label} <tspan fill="#10b981" fontWeight="900">({coord.value})</tspan>
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Card 2: Relatório do Olheiro / Comitê Técnico (Scouting Report) */}
          <div className="bg-[#10131a] border border-slate-800/90 rounded-2xl p-4 space-y-3.5 shadow-lg text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-amber-400" />
                Relatório da Comissão Técnica
              </span>
              <span className="text-[10px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800/60 font-bold">
                Scouting Oficial
              </span>
            </div>

            {/* Função Recomendada */}
            <div className="bg-[#181d28] p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Função Tática Recomendada para o Atleta:
              </span>
              <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>{scoutReport.bestRole}</span>
              </h4>
            </div>

            {/* Pontos Fortes (Prós) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Principais Pontos Fortes (Prós):
              </span>
              <div className="space-y-1">
                {scoutReport.topPros.map(pro => (
                  <div key={pro.key} className="flex items-center justify-between text-xs bg-[#141822] px-2.5 py-1.5 rounded-lg border border-emerald-950">
                    <span className="text-slate-200 font-medium">{pro.label}</span>
                    <span className="font-mono font-bold text-emerald-400">{pro.val} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pontos a Desenvolver (Contras) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Pontos a Desenvolver no Treino:
              </span>
              <div className="space-y-1">
                {scoutReport.bottomCons.map(con => (
                  <div key={con.key} className="flex items-center justify-between text-xs bg-[#141822] px-2.5 py-1.5 rounded-lg border border-amber-950">
                    <span className="text-slate-300 font-medium">{con.label}</span>
                    <span className="font-mono font-bold text-amber-400">{con.val} pts</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Legenda de Cores do Football Manager */}
      <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <span className="font-semibold text-slate-400">Escala Oficial de Cores Football Manager:</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-300 font-bold">82+ Elite Mundial</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-sky-300 font-bold">73-81 Muito Bom</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-amber-300 font-bold">64-72 Competente</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span className="text-slate-400 font-bold">&lt; 64 Em Evolução</span>
          </span>
        </div>
      </div>

    </div>
  );
});
