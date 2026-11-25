/**
 * Sistema de Feedback Tátil (Vibração Exclusiva — ZERO Áudio/Som)
 * Utiliza navigator.vibrate() com padrões distintos por acontecimento de jogo.
 */

const HAPTICS_ENABLED_KEY = 'craque_haptics_enabled_v1';

export type HapticEventType =
  | 'goal_user'
  | 'goal_team'
  | 'goal_conceded'
  | 'yellow_card'
  | 'red_card'
  | 'injury'
  | 'decision_prompt'
  | 'whistle_end'
  | 'trophy_award'
  | 'opportunity'
  | 'purchase_money'
  | 'tap';

const HAPTIC_PATTERNS: Record<HapticEventType, number | number[]> = {
  goal_user: [100, 50, 100, 50, 260],
  goal_team: [80, 60, 140],
  goal_conceded: [320],
  yellow_card: [70, 50, 70],
  red_card: [180, 70, 180, 70, 240],
  injury: [220, 60, 90, 60, 90],
  decision_prompt: [35, 35, 55],
  whistle_end: [90, 60, 90, 60, 220],
  trophy_award: [70, 40, 70, 40, 110, 50, 280],
  opportunity: [40, 40, 80],
  purchase_money: [30, 30, 60],
  tap: [18]
};

export interface HapticTestItem {
  event: HapticEventType;
  label: string;
  description: string;
}

export const HAPTIC_TEST_ITEMS: HapticTestItem[] = [
  { event: 'goal_user', label: '⚽ Gol Seu!', description: 'Pulso triplo crescente de comemoração' },
  { event: 'yellow_card', label: '🟨 Cartão Amarelo / 🟥 Vermelho', description: 'Toque seco duplo de advertência' },
  { event: 'injury', label: '🚑 Lesão / Choque', description: 'Vibração longa seguida de alertas curtos' },
  { event: 'trophy_award', label: '🏆 Troféu / Craque', description: 'Fanfarra tátil de premiação' }
];

export function isHapticsSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

export function isHapticsEnabled(): boolean {
  try {
    const raw = localStorage.getItem(HAPTICS_ENABLED_KEY);
    if (raw === null) return true;
    return raw === 'true';
  } catch {
    return true;
  }
}

export function setHapticsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(HAPTICS_ENABLED_KEY, enabled ? 'true' : 'false');
    if (!enabled && isHapticsSupported()) {
      navigator.vibrate(0);
    }
  } catch {
    // ignore storage quota errors
  }
}

export function triggerHaptic(event: HapticEventType, forceTest: boolean = false): boolean {
  if (!isHapticsSupported()) return false;
  if (!forceTest && !isHapticsEnabled()) return false;
  const userActivation = (navigator as any)?.userActivation;
  if (userActivation && !userActivation.hasBeenActive) return false;

  const pattern = HAPTIC_PATTERNS[event];
  if (!pattern) return false;

  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}
