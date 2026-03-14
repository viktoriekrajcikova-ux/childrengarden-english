import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import {
  subtractScoreAtom, scoreAtom, addFedFoodAtom,
  mutedAtom, lastSeenPetStageAtom, lastFedTimeAtom,
} from '../store/atoms';
import { useSpeech } from '../hooks/useSpeech';
import { useAudio } from '../hooks/useAudio';
import { useTimers } from '../hooks/useTimers';
import { useTouchDrag } from '../hooks/useTouchDrag';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { getPetStage } from '../utils/petUtils';
import {
  SHOP_GRAIN_PRICE, SHOP_APPLE_PRICE, SHOP_CAKE_PRICE,
  DELAY_PET_ACTION, DELAY_BULLDOZER, DELAY_SHOWER, DELAY_PET_REACTION,
  PET_MIN_FED, PET_MAX_INVENTORY, PET_HUNGER_THRESHOLD,
} from '../constants';
import Pet from '../components/pet/Pet';
import type { PetAnimation, PetMood } from '../components/pet/Pet';
import SpeechBubble from '../components/pet/SpeechBubble';
import Inventory from '../components/pet/Inventory';
import type { FoodItem } from '../components/pet/Inventory';
import { cn } from '../utils/cn';
import styles from './PetCarePage.module.css';

type ActionPhase = 'idle' | 'shopping' | 'feeding' | 'shower' | 'poop';

const IDLE_PHRASES = [
  'Hi! What shall we do?',
  'Yay, you are here!',
  'I missed you so much!',
  'Let\'s play together!',
  'Hello friend!',
  'I am so happy to see you!',
  'What do you want to do?',
  'Hey! I was waiting for you!',
  'Hooray, you came back!',
  'I love spending time with you!',
];

const SAD_PHRASES = [
  'I am still hungry!',
  'More food please!',
  'My tummy is rumbling...',
  'Can I have some more?',
  'Feed me more, please!',
];

const TAP_PHRASES = [
  'Hehe, that tickles!',
  'I love you!',
  'You are the best!',
  'Yay!',
  'More pets please!',
];

const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🌟'];

function randomPhrase() {
  return IDLE_PHRASES[Math.floor(Math.random() * IDLE_PHRASES.length)];
}

function randomSadPhrase() {
  return SAD_PHRASES[Math.floor(Math.random() * SAD_PHRASES.length)];
}

function randomTapPhrase() {
  return TAP_PHRASES[Math.floor(Math.random() * TAP_PHRASES.length)];
}

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
  const addFedFood = useSetAtom(addFedFoodAtom);
  const score = useAtomValue(scoreAtom);
  const [muted, setMuted] = useAtom(mutedAtom);
  const [lastSeenPetStage, setLastSeenPetStage] = useAtom(lastSeenPetStageAtom);
  const [lastFedTime, setLastFedTime] = useAtom(lastFedTimeAtom);
  const { speak } = useSpeech();
  const {
    playChirpHappy, playMunch, playWaterSplash,
    playPoopSound, playBulldozer, playCashRegister, playFanfare,
  } = useAudio();
  const setTimer = useTimers();
  const { completedGroupIndices } = useLevelGroups();

  const petStage = getPetStage(completedGroupIndices.length);

  const [phase, setPhase] = useState<ActionPhase>('idle');
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [petAnimation, setPetAnimation] = useState<PetAnimation>('idle');
  const [mood, setMood] = useState<PetMood>('neutral');
  const [fedCount, setFedCount] = useState(0);
  const [speechText, setSpeechText] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [speechFading, setSpeechFading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [poopVisible, setPoopVisible] = useState(false);
  const [bulldozerVisible, setBulldozerVisible] = useState(false);
  const [showerActive, setShowerActive] = useState(false);
  const [bubblesActive, setBubblesActive] = useState(false);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const draggedRef = useRef<string | null>(null);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const initDone = useRef(false);

  // --- SPEECH BUBBLE AUTO-HIDE ---
  const say = useCallback((text: string) => {
    // Clear previous timers
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (speechFadeTimerRef.current) clearTimeout(speechFadeTimerRef.current);
    setSpeechText(text);
    setShowSpeech(true);
    setSpeechFading(false);
    speak(text, 0.85, 1.8);
    // Start fade after 3.5s, hide after 4s
    speechFadeTimerRef.current = setTimeout(() => setSpeechFading(true), 3500);
    speechTimerRef.current = setTimeout(() => {
      setShowSpeech(false);
      setSpeechFading(false);
    }, 4000);
  }, [speak]);

  const goIdle = useCallback((text?: string) => {
    if (!text) text = randomPhrase();
    setPhase('idle');
    setPetAnimation('idle');
    setMood('neutral');
    say(text);
    setBusy(false);
  }, [say]);

  // --- INIT: hunger check + growth celebration ---
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    // Check for growth celebration first
    if (petStage !== lastSeenPetStage) {
      // Pet has grown!
      setMood('happy');
      setPetAnimation('happy');
      say("I'm growing up! Look at me!");
      playFanfare();
      setShowConfetti(true);
      setBusy(true);
      setTimeout(() => {
        setLastSeenPetStage(petStage);
        setShowConfetti(false);
        goIdle();
      }, 3000);
      return;
    }

    // Check for hunger (24h since last fed)
    if (lastFedTime > 0 && Date.now() - lastFedTime > PET_HUNGER_THRESHOLD) {
      setMood('sad');
      say("I haven't eaten in so long!");
    } else {
      say(randomPhrase());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- TAP INTERACTION ---
  const handlePetTap = useCallback(() => {
    if (phase !== 'idle' || busy) return;
    setBusy(true);
    setMood('happy');
    setPetAnimation('happy');
    playChirpHappy();
    say(randomTapPhrase());
    setTimer(() => goIdle(), DELAY_PET_REACTION);
  }, [phase, busy, playChirpHappy, say, setTimer, goIdle]);

  // --- SHOPPING ---
  const startShopping = useCallback(() => {
    setPhase('shopping');
    say('Buy me some food?');
    setPetAnimation('happy');
    setTimer(() => setPetAnimation('idle'), 1500);
  }, [say, setTimer]);

  const buyItem = useCallback((item: ShopItem) => {
    if (item.price > score) return;
    // Max inventory check
    if (inventory.length >= PET_MAX_INVENTORY) {
      say('My bag is full!');
      return;
    }
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
  }, [score, inventory.length, subtractScore, playCashRegister, playChirpHappy, say, setTimer]);

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

      // Capture the item emoji before removing from inventory
      let droppedEmoji = '';
      setInventory(prev => {
        const item = prev.find(f => f.id === itemId);
        if (item) {
          droppedEmoji = item.emoji;
          addFedFood(item.emoji);
        }
        return prev.filter(f => f.id !== itemId);
      });

      setFedCount(prev => {
        const newCount = prev + 1;
        if (newCount < PET_MIN_FED) {
          say(randomSadPhrase());
          setTimer(() => {
            setMood('sad');
            setPetAnimation('idle');
            setBusy(false);
          }, DELAY_PET_ACTION);
        } else {
          // Different reactions based on food type
          let reaction = 'That was so tasty!';
          if (droppedEmoji === '🌾') {
            reaction = 'Thanks, that was okay.';
          } else if (droppedEmoji === '🍎') {
            reaction = 'Yummy apple, I love it!';
          } else if (droppedEmoji === '🎂') {
            reaction = 'WOW, cake! This is the BEST!';
          }
          say(reaction);
          setTimer(() => {
            setMood('happy');
            setPetAnimation('happy');
            setBusy(false);
          }, DELAY_PET_ACTION);
          setTimer(() => {
            // Save last fed time
            setLastFedTime(Date.now());
            goIdle();
          }, DELAY_PET_ACTION + DELAY_PET_REACTION);
        }
        return newCount;
      });
    },
    [busy, playMunch, addFedFood, say, setTimer, goIdle, setLastFedTime]
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
      setMood('happy');
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
      setMood('happy');
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

  const renderConfetti = () => {
    if (!showConfetti) return null;
    return (
      <div className={styles.confettiContainer}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={`confetti-${i}`}
            className={styles.confettiPiece}
            style={{
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          >
            {CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
          </span>
        ))}
      </div>
    );
  };

  const inventoryFull = inventory.length >= PET_MAX_INVENTORY;

  const renderActionArea = () => {
    switch (phase) {
      case 'shopping':
        return (
          <div className={styles.actionArea}>
            <div className={styles.shopCards}>
              {SHOP_ITEMS.map((item) => {
                const disabled = item.price > score || inventoryFull;
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
            {inventoryFull && (
              <div className={styles.backHint}>Bag is full!</div>
            )}
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
      {/* Confetti overlay */}
      {renderConfetti()}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <button
            className={styles.backButton}
            onClick={() => navigate(`/map?scrollTo=${nextLevel}`)}
            disabled={fedCount < PET_MIN_FED}
          >
            ← Back
          </button>
          {fedCount < PET_MIN_FED && (
            <div className={styles.backHint}>
              Feed me {PET_MIN_FED - fedCount} more time{PET_MIN_FED - fedCount !== 1 ? 's' : ''}!
            </div>
          )}
        </div>
        <span className={styles.scoreDisplay}>⭐ {score}</span>
        <button
          className={styles.muteButton}
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <Inventory items={inventory} />
      </div>

      {/* Feed progress hearts */}
      {fedCount < PET_MIN_FED && (
        <div className={styles.feedProgress}>
          {Array.from({ length: PET_MIN_FED }).map((_, i) => (
            <span key={i}>{i < fedCount ? '❤️' : '🤍'}</span>
          ))}
        </div>
      )}

      {/* Pet area */}
      <div className={styles.petStage}>
        <SpeechBubble text={speechText} visible={showSpeech} fading={speechFading} />
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
          onClick={handlePetTap}
        >
          <Pet stage={petStage} animation={petAnimation} mood={mood} />
          {renderShowerEffects()}
          {renderPoopEffects()}
        </div>
      </div>

      {/* Action area */}
      {renderActionArea()}
    </div>
  );
}
