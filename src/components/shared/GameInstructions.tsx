import { useState } from 'react';
import { useAtom } from 'jotai';
import { seenTutorialsAtom } from '../../store/atoms';
import styles from './GameInstructions.module.css';

const INSTRUCTIONS: Record<string, { emoji: string; title: string; text: string }> = {
  standard: {
    emoji: '🎯',
    title: 'Najdi správný obrázek!',
    text: 'Klikni na PLAY, poslechni slovo a klikni na správný obrázek!',
  },
  memory: {
    emoji: '🎮',
    title: 'Pexeso',
    text: 'Najdi stejné dvojice karet!',
  },
  coloring: {
    emoji: '🎨',
    title: 'Omalovánka',
    text: 'Poslechni barvu a tvar, vyber barvu a klikni na tvar!',
  },
  dragDrop: {
    emoji: '🎯',
    title: 'Kam to patří?',
    text: 'Přetáhni obrázky na správné místo!',
  },
  counting: {
    emoji: '🔢',
    title: 'Kolik jich vidíš?',
    text: 'Spočítej obrázky a klikni na správné číslo!',
  },
  restaurant: {
    emoji: '🍽️',
    title: 'Restaurace',
    text: 'Přetáhni správný nápoj zákazníkovi!',
  },
  rhythm: {
    emoji: '🎵',
    title: 'Rytmická hra',
    text: 'Poslechni slova a zopakuj je ve správném pořadí!',
  },
};

interface Props {
  type: string;
  children: React.ReactNode;
}

export default function GameInstructions({ type, children }: Props) {
  const [seenTutorials, setSeenTutorials] = useAtom(seenTutorialsAtom);
  const [dismissed, setDismissed] = useState(false);

  const instruction = INSTRUCTIONS[type];
  const alreadySeen = seenTutorials.includes(type);

  if (!instruction || alreadySeen || dismissed) {
    return <>{children}</>;
  }

  const handleDismiss = () => {
    setSeenTutorials([...seenTutorials, type]);
    setDismissed(true);
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleDismiss}>
        <div className={styles.card} onClick={(e) => e.stopPropagation()}>
          <div className={styles.emoji}>{instruction.emoji}</div>
          <div className={styles.title}>{instruction.title}</div>
          <div className={styles.text}>{instruction.text}</div>
          <button className={styles.button} onClick={handleDismiss}>
            Rozumím!
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
