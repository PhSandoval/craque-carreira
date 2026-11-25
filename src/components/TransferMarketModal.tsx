import React from 'react';
import { PlayerProfile, Club } from '../types';
import { CLUBS, getTransferOffersForPlayer, WORLD_TRANSFERS_FEED } from '../data/clubs';
import { getSavedClubSignings } from '../services/clubTransferAIService';
import { ensurePlayerEconomy, calculateContractOffer, formatEurCurrency } from '../services/economyAndContractService';
import { ClubBadge } from './ClubBadge';
import { 
  Briefcase, 
  ArrowRightLeft, 
  TrendingUp, 
  Sparkles, 
  Lock, 
  Calendar, 
  Search, 
  Check, 
  DollarSign, 
  X,
  ShieldCheck
} from 'lucide-react';

interface TransferMarketModalProps {
  player: PlayerProfile;
  onSelectTransferClub: (clubName: string) => void;
  onClose: () => void;
  embedded?: boolean;
}

export const TransferMarketModal: React.FC<TransferMarketModalProps> = ({
  player: rawPlayer,
  onSelectTransferClub,
  onClose,
  embedded = false
}) => {
  const player = ensurePlayerEconomy(rawPlayer);
  const currentClub = CLUBS[player.currentClub] || CLUBS['Grêmio Novorizontino'];
  const effectiveMatchDay = Math.max(player.currentMatchDay || 1, (player.currentSeasonStats?.games || 0) + 1);
  const isSeasonEnd = effectiveMatchDay > 38;
  const offersClubNames = getTransferOffersForPlayer(player.currentClub, player.ovr, player.age);

  // Clubes que monitoram o jogador (excluindo o clube atual)
  const interestedClubs = offersClubNames
    .filter(name => name !== player.currentClub)
    .map(name => CLUBS[name])
    .filter((c): c is Club => !!c);

  const clubSignings = getSavedClubSignings();

  const cardContent = (
    <div
      className={
        embedded
          ? 'relative w-full bg-[#12151c] border border-slate-800/80 rounded-3xl shadow-xl overflow-hidden flex flex-col'
          : 'relative w-full max-w-3xl bg-[#12151c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]'
      }
    >
        
        {/* Header */}
        <div className="bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Mercado da Bola & Transferências
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isSeasonEnd
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isSeasonEnd ? 'Janela Aberta' : 'Janela Fechada (Temporada Ativa)'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isSeasonEnd
                  ? 'Janela oficial de transferências de fim de temporada aberta para negociações!'
                  : `Temporada 2026 em andamento (Rodada ${effectiveMatchDay} de 38). Sondagens e scouts do mercado.`}
              </p>
            </div>
          </div>

          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* Card de Valor de Mercado e Vínculo Atual */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-700/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Vínculo Profissional em Vigor
              </span>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <ClubBadge club={currentClub} size="sm" />
                <span>{player.currentClub}</span>
              </h3>
              <p className="text-xs text-slate-300">
                Camisa #{player.number} • {player.ovr} OVR • Salário atual: <strong className="text-emerald-400">{formatEurCurrency(player.contract?.monthlySalaryEur || 15000)} / mês</strong> ({player.contract?.yearsRemaining || 3} ano(s))
              </p>
            </div>

            <div className="text-left sm:text-right bg-[#12151c]/70 p-3 rounded-xl border border-slate-800 shrink-0">
              <span className="text-[10px] font-bold text-slate-400 block">VALOR DE MERCADO</span>
              <span className="text-2xl font-black text-emerald-400 font-['Teko'] tracking-wider">
                €{player.marketValueEur.toFixed(1)}M
              </span>
            </div>
          </div>

          {/* Banner de Janela Fechada ou Aberta */}
          {!isSeasonEnd ? (
            <div className="bg-[#181d28] border border-amber-800/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                <span>Janela de Transferências Fechada (Meio de Temporada)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você já está sob contrato e defendendo o <strong>{player.currentClub}</strong> na <strong>Rodada {effectiveMatchDay} de 38</strong> da {currentClub.league}. Não é momento de decidir permanência ou saída: seu foco total é pontuar em campo e buscar o acesso/título!
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>A janela oficial de transferências abrirá após a <strong>Rodada 38</strong> (ao término do campeonato).</span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Janela de Fim de Temporada Aberta!</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                A temporada regular de 38 rodadas chegou ao fim! Chegou a hora de decidir os rumos do próximo ano: renove seu contrato com valorização salarial ou assine com um novo clube!
              </p>
            </div>
          )}

          {/* Se for Fim de Temporada: Propostas Oficiais na Mesa */}
          {isSeasonEnd ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>Propostas Oficiais na Mesa ({offersClubNames.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400">Baseado no seu OVR ({player.ovr})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offersClubNames.map(clubName => {
                  const targetClub = CLUBS[clubName];
                  if (!targetClub) return null;
                  const isCurrent = clubName === player.currentClub;
                  const offer = calculateContractOffer(targetClub, player, isCurrent);

                  return (
                    <div
                      key={clubName}
                      className="bg-[#181d28] border border-slate-700/80 hover:border-slate-500 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {isCurrent ? 'Renovação Contratual' : targetClub.league}
                          </span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            {formatEurCurrency(offer.monthlySalaryEur)} / mês
                          </span>
                        </div>

                        <div className="flex items-center space-x-2.5">
                          <ClubBadge club={targetClub} size="sm" />
                          <h4 className="font-bold text-white text-base truncate">{targetClub.name}</h4>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug">
                          Status: <strong className="text-slate-200">{offer.roleLabel}</strong> • {offer.years} anos • Luvas: <strong className="text-amber-300">{formatEurCurrency(offer.signingBonusEur)}</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectTransferClub(clubName);
                          onClose();
                        }}
                        className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all active:scale-95 ${
                          isCurrent
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/30'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-900/30'
                        }`}
                      >
                        {isCurrent ? `Renovar com ${targetClub.shortName}` : `Assinar com ${targetClub.shortName}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Se for Meio de Temporada: Radar de Sondagens & Clubes de Olho */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-sky-400" />
                  <span>Radar de Sondagens & Clubes de Olho ({interestedClubs.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400">Scouts e analistas de desempenho</span>
              </div>

              {interestedClubs.length === 0 ? (
                <div className="bg-[#181d28] p-4 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
                  Seus números estão em alta no {player.currentClub}. Continue somando gols e assistências para despertar o interesse da 1ª divisão!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {interestedClubs.map(targetClub => {
                    return (
                      <div
                        key={targetClub.id}
                        className="bg-[#181d28] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
                              {targetClub.league}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Olheiros no estádio
                            </span>
                          </div>

                          <div className="flex items-center space-x-2.5">
                            <ClubBadge club={targetClub} size="sm" />
                            <div>
                              <h4 className="font-bold text-white text-sm truncate">{targetClub.name}</h4>
                              <span className="text-[10px] text-slate-400">{targetClub.stadium}</span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-snug">
                            Scouts de {targetClub.coachName} acompanham suas atuações na {currentClub.league}. Monitorando para a janela de transferências ao fim da temporada!
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Previsão de Oferta:</span>
                          <span className="text-emerald-400 font-bold">Fim de 2026 (Rodada 38)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Seção: Reforços Estratégicos dos Clubes (IA por Formação, Estilo e Custos) */}
          {clubSignings.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reforços dos Clubes (Pensando em Formação & Estilo)</span>
                </h3>
                <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-mono">
                  {clubSignings.length} Contratações Ativas
                </span>
              </div>

              <div className="space-y-2.5">
                {clubSignings.slice(0, 5).map(signing => {
                  const targetClubObj = CLUBS[signing.clubName];
                  return (
                    <div
                      key={signing.id}
                      className="bg-[#151924] border border-amber-900/40 hover:border-amber-700/60 p-3.5 rounded-2xl text-xs space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {targetClubObj && <ClubBadge club={targetClubObj} size="xs" />}
                          <div>
                            <span className="font-black text-white">{signing.clubName}</span>
                            <span className="text-[10px] text-slate-400 block">
                              Esquema: {targetClubObj?.formation || '4-3-3'} • {signing.dateStr}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-emerald-400 font-mono">
                            €{signing.transferFeeEur}M
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Veio do {signing.previousClub}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#10141d] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300">{signing.player.name}</span>
                          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono text-[10px]">
                            {signing.player.position}
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">
                            {signing.player.ovr} OVR
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 italic">
                          {signing.reason}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-300 italic bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
                        {signing.coachQuote}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seção: Giro do Mercado Mundial (Transferências Reais) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Giro de Transferências pelo Mundo</span>
            </h3>

            <div className="space-y-2">
              {WORLD_TRANSFERS_FEED.map(event => (
                <div
                  key={event.id}
                  className="bg-[#181d28]/70 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs space-x-3"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">{event.playerName}</span>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {event.headline}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">{event.fromClub} ➔ {event.toClub}</span>
                    <span className="font-bold text-emerald-400">
                      {event.feeEur > 0 ? `€${event.feeEur}M` : 'Sem Custos'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Rodapé */}
        {!embedded && (
          <div className="bg-[#181d28] border-t border-slate-800 p-4 text-center">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors"
            >
              Fechar Janela
            </button>
          </div>
        )}

      </div>
  );

  if (embedded) return cardContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      {cardContent}
    </div>
  );
};
