import styles from '../../pages/PetCarePage.module.css';
import { cn } from '../../utils/cn';

interface SpeechBubbleProps {
  text: string;
  visible: boolean;
  fading?: boolean;
}

export default function SpeechBubble({ text, visible, fading }: SpeechBubbleProps) {
  if (!visible) return null;

  return (
    <div className={cn(styles.speechBubble, fading && styles.speechBubbleFading)}>
      {text}
    </div>
  );
}
