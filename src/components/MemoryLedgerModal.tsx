import React, { useState } from 'react';
import { PlayerProfile, MemoryEvent } from '../types';
import { analyzePlayerDecisionProfile } from '../services/playerPersonaService';
import { 
  Brain, 
  Sparkles, 
  X, 
  Shield, 
  Tag, 
  Calendar, 
  Flame, 
  Target, 
  Compass, 
  MessageSquare, 
  Dumbbell, 
  Award, 
  TrendingUp, 
  Scale, 
  Zap,
  CheckCircle2,
  HelpCircle,
  Activity,
  Users,
  Heart
} from 'lucide-react';

interface MemoryLedgerModalProps {
  player: PlayerProfile;
  onClose: () => void;
}

export const MemoryLedgerModal: React.FC<MemoryLedgerModalProps> = ({ player, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline'>('profile');
  
  // Analisa detalhadamente as escolhas, decisões em campo, coletivas e treinos do atleta
  const decisionProfile = analyzePlayerDecisionProfile(player);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#12151c] border border-purple-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        
        {/* Header do Dossiê */}
        <div className="bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-600/60 flex items-center justify-center text-purple-300 shadow-lg">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Dossiê & Memória Contínua
                </h2>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-700/40">
                  {player.memories?.length || 0} fatos
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Raio-x do seu estilo de escolhas, perfil decisório sob pressão e histórico de carreira.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center border-b border-slate-800 bg-[#141822] px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Perfil & Estilo de Escolhas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'timeline'
                ? 'border-purple-500 text-purple-300 bg-purple-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Livro de Fatos Históricos ({player.memories?.length || 0})</span>
          </button>
        </div>

        {/* Corpo do Dossiê */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              
              {/* Card Destaque: Estilo Predominante de Escolhas */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/60 via-[#181d28] to-[#12151c] border border-purple-600/40 p-5 sm:p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-purple-400" />
                      Diagnóstico do Estilo Decisório
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/50">
                      {decisionProfile.styleBadge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Teko'] tracking-wide">
                    {decisionProfile.styleName}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {decisionProfile.tagline}
                  </p>
                </div>
              </div>

              {/* Barras de Tendência Decisória (%) */}
              <div className="bg-[#181d28] p-5 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Tendência de Decisões em Campo</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Calculado a partir de lances, treinos e coletivas</span>
                </div>

                <div className="space-y-3.5">
                  {/* Ousadia */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Ousadia & Finalização Individual</span>
                      </span>
                      <span className="text-rose-300 font-bold font-mono">{decisionProfile.tendencies.boldness}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-500"
                        style={{ width: `${decisionProfile.tendencies.boldness}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Preferência por arremates agudos, busca do ângulo e dribles para desmoralizar o marcador.
                    </p>
                  </div>

                  {/* Visão Coletiva */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-sky-400 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Visão Coletiva & Trabalho de Equipe</span>
                      </span>
                      <span className="text-sky-300 font-bold font-mono">{decisionProfile.tendencies.teamwork}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-500"
                        style={{ width: `${decisionProfile.tendencies.teamwork}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Passes entrelinhas, inversões rápidas, enfiadas de calcanhar e divisão de méritos na imprensa.
                    </p>
                  </div>

                  {/* Controle Tático */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Frieza Tática & Disciplina</span>
                      </span>
                      <span className="text-emerald-300 font-bold font-mono">{decisionProfile.tendencies.tactical}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${decisionProfile.tendencies.tactical}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Retenção no peito, cavar faltas para cadenciar o cronômetro e obediência à prancheta do técnico.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid de Métricas Rápidas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {decisionProfile.metrics.map((m, idx) => (
                  <div key={idx} className="bg-[#181d28] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                      <span className="text-sm">{m.icon}</span>
                    </div>
                    <div className={`text-lg sm:text-xl font-black font-['Teko'] ${m.color}`}>
                      {m.value}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight">
                      {m.subtext}
                    </div>
                  </div>
                ))}
              </div>

              {/* Relatório Psicológico & Análise Comportamental */}
              <div className="bg-[#181d28] p-5 rounded-3xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Relatório Psicológico & Tomada de Decisão</span>
                </h4>

                <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                  <div className="bg-[#12151c] p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                    <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <span>⚽</span>
                      <span>Comportamento com a Bola no Pé:</span>
                    </div>
                    <p className="text-slate-300">
                      {decisionProfile.psychologicalReport.pitchAnalysis}
                    </p>
                  </div>

                  <div className="bg-[#12151c] p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
                    <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      <span>Postura com a Imprensa & Microfones:</span>
                    </div>
                    <p className="text-slate-300">
                      {decisionProfile.psychologicalReport.mediaAnalysis}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-[#12151c] p-3 rounded-2xl border border-slate-800/80 space-y-1">
                      <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Visão do Técnico:</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {decisionProfile.psychologicalReport.coachPerception}
                      </p>
                    </div>

                    <div className="bg-[#12151c] p-3 rounded-2xl border border-slate-800/80 space-y-1">
                      <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>Visão da Torcida:</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {decisionProfile.psychologicalReport.fansPerception}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/20 rounded-2xl border border-emerald-800/40 text-[11px] text-emerald-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{decisionProfile.psychologicalReport.tacticalAdvice}</span>
                  </div>
                </div>
              </div>

              {/* Registro das Escolhas Recentes Mais Marcantes */}
              <div className="bg-[#181d28] p-5 rounded-3xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Últimas Decisões & Escolhas Registradas</span>
                </h4>

                <div className="space-y-2.5">
                  {decisionProfile.recentKeyDecisions.map((dec, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#12151c] p-3 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-purple-400 font-bold">{dec.date}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{dec.categoryLabel}</span>
                        </div>
                        <div className="text-xs font-bold text-white">{dec.title}</div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{dec.detail}</p>
                      </div>

                      <div className="shrink-0">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${dec.badgeColor}`}>
                          {dec.styleBadge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags de Personalidade e Reputação */}
              <div className="bg-[#181d28] p-4 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Tag className="w-4 h-4 text-purple-400" />
                  <span>Arquétipo & Reputação no Futebol</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {player.personalityTags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-purple-950/60 text-purple-200 border border-purple-800/60 text-xs px-3 py-1 rounded-xl font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                  <span className="bg-slate-800 text-slate-400 text-xs px-3 py-1 rounded-xl font-medium">
                    Pé Dominante: {player.preferredFoot}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* Aba: Livro de Fatos Históricos */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Linha do Tempo de Memórias Registradas</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {player.memories?.length || 0} acontecimentos
                </span>
              </div>

              {player.memories.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 bg-[#181d28] rounded-2xl border border-slate-800 p-6">
                  Nenhum fato histórico registrado ainda. Suas decisões em partidas, treinos e coletivas de imprensa aparecerão aqui.
                </div>
              ) : (
                <div className="space-y-3">
                  {player.memories.map(mem => (
                    <div
                      key={mem.id}
                      className="bg-[#181d28] border border-slate-800 hover:border-purple-800/70 rounded-2xl p-4 space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-400">{mem.dateStr}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          mem.importance === 'lendaria'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : mem.importance === 'alta'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {mem.importance}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm">{mem.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{mem.description}</p>

                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Consequência permanente: {mem.impactSummary}</span>
                        </div>
                        {mem.tags && mem.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {mem.tags.slice(0, 3).map((t, i) => (
                              <span key={i} className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="bg-[#181d28] border-t border-slate-800 p-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Estilo Atual: <span className="text-purple-300 font-bold">{decisionProfile.styleName}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-900/30"
          >
            Fechar Dossiê
          </button>
        </div>
      </div>
    </div>
  );
};
