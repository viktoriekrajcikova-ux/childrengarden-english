import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { useTouchDrag } from '../../hooks/useTouchDrag';
import { filterByDifficulty } from '../../utils/difficultyFilter';
import { shuffleArray } from '../../utils/shuffle';
import type { RestaurantLevel, DrinkItem } from '../../types';
import { cn } from '../../utils/cn';
import GameHeader from '../shared/GameHeader';
import MessageDisplay from '../shared/MessageDisplay';
import { useStreak } from '../../hooks/useStreak';
import { useAudio } from '../../hooks/useAudio';
import { SCORE_CORRECT, SCORE_PENALTY, STREAK_BONUS_3, STREAK_BONUS_5, DELAY_SHORT, DELAY_WRONG, DELAY_TRANSITION } from '../../constants';
import styles from './RestaurantGame.module.css';

interface Props {
  level: RestaurantLevel;
  levelIndex: number;
}

export default function RestaurantGame({ level, levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const { playComboSound } = useAudio();
  const setTimer = useTimers();
  const { streak, incrementStreak, resetStreak } = useStreak();

  const [served, setServed] = useState(0);
  const [currentDrink, setCurrentDrink] = useState<DrinkItem | null>(null);
  const [customerEmoji, setCustomerEmoji] = useState('🧑');
  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [message, setMessage] = useState('');
  const [dropOver, setDropOver] = useState(false);
  const [servedEmoji, setServedEmoji] = useState<string | null>(null);
  const [draggingDrink, setDraggingDrink] = useState<string | null>(null);
  const draggedRef = useRef<DrinkItem | null>(null);

  const loadCustomer = useCallback(() => {
    if (!difficulty) return;
    const filteredDrinks = filterByDifficulty(level.drinks, difficulty);
    const customer = level.customers[Math.floor(Math.random() * level.customers.length)];
    const drink = filteredDrinks[Math.floor(Math.random() * filteredDrinks.length)];

    setCustomerEmoji(customer);
    setCurrentDrink(drink);
    setDrinks(shuffleArray([...filteredDrinks]));
    setServedEmoji(null);

    setTimer(() => speak(`I want ${drink.name}`, 0.9), DELAY_SHORT);
  }, [difficulty, level, speak, setTimer]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  const processDrop = useCallback((drink: DrinkItem) => {
    if (!currentDrink) return;

    if (drink.name === currentDrink.name) {
      incrementStreak();
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 5 ? STREAK_BONUS_5 : nextStreak >= 3 ? STREAK_BONUS_3 : 0;
      addScore(SCORE_CORRECT + bonus);
      if (bonus > 0) {
        playComboSound();
        setMessage(`🎉 Správně! +${SCORE_CORRECT + bonus} bodů (combo!)`);
      } else {
        setMessage('🎉 Správně! +10 bodů');
      }
      playFanfare();
      setServedEmoji(currentDrink.emoji);
      speak('Thank you!');

      const newServed = served + 1;
      setServed(newServed);

      if (newServed >= level.customersToServe) {
        setTimer(() => {
          setMessage('🎊 Level dokončen!');
          completeLevel(levelIndex);
        }, DELAY_WRONG);
      } else {
        setTimer(loadCustomer, DELAY_TRANSITION);
      }
    } else {
      subtractScore(SCORE_PENALTY);
      resetStreak();
      setMessage(`❌ Špatně! Zákazník chtěl ${currentDrink.czech}. -5 bodů`);
      playErrorSound();
    }
  }, [currentDrink, served, level.customersToServe, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel, levelIndex, loadCustomer, setTimer]);

  const handleDragStart = (drink: DrinkItem) => {
    draggedRef.current = drink;
    setDraggingDrink(drink.name);
  };

  const handleDragEnd = () => {
    setDraggingDrink(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropOver(false);
    const drink = draggedRef.current;
    if (!drink) return;
    processDrop(drink);
    draggedRef.current = null;
    setDraggingDrink(null);
  };

  const { getTouchHandlers } = useTouchDrag<DrinkItem>({
    onDrop: (drink) => processDrop(drink),
    onDragStart: (drink) => setDraggingDrink(drink.name),
    onDragEnd: () => setDraggingDrink(null),
    onDragOverZone: (zone) => setDropOver(zone === 'customer'),
  });

  return (
    <div className={styles.wrapper}>
      <GameHeader emoji="🍽️" title="Restaurace" />
      <div className={styles.progress}>
        Zákazník {served + 1} / {level.customersToServe}
      </div>
      <div className={styles.scene}>
        <div className={styles.customer}>
          <div className={styles.avatar}>{customerEmoji}</div>
          <div className={styles.order}>
            <div className={styles.speechBubble}>
              {currentDrink ? `I want ${currentDrink.name}!` : ''}
            </div>
            <div
              data-drop-zone="customer"
              className={cn(styles.dropZone, dropOver && styles.dropZoneOver)}
              onDragOver={(e) => { e.preventDefault(); setDropOver(true); }}
              onDragLeave={() => setDropOver(false)}
              onDrop={handleDrop}
            >
              {servedEmoji ? (
                <div className={styles.servedEmoji}>{servedEmoji}</div>
              ) : (
                <div className={styles.dropHint}>⬇ Přetáhni nápoj sem ⬇</div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.bar}>
          <div className={styles.barTitle}>🍹 Nápoje</div>
          <div className={styles.shelf}>
            {drinks.map((drink) => (
              <div
                key={drink.name}
                className={cn(styles.drinkItem, draggingDrink === drink.name && styles.drinkDragging)}
                draggable
                onDragStart={() => handleDragStart(drink)}
                onDragEnd={handleDragEnd}
                {...getTouchHandlers(drink)}
              >
                <div className={styles.drinkEmoji}>{drink.emoji}</div>
                <div className={styles.drinkName}>{drink.czech}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <MessageDisplay text={message} />
    </div>
  );
}
