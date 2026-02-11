import { cn } from '../../utils/cn';
import styles from './ItemCard.module.css';

interface Props {
  emoji: string;
  czech: string;
  state?: 'idle' | 'clickable' | 'correct' | 'wrong' | 'hidden';
  onClick?: () => void;
}

export default function ItemCard({ emoji, czech, state = 'idle', onClick }: Props) {
  return (
    <div
      className={cn(
        styles.card,
        state === 'clickable' && styles.clickable,
        state === 'correct' && styles.correct,
        state === 'wrong' && styles.wrong,
        state === 'hidden' && styles.hidden,
      )}
      onClick={onClick}
    >
      <div className={styles.emoji}>{emoji}</div>
      <div className={styles.name}>{czech}</div>
    </div>
  );
}
