import React from 'react';
import {
  Sparkles,
  Trophy,
  Dumbbell,
  Calendar,
  Newspaper,
  HeartPulse,
  AlertTriangle,
  Briefcase,
  Coins,
  X,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { triggerHaptic } from '../services/hapticsService';

export type CareerPopupCategory =
  | 'welcome'
  | 'training'
  | 'match_alert'
  | 'award'
  | 'finance'
  | 'injury'
  | 'suspension'
  | 'transfer_window'
  | 'news'
  | 'coach_note';

export interface CareerPopupHighlight {
  label: string;
  value: string;
  tone?: 'emerald' | 'amber' | 'sky' | 'rose' | 'purple';
}

export interface CareerPopupEvent {
  id: string;
  category: CareerPopupCategory;
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  highlights?: CareerPopupHighlight[];
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

interface EventPopupModalProps {
  event: CareerPopupEvent;
  onPrimary: () => void;
  onSecondary?: () => void;
  onDismiss: () => void;
}

const CATEGORY_THEMES: Record<
  CareerPopupCategory,
  { border: string; badgeBg: string; iconBg: string; buttonBg: string; icon: React.ReactNode }
> = {
  welcome: {
    border: 'border-emerald-500/60',
    badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/70',
    iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    buttonBg: 'bg-emerald-500 hover:bg-emerald-400 text-black',
    icon: <Sparkles className="w-6 h-6" />
  },
  training: {
    border: 'border-teal-500/60',
    badgeBg: 'bg-teal-950/90 text-teal-300 border-teal-700/70',
    iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    buttonBg: 'bg-teal-400 hover:bg-teal-300 text-black',
    icon: <Dumbbell className="w-6 h-6" />
  },
  match_alert: {
    border: 'border-amber-500/60',
    badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-700/70',
    iconBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black',
    icon: <Calendar className="w-6 h-6" />
  },
  award: {
    border: 'border-yellow-500/70',
    badgeBg: 'bg-yellow-950/90 text-yellow-300 border-yellow-600/70',
    iconBg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    buttonBg: 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black',
    icon: <Trophy className="w-6 h-6" />
  },
  finance: {
    border: 'border-emerald-500/60',
    badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/70',
    iconBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    buttonBg: 'bg-emerald-500 hover:bg-emerald-400 text-black',
    icon: <Coins className="w-6 h-6" />
  },
  injury: {
    border: 'border-rose-500/60',
    badgeBg: 'bg-rose-950/90 text-rose-300 border-rose-700/70',
    iconBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    buttonBg: 'bg-rose-500 hover:bg-rose-400 text-white',
    icon: <HeartPulse className="w-6 h-6" />
  },
  suspension: {
    border: 'border-orange-500/60',
    badgeBg: 'bg-orange-950/90 text-orange-300 border-orange-700/70',
    iconBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    buttonBg: 'bg-orange-500 hover:bg-orange-400 text-black',
    icon: <AlertTriangle className="w-6 h-6" />
  },
  transfer_window: {
    border: 'border-sky-500/60',
    badgeBg: 'bg-sky-950/90 text-sky-300 border-sky-700/70',
    iconBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    buttonBg: 'bg-sky-400 hover:bg-sky-300 text-black',
    icon: <Briefcase className="w-6 h-6" />
  },
  news: {
    border: 'border-blue-500/60',
    badgeBg: 'bg-blue-950/90 text-blue-300 border-blue-700/70',
    iconBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    buttonBg: 'bg-blue-500 hover:bg-blue-400 text-white',
    icon: <Newspaper className="w-6 h-6" />
  },
  coach_note: {
    border: 'border-purple-500/60',
    badgeBg: 'bg-purple-950/90 text-purple-300 border-purple-700/70',
    iconBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    buttonBg: 'bg-purple-400 hover:bg-purple-300 text-black',
    icon: <CheckCircle2 className="w-6 h-6" />
  }
};

export const EventPopupModal: React.FC<EventPopupModalProps> = ({
  event,
  onPrimary,
  onSecondary,
  onDismiss
}) => {
  const theme = CATEGORY_THEMES[event.category] || CATEGORY_THEMES.welcome;

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onDismiss}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-[#121620] border ${theme.border} rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 custom-scrollbar`}
      >
        {/* Cabeçalho do Pop-up */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${theme.iconBg}`}>
              {theme.icon}
            </div>
            <div className="space-y-1">
              <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}>
                {event.badge}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-xs font-semibold text-slate-400">
                  {event.subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              onDismiss();
            }}
            className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Texto principal explicativo */}
        <div className="bg-[#0d1118] border border-slate-800 rounded-2xl p-4">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Cards de destaque numéricos / tags */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {event.highlights.map((h, idx) => {
              const toneClass =
                h.tone === 'emerald'
                  ? 'text-emerald-300 border-emerald-800/60 bg-emerald-950/30'
                  : h.tone === 'amber'
                  ? 'text-amber-300 border-amber-800/60 bg-amber-950/30'
                  : h.tone === 'sky'
                  ? 'text-sky-300 border-sky-800/60 bg-sky-950/30'
                  : h.tone === 'rose'
                  ? 'text-rose-300 border-rose-800/60 bg-rose-950/30'
                  : h.tone === 'purple'
                  ? 'text-purple-300 border-purple-800/60 bg-purple-950/30'
                  : 'text-white border-slate-800 bg-[#171c28]';

              return (
                <div key={idx} className={`rounded-xl border p-2.5 text-center ${toneClass}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {h.label}
                  </span>
                  <span className="text-xs sm:text-sm font-black block mt-0.5 truncate">
                    {h.value}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              onPrimary();
            }}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${theme.buttonBg}`}
          >
            <span>{event.primaryActionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {event.secondaryActionLabel && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                if (onSecondary) onSecondary();
                else onDismiss();
              }}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-colors"
            >
              {event.secondaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
