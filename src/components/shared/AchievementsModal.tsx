import { useAtomValue } from 'jotai';
import { achievementsAtom } from '../../store/atoms';
import { ACHIEVEMENTS } from '../../data/achievements';
import { cn } from '../../utils/cn';
import styles from '../../pages/MapPage.module.css';

interface Props {
  onClose: () => void;
}

export default function AchievementsModal({ onClose }: Props) {
  const unlockedAchievements = useAtomValue(achievementsAtom);

  return (
    <div className={styles.achievementOverlay} onClick={onClose}>
      <div className={styles.achievementModal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.achievementTitle}>🏆 Úspěchy</h2>
        <div className={styles.achievementList}>
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedAchievements.includes(a.id);
            return (
              <div key={a.id} className={cn(styles.achievementItem, !unlocked && styles.achievementLocked)}>
                <span className={styles.achievementEmoji}>{unlocked ? a.emoji : '🔒'}</span>
                <div>
                  <div className={styles.achievementName}>{a.title}</div>
                  <div className={styles.achievementDesc}>{a.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button className={styles.achievementCloseBtn} onClick={onClose}>
          Zavřít
        </button>
      </div>
    </div>
  );
}
