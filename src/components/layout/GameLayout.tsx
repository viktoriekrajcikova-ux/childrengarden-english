import LevelIndicator from './LevelIndicator';
import ScoreBoard from './ScoreBoard';
import BackToMapButton from './BackToMapButton';
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
  const { toast, dismissToast } = useAchievements();

  return (
    <>
      <LevelIndicator text={title} />
      <ScoreBoard />
      <BackToMapButton />
      <StreakIndicator />
      {toast && <AchievementToast achievement={toast} onDismiss={dismissToast} />}
      <div className={cn(styles.gameContainer, className)}>
        {children}
      </div>
    </>
  );
}
