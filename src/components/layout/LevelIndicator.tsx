import styles from './LevelIndicator.module.css';

interface Props {
  text: string;
}

export default function LevelIndicator({ text }: Props) {
  return <div className={styles.levelIndicator}>{text}</div>;
}
