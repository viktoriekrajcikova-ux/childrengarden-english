import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { difficultyAtom, completedLevelsAtom, addScoreAtom, subtractScoreAtom } from '../store/atoms';
import { useAudio } from '../hooks/useAudio';
import { useSpeech } from '../hooks/useSpeech';
import { useLevelCompletion } from '../hooks/useLevelCompletion';
import { levels } from '../data/levels';
import { filterByDifficulty } from '../utils/difficultyFilter';
import { shuffleArray } from '../utils/shuffle';
import type { LevelItem } from '../types';
import GameLayout from '../components/layout/GameLayout';
import PlayButton from '../components/layout/PlayButton';
import MessageDisplay from '../components/shared/MessageDisplay';
import ItemCard from '../components/shared/ItemCard';
import Button from '../components/shared/Button';
import reviewStyles from './ReviewPage.module.css';
import gridStyles from '../styles/grid.module.css';

const REVIEW_ROUNDS = 5;

export default function ReviewPage() {
  const difficulty = useAtomValue(difficultyAtom);
  const completedLevels = useAtomValue(completedLevelsAtom);
  const addScore = useSetAtom(addScoreAtom);
  const subtractScore = useSetAtom(subtractScoreAtom);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { playFanfare, playErrorSound } = useAudio();
  const { speak } = useSpeech();
  const { completeLevel } = useLevelCompletion();

  const mode = searchParams.get('mode') || 'practice';
  const autoStart = parseInt(searchParams.get('start') || '0', 10);
  const autoEnd = parseInt(searchParams.get('end') || '0', 10);
  const autoLevelIndex = parseInt(searchParams.get('levelIndex') || '-1', 10);

  const [allItems, setAllItems] = useState<LevelItem[]>([]);
  const [currentItems, setCurrentItems] = useState<LevelItem[]>([]);
  const [currentTarget, setCurrentTarget] = useState<LevelItem | null>(null);
  const [canClick, setCanClick] = useState(false);
  const [cardStates, setCardStates] = useState<Record<string, 'idle' | 'clickable' | 'correct' | 'wrong' | 'hidden'>>({});
  const [message, setMessage] = useState('');
  const [playDisabled, setPlayDisabled] = useState(false);
  const [finished, setFinished] = useState(false);
  const roundsRef = useRef(0);
  const allItemsRef = useRef<LevelItem[]>([]);

  // Collect review items
  useEffect(() => {
    if (!difficulty) { navigate('/'); return; }

    let items: LevelItem[] = [];
    if (mode === 'auto') {
      for (let i = autoStart; i <= autoEnd; i++) {
        const l = levels[i];
        if (l.type === 'standard') {
          items = items.concat(filterByDifficulty(l.items, difficulty));
        }
      }
    } else {
      completedLevels.forEach((li) => {
        const l = levels[li];
        if (l.type === 'standard') {
          items = items.concat(filterByDifficulty(l.items, difficulty));
        }
      });
    }
    allItemsRef.current = items;
    setAllItems(items);
  }, [difficulty, mode, autoStart, autoEnd, completedLevels, navigate]);

  const initRound = useCallback(() => {
    const items = allItemsRef.current;
    if (items.length < 2) {
      setMessage('Nedostatek položek k opakování.');
      setFinished(true);
      return;
    }

    const shuffled = shuffleArray(items);
    const selected = shuffled.slice(0, 2);
    const target = selected[0];
    const display = shuffleArray(selected);

    setCurrentItems(display);
    setCurrentTarget(target);
    setCanClick(false);
    setPlayDisabled(false);
    setMessage('');
    setCardStates({});
  }, []);

  // Start first round when items are ready
  useEffect(() => {
    if (allItems.length >= 2) {
      roundsRef.current = 0;
      setFinished(false);
      initRound();
    }
  }, [allItems, initRound]);

  const handlePlay = () => {
    if (!currentTarget || finished) return;
    setCanClick(true);
    setPlayDisabled(true);
    speak(currentTarget.name);
    setMessage('Klikni na správnou položku!');
    const newStates: Record<string, 'idle' | 'clickable' | 'correct' | 'wrong' | 'hidden'> = {};
    currentItems.forEach((item) => { newStates[item.name] = 'clickable'; });
    setCardStates(newStates);
  };

  const handleItemClick = (itemName: string) => {
    if (!canClick || !currentTarget || finished) return;
    setCanClick(false);

    // Remove clickable from all cards
    setCardStates((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => { if (next[k] === 'clickable') next[k] = 'idle'; });
      return next;
    });

    if (itemName === currentTarget.name) {
      // Correct answer
      setCardStates((prev) => ({ ...prev, [itemName]: 'correct' }));
      addScore(10);
      setMessage('🎉 Správně! +10 bodů');
      playFanfare();

      roundsRef.current += 1;
      const newRounds = roundsRef.current;

      // Hide correct card after 1s
      setTimeout(() => {
        setCardStates((prev) => ({ ...prev, [itemName]: 'hidden' }));

        // After another 1s, check completion or start next round
        setTimeout(() => {
          if (mode === 'auto' && newRounds >= REVIEW_ROUNDS) {
            setMessage('🎊 Opakování dokončeno!');
            setFinished(true);
            if (autoLevelIndex >= 0) {
              completeLevel(autoLevelIndex);
            }
            return;
          }

          if (mode === 'practice' && newRounds >= REVIEW_ROUNDS) {
            setMessage('🎊 Opakování dokončeno!');
            setFinished(true);
            setTimeout(() => navigate('/map'), 2000);
            return;
          }

          initRound();
        }, 1000);
      }, 1000);
    } else {
      // Wrong answer
      setCardStates((prev) => ({ ...prev, [itemName]: 'wrong' }));
      subtractScore(5);
      setMessage('❌ Špatně! -5 bodů. Zkus to znovu.');
      playErrorSound();

      setTimeout(() => {
        setCardStates((prev) => ({ ...prev, [itemName]: 'idle' }));
        setPlayDisabled(false);
      }, 1500);
    }
  };

  return (
    <GameLayout title="🔄 Opakování">
      <div className={reviewStyles.reviewIndicator}>🔄 Režim opakování</div>
      <div className={gridStyles.grid}>
        {currentItems.map((item) => (
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
      {!finished && <PlayButton onClick={handlePlay} disabled={playDisabled} />}
      <Button variant="secondary" onClick={() => navigate('/map')}>
        ← Zpět na levely
      </Button>
    </GameLayout>
  );
}
