import type { Achievement } from '../../data/achievements';
import styles from './AchievementToast.module.css';

interface Props {
  achievement: Achievement;
  onDismiss: () => void;
}

export default function AchievementToast({ achievement, onDismiss }: Props) {
  return (
    <div className={styles.toast} onClick={onDismiss}>
      <span className={styles.emoji}>{achievement.emoji}</span>
      <div className={styles.content}>
        <span className={styles.label}>Nový úspěch!</span>
        <span className={styles.title}>{achievement.title}</span>
      </div>
    </div>
  );
}
