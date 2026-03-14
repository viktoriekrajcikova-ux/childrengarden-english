import { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom, useAtomValue } from 'jotai';
import { subtractScoreAtom, scoreAtom } from '../store/atoms';
import { useSpeech } from '../hooks/useSpeech';
import { useAudio } from '../hooks/useAudio';
import { useTimers } from '../hooks/useTimers';
import { useTouchDrag } from '../hooks/useTouchDrag';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { shuffleArray } from '../utils/shuffle';
import { getPetStage, getPetEmoji } from '../utils/petUtils';
import { PET_CARE_COST, DELAY_PET_SPEAK, DELAY_PET_SUCCESS } from '../constants';
import MessageDisplay from '../components/shared/MessageDisplay';
import { cn } from '../utils/cn';
import styles from './PetCarePage.module.css';

interface CareAction {
  id: string;
  phrase: string;
  correctItem: string;
  reaction: string;
}

const CARE_ACTIONS: CareAction[] = [
  { id: 'feed', phrase: "I'm hungry!", correctItem: '🍗', reaction: 'Yummy!' },
  { id: 'bath', phrase: 'Bath time!', correctItem: '🧼', reaction: 'So clean!' },
  { id: 'toilet', phrase: 'I need to poop!', correctItem: '🚽', reaction: 'Much better!' },
];

const ALL_ITEMS = ['🍗', '🧼', '🚽'];

export default function PetCarePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextLevel = searchParams.get('nextLevel') || '0';

  const subtractScore = useSetAtom(subtractScoreAtom);
  const score = useAtomValue(scoreAtom);
  const { speak } = useSpeech();
  const { playFanfare, playErrorSound } = useAudio();
  const setTimer = useTimers();
  const { completedGroupIndices } = useLevelGroups();

  const petStage = getPetStage(completedGroupIndices.length);
  const petEmoji = getPetEmoji(petStage);

  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [completedItem, setCompletedItem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const draggedRef = useRef<string | null>(null);

  const currentAction = step < CARE_ACTIONS.length ? CARE_ACTIONS[step] : null;

  const shuffledItems = useMemo(
    () => shuffleArray([...ALL_ITEMS]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [step]
  );

  // Speak the phrase when step changes
  const spokenStep = useRef(-1);
  if (currentAction && spokenStep.current !== step) {
    spokenStep.current = step;
    setTimeout(() => speak(currentAction.phrase, 0.75), DELAY_PET_SPEAK);
  }

  const processDrop = useCallback(
    (item: string, zoneId: string) => {
      if (busy || !currentAction || zoneId !== 'pet') return;

      if (item === currentAction.correctItem) {
        setBusy(true);
        setCompletedItem(item);
        setMessage('');

        if (score >= PET_CARE_COST) {
          subtractScore(PET_CARE_COST);
        }

        playFanfare();
        setTimer(() => speak(currentAction.reaction, 0.75), 300);

        setTimer(() => {
          setCompletedItem(null);
          setBusy(false);
          const nextStep = step + 1;
          if (nextStep >= CARE_ACTIONS.length) {
            navigate(`/map?scrollTo=${nextLevel}`);
          } else {
            setStep(nextStep);
          }
        }, DELAY_PET_SUCCESS);
      } else {
        playErrorSound();
        setMessage('Zkus jiný předmět!');
      }
    },
    [busy, currentAction, step, score, subtractScore, playFanfare, playErrorSound, speak, setTimer, navigate, nextLevel]
  );

  // HTML5 drag handlers
  const handleDragStart = (item: string, e: React.DragEvent) => {
    draggedRef.current = item;
    setDraggingItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone('pet');
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverZone(null);
    const item = draggedRef.current;
    if (!item) return;
    processDrop(item, 'pet');
    draggedRef.current = null;
    setDraggingItem(null);
  };

  const { getTouchHandlers } = useTouchDrag<string>({
    onDrop: processDrop,
    onDragStart: (item) => setDraggingItem(item),
    onDragEnd: () => setDraggingItem(null),
    onDragOverZone: (zone) => setDragOverZone(zone),
  });

  if (!currentAction) return null;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Péče o mazlíčka</h1>

      <div
        className={cn(styles.petArea, dragOverZone === 'pet' && styles.petAreaActive)}
        data-drop-zone="pet"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.speechBubble}>{currentAction.phrase}</div>
        {petEmoji}
      </div>

      <div className={styles.progressDots}>
        {CARE_ACTIONS.map((_, i) => (
          <div
            key={i}
            className={cn(
              styles.dot,
              i < step && styles.dotCompleted,
              i === step && styles.dotActive,
            )}
          />
        ))}
      </div>

      <div className={styles.dragItems}>
        {shuffledItems.map((item) => (
          <div
            key={item}
            className={cn(
              styles.dragItem,
              draggingItem === item && styles.dragging,
              completedItem === item && styles.careItemHint,
              completedItem && completedItem !== item && styles.hidden,
            )}
            draggable={!busy}
            onDragStart={(e) => handleDragStart(item, e)}
            onDragEnd={handleDragEnd}
            {...(busy ? {} : getTouchHandlers(item))}
          >
            {item}
          </div>
        ))}
      </div>

      <MessageDisplay text={message} />
    </div>
  );
}
