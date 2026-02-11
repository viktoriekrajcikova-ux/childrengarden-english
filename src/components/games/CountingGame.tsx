import { useState, useEffect, useCallback } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { shuffleArray } from '../../utils/shuffle';
import type { CountingLevel, CountingObject } from '../../types';
import { cn } from '../../utils/cn';
import GameHeader from '../shared/GameHeader';
import MessageDisplay from '../shared/MessageDisplay';
import { ROUNDS_REQUIRED, SCORE_CORRECT, SCORE_PENALTY, DELAY_SHORT, DELAY_WRONG, DELAY_TRANSITION, DELAY_WRONG_LONG } from '../../constants';
import styles from './CountingGame.module.css';

interface Props {
  level: CountingLevel;
  levelIndex: number;
}

export default function CountingGame({ level, levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const setTimer = useTimers();

  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [target, setTarget] = useState<CountingObject | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [displayObjects, setDisplayObjects] = useState<{ emoji: string; key: number }[]>([]);
  const [options, setOptions] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [buttonStates, setButtonStates] = useState<Record<number, 'idle' | 'correct' | 'incorrect'>>({});
  const [disabled, setDisabled] = useState(false);

  const loadRound = useCallback(() => {
    const objects = level.countingObjects;
    const obj = objects[Math.floor(Math.random() * objects.length)];
    setTarget(obj);

    const count = Math.floor(Math.random() * 10);
    setCorrectCount(count);

    const totalObjects = 15 + Math.floor(Math.random() * 6);
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
    let numOpts = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
    const opts = new Set<number>();
    opts.add(count);
    while (opts.size < numOpts) {
      const range = 3;
      let val = Math.max(0, Math.min(9, count + Math.floor(Math.random() * (range * 2 + 1)) - range));
      opts.add(val);
    }
    setOptions(shuffleArray([...opts]));
    setButtonStates({});
    setDisabled(false);

    const name = count === 1 ? obj.nameSingular : obj.name;
    setTimer(() => speak(`How many ${name} can you see?`, 0.9), DELAY_SHORT);
  }, [level.countingObjects, difficulty, speak, setTimer]);

  useEffect(() => {
    loadRound();
  }, [loadRound]);

  const handleAnswer = (selected: number) => {
    setDisabled(true);

    if (selected === correctCount) {
      setButtonStates((prev) => ({ ...prev, [selected]: 'correct' }));
      addScore(SCORE_CORRECT);
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
      setMessage(`❌ Špatně! Správná odpověď je ${correctCount}. -5 bodů`);
      playErrorSound();
      setTimer(loadRound, DELAY_WRONG_LONG);
    }
  };

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
      <MessageDisplay text={message} />
    </div>
  );
}
