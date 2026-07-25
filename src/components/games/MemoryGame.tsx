import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { levels } from '../../data/levels';
import { filterByDifficulty } from '../../utils/difficultyFilter';
import { shuffleArray } from '../../utils/shuffle';
import type { LevelItem } from '../../types';
import { cn } from '../../utils/cn';
import MessageDisplay from '../shared/MessageDisplay';
import { SCORE_CORRECT_DOUBLE, DELAY_SHORT, DELAY_FEEDBACK, DELAY_WRONG } from '../../constants';
import styles from './MemoryGame.module.css';

interface Props {
  levelIndex: number;
}

interface MemoryCard {
  item: LevelItem;
  id: number;      // unikátní pro každou kartu
  pairId: number;  // shodné pro obě karty jednoho páru
}

// Maximální počet párů (karet je 2×). Míň párů může vzniknout, když
// po filtrování obtížnosti zbyde méně unikátních slov – to je v pořádku.
const MAX_PAIRS = 8;

export default function MemoryGame({ levelIndex }: Props) {
  const { difficulty, addScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const setTimer = useTimers();

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState('Klikni na karty a najdi stejné dvojice!');
  const canFlipRef = useRef(true);
  const matchedPairsRef = useRef(0);
  const totalPairsRef = useRef(0);

  useEffect(() => {
    if (!difficulty) return;

    let allItems: LevelItem[] = [];
    for (let i = 0; i < 5; i++) {
      const l = levels[i];
      if (l.type === 'standard') {
        allItems = allItems.concat(filterByDifficulty(l.items, difficulty));
      }
    }

    // Deduplikace podle jména – stejné slovo se napříč levely opakuje
    // (např. "orange" v Jídle i Barvách) a bez toho by vznikly 4 stejné karty.
    const seen = new Set<string>();
    const unique = allItems.filter((it) => {
      if (seen.has(it.name)) return false;
      seen.add(it.name);
      return true;
    });

    const selected = shuffleArray(unique).slice(0, MAX_PAIRS);
    // Každé slovo = jeden pár (pairId), dvě karty s unikátním id.
    const pairs: MemoryCard[] = selected.flatMap((item, p) => [
      { item, id: p * 2, pairId: p },
      { item, id: p * 2 + 1, pairId: p },
    ]);

    setCards(shuffleArray(pairs));
    setFlipped([]);
    setMatched(new Set());
    matchedPairsRef.current = 0;
    totalPairsRef.current = selected.length;
    canFlipRef.current = true;
  }, [difficulty, levelIndex]);

  const handleCardClick = useCallback(
    (card: MemoryCard) => {
      if (!canFlipRef.current) return;
      if (flipped.includes(card.id)) return;
      if (matched.has(card.pairId)) return;

      speak(card.item.name);

      const newFlipped = [...flipped, card.id];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        canFlipRef.current = false;
        const first = cards.find((c) => c.id === newFlipped[0]);
        const second = cards.find((c) => c.id === newFlipped[1]);

        // Pojistka: kdyby se karta nenašla, radši kolo zrušíme, než abychom spadli.
        if (!first || !second) {
          setFlipped([]);
          canFlipRef.current = true;
          return;
        }

        if (first.pairId === second.pairId) {
          setTimer(() => {
            setMatched((prev) => new Set(prev).add(first.pairId));
            addScore(SCORE_CORRECT_DOUBLE);
            setMessage('🎉 Skvělé! Našel jsi pár! +20 bodů');
            playFanfare();

            matchedPairsRef.current++;
            if (matchedPairsRef.current === totalPairsRef.current) {
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
    [flipped, matched, cards, addScore, playFanfare, playErrorSound, speak, completeLevel, levelIndex, setTimer]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.has(card.pairId);

          return (
            <div
              key={card.id}
              className={cn(
                styles.card,
                isFlipped && styles.flipped,
                isMatched && styles.matched,
              )}
              onClick={() => handleCardClick(card)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>
                  <div className={styles.cardEmoji}>{card.item.emoji}</div>
                  <div className={styles.cardEnglish}>{card.item.name}</div>
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
