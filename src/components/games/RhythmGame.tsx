import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { levels } from '../../data/levels';
import { filterByDifficulty } from '../../utils/difficultyFilter';
import { shuffleArray } from '../../utils/shuffle';
import type { LevelItem } from '../../types';
import { cn } from '../../utils/cn';
import GameHeader from '../shared/GameHeader';
import MessageDisplay from '../shared/MessageDisplay';
import { ROUNDS_REQUIRED, SCORE_CORRECT_DOUBLE, SCORE_PENALTY, DELAY_SHORT, DELAY_FEEDBACK, DELAY_WRONG, DELAY_TRANSITION } from '../../constants';
import styles from './RhythmGame.module.css';

interface Props {
  levelIndex: number;
}

export default function RhythmGame({ levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const setTimer = useTimers();

  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [sequence, setSequence] = useState<LevelItem[]>([]);
  const [playerSequence, setPlayerSequence] = useState<LevelItem[]>([]);
  const [availableItems, setAvailableItems] = useState<LevelItem[]>([]);
  const [displayItems, setDisplayItems] = useState<LevelItem[]>([]);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [canInput, setCanInput] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [instruction, setInstruction] = useState('Klikni na PLAY a poslouchej posloupnost slov!');
  const [message, setMessage] = useState('');
  const [playBtnDisabled, setPlayBtnDisabled] = useState(false);
  const allItemsRef = useRef<LevelItem[]>([]);

  useEffect(() => {
    if (!difficulty) return;
    let items: LevelItem[] = [];
    for (let i = 0; i < levelIndex; i++) {
      const l = levels[i];
      if (l.type === 'standard') {
        items = items.concat(filterByDifficulty(l.items, difficulty));
      }
    }
    allItemsRef.current = items;
    setAvailableItems(items);
  }, [difficulty, levelIndex]);

  const loadRound = useCallback(() => {
    const items = allItemsRef.current;
    if (items.length === 0) return;

    let seqLen = 3;
    if (difficulty === 'medium') seqLen = 4;
    else if (difficulty === 'hard') seqLen = 5;

    const shuffled = shuffleArray(items);
    const seq = shuffled.slice(0, seqLen);
    setSequence(seq);
    setPlayerSequence([]);
    setCanInput(false);
    setShowSubmit(false);
    setPlayBtnDisabled(false);
    setPlayingIndex(-1);
    setInstruction('Klikni na PLAY a poslouchej posloupnost slov!');

    // Build display items
    const uniqueNames = new Set<string>();
    const unique: LevelItem[] = [];
    seq.forEach((item) => {
      if (!uniqueNames.has(item.name)) {
        unique.push(item);
        uniqueNames.add(item.name);
      }
    });

    const distractorCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    const others = shuffleArray(items.filter((i) => !uniqueNames.has(i.name)));
    for (let i = 0; i < distractorCount && i < others.length; i++) {
      unique.push(others[i]);
    }

    setDisplayItems(shuffleArray(unique));
  }, [difficulty]);

  useEffect(() => {
    if (availableItems.length > 0) loadRound();
  }, [availableItems, loadRound]);

  const handlePlay = () => {
    setPlayBtnDisabled(true);
    setInstruction('Poslouchej pozorně...');

    sequence.forEach((item, index) => {
      setTimer(() => {
        setPlayingIndex(index);
        speak(item.name);
      }, index * DELAY_FEEDBACK);
    });

    setTimer(() => {
      setPlayingIndex(-1);
      setCanInput(true);
      setShowSubmit(true);
      setInstruction('Teď klikej na karty a zopakuj posloupnost!');
    }, sequence.length * DELAY_FEEDBACK + DELAY_SHORT);
  };

  const handleItemClick = (item: LevelItem) => {
    if (!canInput) return;
    const newSeq = [...playerSequence, item];
    setPlayerSequence(newSeq);

    if (newSeq.length === sequence.length) {
      setInstruction('Hotovo! Teď klikni na Zkontrolovat.');
    }
  };

  const handleRemoveItem = (index: number) => {
    setPlayerSequence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    let isCorrect = playerSequence.length === sequence.length;
    if (isCorrect) {
      for (let i = 0; i < sequence.length; i++) {
        if (playerSequence[i].name !== sequence[i].name) {
          isCorrect = false;
          break;
        }
      }
    }

    if (isCorrect) {
      const newRounds = roundsCompleted + 1;
      setRoundsCompleted(newRounds);
      addScore(SCORE_CORRECT_DOUBLE);
      setInstruction('🎉 Perfektní! +20 bodů');
      setMessage('🎉 Správně!');
      playFanfare();

      if (newRounds >= ROUNDS_REQUIRED) {
        setTimer(() => {
          setMessage('🎊 Level dokončen!');
          completeLevel(levelIndex);
        }, DELAY_WRONG);
      } else {
        setTimer(loadRound, DELAY_TRANSITION);
      }
    } else {
      subtractScore(SCORE_PENALTY);
      setInstruction('Klikni na PLAY a poslouchej znovu!');
      setMessage('❌ Špatně! Poslechni si to znovu.');
      playErrorSound();
      setPlayerSequence([]);
      setPlayBtnDisabled(false);
      setShowSubmit(false);
      setCanInput(false);
    }
  };

  const usedNames = new Set(playerSequence.map((i) => i.name));

  return (
    <div className={styles.wrapper}>
      <GameHeader emoji="🎵" title="Rytmická hra" />
      <div className={styles.progress}>
        Kolo {roundsCompleted + 1} / {ROUNDS_REQUIRED}
      </div>
      <div className={styles.instruction}>{instruction}</div>

      <div className={styles.sequenceDisplay}>
        {sequence.map((item, idx) => (
          <div
            key={idx}
            className={cn(styles.sequenceItem, playingIndex === idx && styles.playing)}
          >
            <div className={styles.sequenceEmoji}>{item.emoji}</div>
            <div className={styles.sequenceName}>{item.czech}</div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button className={styles.playBtn} onClick={handlePlay} disabled={playBtnDisabled}>
          🔊 PLAY
        </button>
        {showSubmit && (
          <button className={styles.submitBtn} onClick={handleSubmit}>
            ✓ Zkontrolovat
          </button>
        )}
      </div>

      <div className={cn(styles.playerInput, playerSequence.length > 0 && styles.hasItems)}>
        {playerSequence.length === 0 ? (
          <div className={styles.placeholder}>Klikej na karty níže a zopakuj posloupnost</div>
        ) : (
          playerSequence.map((item, idx) => (
            <div key={idx} className={styles.playerItem}>
              <div className={styles.itemEmoji}>{item.emoji}</div>
              <div className={styles.itemName}>{item.czech}</div>
              <button className={styles.removeBtn} onClick={() => handleRemoveItem(idx)}>
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.itemsGrid}>
        {displayItems.map((item) => (
          <div
            key={item.name}
            className={cn(styles.itemCard, usedNames.has(item.name) && styles.itemCardUsed)}
            onClick={() => handleItemClick(item)}
          >
            <div className={styles.itemEmoji}>{item.emoji}</div>
            <div className={styles.itemName}>{item.czech}</div>
          </div>
        ))}
      </div>

      <MessageDisplay text={message} />
    </div>
  );
}
