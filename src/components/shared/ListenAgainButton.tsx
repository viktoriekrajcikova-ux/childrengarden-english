import styles from './ListenAgainButton.module.css';

interface Props {
  onClick: () => void;
}

export default function ListenAgainButton({ onClick }: Props) {
  return (
    <button className={styles.button} onClick={onClick} title="Poslechnout znovu">
      🔊
    </button>
  );
}
