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
import { SCORE_CORRECT_DOUBLE, DELAY_SHORT, DELAY_FEEDBACK, DELAY_WRONG } from '../../constants';
import styles from './MemoryGame.module.css';

interface Props {
  levelIndex: number;
}

interface MemoryCard {
  item: LevelItem;
  id: number;
}

export default function MemoryGame({ levelIndex }: Props) {
  const { difficulty, addScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const setTimer = useTimers();

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('Klikni na karty a najdi stejné dvojice!');
  const canFlipRef = useRef(true);
  const matchedPairsRef = useRef(0);

  useEffect(() => {
    if (!difficulty) return;

    let allItems: LevelItem[] = [];
    for (let i = 0; i < 5; i++) {
      const l = levels[i];
      if (l.type === 'standard') {
        allItems = allItems.concat(filterByDifficulty(l.items, difficulty));
      }
    }

    const selected = shuffleArray(allItems).slice(0, 8);
    const pairs: MemoryCard[] = [...selected, ...selected].map((item, idx) => ({
      item,
      id: idx,
    }));
    setCards(shuffleArray(pairs));
    setFlipped([]);
    setMatched(new Set());
    matchedPairsRef.current = 0;
    canFlipRef.current = true;
  }, [difficulty]);

  const handleCardClick = useCallback(
    (cardId: number, item: LevelItem) => {
      if (!canFlipRef.current) return;
      if (flipped.includes(cardId)) return;
      if (matched.has(item.name) && flipped.length === 0) return;

      speak(item.name);

      const newFlipped = [...flipped, cardId];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        canFlipRef.current = false;
        const first = cards.find((c) => c.id === newFlipped[0])!;
        const second = cards.find((c) => c.id === newFlipped[1])!;

        if (first.item.name === second.item.name) {
          setTimer(() => {
            setMatched((prev) => new Set([...prev, first.item.name]));
            addScore(SCORE_CORRECT_DOUBLE);
            setMessage('🎉 Skvělé! Našel jsi pár! +20 bodů');
            playFanfare();

            matchedPairsRef.current++;
            if (matchedPairsRef.current === 8) {
              setTimer(() => {
                setMessage('🎊 Level dokončen!');
                completeLevel(levelIndex);
              }, DELAY_FEEDBACK);
            }

            setFlipped([]);
            canFlipRef.current = true;
          }, DELAY_SHORT);
        } else {
          setMessage('❌ Neshodují se, zkus znovu!');
          playErrorSound();
          setTimer(() => {
            setFlipped([]);
            canFlipRef.current = true;
            setMessage('Klikni na karty a najdi stejné dvojice!');
          }, DELAY_WRONG);
        }
      }
    },
    [flipped, matched, cards, addScore, playFanfare, playErrorSound, speak, completeLevel, levelIndex]
  );

  return (
    <div className={styles.wrapper}>
      <GameHeader emoji="🎮" title="Pexeso" />
      <div className={styles.grid}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.has(card.item.name);

          return (
            <div
              key={card.id}
              className={cn(
                styles.card,
                isFlipped && styles.flipped,
                isMatched && styles.matched,
              )}
              onClick={() => handleCardClick(card.id, card.item)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>
                  <div className={styles.cardEmoji}>{card.item.emoji}</div>
                  <div className={styles.cardName}>{card.item.czech}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageDisplay text={message} />
    </div>
  );
}
