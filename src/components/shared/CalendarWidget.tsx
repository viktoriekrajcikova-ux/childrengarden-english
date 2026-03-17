import { useState } from 'react';
import { useDailyStreak } from '../../hooks/useDailyStreak';
import styles from './CalendarWidget.module.css';

const DAY_NAMES = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const MONTH_NAMES = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

export default function CalendarWidget() {
  const { currentStreak, longestStreak, getMonthPlayDates, today } = useDailyStreak();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const playDays = getMonthPlayDates(viewYear, viewMonth);

  // First day of month (0=Sun, convert to Mon-start: 0=Mon)
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Monday-based
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayDay = today === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    ? now.getDate()
    : -1;

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    // Don't go past current month
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  return (
    <div className={styles.calendar}>
      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>🔥 {currentStreak}</span>
          <span className={styles.statLabel}>Aktuální série</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>🏆 {longestStreak}</span>
          <span className={styles.statLabel}>Nejdelší série</span>
        </div>
      </div>

      {/* Month navigation */}
      <div className={styles.header}>
        <button className={styles.navBtn} onClick={goPrev}>◀</button>
        <span className={styles.monthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button
          className={styles.navBtn}
          onClick={goNext}
          disabled={isCurrentMonth}
        >
          ▶
        </button>
      </div>

      {/* Day names */}
      <div className={styles.dayNames}>
        {DAY_NAMES.map((d) => (
          <span key={d} className={styles.dayName}>{d}</span>
        ))}
      </div>

      {/* Days grid */}
      <div className={styles.daysGrid}>
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <span key={`empty-${i}`} className={styles.emptyCell} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const played = playDays.has(day);
          const isToday = day === todayDay;

          return (
            <span
              key={day}
              className={`${styles.dayCell} ${played ? styles.played : ''} ${isToday ? styles.today : ''}`}
            >
              {played ? '⭐' : day}
            </span>
          );
        })}
      </div>
    </div>
  );
}
