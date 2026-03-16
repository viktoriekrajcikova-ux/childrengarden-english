import { useAtomValue } from 'jotai';
import { streakAtom } from '../../store/atoms';
import { STREAK_BONUS_3, STREAK_BONUS_5 } from '../../constants';
import styles from './StreakIndicator.module.css';

export default function StreakIndicator() {
  const streak = useAtomValue(streakAtom);

  if (streak < 3) return null;

  const bonus = streak >= 5 ? STREAK_BONUS_5 : STREAK_BONUS_3;

  return (
    <div className={styles.wrapper}>
      <span className={styles.indicator} key={streak}>
        {streak}x combo! +{bonus} bonus
      </span>
    </div>
  );
}
