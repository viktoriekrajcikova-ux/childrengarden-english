import styles from '../../pages/PetCarePage.module.css';

interface SpeechBubbleProps {
  text: string;
  visible: boolean;
}

export default function SpeechBubble({ text, visible }: SpeechBubbleProps) {
  if (!visible) return null;

  return (
    <div className={styles.speechBubble}>
      {text}
    </div>
  );
}
