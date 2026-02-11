import styles from './GameHeader.module.css';

interface GameHeaderProps {
  emoji: string;
  title: string;
}

export default function GameHeader({ emoji, title }: GameHeaderProps) {
  return <h2 className={styles.title}>{emoji} {title}</h2>;
}
