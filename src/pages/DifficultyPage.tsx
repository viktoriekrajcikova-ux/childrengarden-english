import { useNavigate } from 'react-router-dom';
import { useSetAtom, useAtomValue } from 'jotai';
import { difficultyAtom, hasHatchedAtom } from '../store/atoms';
import { useAudio } from '../hooks/useAudio';
import type { Difficulty } from '../types';
import styles from './DifficultyPage.module.css';

const difficulties: { key: Difficulty; emoji: string; name: string; description: string }[] = [
  { key: 'easy', emoji: '🐣', name: 'Kuřátko', description: 'Pro začátečníky\nVíce času, jednodušší slova' },
  { key: 'medium', emoji: '🦊', name: 'Lištička', description: 'Pro mírně pokročilé\nStandardní obtížnost' },
  { key: 'hard', emoji: '🦁', name: 'Lev', description: 'Pro pokročilé\nRychlejší tempo' },
];

export default function DifficultyPage() {
  const setDifficulty = useSetAtom(difficultyAtom);
  const hasHatched = useAtomValue(hasHatchedAtom);
  const navigate = useNavigate();
  const { playGameStartSound } = useAudio();

  const selectDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    playGameStartSound();
    navigate(hasHatched ? '/map' : '/egg-hatch');
  };

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <h1 className={styles.title}>🎮 Angličtina do školky</h1>
        <h2 className={styles.subtitle}>Vyber si obtížnost:</h2>
        <div className={styles.cards}>
          {difficulties.map((d) => (
            <div key={d.key} className={styles.card} onClick={() => selectDifficulty(d.key)}>
              <div className={styles.cardEmoji}>{d.emoji}</div>
              <div className={styles.cardName}>{d.name}</div>
              <div className={styles.cardDescription}>
                {d.description.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
