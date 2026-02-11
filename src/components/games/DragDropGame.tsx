import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { filterByDifficulty } from '../../utils/difficultyFilter';
import { shuffleArray } from '../../utils/shuffle';
import type { DragDropLevel, DragDropItem } from '../../types';
import { cn } from '../../utils/cn';
import GameHeader from '../shared/GameHeader';
import MessageDisplay from '../shared/MessageDisplay';
import styles from './DragDropGame.module.css';

interface Props {
  level: DragDropLevel;
  levelIndex: number;
}

export default function DragDropGame({ level, levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const setTimer = useTimers();

  const [remainingItems, setRemainingItems] = useState<DragDropItem[]>([]);
  const [currentRound, setCurrentRound] = useState<DragDropItem[]>([]);
  const [droppedItems, setDroppedItems] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState('Přetáhni předměty na správná místa!');
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const draggedRef = useRef<DragDropItem | null>(null);
  const [draggingName, setDraggingName] = useState<string | null>(null);

  useEffect(() => {
    if (!difficulty) return;
    const filtered = filterByDifficulty(level.items, difficulty);
    setRemainingItems([...filtered]);
    setDroppedItems({});
  }, [level, difficulty]);

  const loadRound = useCallback(
    (items: DragDropItem[]) => {
      if (items.length === 0) {
        setMessage('🎊 Level dokončen!');
        playFanfare();
        setTimer(() => completeLevel(levelIndex), 500);
        return;
      }
      const count = Math.min(level.itemsPerRound || 3, items.length);
      const shuffled = shuffleArray(items);
      setCurrentRound(shuffled.slice(0, count));
      setMessage('Přetáhni předměty na správná místa!');
    },
    [level.itemsPerRound, playFanfare, completeLevel, levelIndex]
  );

  useEffect(() => {
    if (remainingItems.length > 0 && currentRound.length === 0) {
      loadRound(remainingItems);
    }
  }, [remainingItems]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragStart = (item: DragDropItem, e: React.DragEvent) => {
    draggedRef.current = item;
    setDraggingName(item.name);
    e.dataTransfer.effectAllowed = 'move';
    speak(item.name);
  };

  const handleDragEnd = () => {
    setDraggingName(null);
  };

  const handleDragOver = (e: React.DragEvent, zoneName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(zoneName);
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDrop = (e: React.DragEvent, zoneName: string) => {
    e.preventDefault();
    setDragOverZone(null);
    const item = draggedRef.current;
    if (!item) return;

    if (zoneName === item.belongsTo) {
      addScore(10);
      setMessage('🎉 Správně! +10 bodů');
      playFanfare();

      setDroppedItems((prev) => ({
        ...prev,
        [zoneName]: [...(prev[zoneName] || []), item.emoji],
      }));

      const newRemaining = remainingItems.filter((i) => i.name !== item.name);
      setRemainingItems(newRemaining);
      const newRound = currentRound.filter((i) => i.name !== item.name);
      setCurrentRound(newRound);

      if (newRound.length === 0) {
        setTimer(() => loadRound(newRemaining), 1000);
      }
    } else {
      subtractScore(5);
      setMessage('❌ Špatně! Zkus jiné místo. -5 bodů');
      playErrorSound();
    }

    draggedRef.current = null;
    setDraggingName(null);
  };

  return (
    <div className={styles.wrapper}>
      <GameHeader emoji="🎯" title="Kam to patří?" />
      <div className={styles.dropZones}>
        {level.destinations.map((dest) => (
          <div
            key={dest.name}
            className={cn(
              styles.dropZone,
              styles[dest.cssClass as keyof typeof styles],
              dragOverZone === dest.name && styles.dragOver,
            )}
            onDragOver={(e) => handleDragOver(e, dest.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, dest.name)}
          >
            <div className={styles.dropZoneHeader}>{dest.emoji}</div>
            <div className={styles.dropZoneName}>{dest.czech}</div>
            <div className={styles.dropZoneItems}>
              {(droppedItems[dest.name] || []).map((emoji, i) => (
                <div key={i} className={styles.droppedItem}>{emoji}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.draggableItems}>
        {currentRound.map((item) => (
          <div
            key={item.name}
            className={cn(styles.draggableItem, draggingName === item.name && styles.dragging)}
            draggable
            onDragStart={(e) => handleDragStart(item, e)}
            onDragEnd={handleDragEnd}
          >
            <div className={styles.draggableEmoji}>{item.emoji}</div>
            <div className={styles.draggableName}>{item.czech}</div>
          </div>
        ))}
      </div>
      <MessageDisplay text={message} />
    </div>
  );
}
