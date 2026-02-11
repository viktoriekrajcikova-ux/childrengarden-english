import { useState, useEffect, useCallback } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { getItemsForLevel } from '../../utils/difficultyFilter';
import type { StandardLevel, LevelItem } from '../../types';
import PlayButton from '../layout/PlayButton';
import MessageDisplay from '../shared/MessageDisplay';
import ItemCard from '../shared/ItemCard';
import styles from '../../styles/grid.module.css';

interface Props {
  level: StandardLevel;
  levelIndex: number;
}

export default function StandardGame({ level, levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();

  const [items, setItems] = useState<LevelItem[]>([]);
  const [remaining, setRemaining] = useState<LevelItem[]>([]);
  const [currentTarget, setCurrentTarget] = useState<LevelItem | null>(null);
  const [canClick, setCanClick] = useState(false);
  const [cardStates, setCardStates] = useState<Record<string, 'idle' | 'clickable' | 'correct' | 'wrong' | 'hidden'>>({});
  const [message, setMessage] = useState('');
  const [playDisabled, setPlayDisabled] = useState(false);

  useEffect(() => {
    if (!difficulty) return;
    const selected = getItemsForLevel(level.items, level.maxDisplay, difficulty);
    setItems(selected);
    setRemaining([...selected]);
    setCurrentTarget(null);
    setCanClick(false);
    setMessage('');
    setPlayDisabled(false);
    setCardStates({});
  }, [level, difficulty]);

  const handlePlay = useCallback(() => {
    if (remaining.length === 0) return;

    // Reset card states
    setCardStates((prev) => {
      const next: typeof prev = {};
      items.forEach((item) => {
        next[item.name] = prev[item.name] === 'hidden' ? 'hidden' : 'clickable';
      });
      return next;
    });

    const randomIndex = Math.floor(Math.random() * remaining.length);
    const target = remaining[randomIndex];
    setCurrentTarget(target);
    setCanClick(true);
    speak(target.name);
    setMessage('Klikni na správnou položku!');
    setPlayDisabled(true);
  }, [remaining, items, speak]);

  const handleItemClick = useCallback(
    (itemName: string) => {
      if (!canClick || !currentTarget || cardStates[itemName] === 'hidden') return;
      setCanClick(false);

      // Remove clickable from all
      setCardStates((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] === 'clickable') next[k] = 'idle';
        });
        return next;
      });

      if (itemName === currentTarget.name) {
        setCardStates((prev) => ({ ...prev, [itemName]: 'correct' }));
        addScore(10);
        setMessage('🎉 Správně! +10 bodů');
        playFanfare();

        const newRemaining = remaining.filter((item) => item.name !== itemName);
        setRemaining(newRemaining);

        setTimeout(() => {
          setCardStates((prev) => ({ ...prev, [itemName]: 'hidden' }));

          if (newRemaining.length === 0) {
            setTimeout(() => {
              setMessage('🎊 Level dokončen!');
              completeLevel(levelIndex);
            }, 1000);
          } else {
            setPlayDisabled(false);
          }
        }, 1000);
      } else {
        setCardStates((prev) => ({ ...prev, [itemName]: 'wrong' }));
        subtractScore(5);
        setMessage('❌ Špatně! -5 bodů. Zkus to znovu.');
        playErrorSound();

        setTimeout(() => {
          setCardStates((prev) => ({ ...prev, [itemName]: 'idle' }));
          setPlayDisabled(false);
        }, 1500);
      }
    },
    [canClick, currentTarget, remaining, cardStates, addScore, subtractScore, playFanfare, playErrorSound, completeLevel, levelIndex]
  );

  return (
    <>
      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard
            key={item.name}
            emoji={item.emoji}
            czech={item.czech}
            state={cardStates[item.name] || 'idle'}
            onClick={() => handleItemClick(item.name)}
          />
        ))}
      </div>
      <MessageDisplay text={message} />
      <PlayButton onClick={handlePlay} disabled={playDisabled} />
    </>
  );
}
