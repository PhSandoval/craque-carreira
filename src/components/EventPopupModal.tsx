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

const CATEGORY_ICONS: Record<CareerPopupCategory, { accent: string; icon: React.ReactNode }> = {
  welcome: { accent: 'text-emerald-400 bg-emerald-500/10', icon: <Sparkles className="w-5 h-5" /> },
  training: { accent: 'text-teal-400 bg-teal-500/10', icon: <Dumbbell className="w-5 h-5" /> },
  match_alert: { accent: 'text-amber-400 bg-amber-500/10', icon: <Calendar className="w-5 h-5" /> },
  award: { accent: 'text-yellow-400 bg-yellow-500/10', icon: <Trophy className="w-5 h-5" /> },
  finance: { accent: 'text-emerald-400 bg-emerald-500/10', icon: <Coins className="w-5 h-5" /> },
  injury: { accent: 'text-rose-400 bg-rose-500/10', icon: <HeartPulse className="w-5 h-5" /> },
  suspension: { accent: 'text-orange-400 bg-orange-500/10', icon: <AlertTriangle className="w-5 h-5" /> },
  transfer_window: { accent: 'text-sky-400 bg-sky-500/10', icon: <Briefcase className="w-5 h-5" /> },
  news: { accent: 'text-blue-400 bg-blue-500/10', icon: <Newspaper className="w-5 h-5" /> },
  coach_note: { accent: 'text-purple-400 bg-purple-500/10', icon: <CheckCircle2 className="w-5 h-5" /> }
};

export const EventPopupModal: React.FC<EventPopupModalProps> = ({
  event,
  onPrimary,
  onSecondary,
  onDismiss
}) => {
  const meta = CATEGORY_ICONS[event.category] || CATEGORY_ICONS.welcome;

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onDismiss}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md max-h-[88dvh] overflow-y-auto bg-[#12161f] border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 custom-scrollbar"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.accent}`}>
              {meta.icon}
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {event.badge}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="text-xs text-slate-400">{event.subtitle}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              onDismiss();
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
          {event.description}
        </p>

        {event.highlights && event.highlights.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {event.highlights.map((h, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-center"
              >
                <span className="text-[10px] font-semibold uppercase text-slate-500 block">
                  {h.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white block mt-0.5 truncate">
                  {h.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap');
              onPrimary();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
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
              className="py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-semibold text-xs sm:text-sm transition-colors"
            >
              {event.secondaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
