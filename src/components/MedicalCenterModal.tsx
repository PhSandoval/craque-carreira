import React, { useState } from 'react';
import { PlayerProfile, PlayerInjury } from '../types';
import { applyInjuryTreatment } from '../services/injuryAndMedicalService';
import { ShieldAlert, Activity, HeartPulse, Clock, Stethoscope, AlertTriangle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface MedicalCenterModalProps {
  player: PlayerProfile;
  injury: PlayerInjury;
  onClose: () => void;
  onUpdatePlayer: (updated: PlayerProfile) => void;
}

export const MedicalCenterModal: React.FC<MedicalCenterModalProps> = ({
  player,
  injury,
  onClose,
  onUpdatePlayer
}) => {
  const [selectedTreatment, setSelectedTreatment] = useState<'conservative' | 'accelerate' | 'sacrifice'>(
    injury.isPlayingOnSacrifice ? 'sacrifice' : 'conservative'
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleConfirmTreatment = () => {
    const { updatedPlayer, message } = applyInjuryTreatment(player, selectedTreatment);
    onUpdatePlayer(updatedPlayer);
    setFeedbackMessage(message);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const getLevelBadge = (level: PlayerInjury['level']) => {
    switch (level) {
      case 'leve':
        return { label: 'GRAU 1 • LEVE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'moderada':
        return { label: 'GRAU 2 • MODERADA', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
      case 'grave':
        return { label: 'GRAU 3 • GRAVE', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    }
  };

  const badge = getLevelBadge(injury.level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        
        {/* Cabeçalho do Boletim Médico */}
        <div className="px-6 py-5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Departamento Médico</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
              <h2 className="text-lg font-black text-white tracking-wide">
                Boletim Clínico & Laudo de Lesão
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Corpo do Laudo */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {feedbackMessage ? (
            <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-300">Conduta Médica Confirmada!</h3>
              <p className="text-xs text-slate-300">{feedbackMessage}</p>
            </div>
          ) : (
            <>
              {/* Card Diagnóstico Principal */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Diagnóstico por Imagem</span>
                    <h3 className="text-base font-black text-white">{injury.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{injury.roundsRemaining} {injury.roundsRemaining === 1 ? 'rodada restante' : 'rodadas restantes'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Motivo Biomecânico</span>
                    <p className="font-semibold text-slate-200">{injury.causeTitle}</p>
                    <p className="text-[11px] text-slate-400">{injury.causeDescription}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Região Afetada</span>
                    <p className="font-semibold text-slate-200 capitalize">Região da {injury.bodyPart}</p>
                    <p className="text-[11px] text-slate-400">
                      Impacto: -{injury.statDebuff?.penalty} em {injury.statDebuff?.stat}
                    </p>
                  </div>
                </div>

                {/* Laudo Oficial do Médico */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                  <Stethoscope className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-300">Parecer do Chefe do DM: </span>
                    <span className="text-slate-300 italic">"{injury.doctorReport}"</span>
                  </div>
                </div>
              </div>

              {/* Escolha da Conduta Médica */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Escolha Sua Conduta de Recuperação
                </span>

                <div className="space-y-2.5">
                  
                  {/* Opção 1: Protocolo Conservador */}
                  <label
                    onClick={() => setSelectedTreatment('conservative')}
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTreatment === 'conservative'
                        ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/50'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedTreatment === 'conservative' ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                        }`}>
                          {selectedTreatment === 'conservative' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className="font-bold text-slate-200 text-sm">Protocolo Fisioterápico Conservador (100% Seguro)</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        Padrão do DM
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 pl-6">
                      Cumpre o prazo recomendado pelo departamento médico com fisioterapia diária, gelo e liberação muscular. Zero risco de recaída.
                    </p>
                  </label>

                  {/* Opção 2: Tratamento Intensivo (3 períodos) */}
                  <label
                    onClick={() => setSelectedTreatment('accelerate')}
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTreatment === 'accelerate'
                        ? 'bg-purple-950/40 border-purple-500/80 ring-1 ring-purple-500/50'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedTreatment === 'accelerate' ? 'border-purple-400 bg-purple-500' : 'border-slate-600'
                        }`}>
                          {selectedTreatment === 'accelerate' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className="font-bold text-slate-200 text-sm">Fisioterapia Intensiva em 3 Períodos (Câmara Hiperbárica)</span>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        -1 Rodada
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 pl-6">
                      Você dobra a rotina com câmara hiperbárica e laser de alta potência para acelerar a regeneração. Reduz 1 rodada do prazo, mas consome energia e moral.
                    </p>
                  </label>

                  {/* Opção 3: Atuar no Sacrifício sob Infiltração */}
                  {injury.isSacrificeAllowed && (
                    <label
                      onClick={() => setSelectedTreatment('sacrifice')}
                      className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedTreatment === 'sacrifice'
                          ? 'bg-amber-950/40 border-amber-500/80 ring-1 ring-amber-500/50'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedTreatment === 'sacrifice' ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
                          }`}>
                            {selectedTreatment === 'sacrifice' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className="font-bold text-slate-200 text-sm">Atuar no Sacrifício sob Infiltração (Ir para o Jogo)</span>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Alto Risco
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 pl-6">
                        Você toma analgésicos fortes e vai para campo ajudar o time. A torcida e o técnico vão amar sua raça (+Torcida, +Técnico), mas seus atributos físicos cairão e há 35% de risco de agravar a lesão.
                      </p>
                    </label>
                  )}

                </div>
              </div>
            </>
          )}

        </div>

        {/* Rodapé com Botão de Ação */}
        {!feedbackMessage && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
            >
              Manter Decisão Atual
            </button>
            <button
              type="button"
              onClick={handleConfirmTreatment}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Confirmar Conduta com o DM</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
