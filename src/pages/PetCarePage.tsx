import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import {
  subtractScoreAtom, scoreAtom, addFedFoodAtom,
  mutedAtom, lastSeenPetStageAtom, lastFedTimeAtom,
  animalTypeAtom, petNameAtom, lastVisitTimeAtom,
  petColorsAtom, ownedColorsAtom,
  ownedAccessoriesAtom, equippedAccessoriesAtom,
} from '../store/atoms';
import { useSpeech } from '../hooks/useSpeech';
import { useAudio } from '../hooks/useAudio';
import { useTimers } from '../hooks/useTimers';
import { useTouchDrag } from '../hooks/useTouchDrag';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { getPetStage } from '../utils/petUtils';
import { COLOR_OPTIONS } from '../utils/colorUtils';
import { ACCESSORY_LIST } from '../components/pet/accessories';
import {
  SHOP_GRAIN_PRICE, SHOP_APPLE_PRICE, SHOP_CAKE_PRICE,
  DELAY_PET_ACTION, DELAY_BULLDOZER, DELAY_SHOWER, DELAY_PET_REACTION,
  PET_MIN_FED, PET_MAX_INVENTORY, PET_HUNGER_THRESHOLD,
  ABSENCE_MILD, ABSENCE_MEDIUM, ABSENCE_LONG,
  IDLE_ANIM_MIN, IDLE_ANIM_MAX,
  SHOP_COLOR_PRICE, SHOP_ACCESSORY_PRICE,
} from '../constants';
import Pet from '../components/pet/Pet';
import type { PetAnimation, PetMood } from '../components/pet/Pet';
import SpeechBubble from '../components/pet/SpeechBubble';
import Inventory from '../components/pet/Inventory';
import type { FoodItem } from '../components/pet/Inventory';
import { pickRandom } from '../utils/shuffle';
import { cn } from '../utils/cn';
import styles from './PetCarePage.module.css';

type ActionPhase = 'idle' | 'shopping' | 'feeding' | 'shower' | 'poop' | 'sleeping';
type ShopTab = 'food' | 'colors' | 'accessories';

const IDLE_PHRASES = [
  'Hi! What shall we do?',
  'Yay, you are here!',
  'Let\'s play together!',
  'Hello friend!',
  'I am so happy to see you!',
  'What do you want to do?',
  'Hey! I was waiting for you!',
  'Hooray, you came back!',
  'I love spending time with you!',
  'You are my best friend!',
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
  'That feels nice!',
  'Wheee!',
  'Do it again!',
  'I love hugs!',
  'You make me so happy!',
  'Hahaha!',
  'Woooo!',
];

// Absence reaction phrases (phase 1)
const ABSENCE_MILD_PHRASES = [
  'I missed you!',
  'Hey, you came back!',
  'I was waiting for you!',
];
const ABSENCE_MEDIUM_PHRASES = [
  'I was so lonely...',
  'Where did you go?',
  'I missed you so much!',
  'Please don\'t leave me!',
];
const ABSENCE_LONG_PHRASES = [
  'I thought you forgot about me!',
  'I was so worried!',
  'I almost cried...',
  'Promise you\'ll come back sooner?',
];

// Tap animation pool (phase 2)
const TAP_ANIMATIONS: PetAnimation[] = ['happy', 'jumping', 'dancing', 'waving'];
// Idle mini-animations (phase 2)
const IDLE_ANIMATIONS: PetAnimation[] = ['scratching', 'yawning', 'jumping'];

const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🌟'];

const randomPhrase = () => pickRandom(IDLE_PHRASES);
const randomSadPhrase = () => pickRandom(SAD_PHRASES);
const randomTapPhrase = () => pickRandom(TAP_PHRASES);

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
  const animalType = useAtomValue(animalTypeAtom);
  const petName = useAtomValue(petNameAtom);
  const [lastVisitTime, setLastVisitTime] = useAtom(lastVisitTimeAtom);
  const [petColorsMap, setPetColorsMap] = useAtom(petColorsAtom);
  const [ownedColorsMap, setOwnedColorsMap] = useAtom(ownedColorsAtom);
  const [ownedAccessoriesMap, setOwnedAccessoriesMap] = useAtom(ownedAccessoriesAtom);
  const [equippedAccessoriesMap, setEquippedAccessoriesMap] = useAtom(equippedAccessoriesAtom);
  const { speak } = useSpeech(null);
  const {
    playChirpHappy, playMunch, playWaterSplash,
    playPoopSound, playBulldozer, playCashRegister, playFanfare,
  } = useAudio();
  const setTimer = useTimers();
  const { completedGroupIndices } = useLevelGroups();

  const petStage = getPetStage(completedGroupIndices.length);
  const habitatIndex = Math.min(completedGroupIndices.length, 4);

  // Per-animal color/accessory helpers
  const petColor = petColorsMap[animalType] ?? null;
  const setPetColor = useCallback((color: string | null) => {
    setPetColorsMap(prev => ({ ...prev, [animalType]: color }));
  }, [animalType, setPetColorsMap]);
  const ownedColors = ownedColorsMap[animalType] ?? [];
  const setOwnedColors = useCallback((updater: (prev: string[]) => string[]) => {
    setOwnedColorsMap(prev => ({ ...prev, [animalType]: updater(prev[animalType] ?? []) }));
  }, [animalType, setOwnedColorsMap]);
  const ownedAccessories = ownedAccessoriesMap[animalType] ?? [];
  const setOwnedAccessories = useCallback((updater: (prev: string[]) => string[]) => {
    setOwnedAccessoriesMap(prev => ({ ...prev, [animalType]: updater(prev[animalType] ?? []) }));
  }, [animalType, setOwnedAccessoriesMap]);
  const equippedAccessory = equippedAccessoriesMap[animalType] ?? null;
  const setEquippedAccessory = useCallback((accId: string | null) => {
    setEquippedAccessoriesMap(prev => ({ ...prev, [animalType]: accId }));
  }, [animalType, setEquippedAccessoriesMap]);

  const [phase, setPhase] = useState<ActionPhase>('idle');
  const [shopTab, setShopTab] = useState<ShopTab>('food');
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
  const [showZzz, setShowZzz] = useState(false);
  const initDone = useRef(false);
  const idleIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- SPEECH BUBBLE AUTO-HIDE ---
  const say = useCallback((text: string) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    if (speechFadeTimerRef.current) clearTimeout(speechFadeTimerRef.current);
    setSpeechText(text);
    setShowSpeech(true);
    setSpeechFading(false);
    speak(text, 0.85, 1.8);
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

  // --- IDLE MINI-ANIMATIONS (Phase 2) ---
  useEffect(() => {
    if (phase !== 'idle' || busy) {
      if (idleIntervalRef.current) {
        clearTimeout(idleIntervalRef.current);
        idleIntervalRef.current = null;
      }
      return;
    }

    const scheduleNext = () => {
      const delay = IDLE_ANIM_MIN + Math.random() * (IDLE_ANIM_MAX - IDLE_ANIM_MIN);
      idleIntervalRef.current = setTimeout(() => {
        const anim = pickRandom(IDLE_ANIMATIONS);
        setPetAnimation(anim);
        // Return to idle after animation plays
        setTimeout(() => {
          setPetAnimation('idle');
          scheduleNext();
        }, 1500);
      }, delay);
    };

    scheduleNext();
    return () => {
      if (idleIntervalRef.current) clearTimeout(idleIntervalRef.current);
    };
  }, [phase, busy]);

  // --- INIT: absence check + hunger + growth celebration ---
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    // Check for growth celebration first
    if (petStage !== lastSeenPetStage) {
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

    // Phase 1: Absence-based emotional reaction
    const now = Date.now();
    if (lastVisitTime > 0) {
      const absence = now - lastVisitTime;
      if (absence >= ABSENCE_LONG) {
        // Very sad → transitions to happy after 3s
        setMood('sad');
        setPetAnimation('idle');
        say(pickRandom(ABSENCE_LONG_PHRASES));
        setBusy(true);
        setTimeout(() => {
          setMood('happy');
          setPetAnimation('happy');
          say('But now you are here! Yay!');
          setTimeout(() => { setBusy(false); setPetAnimation('idle'); setMood('neutral'); }, 1500);
        }, 3000);
        return;
      } else if (absence >= ABSENCE_MEDIUM) {
        // Sad → transitions to happy after 2s
        setMood('sad');
        setPetAnimation('idle');
        say(pickRandom(ABSENCE_MEDIUM_PHRASES));
        setBusy(true);
        setTimeout(() => {
          setMood('happy');
          setPetAnimation('happy');
          say('I am so glad you are back!');
          setTimeout(() => { setBusy(false); setPetAnimation('idle'); setMood('neutral'); }, 1500);
        }, 2000);
        return;
      } else if (absence >= ABSENCE_MILD) {
        say(pickRandom(ABSENCE_MILD_PHRASES));
        return;
      }
    }

    // Check for hunger (24h since last fed)
    if (lastFedTime > 0 && now - lastFedTime > PET_HUNGER_THRESHOLD) {
      setMood('sad');
      say("I haven't eaten in so long!");
    } else {
      say(randomPhrase());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- TAP INTERACTION (Phase 2: expanded) ---
  const handlePetTap = useCallback(() => {
    if (phase !== 'idle' || busy) return;
    setBusy(true);
    setMood('happy');
    const anim = pickRandom(TAP_ANIMATIONS);
    setPetAnimation(anim);
    playChirpHappy();
    say(randomTapPhrase());
    setTimer(() => goIdle(), DELAY_PET_REACTION);
  }, [phase, busy, playChirpHappy, say, setTimer, goIdle]);

  // --- SHOPPING ---
  const startShopping = useCallback(() => {
    setPhase('shopping');
    setShopTab('food');
    say('Buy me some food?');
    setPetAnimation('happy');
    setTimer(() => setPetAnimation('idle'), 1500);
  }, [say, setTimer]);

  const buyItem = useCallback((item: ShopItem) => {
    if (item.price > score) return;
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

  // --- BUY COLOR (Phase 3) ---
  const buyColor = useCallback((colorId: string, hex: string) => {
    if (ownedColors.includes(colorId)) {
      // Already owned — apply it
      setPetColor(hex);
      say('I look amazing!');
      setPetAnimation('dancing');
      setTimer(() => setPetAnimation('idle'), 1500);
      return;
    }
    if (SHOP_COLOR_PRICE > score) return;
    subtractScore(SHOP_COLOR_PRICE);
    playCashRegister();
    setOwnedColors(prev => [...prev, colorId]);
    setPetColor(hex);
    say('New color! I love it!');
    setPetAnimation('happy');
    playChirpHappy();
    setTimer(() => setPetAnimation('idle'), DELAY_PET_REACTION);
  }, [ownedColors, score, subtractScore, playCashRegister, playChirpHappy, say, setTimer, setPetColor, setOwnedColors]);

  // Reset to default color
  const resetColor = useCallback(() => {
    setPetColor(null);
    say('Back to normal!');
    setPetAnimation('happy');
    setTimer(() => setPetAnimation('idle'), 1000);
  }, [setPetColor, say, setTimer]);

  // --- BUY ACCESSORY (Phase 4) ---
  const buyAccessory = useCallback((accId: string) => {
    if (ownedAccessories.includes(accId)) {
      // Already owned — toggle equip
      if (equippedAccessory === accId) {
        setEquippedAccessory(null);
        say('Taking it off!');
      } else {
        setEquippedAccessory(accId);
        say('Looking good!');
      }
      setPetAnimation('happy');
      setTimer(() => setPetAnimation('idle'), 1000);
      return;
    }
    if (SHOP_ACCESSORY_PRICE > score) return;
    subtractScore(SHOP_ACCESSORY_PRICE);
    playCashRegister();
    setOwnedAccessories(prev => [...prev, accId]);
    setEquippedAccessory(accId);
    say('My new favorite thing!');
    setPetAnimation('dancing');
    playChirpHappy();
    setTimer(() => setPetAnimation('idle'), DELAY_PET_REACTION);
  }, [ownedAccessories, equippedAccessory, score, subtractScore, playCashRegister, playChirpHappy, say, setTimer, setEquippedAccessory, setOwnedAccessories]);

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

  // --- SLEEP & LEAVE ---
  const handleLeave = useCallback(() => {
    setPhase('sleeping');
    setBusy(true);
    say('*yaaawn* I am sleepy...');
    setPetAnimation('sleeping');
    setMood('neutral');
    setShowZzz(true);

    // Save last visit time (Phase 1)
    setLastVisitTime(Date.now());

    setTimer(() => {
      say('Good night! See you tomorrow!');
    }, 2000);

    setTimer(() => {
      navigate(`/map?scrollTo=${nextLevel}`);
    }, 4000);
  }, [say, setTimer, navigate, nextLevel, setLastVisitTime]);

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
          {/* SVG Yellow Bulldozer with blade */}
          <svg className={styles.bulldozerSvg} viewBox="0 0 120 70" aria-label="Bulldozer">
            {/* Blade / radlice */}
            <rect x="0" y="16" width="10" height="38" rx="2" fill="#E0A000" stroke="#B8860B" strokeWidth="1.5" />
            <rect x="2" y="12" width="6" height="8" rx="1" fill="#C8930A" />
            {/* Arm connecting blade to body */}
            <rect x="10" y="28" width="20" height="6" rx="2" fill="#D4A017" />
            {/* Body */}
            <rect x="28" y="10" width="58" height="34" rx="8" fill="#FFD600" />
            {/* Body highlight */}
            <rect x="34" y="14" width="30" height="10" rx="5" fill="white" opacity="0.2" />
            {/* Cabin */}
            <rect x="56" y="2" width="26" height="28" rx="4" fill="#FFE54C" stroke="#D4A017" strokeWidth="1.5" />
            {/* Window */}
            <rect x="60" y="6" width="18" height="14" rx="3" fill="#81D4FA" opacity="0.8" />
            {/* Window shine */}
            <rect x="62" y="8" width="6" height="8" rx="2" fill="white" opacity="0.35" />
            {/* Exhaust pipe */}
            <rect x="38" y="2" width="5" height="12" rx="2" fill="#616161" />
            <ellipse cx="40.5" cy="2" rx="4" ry="2" fill="#424242" />
            {/* Tracks / undercarriage */}
            <rect x="26" y="44" width="64" height="18" rx="9" fill="#424242" />
            <rect x="30" y="47" width="56" height="12" rx="6" fill="#616161" />
            {/* Track wheels */}
            <circle cx="38" cy="53" r="5" fill="#424242" />
            <circle cx="38" cy="53" r="2.5" fill="#757575" />
            <circle cx="58" cy="53" r="5" fill="#424242" />
            <circle cx="58" cy="53" r="2.5" fill="#757575" />
            <circle cx="78" cy="53" r="5" fill="#424242" />
            <circle cx="78" cy="53" r="2.5" fill="#757575" />
            {/* Track teeth */}
            <rect x="32" y="57" width="4" height="3" rx="1" fill="#424242" />
            <rect x="42" y="57" width="4" height="3" rx="1" fill="#424242" />
            <rect x="52" y="57" width="4" height="3" rx="1" fill="#424242" />
            <rect x="62" y="57" width="4" height="3" rx="1" fill="#424242" />
            <rect x="72" y="57" width="4" height="3" rx="1" fill="#424242" />
          </svg>
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

  const renderShopTabs = () => (
    <div className={styles.shopTabs}>
      <button
        className={cn(styles.shopTab, shopTab === 'food' && styles.shopTabActive)}
        onClick={() => setShopTab('food')}
      >
        🍽️ Food
      </button>
      <button
        className={cn(styles.shopTab, shopTab === 'colors' && styles.shopTabActive)}
        onClick={() => setShopTab('colors')}
      >
        🎨 Colors
      </button>
      <button
        className={cn(styles.shopTab, shopTab === 'accessories' && styles.shopTabActive)}
        onClick={() => setShopTab('accessories')}
      >
        👒 Stuff
      </button>
    </div>
  );

  const renderShopContent = () => {
    if (shopTab === 'food') {
      return (
        <>
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
                    {item.price === 0 ? 'Free' : `${item.price} pts`}
                  </span>
                </button>
              );
            })}
          </div>
          {inventoryFull && (
            <div className={styles.backHint}>Bag is full!</div>
          )}
        </>
      );
    }

    if (shopTab === 'colors') {
      return (
        <div className={styles.shopCards}>
          {/* Reset to default */}
          <button
            className={cn(styles.shopCard, !petColor && styles.shopCardDisabled)}
            disabled={!petColor}
            onClick={resetColor}
          >
            <span className={styles.colorSwatch} style={{ background: 'linear-gradient(135deg, #ccc, #eee)' }}>✕</span>
            <span className={styles.shopCardName}>Default</span>
            <span className={styles.shopCardFree}>Free</span>
          </button>
          {COLOR_OPTIONS.map((c) => {
            const owned = ownedColors.includes(c.id);
            const active = petColor === c.hex;
            const disabled = !owned && SHOP_COLOR_PRICE > score;
            return (
              <button
                key={c.id}
                className={cn(
                  styles.shopCard,
                  disabled && styles.shopCardDisabled,
                  active && styles.shopCardActive,
                )}
                disabled={disabled}
                onClick={() => buyColor(c.id, c.hex)}
              >
                <span className={styles.colorSwatch} style={{ background: c.hex }}>{c.emoji}</span>
                <span className={styles.shopCardName}>{c.name}</span>
                <span className={owned ? styles.shopCardFree : styles.shopCardPrice}>
                  {owned ? (active ? 'Active' : 'Owned') : `${SHOP_COLOR_PRICE} pts`}
                </span>
              </button>
            );
          })}
        </div>
      );
    }

    // accessories tab
    return (
      <div className={styles.shopCards}>
        {/* Unequip */}
        <button
          className={cn(styles.shopCard, !equippedAccessory && styles.shopCardDisabled)}
          disabled={!equippedAccessory}
          onClick={() => { setEquippedAccessory(null); say('Taking it off!'); }}
        >
          <span className={styles.shopCardEmoji}>🚫</span>
          <span className={styles.shopCardName}>None</span>
          <span className={styles.shopCardFree}>Free</span>
        </button>
        {ACCESSORY_LIST.map((acc) => {
          const owned = ownedAccessories.includes(acc.id);
          const equipped = equippedAccessory === acc.id;
          const disabled = !owned && SHOP_ACCESSORY_PRICE > score;
          return (
            <button
              key={acc.id}
              className={cn(
                styles.shopCard,
                disabled && styles.shopCardDisabled,
                equipped && styles.shopCardActive,
              )}
              disabled={disabled}
              onClick={() => buyAccessory(acc.id)}
            >
              <span className={styles.shopCardEmoji}>{acc.emoji}</span>
              <span className={styles.shopCardName}>{acc.name}</span>
              <span className={owned ? styles.shopCardFree : styles.shopCardPrice}>
                {owned ? (equipped ? 'Equipped' : 'Owned') : `${SHOP_ACCESSORY_PRICE} pts`}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderActionArea = () => {
    switch (phase) {
      case 'shopping':
        return (
          <div className={styles.actionArea}>
            {renderShopTabs()}
            {renderShopContent()}
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
      case 'sleeping':
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
    <div className={cn(styles.wrapper, styles[`habitat${habitatIndex}`])}>
      {/* Confetti overlay */}
      {renderConfetti()}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <button
            className={styles.backButton}
            onClick={handleLeave}
            disabled={fedCount < PET_MIN_FED || phase === 'sleeping'}
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
        {petName && <div className={styles.petName}>{petName}</div>}
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
          <Pet
            stage={petStage}
            animation={petAnimation}
            mood={mood}
            animalType={animalType}
            bodyColor={petColor ?? undefined}
            accessoryId={equippedAccessory}
          />
          {renderShowerEffects()}
          {renderPoopEffects()}
          {showZzz && (
            <div className={styles.zzzContainer}>
              {['💤', '💤', '💤'].map((z, i) => (
                <span key={i} className={styles.zzz} style={{ animationDelay: `${i * 0.8}s` }}>{z}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action area */}
      {renderActionArea()}
    </div>
  );
}
