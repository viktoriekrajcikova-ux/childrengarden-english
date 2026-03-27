import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { scoreAtom } from '../../store/atoms';
import StreakIndicator from '../shared/StreakIndicator';
import AchievementToast from '../shared/AchievementToast';
import { useAchievements } from '../../hooks/useAchievements';
import { cn } from '../../utils/cn';
import styles from './GameLayout.module.css';

interface GameLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function GameLayout({ title, children, className }: GameLayoutProps) {
  const navigate = useNavigate();
  const score = useAtomValue(scoreAtom);
  const { toast, dismissToast } = useAchievements();

  return (
    <div className={styles.gameLayout}>
      {/* Horni lista */}
      <div className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <button className={styles.backButton} onClick={() => navigate('/map')}>
            <span className={styles.backIcon}>←</span>
            <span className={styles.backText}>Mapa</span>
          </button>
        </div>
        <div className={styles.navbarCenter}>
          <div className={styles.levelTitle}>{title}</div>
        </div>
        <div className={styles.navbarRight}>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreIcon}>⭐</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
        </div>
      </div>

      {/* Obsah */}
      <div className={styles.gameContent}>
        <div className={cn(styles.gameContainer, className)}>
          {children}
        </div>
      </div>

      <StreakIndicator />
      {toast && <AchievementToast achievement={toast} onDismiss={dismissToast} />}
    </div>
  );
}
