import { cn } from '../../utils/cn';
import styles from './ItemCard.module.css';

interface Props {
  emoji: string;
  english?: string;
  czech: string;
  state?: 'idle' | 'clickable' | 'correct' | 'wrong' | 'hidden' | 'hint' | 'correctReveal';
  onClick?: () => void;
}

export default function ItemCard({ emoji, english, czech, state = 'idle', onClick }: Props) {
  const label = english ? `${english} – ${czech}` : czech;
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        styles.card,
        state === 'clickable' && styles.clickable,
        state === 'correct' && styles.correct,
        state === 'wrong' && styles.wrong,
        state === 'hidden' && styles.hidden,
        state === 'hint' && styles.hint,
        state === 'correctReveal' && styles.correctReveal,
      )}
      onClick={onClick}
    >
      <div className={styles.emoji} aria-hidden="true">{emoji}</div>
      {english && <div className={styles.english}>{english}</div>}
      <div className={styles.name}>{czech}</div>
    </button>
  );
}
