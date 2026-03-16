import { useState, useEffect, useCallback } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { getItemsForLevel } from '../../utils/difficultyFilter';
import type { StandardLevel, LevelItem } from '../../types';
import PlayButton from '../layout/PlayButton';
import MessageDisplay from '../shared/MessageDisplay';
import ItemCard from '../shared/ItemCard';
import HintButton from '../shared/HintButton';
import { useStreak } from '../../hooks/useStreak';
import { useAdaptiveDifficulty } from '../../hooks/useAdaptiveDifficulty';
import { useIdleNudge } from '../../hooks/useIdleNudge';
import { useAchievements } from '../../hooks/useAchievements';
import { useAudio } from '../../hooks/useAudio';
import { SCORE_CORRECT, SCORE_PENALTY, SCORE_HINT_COST, HINT_WRONG_THRESHOLD, STREAK_BONUS_3, STREAK_BONUS_5, DELAY_FEEDBACK, DELAY_WRONG } from '../../constants';
import styles from '../../styles/grid.module.css';

type CardState = 'idle' | 'clickable' | 'correct' | 'wrong' | 'hidden' | 'hint' | 'correctReveal';

interface Props {
  level: StandardLevel;
  levelIndex: number;
}

export default function StandardGame({ level, levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const { playComboSound } = useAudio();
  const setTimer = useTimers();
  const { streak, incrementStreak, resetStreak } = useStreak();
  const { adjustedMax, recordCorrect: adaptiveCorrect, recordWrong: adaptiveWrong } = useAdaptiveDifficulty(level.maxDisplay);
  const { checkAndUnlock } = useAchievements();

  const [items, setItems] = useState<LevelItem[]>([]);
  const [remaining, setRemaining] = useState<LevelItem[]>([]);
  const [currentTarget, setCurrentTarget] = useState<LevelItem | null>(null);
  const [canClick, setCanClick] = useState(false);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [message, setMessage] = useState('');
  const [playDisabled, setPlayDisabled] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const { resetIdle } = useIdleNudge(speak, canClick);

  useEffect(() => {
    if (!difficulty) return;
    const selected = getItemsForLevel(level.items, adjustedMax, difficulty);
    setItems(selected);
    setRemaining([...selected]);
    setCurrentTarget(null);
    setCanClick(false);
    setMessage('');
    setPlayDisabled(false);
    setCardStates({});
    setWrongCount(0);
    setHintUsed(false);
  }, [level, difficulty, adjustedMax]);

  const handlePlay = useCallback(() => {
    if (remaining.length === 0) return;

    // Reset card states
    setCardStates((prev) => {
      const next: Record<string, CardState> = {};
      items.forEach((item) => {
        next[item.name] = prev[item.name] === 'hidden' ? 'hidden' : 'clickable';
      });
      return next;
    });

    const randomIndex = Math.floor(Math.random() * remaining.length);
    const target = remaining[randomIndex];
    setCurrentTarget(target);
    setCanClick(true);
    setWrongCount(0);
    setHintUsed(false);
    speak(target.name);
    setMessage('Klikni na správnou položku!');
    setPlayDisabled(true);
  }, [remaining, items, speak]);

  const handleHint = useCallback(() => {
    if (!currentTarget) return;
    subtractScore(SCORE_HINT_COST);
    setHintUsed(true);
    setCardStates((prev) => ({ ...prev, [currentTarget.name]: 'hint' }));
    speak(currentTarget.name);
    setMessage('Tady je nápověda! Klikni na zvýrazněnou kartu.');
  }, [currentTarget, subtractScore, speak]);

  const handleItemClick = useCallback(
    (itemName: string) => {
      if (!canClick || !currentTarget || cardStates[itemName] === 'hidden') return;
      setCanClick(false);
      resetIdle();

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
        incrementStreak();
        adaptiveCorrect();
        // streak is not yet updated in this render, so use streak+1 for bonus
        const nextStreak = streak + 1;
        const bonus = nextStreak >= 5 ? STREAK_BONUS_5 : nextStreak >= 3 ? STREAK_BONUS_3 : 0;
        addScore(SCORE_CORRECT + bonus);
        checkAndUnlock('streak_3', nextStreak >= 3);
        checkAndUnlock('streak_5', nextStreak >= 5);
        if (bonus > 0) {
          playComboSound();
          setMessage(`🎉 Správně! +${SCORE_CORRECT + bonus} bodů (combo bonus!)`);
        } else {
          setMessage('🎉 Správně! +10 bodů');
        }
        playFanfare();

        const newRemaining = remaining.filter((item) => item.name !== itemName);
        setRemaining(newRemaining);

        setTimer(() => {
          setCardStates((prev) => ({ ...prev, [itemName]: 'hidden' }));

          if (newRemaining.length === 0) {
            setTimer(() => {
              setMessage('🎊 Level dokončen!');
              completeLevel(levelIndex);
            }, DELAY_FEEDBACK);
          } else {
            setPlayDisabled(false);
          }
        }, DELAY_FEEDBACK);
      } else {
        setCardStates((prev) => ({ ...prev, [itemName]: 'wrong' }));
        subtractScore(SCORE_PENALTY);
        playErrorSound();
        resetStreak();
        adaptiveWrong();
        setWrongCount((c) => c + 1);

        // Show correct answer after wrong
        setCardStates((prev) => ({ ...prev, [itemName]: 'wrong', [currentTarget.name]: 'correctReveal' }));
        speak(currentTarget.name);

        const encouragements = ['Nevadí, zkus to znovu!', 'Skoro! Příště to bude!', 'Dobrý pokus!'];
        setMessage(`❌ ${encouragements[Math.floor(Math.random() * encouragements.length)]} -5 bodů`);

        setTimer(() => {
          setCardStates((prev) => {
            const next = { ...prev };
            if (next[itemName] === 'wrong') next[itemName] = 'idle';
            if (next[currentTarget.name] === 'correctReveal') next[currentTarget.name] = 'clickable';
            return next;
          });
          setPlayDisabled(false);
        }, DELAY_WRONG);
      }
    },
    [canClick, currentTarget, remaining, cardStates, addScore, subtractScore, playFanfare, playErrorSound, completeLevel, levelIndex, setTimer]
  );

  const showHintBtn = wrongCount >= HINT_WRONG_THRESHOLD && !hintUsed && currentTarget && canClick;

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
      {showHintBtn && <HintButton onClick={handleHint} />}
      <PlayButton onClick={handlePlay} disabled={playDisabled} />
    </>
  );
}
