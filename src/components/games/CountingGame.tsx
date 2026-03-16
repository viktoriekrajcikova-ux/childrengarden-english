import { useState, useEffect, useCallback } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { shuffleArray } from '../../utils/shuffle';
import type { CountingLevel, CountingObject } from '../../types';
import { cn } from '../../utils/cn';
import GameHeader from '../shared/GameHeader';
import MessageDisplay from '../shared/MessageDisplay';
import HintButton from '../shared/HintButton';
import { useStreak } from '../../hooks/useStreak';
import { useAdaptiveDifficulty } from '../../hooks/useAdaptiveDifficulty';
import { useIdleNudge } from '../../hooks/useIdleNudge';
import { useAudio } from '../../hooks/useAudio';
import { ROUNDS_REQUIRED, SCORE_CORRECT, SCORE_PENALTY, SCORE_HINT_COST, HINT_WRONG_THRESHOLD, STREAK_BONUS_3, STREAK_BONUS_5, DELAY_SHORT, DELAY_WRONG, DELAY_TRANSITION, DELAY_WRONG_LONG, COUNTING_MAX_TARGET, COUNTING_TOTAL_MIN, COUNTING_TOTAL_EXTRA, COUNTING_OPTION_RANGE } from '../../constants';
import styles from './CountingGame.module.css';

interface Props {
  level: CountingLevel;
  levelIndex: number;
}

export default function CountingGame({ level, levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const { playComboSound } = useAudio();
  const setTimer = useTimers();
  const { streak, incrementStreak, resetStreak } = useStreak();
  const baseNumOpts = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
  const { adjustedMax: adjustedNumOpts, recordCorrect: adaptiveCorrect, recordWrong: adaptiveWrong } = useAdaptiveDifficulty(baseNumOpts);

  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [target, setTarget] = useState<CountingObject | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [displayObjects, setDisplayObjects] = useState<{ emoji: string; key: number }[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [buttonStates, setButtonStates] = useState<Record<number, 'idle' | 'correct' | 'incorrect'>>({});
  const [disabled, setDisabled] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const { resetIdle } = useIdleNudge(speak, !disabled);

  const loadRound = useCallback(() => {
    const objects = level.countingObjects;
    if (objects.length === 0) return;
    const obj = objects[Math.floor(Math.random() * objects.length)];
    setTarget(obj);

    const count = Math.floor(Math.random() * COUNTING_MAX_TARGET);
    setCorrectCount(count);

    const totalObjects = COUNTING_TOTAL_MIN + Math.floor(Math.random() * COUNTING_TOTAL_EXTRA);
    const otherCount = totalObjects - count;
    const others = objects.filter((o) => o.name !== obj.name);

    const allObjs: { emoji: string; key: number }[] = [];
    for (let i = 0; i < count; i++) allObjs.push({ emoji: obj.emoji, key: i });
    for (let i = 0; i < otherCount; i++) {
      const r = others[Math.floor(Math.random() * others.length)];
      allObjs.push({ emoji: r.emoji, key: count + i });
    }

    setDisplayObjects(shuffleArray(allObjs));

    // Generate options
    const opts = new Set<number>();
    opts.add(count);
    while (opts.size < adjustedNumOpts) {
      let val = Math.max(0, Math.min(COUNTING_MAX_TARGET - 1, count + Math.floor(Math.random() * (COUNTING_OPTION_RANGE * 2 + 1)) - COUNTING_OPTION_RANGE));
      opts.add(val);
    }
    setOptions(shuffleArray([...opts]));
    setButtonStates({});
    setDisabled(false);
    setWrongCount(0);
    setHintUsed(false);

    const name = count === 1 ? obj.nameSingular : obj.name;
    setTimer(() => speak(`How many ${name} can you see?`, 0.9), DELAY_SHORT);
  }, [level.countingObjects, difficulty, adjustedNumOpts, speak, setTimer]);

  useEffect(() => {
    loadRound();
  }, [loadRound]);

  const handleAnswer = (selected: number) => {
    setDisabled(true);
    resetIdle();

    if (selected === correctCount) {
      setButtonStates((prev) => ({ ...prev, [selected]: 'correct' }));
      incrementStreak();
      adaptiveCorrect();
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 5 ? STREAK_BONUS_5 : nextStreak >= 3 ? STREAK_BONUS_3 : 0;
      addScore(SCORE_CORRECT + bonus);
      if (bonus > 0) playComboSound();
      playFanfare();
      speak(String(correctCount));

      const newRounds = roundsCompleted + 1;
      setRoundsCompleted(newRounds);

      if (newRounds >= ROUNDS_REQUIRED) {
        setMessage('🎊 Level dokončen! +10 bodů');
        setTimer(() => completeLevel(levelIndex), DELAY_WRONG);
      } else {
        const left = ROUNDS_REQUIRED - newRounds;
        setMessage(`🎉 Správně! +10 bodů (Zbývá ${left} ${left === 1 ? 'kolo' : 'kola'})`);
        setTimer(loadRound, DELAY_TRANSITION);
      }
    } else {
      setButtonStates((prev) => ({ ...prev, [selected]: 'incorrect', [correctCount]: 'correct' }));
      subtractScore(SCORE_PENALTY);
      speak(String(correctCount));
      const encouragements = ['Nevadí, zkus to znovu!', 'Skoro! Příště to bude!', 'Dobrý pokus!'];
      setMessage(`❌ ${encouragements[Math.floor(Math.random() * encouragements.length)]} Správně: ${correctCount}. -5 bodů`);
      playErrorSound();
      resetStreak();
      adaptiveWrong();
      setWrongCount((c) => c + 1);
      setTimer(loadRound, DELAY_WRONG_LONG);
    }
  };

  const handleHint = () => {
    subtractScore(SCORE_HINT_COST);
    setHintUsed(true);
    speak(String(correctCount));
    setMessage(`Nápověda: Správná odpověď je ${correctCount}.`);
  };

  const showHintBtn = wrongCount >= HINT_WRONG_THRESHOLD && !hintUsed && !disabled;

  const questionText = target
    ? `How many ${correctCount === 1 ? target.nameSingular : target.name} can you see?`
    : '';

  return (
    <div className={styles.wrapper}>
      <GameHeader emoji="🔢" title="Kolik jich vidíš?" />
      <div className={styles.question}>{questionText}</div>
      <div className={styles.objectsArea}>
        {displayObjects.map((obj) => (
          <div key={obj.key} className={styles.countingObject} style={{ animationDelay: `${obj.key * 0.05}s` }}>
            {obj.emoji}
          </div>
        ))}
      </div>
      <div className={styles.answers}>
        {options.map((opt) => (
          <button
            key={opt}
            className={cn(
              styles.answerButton,
              buttonStates[opt] === 'correct' && styles.correct,
              buttonStates[opt] === 'incorrect' && styles.incorrect,
            )}
            disabled={disabled}
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {showHintBtn && <HintButton onClick={handleHint} />}
      <MessageDisplay text={message} />
    </div>
  );
}
