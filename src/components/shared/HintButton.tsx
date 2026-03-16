import styles from './HintButton.module.css';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

export default function HintButton({ onClick, disabled }: Props) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      Nápověda (-3 body)
    </button>
  );
}
