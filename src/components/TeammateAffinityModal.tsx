import React, { useState } from 'react';
import { PlayerProfile, TeammateAffinity } from '../types';
import { CLUBS } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { 
  getOrInitTeammateAffinities, 
  interactWithTeammate,
  LIFESTYLE_PERSONAS,
  LifestylePersonaMeta,
  setPlayerLifestylePersona,
  resolvePartyInvitationDilemma
} from '../services/teammateAffinityService';
import { 
  Users, 
  Heart, 
  AlertTriangle, 
  Sparkles, 
  MessageSquare, 
  Dumbbell, 
  Megaphone, 
  CheckCircle2, 
  X, 
  Filter, 
  Shield, 
  Zap,
  Handshake,
  Award,
  TrendingUp,
  Moon,
  PartyPopper,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';

interface TeammateAffinityModalProps {
  player: PlayerProfile;
  onUpdatePlayer: (updatedPlayer: PlayerProfile) => void;
  onClose: () => void;
  embedded?: boolean;
}

export const TeammateAffinityModal: React.FC<TeammateAffinityModalProps> = ({
  player,
  onUpdatePlayer,
  onClose,
  embedded = false
}) => {
  const currentClub = CLUBS[player.currentClub] || CLUBS['Grêmio Novorizontino'];
  const [affinitiesMap, setAffinitiesMap] = useState<Record<string, TeammateAffinity>>(() => 
    getOrInitTeammateAffinities(player, currentClub)
  );

  const [activeTab, setActiveTab] = useState<'elenco' | 'personalidade' | 'dilemas'>('personalidade');
  const [levelFilter, setLevelFilter] = useState<'all' | 'alta' | 'neutra' | 'baixa'>('all');
  const [cliqueFilter, setCliqueFilter] = useState<'all' | 'veteranos' | 'festeiros' | 'base' | 'profissionais'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<LifestylePersonaMeta['id']>(
    player.lifestylePersona || 'disciplinado_extremo'
  );

  const teammatesList = Object.values(affinitiesMap);

  const highAffinityCount = teammatesList.filter(t => t.level === 'alta').length;
  const neutralAffinityCount = teammatesList.filter(t => t.level === 'neutra').length;
  const lowAffinityCount = teammatesList.filter(t => t.level === 'baixa').length;

  const averageAffinity = teammatesList.length > 0
    ? Math.round(teammatesList.reduce((acc, t) => acc + t.affinity, 0) / teammatesList.length)
    : 70;

  const filteredTeammates = teammatesList.filter(t => {
    if (levelFilter !== 'all' && t.level !== levelFilter) return false;
    if (cliqueFilter !== 'all' && t.socialClique !== cliqueFilter) return false;
    return true;
  });

  const handleSelectPersona = (personaId: LifestylePersonaMeta['id']) => {
    setSelectedPersonaId(personaId);
    const { updatedPlayer, message } = setPlayerLifestylePersona(player, personaId);
    onUpdatePlayer(updatedPlayer);
    setAffinitiesMap(updatedPlayer.teammateAffinities || {});
    setFeedbackMessage(message);

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 6000);
  };

  const handleResolveDilemma = (choice: 'decline_focus' | 'accept_party' | 'diplomatic_short') => {
    const { updatedPlayer, resultMessage } = resolvePartyInvitationDilemma(player, choice);
    onUpdatePlayer(updatedPlayer);
    setAffinitiesMap(updatedPlayer.teammateAffinities || {});
    setFeedbackMessage(resultMessage);

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 6000);
  };

  const handleInteract = (
    teammateId: string, 
    action: 'chat' | 'train' | 'praise' | 'resolve_friction'
  ) => {
    const { updatedPlayer, resultMessage } = interactWithTeammate(player, teammateId, action);
    onUpdatePlayer(updatedPlayer);
    setAffinitiesMap(updatedPlayer.teammateAffinities || {});
    setFeedbackMessage(resultMessage);

    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4500);
  };

  const currentPersona = LIFESTYLE_PERSONAS.find(p => p.id === (player.lifestylePersona || selectedPersonaId)) || LIFESTYLE_PERSONAS[0];

  const cardContent = (
    <div
      className={
        embedded
          ? 'relative w-full bg-[#11151d] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col'
          : 'relative w-full max-w-4xl bg-[#12151c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]'
      }
    >
        {/* Header do Vestiário */}
        <div className={embedded ? 'px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between' : 'bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between'}>
          <div className="flex items-center space-x-3">
            {!embedded && <ClubBadge club={currentClub} size="md" />}
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Vestiário & Elenco</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  · {teammatesList.length} atletas
                </span>
              </h2>
              {!embedded && (
                <p className="text-xs text-slate-400">
                  {currentClub.name} • Sua personalidade extracampo dita alianças, químicas e atritos no vestiário.
                </p>
              )}
            </div>
          </div>

          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Feedback de Ação */}
        {feedbackMessage && (
          <div className="bg-gradient-to-r from-emerald-950 via-[#18232c] to-emerald-950 border-b border-emerald-700/60 px-4 py-2.5 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Indicadores Globais das Alas do Vestiário */}
        <div className="bg-[#141822] p-4 border-b border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Respeito dos Veteranos */}
            <div className="bg-[#181d28] p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Respeito Veteranos</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-amber-400 font-['Teko']">
                    {player.relationships.veteransRespect || 65}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Líderes 30+</span>
                </div>
              </div>
            </div>

            {/* Química da Ala Festeira */}
            <div className="bg-[#181d28] p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Química Festeiros</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-purple-400 font-['Teko']">
                    {player.relationships.partyCliqueChemistry || 60}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Resenha</span>
                </div>
              </div>
            </div>

            {/* Confiança do Treinador */}
            <div className="bg-[#181d28] p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Confiança Treinador</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-emerald-400 font-['Teko']">
                    {player.relationships.coach}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Minutagem</span>
                </div>
              </div>
            </div>

            {/* Média de Entrosamento */}
            <div className="bg-[#181d28] p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-700/50 flex items-center justify-center text-sky-400 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Média do Elenco</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-sky-400 font-['Teko']">
                    {averageAffinity}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Química geral</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Abas Superiores */}
        <div className="bg-[#11141c] px-4 sm:px-6 pt-3 border-b border-slate-800/80 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('personalidade')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'personalidade'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conduta Extracampo & Personalidade</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dilemas')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'dilemas'
                ? 'border-purple-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PartyPopper className="w-3.5 h-3.5 text-purple-400" />
            <span>Dilema da Noitada VIP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('elenco')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'elenco'
                ? 'border-sky-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>Mapeamento do Elenco ({filteredTeammates.length})</span>
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL SCROLLÁVEL */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* ABA 1: PERSONALIDADE & CONDUTA EXTRACAMPO */}
          {activeTab === 'personalidade' && (
            <div className="space-y-4">
              
              <div className="bg-[#181d28] p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Como a Sua Conduta Extracampo Afeta o Vestiário
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No futebol de alto rendimento, suas escolhas fora das quatro linhas definem quem se torna seu parceiro ou rival dentro do vestiário. 
                  Ao escolher <span className="text-white font-semibold">não sair para festas em nenhuma ocasião</span>, você perde a química e sofre atritos com a ala que adora balada e pagode (que te acha certinho demais), mas conquista a moral absoluta com os <span className="text-amber-400 font-semibold">capitães veteranos (30+ anos)</span> e a confiança do <span className="text-emerald-400 font-semibold">treinador</span>!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {LIFESTYLE_PERSONAS.map(persona => {
                  const isSelected = (player.lifestylePersona || selectedPersonaId) === persona.id;

                  return (
                    <div
                      key={persona.id}
                      onClick={() => handleSelectPersona(persona.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-[#1a2332] border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                          : 'bg-[#181d28] border-slate-800 hover:border-slate-700 hover:bg-[#1b212e]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-white text-sm">{persona.title}</h4>
                              {isSelected && (
                                <span className="text-[10px] bg-emerald-500 text-black font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> ATIVA
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-emerald-400 font-semibold block">
                              {persona.tagline}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed pt-1">
                          {persona.description}
                        </p>
                      </div>

                      {/* Efeitos Imediatos */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Respeito dos Veteranos:</span>
                          <span className={`font-bold font-mono ${persona.veteransDelta > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {persona.veteransDelta > 0 ? `+${persona.veteransDelta}%` : `${persona.veteransDelta}%`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Química com Festeiros:</span>
                          <span className={`font-bold font-mono ${persona.partyDelta > 0 ? 'text-purple-400' : 'text-rose-400'}`}>
                            {persona.partyDelta > 0 ? `+${persona.partyDelta}%` : `${persona.partyDelta}%`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Confiança do Treinador:</span>
                          <span className={`font-bold font-mono ${persona.coachDelta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {persona.coachDelta > 0 ? `+${persona.coachDelta}%` : `${persona.coachDelta}%`}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPersona(persona.id);
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Conduta Adotada</span>
                          </>
                        ) : (
                          <span>Adotar Esta Conduta</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Botão para avançar e ver os companheiros afetados */}
              <div className="bg-[#141822] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Conduta Atual: {currentPersona.title}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Veja como os jogadores do {currentClub.name} reagem à sua presença no CT.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('elenco')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Ver Elenco & Atritos</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ABA 2: DILEMA DE VESTIÁRIO (CONVITE NOITADA VIP) */}
          {activeTab === 'dilemas' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-950/40 via-[#181d28] to-[#141822] p-5 rounded-3xl border border-purple-800/40 space-y-3">
                <div className="flex items-center gap-2 text-purple-400">
                  <PartyPopper className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">Situação de Vestiário Pós-Jogo</span>
                </div>
                <h3 className="text-lg font-black text-white">
                  Convite para a Noitada VIP no Camarote dos Parças
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Após a rodada, a ala jovem e baladeira do time reservou um camarote badalado com direito a pagode e influenciadores. 
                  Eles vêm até o seu armário cobrar sua presença: <span className="italic text-purple-300">"Bora monstro, vitória merecida, você não vai amarelar e ficar dormindo hoje de novo, né?!"</span>
                </p>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  Enquanto isso, o capitão experiente de 34 anos e o preparador físico observam do outro lado do vestiário. 
                  Qual decisão você toma?
                </div>
              </div>

              <div className="space-y-3">
                
                {/* Opção 1: Recusar (Cenário do Usuário) */}
                <div className="bg-[#181d28] p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-bold text-white text-sm">
                          Recusar Categoricamente e Focar no Sono & CT
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 pt-1">
                        Você agradece o convite mas diz que seu corpo precisa descansar às 22h para treinar forte na manhã seguinte.
                      </p>
                    </div>
                    <span className="text-[10px] bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold px-2 py-0.5 rounded-full shrink-0">
                      Profissional
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
                    <span className="text-amber-400 font-bold">+18% Respeito Veteranos</span>
                    <span className="text-emerald-400 font-bold">+10% Treinador</span>
                    <span className="text-rose-400 font-bold">-15% Química com Festeiros (Atrito)</span>
                    <span className="text-slate-400 font-medium">0 Desgaste Físico</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleResolveDilemma('decline_focus')}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Escolher: Dormir Cedo & Foco Total</span>
                  </button>
                </div>

                {/* Opção 2: Aceitar Noitada */}
                <div className="bg-[#181d28] p-4 rounded-2xl border border-slate-800 hover:border-purple-500/60 transition-all space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <PartyPopper className="w-4 h-4 text-purple-400" />
                        <h4 className="font-bold text-white text-sm">
                          Cair na Noitada com os Parceiros de Time
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 pt-1">
                        Você aceita o convite, cola no camarote com os atacantes e aproveita a resenha até as 4h da manhã.
                      </p>
                    </div>
                    <span className="text-[10px] bg-purple-950 border border-purple-700 text-purple-300 font-bold px-2 py-0.5 rounded-full shrink-0">
                      Resenha
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
                    <span className="text-purple-400 font-bold">+22% Química com Festeiros</span>
                    <span className="text-rose-400 font-bold">-18% Respeito Veteranos (Cobrança)</span>
                    <span className="text-rose-400 font-bold">-10% Treinador</span>
                    <span className="text-amber-400 font-bold">-15% Energia Física</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleResolveDilemma('accept_party')}
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Escolher: Colar no Camarote com o Bonde</span>
                  </button>
                </div>

                {/* Opção 3: Passagem Diplomática */}
                <div className="bg-[#181d28] p-4 rounded-2xl border border-slate-800 hover:border-sky-500/60 transition-all space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Handshake className="w-4 h-4 text-sky-400" />
                        <h4 className="font-bold text-white text-sm">
                          Passagem Rápida & Diplomática (30 min)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 pt-1">
                        Você marca presença cordial no jantar/início do evento, parabeniza a todos e se despede às 22h sem beber nada.
                      </p>
                    </div>
                    <span className="text-[10px] bg-sky-950 border border-sky-700 text-sky-300 font-bold px-2 py-0.5 rounded-full shrink-0">
                      Diplomacia
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
                    <span className="text-sky-300 font-bold">+5% Elenco Geral</span>
                    <span className="text-emerald-400 font-bold">+3% Treinador</span>
                    <span className="text-slate-400 font-medium">-5% Energia Física</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleResolveDilemma('diplomatic_short')}
                    className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Escolher: Passagem Rápida e Educada</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ABA 3: MAPEAMENTO DO ELENCO COM FACÇÕES & ATRITOS */}
          {activeTab === 'elenco' && (
            <div className="space-y-4">
              
              {/* Barra de Filtros */}
              <div className="bg-[#181d28] p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                
                {/* Filtro por Facção/Ala */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold text-[11px]">Ala do Vestiário:</span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      onClick={() => setCliqueFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        cliqueFilter === 'all'
                          ? 'bg-white text-black'
                          : 'bg-[#12151c] text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      Todas ({teammatesList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCliqueFilter('veteranos')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        cliqueFilter === 'veteranos'
                          ? 'bg-amber-400 text-black'
                          : 'bg-[#12151c] text-amber-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Shield className="w-3 h-3 text-amber-400" />
                      <span>Veteranos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCliqueFilter('festeiros')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        cliqueFilter === 'festeiros'
                          ? 'bg-purple-400 text-black'
                          : 'bg-[#12151c] text-purple-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>Festeiros</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCliqueFilter('base')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        cliqueFilter === 'base'
                          ? 'bg-emerald-400 text-black'
                          : 'bg-[#12151c] text-emerald-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Base</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCliqueFilter('profissionais')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                        cliqueFilter === 'profissionais'
                          ? 'bg-sky-400 text-black'
                          : 'bg-[#12151c] text-sky-300 hover:text-white border border-slate-700'
                      }`}
                    >
                      <Users className="w-3 h-3 text-sky-400" />
                      <span>Profissionais</span>
                    </button>
                  </div>
                </div>

                {/* Filtro por Nível de Afinidade */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-bold text-[11px]">Afinidade:</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setLevelFilter('all')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        levelFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevelFilter('alta')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        levelFilter === 'alta' ? 'bg-emerald-500 text-black' : 'text-emerald-400 hover:text-emerald-300'
                      }`}
                    >
                      Alta ({highAffinityCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevelFilter('neutra')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        levelFilter === 'neutra' ? 'bg-sky-500 text-black' : 'text-sky-400 hover:text-sky-300'
                      }`}
                    >
                      Neutra ({neutralAffinityCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setLevelFilter('baixa')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        levelFilter === 'baixa' ? 'bg-rose-500 text-black' : 'text-rose-400 hover:text-rose-300'
                      }`}
                    >
                      Atrito ({lowAffinityCount})
                    </button>
                  </div>
                </div>

              </div>

              {/* Grid de Companheiros */}
              {filteredTeammates.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 bg-[#181d28] rounded-2xl border border-slate-800 p-6">
                  Nenhum jogador encontrado com os filtros selecionados.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredTeammates.map(teammate => {
                    const isHigh = teammate.level === 'alta';
                    const isLow = teammate.level === 'baixa';
                    const isVeteran = teammate.socialClique === 'veteranos';
                    const isParty = teammate.socialClique === 'festeiros';

                    return (
                      <div
                        key={teammate.playerId}
                        className={`bg-[#181d28] rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                          isHigh
                            ? 'border-emerald-600/40 hover:border-emerald-500'
                            : isLow
                            ? 'border-rose-700/50 hover:border-rose-600'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Topo do Card: Posição, Nome, OVR e Facção */}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-2.5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 font-['Teko'] ${
                                isHigh
                                  ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                                  : isLow
                                  ? 'bg-rose-950 border border-rose-700 text-rose-300'
                                  : 'bg-slate-800 border border-slate-700 text-slate-300'
                              }`}>
                                {teammate.position}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-white text-sm truncate">{teammate.name}</h4>
                                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                    {teammate.ovr} OVR
                                  </span>
                                </div>
                                <span className="text-[11px] text-slate-400 block">
                                  {teammate.personality} • {teammate.age} anos
                                </span>
                              </div>
                            </div>

                            {/* Badge da Facção / Ala Social */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${
                              isVeteran
                                ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                                : isParty
                                ? 'bg-purple-950/80 text-purple-300 border-purple-700'
                                : 'bg-slate-900 text-slate-300 border-slate-700'
                            }`}>
                              {isVeteran && <Shield className="w-2.5 h-2.5 text-amber-400" />}
                              {isParty && <Zap className="w-2.5 h-2.5 text-purple-400" />}
                              <span>{teammate.cliqueLabel || (isVeteran ? 'Ala dos Veteranos' : isParty ? 'Ala da Noitada' : 'Elenco')}</span>
                            </span>
                          </div>

                          {/* Barra de Afinidade */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 text-[11px]">Nível de Afinidade:</span>
                              <span className={`font-bold font-mono ${
                                isHigh ? 'text-emerald-400' : isLow ? 'text-rose-400' : 'text-sky-400'
                              }`}>
                                {teammate.affinity}% ({teammate.relationshipTitle})
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isHigh
                                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                                    : isLow
                                    ? 'bg-gradient-to-r from-rose-700 to-rose-500'
                                    : 'bg-gradient-to-r from-sky-600 to-sky-400'
                                }`}
                                style={{ width: `${teammate.affinity}%` }}
                              />
                            </div>
                          </div>

                          {/* Impacto em Campo */}
                          <div className="pt-0.5 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Bônus Tático em Campo:</span>
                            <span className={`font-bold ${
                              teammate.chemistryBonus > 0 ? 'text-emerald-300' : 'text-slate-500'
                            }`}>
                              {teammate.chemistryBonus > 0 
                                ? `+${teammate.chemistryBonus}% de precisão em tabelas` 
                                : 'Sem bônus ativo'}
                            </span>
                          </div>

                          {/* Motivo do Atrito ou Respeito por Conduta */}
                          {teammate.frictionReason ? (
                            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-[11px] text-rose-300 flex items-start gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-rose-200">Atrito de Vestiário: </span>
                                <span>{teammate.frictionReason}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-[#12151c] border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{teammate.lastInteraction}</span>
                            </div>
                          )}
                        </div>

                        {/* Ações de Vestiário */}
                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleInteract(teammate.playerId, 'chat')}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                            title="Bater papo informal e descontraído no CT"
                          >
                            <MessageSquare className="w-3 h-3 text-sky-400" />
                            <span>Resenha (+8%)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInteract(teammate.playerId, 'train')}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                            title="Treinar tabelas e triangulações juntos"
                          >
                            <Dumbbell className="w-3 h-3 text-emerald-400" />
                            <span>Treinar (+12%)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInteract(teammate.playerId, 'praise')}
                            className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                            title="Elogiar o companheiro em entrevista para a imprensa"
                          >
                            <Megaphone className="w-3 h-3 text-amber-400" />
                            <span>Elogiar (+15%)</span>
                          </button>

                          {isLow && (
                            <button
                              type="button"
                              onClick={() => handleInteract(teammate.playerId, 'resolve_friction')}
                              className="w-full py-1.5 px-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 border border-rose-700 text-rose-100 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                              title="Conversa franca no vestiário para aparar arestas"
                            >
                              <Handshake className="w-3.5 h-3.5 text-rose-300" />
                              <span>Aparar Arestas (Conversa Franca +25%)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Rodapé */}
        <div className="bg-[#181d28] border-t border-slate-800 p-4 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Vestiário do <span className="text-white font-bold">{currentClub.name}</span> • Alta afinidade com companheiros desbloqueia jogadas combinadas em campo.
          </div>
          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors"
            >
              Fechar Vestiário
            </button>
          )}
        </div>

      </div>
  );

  if (embedded) return cardContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      {cardContent}
    </div>
  );
};
