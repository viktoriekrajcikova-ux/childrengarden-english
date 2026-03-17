import { useState } from 'react';
import { useDailyStreak } from '../../hooks/useDailyStreak';
import CalendarWidget from './CalendarWidget';
import styles from './DailyStreakBanner.module.css';

export default function DailyStreakBanner() {
  const { currentStreak, playedToday } = useDailyStreak();
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      <button
        className={styles.banner}
        onClick={() => setShowCalendar(true)}
      >
        <span className={styles.fireEmoji}>{currentStreak > 0 ? '🔥' : '💤'}</span>
        <div className={styles.info}>
          <span className={styles.count}>{currentStreak}</span>
          <span className={styles.label}>
            {currentStreak === 1 ? 'den' : currentStreak >= 2 && currentStreak <= 4 ? 'dny' : 'dní'}
          </span>
        </div>
        {playedToday && <span className={styles.checkmark}>✅</span>}
      </button>

      {showCalendar && (
        <div className={styles.overlay} onClick={() => setShowCalendar(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <CalendarWidget />
            <button className={styles.closeBtn} onClick={() => setShowCalendar(false)}>
              Zavřít
            </button>
          </div>
        </div>
      )}
    </>
  );
}
