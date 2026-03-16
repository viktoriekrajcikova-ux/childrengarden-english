import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameSetup } from '../../hooks/useGameSetup';
import { useTimers } from '../../hooks/useTimers';
import { filterByDifficulty } from '../../utils/difficultyFilter';
import { shuffleArray } from '../../utils/shuffle';
import type { ColoringLevel, ColorItem, ShapeItem } from '../../types';
import { cn } from '../../utils/cn';
import PlayButton from '../layout/PlayButton';
import GameHeader from '../shared/GameHeader';
import MessageDisplay from '../shared/MessageDisplay';
import HintButton from '../shared/HintButton';
import { useStreak } from '../../hooks/useStreak';
import { useAudio } from '../../hooks/useAudio';
import { SCORE_CORRECT, SCORE_HINT_COST, HINT_WRONG_THRESHOLD, STREAK_BONUS_3, STREAK_BONUS_5, DELAY_SHORT, DELAY_WRONG } from '../../constants';
import styles from './ColoringGame.module.css';

interface Props {
  level: ColoringLevel;
  levelIndex: number;
}

export default function ColoringGame({ level, levelIndex }: Props) {
  const { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel } = useGameSetup();
  const { playComboSound } = useAudio();
  const setTimer = useTimers();
  const { streak, incrementStreak, resetStreak } = useStreak();

  const [targetColor, setTargetColor] = useState<ColorItem | null>(null);
  const [targetShape, setTargetShape] = useState<ShapeItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(null);
  const [displayShapes, setDisplayShapes] = useState<ShapeItem[]>([]);
  const [coloredShapeStyles, setColoredShapeStyles] = useState<Record<string, string>>({});
  const [coloredShapeSet, setColoredShapeSet] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [playDisabled, setPlayDisabled] = useState(false);
  const [removedColors, setRemovedColors] = useState<Set<string>>(new Set());
  const [availableColors, setAvailableColors] = useState<ColorItem[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);

  const remainingRef = useRef<ColorItem[]>([]);
  const initializedRef = useRef(false);

  const loadNextShape = useCallback((colors: ColorItem[]) => {
    if (colors.length === 0) {
      setMessage('🎨 Skvělá práce! Level dokončen!');
      playFanfare();
      setTimer(() => completeLevel(levelIndex), DELAY_SHORT);
      return;
    }

    const shapes = filterByDifficulty(level.shapes, difficulty!);
    const newTargetShape = shapes[Math.floor(Math.random() * shapes.length)];
    setTargetShape(newTargetShape);

    const displayArr = [newTargetShape, ...shapes.filter((s) => s.name !== newTargetShape.name)];
    setDisplayShapes(shuffleArray(displayArr));

    const newTargetColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(newTargetColor);
    setSelectedColor(null);
    setTransitioning(false);
    setWrongCount(0);
    setHintUsed(false);

    setMessage('Klikni na PLAY a poslechni si barvu a tvar!');
    setPlayDisabled(false);
  }, [level.shapes, difficulty, playFanfare, completeLevel, levelIndex, setTimer]);

  // Initialize level
  useEffect(() => {
    if (!difficulty) return;
    const filtered = filterByDifficulty(level.colors, difficulty);
    const limit = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 4 : 6;
    const available = filtered.slice(0, limit);
    setAvailableColors(available);
    remainingRef.current = [...available];
    setRemovedColors(new Set());
    setColoredShapeStyles({});
    setColoredShapeSet(new Set());
    setSelectedColor(null);
    setTargetColor(null);
    setTargetShape(null);
    setTransitioning(false);
    initializedRef.current = false;
  }, [level, difficulty]);

  // Start first round only once after init
  useEffect(() => {
    if (availableColors.length > 0 && !initializedRef.current) {
      initializedRef.current = true;
      loadNextShape(remainingRef.current);
    }
  }, [availableColors, loadNextShape]);

  const handlePlay = () => {
    if (!targetColor || !targetShape || transitioning) return;
    speak(`${targetColor.name} ${targetShape.name}`);
    setMessage(selectedColor ? 'Vyber správný tvar a obarvi ho!' : 'Vyber správnou barvu a pak správný tvar!');
    setPlayDisabled(true);
  };

  const handleColorSelect = (color: ColorItem) => {
    if (transitioning) return;
    setSelectedColor(color);
    speak(color.name);
    setMessage('Teď vyber tvar a obarvi ho!');
  };

  const handleShapeClick = (shape: ShapeItem) => {
    if (transitioning) return;
    if (!selectedColor) {
      setMessage('Nejdřív vyber barvu!');
      playErrorSound();
      return;
    }
    if (!targetColor || !targetShape) return;

    if (selectedColor.name !== targetColor.name) {
      setMessage('❌ Špatná barva! Zkus to znovu.');
      playErrorSound();
      resetStreak();
      setWrongCount((c) => c + 1);
      setTimer(() => setPlayDisabled(false), DELAY_WRONG);
      return;
    }

    if (shape.name !== targetShape.name) {
      setMessage('❌ Špatný tvar! Zkus to znovu.');
      playErrorSound();
      resetStreak();
      setWrongCount((c) => c + 1);
      setTimer(() => setPlayDisabled(false), DELAY_WRONG);
      return;
    }

    // Correct
    setColoredShapeStyles((prev) => ({ ...prev, [shape.name]: selectedColor.color }));
    setColoredShapeSet((prev) => new Set([...prev, `${shape.name}-${selectedColor.name}`]));
    incrementStreak();
    const nextStreak = streak + 1;
    const bonus = nextStreak >= 5 ? STREAK_BONUS_5 : nextStreak >= 3 ? STREAK_BONUS_3 : 0;
    addScore(SCORE_CORRECT + bonus);
    if (bonus > 0) {
      playComboSound();
      setMessage(`🎉 Skvěle! +${SCORE_CORRECT + bonus} bodů (combo!)`);
    } else {
      setMessage('🎉 Skvěle! +10 bodů');
    }
    playFanfare();

    const newRemaining = remainingRef.current.filter((c) => c.name !== targetColor.name);
    remainingRef.current = newRemaining;
    setRemovedColors((prev) => new Set([...prev, targetColor.name]));
    setSelectedColor(null);
    setTransitioning(true);

    setTimer(() => {
      loadNextShape(newRemaining);
    }, DELAY_WRONG);
  };

  const handleHint = () => {
    if (!targetColor || !targetShape) return;
    subtractScore(SCORE_HINT_COST);
    setHintUsed(true);
    speak(`${targetColor.name} ${targetShape.name}`);
    setSelectedColor(targetColor);
    setMessage(`Nápověda: ${targetColor.czech} ${targetShape.czech}!`);
  };

  const showHintBtn = wrongCount >= HINT_WRONG_THRESHOLD && !hintUsed && !transitioning;

  const getShapeClass = (shapeName: string) => {
    switch (shapeName) {
      case 'circle': return styles.shapeCircle;
      case 'square': return styles.shapeSquare;
      case 'triangle': return styles.shapeTriangle;
      default: return styles.shapeSquare;
    }
  };

  const getShapeStyle = (shapeName: string): React.CSSProperties => {
    const color = coloredShapeStyles[shapeName];
    if (!color) return {};
    if (shapeName === 'triangle') {
      return { borderBottomColor: color };
    }
    return { backgroundColor: color };
  };

  return (
    <div className={styles.wrapper}>
      <GameHeader emoji="🎨" title="Omalovánka" />
      <div className={styles.palette}>
        {availableColors
          .filter((c) => !removedColors.has(c.name))
          .map((color) => (
            <div
              key={color.name}
              className={cn(styles.colorOption, selectedColor?.name === color.name && styles.colorSelected)}
              style={{ backgroundColor: color.color }}
              title={color.czech}
              onClick={() => handleColorSelect(color)}
            />
          ))}
      </div>
      <div className={styles.shapeContainer}>
        {displayShapes.map((shape) => (
          <div
            key={shape.name}
            className={cn(styles.shape, getShapeClass(shape.name), coloredShapeSet.size > 0 && styles.colored)}
            style={getShapeStyle(shape.name)}
            onClick={() => handleShapeClick(shape)}
          />
        ))}
      </div>
      {showHintBtn && <HintButton onClick={handleHint} />}
      <MessageDisplay text={message} />
      <PlayButton onClick={handlePlay} disabled={playDisabled} />
    </div>
  );
}
