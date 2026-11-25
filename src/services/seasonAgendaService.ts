import { MatchFixture, MatchHistoryEntry, PlayerProfile } from '../types';
import { CLUBS, findClub } from '../data/clubs';
import { getNextMatchFixture } from './tournamentService';
import { getMonthInfoForRound } from './awardsService';

export interface AgendaRoundItem {
  round: number;
  monthIndex: number;
  monthLabel: string;
  dateLabel: string;
  status: 'completed' | 'current' | 'upcoming';
  fixture: MatchFixture;
  historyRecord?: MatchHistoryEntry;
  milestones: string[];
  isPaydayAndPotm: boolean;
  isFifaDate: boolean;
  isKnockout: boolean;
}

export interface AgendaMonthGroup {
  monthIndex: number;
  monthLabel: string;
  rounds: AgendaRoundItem[];
}

const WEEK_OFFSETS = ['04', '11', '18', '25'];

export function buildSeasonAgenda(player: PlayerProfile): {
  months: AgendaMonthGroup[];
  allRounds: AgendaRoundItem[];
  currentMonthIndex: number;
} {
  const currentRound = Math.max(1, Math.min(39, player.currentMatchDay || 1));
  const currentClub = CLUBS[player.currentClub] || findClub(player.currentClub);
  const isBrazil = (currentClub.country || 'Brasil') === 'Brasil';

  const historyByRound: Record<number, MatchHistoryEntry> = {};
  (player.matchHistory || []).forEach(entry => {
    if (entry.seasonYear === player.seasonYear) {
      historyByRound[entry.round] = entry;
    }
  });

  const allRounds: AgendaRoundItem[] = [];
  const monthBuckets: Record<number, AgendaMonthGroup> = {};

  for (let r = 1; r <= 38; r++) {
    const monthInfo = getMonthInfoForRound(r);
    const weekSlot = (r - monthInfo.startRound) % WEEK_OFFSETS.length;
    const dateLabel = `${WEEK_OFFSETS[weekSlot]} ${monthInfo.shortLabel}`;
    const fixture = getNextMatchFixture({ ...player, currentMatchDay: r });

    const status: AgendaRoundItem['status'] =
      r < currentRound ? 'completed' : r === currentRound ? 'current' : 'upcoming';

    const milestones: string[] = [];
    const isPaydayAndPotm = r % 4 === 0 && r <= 36;
    const isFifaDate = r === 10 || r === 24 || r === 38;

    if (isPaydayAndPotm) {
      milestones.push('💰 Salário + 🏆 Craque do Mês');
    }
    if (r === 10 || r === 24) {
      milestones.push('🌍 Data FIFA (Seleções)');
    }
    if (isBrazil && r === 8) {
      milestones.push('🏆 Final do Estadual');
    }
    if ((isBrazil && r === 34) || (!isBrazil && r === 35)) {
      milestones.push('🏆 Final da Copa Nacional');
    }
    if (r === 37) {
      milestones.push('⭐ Final Continental');
    }
    if (r === 38) {
      milestones.push('💼 Fim da Temporada & Bola de Ouro');
    }

    const item: AgendaRoundItem = {
      round: r,
      monthIndex: monthInfo.monthIndex,
      monthLabel: monthInfo.fullLabel,
      dateLabel,
      status,
      fixture,
      historyRecord: historyByRound[r],
      milestones,
      isPaydayAndPotm,
      isFifaDate,
      isKnockout: Boolean(fixture.isCupKnockout)
    };

    allRounds.push(item);

    if (!monthBuckets[monthInfo.monthIndex]) {
      monthBuckets[monthInfo.monthIndex] = {
        monthIndex: monthInfo.monthIndex,
        monthLabel: monthInfo.fullLabel,
        rounds: []
      };
    }
    monthBuckets[monthInfo.monthIndex].rounds.push(item);
  }

  const months = Object.values(monthBuckets).sort((a, b) => a.monthIndex - b.monthIndex);
  const currentMonthIndex = getMonthInfoForRound(Math.min(38, currentRound)).monthIndex;

  return { months, allRounds, currentMonthIndex };
}
