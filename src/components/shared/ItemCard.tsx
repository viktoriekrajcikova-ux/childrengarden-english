import styles from './ItemCard.module.css';

interface Props {
  emoji: string;
  czech: string;
  state?: 'idle' | 'clickable' | 'correct' | 'wrong' | 'hidden';
  onClick?: () => void;
}

export default function ItemCard({ emoji, czech, state = 'idle', onClick }: Props) {
  const classes = [styles.card];
  if (state === 'clickable') classes.push(styles.clickable);
  if (state === 'correct') classes.push(styles.correct);
  if (state === 'wrong') classes.push(styles.wrong);
  if (state === 'hidden') classes.push(styles.hidden);

  return (
    <div className={classes.join(' ')} onClick={onClick}>
      <div className={styles.emoji}>{emoji}</div>
      <div className={styles.name}>{czech}</div>
    </div>
  );
}
