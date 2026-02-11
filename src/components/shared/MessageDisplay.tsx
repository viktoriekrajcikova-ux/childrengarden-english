import styles from './MessageDisplay.module.css';

interface Props {
  text: string;
}

export default function MessageDisplay({ text }: Props) {
  return <div className={styles.message}>{text}</div>;
}
