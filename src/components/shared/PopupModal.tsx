import styles from './PopupModal.module.css';

interface Props {
  emoji: string;
  title: string;
  text: string;
  buttonText?: string;
  onAction: () => void;
}

export default function PopupModal({ emoji, title, text, buttonText = 'Vyzvednout!', onAction }: Props) {
  return (
    <div className={styles.overlay} onClick={onAction}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.emoji}>{emoji}</div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{text}</p>
        <button className={styles.button} onClick={onAction}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
