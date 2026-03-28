import { useAtomValue } from 'jotai';
import { achievementsAtom } from '../../store/atoms';
import { ACHIEVEMENTS } from '../../data/achievements';
import { cn } from '../../utils/cn';
import styles from './AchievementsModal.module.css';

interface Props {
  onClose: () => void;
}

export default function AchievementsModal({ onClose }: Props) {
  const unlockedAchievements = useAtomValue(achievementsAtom);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>🏆 Úspěchy</h2>
        <div className={styles.list}>
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedAchievements.includes(a.id);
            return (
              <div key={a.id} className={cn(styles.item, !unlocked && styles.locked)}>
                <span className={styles.emoji}>{unlocked ? a.emoji : '🔒'}</span>
                <div>
                  <div className={styles.name}>{a.title}</div>
                  <div className={styles.desc}>{a.description}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          Zavřít
        </button>
      </div>
    </div>
  );
}
