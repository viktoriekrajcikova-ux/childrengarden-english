import LevelIndicator from './LevelIndicator';
import ScoreBoard from './ScoreBoard';
import BackToMapButton from './BackToMapButton';
import { cn } from '../../utils/cn';
import styles from './GameLayout.module.css';

interface GameLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function GameLayout({ title, children, className }: GameLayoutProps) {
  return (
    <>
      <LevelIndicator text={title} />
      <ScoreBoard />
      <BackToMapButton />
      <div className={cn(styles.gameContainer, className)}>
        {children}
      </div>
    </>
  );
}
