import styles from './PlayButton.module.css';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function PlayButton({ onClick, disabled = false, label = '▶️ PLAY' }: Props) {
  return (
    <button className={styles.playButton} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
