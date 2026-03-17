import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { playDatesAtom } from '../store/atoms';

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a);
  const db = new Date(b);
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

export function useDailyStreak() {
  const [playDates, setPlayDates] = useAtom(playDatesAtom);

  const today = toDateString(new Date());

  const recordToday = () => {
    if (!playDates.includes(today)) {
      setPlayDates([...playDates, today]);
    }
  };

  const playedToday = playDates.includes(today);

  const currentStreak = useMemo(() => {
    if (playDates.length === 0) return 0;

    const sorted = [...playDates].sort();
    const lastDate = sorted[sorted.length - 1];

    // If last play was more than 1 day ago, streak is broken
    // (unless today is a play date or yesterday was)
    const daysFromToday = daysBetween(lastDate, today);
    if (daysFromToday > 1) return 0;

    // Count backwards from the most recent date
    let streak = 1;
    for (let i = sorted.length - 2; i >= 0; i--) {
      const gap = daysBetween(sorted[i], sorted[i + 1]);
      if (gap === 1) {
        streak++;
      } else if (gap === 0) {
        // Same day, skip
        continue;
      } else {
        break;
      }
    }
    return streak;
  }, [playDates, today]);

  const longestStreak = useMemo(() => {
    if (playDates.length === 0) return 0;

    const sorted = [...new Set(playDates)].sort();
    let longest = 1;
    let current = 1;

    for (let i = 1; i < sorted.length; i++) {
      const gap = daysBetween(sorted[i - 1], sorted[i]);
      if (gap === 1) {
        current++;
        longest = Math.max(longest, current);
      } else if (gap > 1) {
        current = 1;
      }
    }
    return longest;
  }, [playDates]);

  // Get play dates for a specific month (for calendar)
  const getMonthPlayDates = (year: number, month: number): Set<number> => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
    const days = new Set<number>();
    for (const d of playDates) {
      if (d.startsWith(prefix)) {
        days.add(parseInt(d.split('-')[2], 10));
      }
    }
    return days;
  };

  return {
    playDates,
    playedToday,
    currentStreak,
    longestStreak,
    recordToday,
    getMonthPlayDates,
    today,
  };
}
