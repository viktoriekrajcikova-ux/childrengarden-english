import { useState, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom, useAtomValue } from 'jotai';
import { subtractScoreAtom, scoreAtom } from '../store/atoms';
import { useSpeech } from '../hooks/useSpeech';
import { useAudio } from '../hooks/useAudio';
import { useTimers } from '../hooks/useTimers';
import { useTouchDrag } from '../hooks/useTouchDrag';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { getPetStage } from '../utils/petUtils';
import {
  SHOP_GRAIN_PRICE, SHOP_APPLE_PRICE, SHOP_CAKE_PRICE,
  DELAY_PET_ACTION, DELAY_BULLDOZER, DELAY_SHOWER, DELAY_PET_REACTION,
} from '../constants';
import Pet from '../components/pet/Pet';
import type { PetAnimation } from '../components/pet/Pet';
import SpeechBubble from '../components/pet/SpeechBubble';
import Inventory from '../components/pet/Inventory';
import type { FoodItem } from '../components/pet/Inventory';
import { cn } from '../utils/cn';
import styles from './PetCarePage.module.css';

type ActionPhase = 'idle' | 'shopping' | 'feeding' | 'shower' | 'poop';

interface ShopItem {
  emoji: string;
  name: string;
  price: number;
}

const SHOP_ITEMS: ShopItem[] = [
  { emoji: '🌾', name: 'Grain', price: SHOP_GRAIN_PRICE },
  { emoji: '🍎', name: 'Apple', price: SHOP_APPLE_PRICE },
  { emoji: '🎂', name: 'Cake', price: SHOP_CAKE_PRICE },
];

let foodIdCounter = 0;

export default function PetCarePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextLevel = searchParams.get('nextLevel') || '0';

  const subtractScore = useSetAtom(subtractScoreAtom);
  const score = useAtomValue(scoreAtom);
  const { speak } = useSpeech();
  const {
    playChirpHappy, playMunch, playWaterSplash,
    playPoopSound, playBulldozer, playCashRegister,
  } = useAudio();
  const setTimer = useTimers();
  const { completedGroupIndices } = useLevelGroups();

  const petStage = getPetStage(completedGroupIndices.length);

  const [phase, setPhase] = useState<ActionPhase>('idle');
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [petAnimation, setPetAnimation] = useState<PetAnimation>('idle');
  const [speechText, setSpeechText] = useState('Hi! What shall we do?');
  const [showSpeech, setShowSpeech] = useState(true);
  const spokenInit = useRef(false);
  if (!spokenInit.current) {
    spokenInit.current = true;
    setTimeout(() => speak('Hi! What shall we do?', 0.85, 1.8), 500);
  }
  const [busy, setBusy] = useState(false);
  const [poopVisible, setPoopVisible] = useState(false);
  const [bulldozerVisible, setBulldozerVisible] = useState(false);
  const [showerActive, setShowerActive] = useState(false);
  const [bubblesActive, setBubblesActive] = useState(false);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const draggedRef = useRef<string | null>(null);

  const say = useCallback((text: string) => {
    setSpeechText(text);
    setShowSpeech(true);
    speak(text, 0.85, 1.8);
  }, [speak]);

  const goIdle = useCallback((text = 'Hi! What shall we do?') => {
    setPhase('idle');
    setPetAnimation('idle');
    say(text);
    setBusy(false);
  }, [say]);

  // --- SHOPPING ---
  const startShopping = useCallback(() => {
    setPhase('shopping');
    say('Buy me some food?');
    setPetAnimation('happy');
    setTimer(() => setPetAnimation('idle'), 1500);
  }, [say, setTimer]);

  const buyItem = useCallback((item: ShopItem) => {
    if (item.price > score) return;
    if (item.price > 0) subtractScore(item.price);
    playCashRegister();
    const foodItem: FoodItem = { id: `food-${++foodIdCounter}`, emoji: item.emoji, name: item.name };
    setInventory(prev => [...prev, foodItem]);
    say('I love it, thank you!');
    setPetAnimation('happy');
    playChirpHappy();
    setTimer(() => {
      setPetAnimation('idle');
      say('Anything else?');
    }, DELAY_PET_REACTION);
  }, [score, subtractScore, playCashRegister, playChirpHappy, say, setTimer]);

  // --- FEEDING ---
  const startFeeding = useCallback(() => {
    setPhase('feeding');
    say('I am so hungry, feed me!');
    setPetAnimation('idle');
  }, [say]);

  const processFeedDrop = useCallback(
    (itemId: string, zoneId: string) => {
      if (busy || zoneId !== 'pet') return;
      setBusy(true);
      playMunch();
      setPetAnimation('eating');
      setInventory(prev => prev.filter(f => f.id !== itemId));
      say('That was so tasty!');

      setTimer(() => {
        goIdle();
      }, DELAY_PET_ACTION);
    },
    [busy, playMunch, say, setTimer, goIdle]
  );

  // HTML5 drag handlers for feeding
  const handleDragStart = (itemId: string, e: React.DragEvent) => {
    draggedRef.current = itemId;
    setDraggingItem(itemId);
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
    const itemId = draggedRef.current;
    if (!itemId) return;
    processFeedDrop(itemId, 'pet');
    draggedRef.current = null;
    setDraggingItem(null);
  };

  const { getTouchHandlers } = useTouchDrag<string>({
    onDrop: processFeedDrop,
    onDragStart: (itemId) => setDraggingItem(itemId),
    onDragEnd: () => setDraggingItem(null),
    onDragOverZone: (zone) => setDragOverZone(zone),
  });

  // --- SHOWER ---
  const startShower = useCallback(() => {
    setBusy(true);
    setPhase('shower');
    say('The water is so cold!');
    setPetAnimation('showering');
    setShowerActive(true);
    playWaterSplash();

    setTimer(() => {
      setShowerActive(false);
      setBubblesActive(true);
    }, DELAY_SHOWER);

    setTimer(() => {
      setBubblesActive(false);
      say('Now I am all clean!');
      setPetAnimation('happy');
      playChirpHappy();
    }, DELAY_SHOWER + DELAY_PET_REACTION);

    setTimer(() => {
      goIdle();
    }, DELAY_SHOWER + DELAY_PET_REACTION + DELAY_PET_REACTION);
  }, [say, playWaterSplash, playChirpHappy, setTimer, goIdle]);

  // --- POOP ---
  const startPoop = useCallback(() => {
    setBusy(true);
    setPhase('poop');
    say('I need to go!');
    setPetAnimation('pooping');

    setTimer(() => {
      setPoopVisible(true);
      playPoopSound();
    }, DELAY_PET_ACTION);

    setTimer(() => {
      setBulldozerVisible(true);
      playBulldozer();
    }, DELAY_PET_ACTION + 500);

    setTimer(() => {
      setPoopVisible(false);
      setBulldozerVisible(false);
      setPetAnimation('relieved');
      say('That feels so much better!');
      playChirpHappy();
    }, DELAY_PET_ACTION + 500 + DELAY_BULLDOZER);

    setTimer(() => {
      goIdle();
    }, DELAY_PET_ACTION + 500 + DELAY_BULLDOZER + DELAY_PET_REACTION);
  }, [say, playPoopSound, playBulldozer, playChirpHappy, setTimer, goIdle]);

  // --- RENDER HELPERS ---
  const renderShowerEffects = () => {
    if (!showerActive && !bubblesActive) return null;
    return (
      <div className={styles.showerContainer}>
        {showerActive && Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`drop-${i}`}
            className={styles.showerDrop}
            style={{
              left: `${10 + (i * 80 / 15)}%`,
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
        {bubblesActive && Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`bubble-${i}`}
            className={styles.bubble}
            style={{
              left: `${20 + (i * 60 / 8)}%`,
              bottom: '20%',
              width: `${10 + Math.random() * 15}px`,
              height: `${10 + Math.random() * 15}px`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  };

  const renderPoopEffects = () => (
    <>
      {poopVisible && !bulldozerVisible && (
        <div className={styles.poopEmoji}>💩</div>
      )}
      {bulldozerVisible && (
        <div className={styles.bulldozerContainer}>
          <span className={styles.bulldozerEmoji}>🚜</span>
          <span className={styles.bulldozerBlade}>▐</span>
          <span className={styles.bulldozerPoop}>💩</span>
        </div>
      )}
    </>
  );

  const renderActionArea = () => {
    switch (phase) {
      case 'shopping':
        return (
          <div className={styles.actionArea}>
            <div className={styles.shopCards}>
              {SHOP_ITEMS.map((item) => {
                const disabled = item.price > score;
                return (
                  <button
                    key={item.emoji}
                    className={cn(styles.shopCard, disabled && styles.shopCardDisabled)}
                    disabled={disabled}
                    onClick={() => buyItem(item)}
                  >
                    <span className={styles.shopCardEmoji}>{item.emoji}</span>
                    <span className={styles.shopCardName}>{item.name}</span>
                    <span className={item.price === 0 ? styles.shopCardFree : styles.shopCardPrice}>
                      {item.price === 0 ? 'Free' : `${item.price} points`}
                    </span>
                  </button>
                );
              })}
            </div>
            <button className={styles.backActionBtn} onClick={() => goIdle()}>
              Back
            </button>
          </div>
        );

      case 'feeding':
        return (
          <div className={styles.actionArea}>
            <div className={styles.feedItems}>
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    styles.feedItem,
                    draggingItem === item.id && styles.feedItemDragging,
                  )}
                  draggable={!busy}
                  onDragStart={(e) => handleDragStart(item.id, e)}
                  onDragEnd={handleDragEnd}
                  {...(busy ? {} : getTouchHandlers(item.id))}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
            <button className={styles.backActionBtn} onClick={() => goIdle()}>
              Back
            </button>
          </div>
        );

      case 'shower':
      case 'poop':
        return null;

      default:
        return (
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn} onClick={startShopping} disabled={busy}>
              <span className={styles.actionBtnEmoji}>🛒</span>
              Shop
            </button>
            <button
              className={styles.actionBtn}
              onClick={startFeeding}
              disabled={busy || inventory.length === 0}
            >
              <span className={styles.actionBtnEmoji}>🍽️</span>
              Feed
            </button>
            <button className={styles.actionBtn} onClick={startShower} disabled={busy}>
              <span className={styles.actionBtnEmoji}>🚿</span>
              Shower
            </button>
            <button className={styles.actionBtn} onClick={startPoop} disabled={busy}>
              <span className={styles.actionBtnEmoji}>💩</span>
              Poop
            </button>
          </div>
        );
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(`/map?scrollTo=${nextLevel}`)}>
          ← Back
        </button>
        <span className={styles.scoreDisplay}>⭐ {score}</span>
        <Inventory items={inventory} />
      </div>

      {/* Pet area */}
      <div className={styles.petStage}>
        <SpeechBubble text={speechText} visible={showSpeech} />
        <div
          className={cn(
            styles.petContainer,
            phase === 'feeding' && styles.petDropZone,
            phase === 'feeding' && dragOverZone === 'pet' && styles.petDropZoneActive,
          )}
          data-drop-zone="pet"
          onDragOver={phase === 'feeding' ? handleDragOver : undefined}
          onDragLeave={phase === 'feeding' ? handleDragLeave : undefined}
          onDrop={phase === 'feeding' ? handleDrop : undefined}
        >
          <Pet stage={petStage} animation={petAnimation} />
          {renderShowerEffects()}
          {renderPoopEffects()}
        </div>
      </div>

      {/* Action area */}
      {renderActionArea()}
    </div>
  );
}
