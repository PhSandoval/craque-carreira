import React, { useState } from 'react';
import { PlayerProfile, NewsArticle } from '../types';
import { getOrInitNewsFeed } from '../services/newsService';
import { 
  Newspaper, 
  X, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Filter, 
  Sparkles, 
  Calendar, 
  Mic, 
  TrendingUp, 
  ShieldAlert,
  Flame,
  Activity,
  Briefcase,
  Users
} from 'lucide-react';

interface NewsFeedModalProps {
  player: PlayerProfile;
  onClose: () => void;
  embedded?: boolean;
}

export const NewsFeedModal: React.FC<NewsFeedModalProps> = ({ player, onClose, embedded = false }) => {
  const [filter, setFilter] = useState<'all' | 'match' | 'interview' | 'transfer'>('all');
  
  // Obtém o feed dinâmico de notícias atualizado a cada jogo
  const newsList = getOrInitNewsFeed(player);

  const filteredNews = newsList.filter(article => {
    if (filter === 'all') return true;
    if (filter === 'match') return article.category === 'match' || article.category === 'milestone';
    if (filter === 'interview') return article.category === 'interview' || !!article.interviewQuote;
    if (filter === 'transfer') return article.category === 'transfer';
    return true;
  });

  const cardContent = (
    <div
      className={
        embedded
          ? 'relative w-full bg-[#11151d] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col'
          : 'relative w-full max-w-3xl bg-[#12151c] border border-blue-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]'
      }
    >
        {/* Header da Imprensa */}
        <div className={embedded ? 'px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between' : 'bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between'}>
          <div className="flex items-center space-x-3">
            {!embedded && (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-600/60 flex items-center justify-center text-blue-300 shadow-lg">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            )}
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Imprensa & Redes Sociais</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  · {newsList.length} reportagens
                </span>
              </h2>
              {!embedded && (
                <p className="text-xs text-slate-400">
                  Cobertura jornalística dos seus jogos, repercussão da torcida e manchetes no {player.currentClub}.
                </p>
              )}
            </div>
          </div>

          {!embedded && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Barra de Filtros */}
        <div className="bg-[#141822] px-4 sm:px-6 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-400">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Filtrar Notícias:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl font-bold text-xs transition-all ${
                filter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-[#181d28] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Todas ({newsList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('match')}
              className={`px-3 py-1 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                filter === 'match'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#181d28] text-emerald-400 hover:text-white border border-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Jogos & Rodadas</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('interview')}
              className={`px-3 py-1 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                filter === 'interview'
                  ? 'bg-sky-500 text-black'
                  : 'bg-[#181d28] text-sky-400 hover:text-white border border-slate-800'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Zona Mista</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('transfer')}
              className={`px-3 py-1 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                filter === 'transfer'
                  ? 'bg-amber-500 text-black'
                  : 'bg-[#181d28] text-amber-400 hover:text-white border border-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Mercado</span>
            </button>
          </div>
        </div>

        {/* Feed de Notícias Dinâmico */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {filteredNews.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 bg-[#181d28] rounded-2xl border border-slate-800 p-6">
              Nenhuma reportagem encontrada para esta categoria. Jogue novas partidas para ver a imprensa repercutir seus lances!
            </div>
          ) : (
            filteredNews.map(article => {
              const badgeClass = article.badgeColor || 'text-sky-400 border-sky-800 bg-sky-950/60';

              return (
                <article
                  key={article.id}
                  className="bg-[#181d28] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3.5 transition-all shadow-md"
                >
                  {/* Top Bar da Matéria: Veículo + Rodada/Data + Categoria */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`font-black uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                        {article.outlet}
                      </span>
                      <span className="text-slate-400 font-medium text-[11px]">
                        {article.dateStr}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                      {article.categoryLabel}
                    </span>
                  </div>

                  {/* Manchete Principal */}
                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {article.headline}
                  </h3>

                  {/* Corpo do Texto Jornalístico */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {article.snippet}
                  </p>

                  {/* Aspas / Declarações Oficiais se houver */}
                  {(article.interviewQuote || article.coachQuote) && (
                    <div className="space-y-2 pt-1">
                      {article.interviewQuote && (
                        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2">
                          <Mic className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-purple-300 uppercase block tracking-wider mb-0.5">
                              Declaração na Zona Mista:
                            </span>
                            <p className="italic text-slate-200">
                              {article.interviewQuote}
                            </p>
                          </div>
                        </div>
                      )}

                      {article.coachQuote && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                          <Users className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mb-0.5">
                              Coletiva do Treinador:
                            </span>
                            <p className="italic text-slate-300">
                              {article.coachQuote}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Caixa de Rede Social / Tweet do X */}
                  {article.socialMediaPost && (
                    <div className="bg-[#12151c] p-3.5 rounded-2xl border border-slate-800/90 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-200">
                          <span className="text-slate-400 font-normal">Post de</span>
                          <span className="text-sky-400">{article.socialMediaPost.author}</span>
                          <span className="text-slate-500 font-mono text-[10px]">{article.socialMediaPost.handle}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">no X</span>
                      </div>

                      <p className="text-slate-200 italic leading-relaxed text-xs">
                        "{article.socialMediaPost.text}"
                      </p>

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span className="flex items-center gap-1 text-rose-400 font-semibold">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{article.socialMediaPost.likes} curtidas</span>
                        </span>
                        {article.socialMediaPost.comments && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MessageSquare className="w-3 h-3" />
                            <span>{article.socialMediaPost.comments} comentários</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-500 ml-auto">
                          <Share2 className="w-3 h-3" />
                          <span>Compartilhar</span>
                        </span>
                      </div>
                    </div>
                  )}

                </article>
              );
            })
          )}
        </div>

        {/* Rodapé */}
        {!embedded && (
          <div className="bg-[#181d28] border-t border-slate-800 p-4 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 hidden sm:block">
              As notícias são atualizadas automaticamente após cada partida jogada no campeonato.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-lg shadow-blue-900/30"
            >
              Voltar ao Jogo
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
