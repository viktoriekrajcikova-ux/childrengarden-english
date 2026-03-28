import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom, useAtomValue, useAtom } from 'jotai';
import {
  subtractScoreAtom, scoreAtom, addFedFoodAtom,
  mutedAtom, lastSeenPetStageAtom, lastFedTimeAtom,
  animalTypeAtom, petNameAtom, lastVisitTimeAtom,
} from '../store/atoms';
import { useAudio } from '../hooks/useAudio';
import { useTimers } from '../hooks/useTimers';
import { useTouchDrag } from '../hooks/useTouchDrag';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { usePetSpeech } from '../hooks/usePetSpeech';
import { usePetCustomization } from '../hooks/usePetCustomization';
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
import {
  IDLE_PHRASES, SAD_PHRASES, TAP_PHRASES,
  ABSENCE_MILD_PHRASES, ABSENCE_MEDIUM_PHRASES, ABSENCE_LONG_PHRASES,
  TAP_ANIMATIONS, IDLE_ANIMATIONS, CONFETTI_EMOJIS,
} from '../constants/petPhrases';
import Pet from '../components/pet/Pet';
import type { PetAnimation, PetMood } from '../components/pet/Pet';
import SpeechBubble from '../components/pet/SpeechBubble';
import Inventory from '../components/pet/Inventory';
import type { FoodItem } from '../components/pet/Inventory';
import { pickRandom } from '../utils/shuffle';
import { cn } from '../utils/cn';
import { getUnlockedIds } from '../data/rewards';
import { claimedRewardsAtom } from '../store/atoms';
import styles from './PetCarePage.module.css';

type ActionPhase = 'idle' | 'shopping' | 'feeding' | 'shower' | 'poop' | 'sleeping';
type ShopTab = 'food' | 'colors' | 'accessories';

interface ShopItem { emoji: string; name: string; price: number }

const ALL_FOOD: ShopItem[] = [
  { emoji: '🌾', name: 'Grain', price: SHOP_GRAIN_PRICE },
  { emoji: '🍎', name: 'Apple', price: SHOP_APPLE_PRICE },
  { emoji: '🎂', name: 'Cake', price: SHOP_CAKE_PRICE },
];

let foodIdCounter = 0;

export default function PetCarePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextLevel = searchParams.get('nextLevel') || '0';

  // --- Atoms ---
  const subtractScore = useSetAtom(subtractScoreAtom);
  const addFedFood = useSetAtom(addFedFoodAtom);
  const score = useAtomValue(scoreAtom);
  const [muted, setMuted] = useAtom(mutedAtom);
  const [lastSeenPetStage, setLastSeenPetStage] = useAtom(lastSeenPetStageAtom);
  const [lastFedTime, setLastFedTime] = useAtom(lastFedTimeAtom);
  const animalType = useAtomValue(animalTypeAtom);
  const petName = useAtomValue(petNameAtom);
  const [lastVisitTime, setLastVisitTime] = useAtom(lastVisitTimeAtom);

  // --- Custom hooks ---
  const { say, speechText, showSpeech, speechFading } = usePetSpeech();
  const {
    petColor, setPetColor, ownedColors, setOwnedColors,
    ownedAccessories, setOwnedAccessories, equippedAccessory, setEquippedAccessory,
  } = usePetCustomization();
  const {
    playChirpHappy, playMunch, playWaterSplash,
    playPoopSound, playBulldozer, playCashRegister, playFanfare,
  } = useAudio();
  const setTimer = useTimers();
  const { completedGroupIndices } = useLevelGroups();
  const claimedRewards = useAtomValue(claimedRewardsAtom);
  const unlocked = getUnlockedIds(claimedRewards);

  const petStage = getPetStage(completedGroupIndices.length);
  const habitatIndex = Math.min(completedGroupIndices.length, 4);

  // --- Local state ---
  const [phase, setPhase] = useState<ActionPhase>('idle');
  const [shopTab, setShopTab] = useState<ShopTab>('food');
  const [inventory, setInventory] = useState<FoodItem[]>([]);
  const [petAnimation, setPetAnimation] = useState<PetAnimation>('idle');
  const [mood, setMood] = useState<PetMood>('neutral');
  const [fedCount, setFedCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [poopVisible, setPoopVisible] = useState(false);
  const [bulldozerVisible, setBulldozerVisible] = useState(false);
  const [showerActive, setShowerActive] = useState(false);
  const [bubblesActive, setBubblesActive] = useState(false);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const draggedRef = useRef<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showZzz, setShowZzz] = useState(false);
  const initDone = useRef(false);
  const idleIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Core helpers ---
  const goIdle = useCallback((text?: string) => {
    setPhase('idle');
    setPetAnimation('idle');
    setMood('neutral');
    say(text ?? pickRandom(IDLE_PHRASES));
    setBusy(false);
  }, [say]);

  // --- Idle mini-animations ---
  useEffect(() => {
    if (phase !== 'idle' || busy) {
      if (idleIntervalRef.current) { clearTimeout(idleIntervalRef.current); idleIntervalRef.current = null; }
      return;
    }
    const scheduleNext = () => {
      const delay = IDLE_ANIM_MIN + Math.random() * (IDLE_ANIM_MAX - IDLE_ANIM_MIN);
      idleIntervalRef.current = setTimeout(() => {
        setPetAnimation(pickRandom(IDLE_ANIMATIONS));
        setTimeout(() => { setPetAnimation('idle'); scheduleNext(); }, 1500);
      }, delay);
    };
    scheduleNext();
    return () => { if (idleIntervalRef.current) clearTimeout(idleIntervalRef.current); };
  }, [phase, busy]);

  // --- Init: absence + hunger + growth ---
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    if (petStage !== lastSeenPetStage) {
      setMood('happy'); setPetAnimation('happy');
      say("I'm growing up! Look at me!"); playFanfare();
      setShowConfetti(true); setBusy(true);
      setTimeout(() => { setLastSeenPetStage(petStage); setShowConfetti(false); goIdle(); }, 3000);
      return;
    }

    const now = Date.now();
    if (lastVisitTime > 0) {
      const absence = now - lastVisitTime;
      if (absence >= ABSENCE_LONG) {
        setMood('sad'); say(pickRandom(ABSENCE_LONG_PHRASES)); setBusy(true);
        setTimeout(() => {
          setMood('happy'); setPetAnimation('happy'); say('But now you are here! Yay!');
          setTimeout(() => { setBusy(false); setPetAnimation('idle'); setMood('neutral'); }, 1500);
        }, 3000);
        return;
      } else if (absence >= ABSENCE_MEDIUM) {
        setMood('sad'); say(pickRandom(ABSENCE_MEDIUM_PHRASES)); setBusy(true);
        setTimeout(() => {
          setMood('happy'); setPetAnimation('happy'); say('I am so glad you are back!');
          setTimeout(() => { setBusy(false); setPetAnimation('idle'); setMood('neutral'); }, 1500);
        }, 2000);
        return;
      } else if (absence >= ABSENCE_MILD) {
        say(pickRandom(ABSENCE_MILD_PHRASES)); return;
      }
    }

    if (lastFedTime > 0 && now - lastFedTime > PET_HUNGER_THRESHOLD) {
      setMood('sad'); say("I haven't eaten in so long!");
    } else {
      say(pickRandom(IDLE_PHRASES));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Tap ---
  const handlePetTap = useCallback(() => {
    if (phase !== 'idle' || busy) return;
    setBusy(true); setMood('happy');
    setPetAnimation(pickRandom(TAP_ANIMATIONS));
    playChirpHappy(); say(pickRandom(TAP_PHRASES));
    setTimer(() => goIdle(), DELAY_PET_REACTION);
  }, [phase, busy, playChirpHappy, say, setTimer, goIdle]);

  // --- Shopping ---
  const startShopping = useCallback(() => {
    setPhase('shopping'); setShopTab('food');
    say('Buy me some food?'); setPetAnimation('happy');
    setTimer(() => setPetAnimation('idle'), 1500);
  }, [say, setTimer]);

  const buyItem = useCallback((item: ShopItem) => {
    if (item.price > score) return;
    if (inventory.length >= PET_MAX_INVENTORY) { say('My bag is full!'); return; }
    if (item.price > 0) subtractScore(item.price);
    playCashRegister();
    setInventory(prev => [...prev, { id: `food-${++foodIdCounter}`, emoji: item.emoji, name: item.name }]);
    say('I love it, thank you!'); setPetAnimation('happy'); playChirpHappy();
    setTimer(() => { setPetAnimation('idle'); say('Anything else?'); }, DELAY_PET_REACTION);
  }, [score, inventory.length, subtractScore, playCashRegister, playChirpHappy, say, setTimer]);

  const buyColor = useCallback((colorId: string, hex: string) => {
    if (ownedColors.includes(colorId)) {
      setPetColor(hex); say('I look amazing!'); setPetAnimation('dancing');
      setTimer(() => setPetAnimation('idle'), 1500); return;
    }
    if (SHOP_COLOR_PRICE > score) return;
    subtractScore(SHOP_COLOR_PRICE); playCashRegister();
    setOwnedColors(prev => [...prev, colorId]); setPetColor(hex);
    say('New color! I love it!'); setPetAnimation('happy'); playChirpHappy();
    setTimer(() => setPetAnimation('idle'), DELAY_PET_REACTION);
  }, [ownedColors, score, subtractScore, playCashRegister, playChirpHappy, say, setTimer, setPetColor, setOwnedColors]);

  const resetColor = useCallback(() => {
    setPetColor(null); say('Back to normal!'); setPetAnimation('happy');
    setTimer(() => setPetAnimation('idle'), 1000);
  }, [setPetColor, say, setTimer]);

  const buyAccessory = useCallback((accId: string) => {
    if (ownedAccessories.includes(accId)) {
      if (equippedAccessory === accId) { setEquippedAccessory(null); say('Taking it off!'); }
      else { setEquippedAccessory(accId); say('Looking good!'); }
      setPetAnimation('happy'); setTimer(() => setPetAnimation('idle'), 1000); return;
    }
    if (SHOP_ACCESSORY_PRICE > score) return;
    subtractScore(SHOP_ACCESSORY_PRICE); playCashRegister();
    setOwnedAccessories(prev => [...prev, accId]); setEquippedAccessory(accId);
    say('My new favorite thing!'); setPetAnimation('dancing'); playChirpHappy();
    setTimer(() => setPetAnimation('idle'), DELAY_PET_REACTION);
  }, [ownedAccessories, equippedAccessory, score, subtractScore, playCashRegister, playChirpHappy, say, setTimer, setEquippedAccessory, setOwnedAccessories]);

  // --- Feeding ---
  const startFeeding = useCallback(() => {
    setPhase('feeding'); say('I am so hungry, feed me!'); setPetAnimation('idle');
  }, [say]);

  const processFeedDrop = useCallback((itemId: string, zoneId: string) => {
    if (busy || zoneId !== 'pet') return;
    setBusy(true); playMunch(); setPetAnimation('eating');

    let droppedEmoji = '';
    setInventory(prev => {
      const item = prev.find(f => f.id === itemId);
      if (item) { droppedEmoji = item.emoji; addFedFood(item.emoji); }
      return prev.filter(f => f.id !== itemId);
    });

    setFedCount(prev => {
      const newCount = prev + 1;
      if (newCount < PET_MIN_FED) {
        say(pickRandom(SAD_PHRASES));
        setTimer(() => { setMood('sad'); setPetAnimation('idle'); setBusy(false); }, DELAY_PET_ACTION);
      } else {
        const reactions: Record<string, string> = { '🌾': 'Thanks, that was okay.', '🍎': 'Yummy apple, I love it!', '🎂': 'WOW, cake! This is the BEST!' };
        say(reactions[droppedEmoji] ?? 'That was so tasty!');
        setTimer(() => { setMood('happy'); setPetAnimation('happy'); setBusy(false); }, DELAY_PET_ACTION);
        setTimer(() => { setLastFedTime(Date.now()); goIdle(); }, DELAY_PET_ACTION + DELAY_PET_REACTION);
      }
      return newCount;
    });
  }, [busy, playMunch, addFedFood, say, setTimer, goIdle, setLastFedTime]);

  // Drag handlers
  const handleDragStart = (itemId: string, e: React.DragEvent) => {
    draggedRef.current = itemId; setDraggingItem(itemId); e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => setDraggingItem(null);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverZone('pet'); };
  const handleDragLeave = () => setDragOverZone(null);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOverZone(null);
    const itemId = draggedRef.current; if (!itemId) return;
    processFeedDrop(itemId, 'pet'); draggedRef.current = null; setDraggingItem(null);
  };
  const { getTouchHandlers } = useTouchDrag<string>({
    onDrop: processFeedDrop,
    onDragStart: (itemId) => setDraggingItem(itemId),
    onDragEnd: () => setDraggingItem(null),
    onDragOverZone: (zone) => setDragOverZone(zone),
  });

  // --- Shower ---
  const startShower = useCallback(() => {
    setBusy(true); setPhase('shower'); say('The water is so cold!');
    setPetAnimation('showering'); setShowerActive(true); playWaterSplash();
    setTimer(() => { setShowerActive(false); setBubblesActive(true); }, DELAY_SHOWER);
    setTimer(() => { setBubblesActive(false); say('Now I am all clean!'); setMood('happy'); setPetAnimation('happy'); playChirpHappy(); }, DELAY_SHOWER + DELAY_PET_REACTION);
    setTimer(() => goIdle(), DELAY_SHOWER + DELAY_PET_REACTION + DELAY_PET_REACTION);
  }, [say, playWaterSplash, playChirpHappy, setTimer, goIdle]);

  // --- Poop ---
  const startPoop = useCallback(() => {
    setBusy(true); setPhase('poop'); say('I need to go!'); setPetAnimation('pooping');
    setTimer(() => { setPoopVisible(true); playPoopSound(); }, DELAY_PET_ACTION);
    setTimer(() => { setBulldozerVisible(true); playBulldozer(); }, DELAY_PET_ACTION + 500);
    setTimer(() => {
      setPoopVisible(false); setBulldozerVisible(false);
      setMood('happy'); setPetAnimation('relieved'); say('That feels so much better!'); playChirpHappy();
    }, DELAY_PET_ACTION + 500 + DELAY_BULLDOZER);
    setTimer(() => goIdle(), DELAY_PET_ACTION + 500 + DELAY_BULLDOZER + DELAY_PET_REACTION);
  }, [say, playPoopSound, playBulldozer, playChirpHappy, setTimer, goIdle]);

  // --- Leave ---
  const doLeave = useCallback(() => {
    setPhase('sleeping'); setBusy(true);
    say('*yaaawn* I am sleepy...'); setPetAnimation('sleeping'); setMood('neutral'); setShowZzz(true);
    setLastVisitTime(Date.now());
    setTimer(() => say('Good night! See you tomorrow!'), 2000);
    setTimer(() => navigate(`/map?scrollTo=${nextLevel}`), 4000);
  }, [say, setTimer, navigate, nextLevel, setLastVisitTime]);

  const handleLeave = useCallback(() => {
    if (fedCount < PET_MIN_FED) {
      if (!confirm('Zvířátko ještě nemá dost jídla! Opravdu chceš odejít?')) return;
    }
    doLeave();
  }, [fedCount, doLeave]);

  // --- Render helpers ---
  const inventoryFull = inventory.length >= PET_MAX_INVENTORY;

  return (
    <div className={cn(styles.wrapper, styles[`habitat${habitatIndex}`])}>
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={`c-${i}`} className={styles.confettiPiece}
              style={{ left: `${5 + Math.random() * 90}%`, animationDelay: `${Math.random() * 1.5}s` }}>
              {CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
            </span>
          ))}
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div>
          <button className={styles.backButton} onClick={handleLeave}
            disabled={phase === 'sleeping'}>← Back</button>
          {fedCount < PET_MIN_FED && (
            <div className={styles.backHint}>
              {PET_MIN_FED - fedCount}x 🤍
            </div>
          )}
        </div>
        <span className={styles.scoreDisplay}>⭐ {score}</span>
        <button className={styles.muteButton} onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? '🔇' : '🔊'}</button>
        <Inventory items={inventory} />
      </div>

      {/* Feed progress */}
      {fedCount < PET_MIN_FED && (
        <div className={styles.feedProgress}>
          {Array.from({ length: PET_MIN_FED }).map((_, i) => <span key={i}>{i < fedCount ? '❤️' : '🤍'}</span>)}
        </div>
      )}

      {/* Pet area */}
      <div className={styles.petStage}>
        {petName && <div className={styles.petName}>{petName}</div>}
        <SpeechBubble text={speechText} visible={showSpeech} fading={speechFading} />
        <div className={cn(styles.petContainer,
          phase === 'feeding' && styles.petDropZone,
          phase === 'feeding' && dragOverZone === 'pet' && styles.petDropZoneActive)}
          data-drop-zone="pet"
          onDragOver={phase === 'feeding' ? handleDragOver : undefined}
          onDragLeave={phase === 'feeding' ? handleDragLeave : undefined}
          onDrop={phase === 'feeding' ? handleDrop : undefined}
          onClick={handlePetTap}>
          <Pet stage={petStage} animation={petAnimation} mood={mood}
            animalType={animalType} bodyColor={petColor ?? undefined} accessoryId={equippedAccessory} />
          {/* Shower effects */}
          {(showerActive || bubblesActive) && (
            <div className={styles.showerContainer}>
              {showerActive && Array.from({ length: 15 }).map((_, i) => (
                <div key={`d-${i}`} className={styles.showerDrop}
                  style={{ left: `${10 + (i * 80 / 15)}%`, animationDelay: `${i * 0.12}s` }} />
              ))}
              {bubblesActive && Array.from({ length: 8 }).map((_, i) => (
                <div key={`b-${i}`} className={styles.bubble}
                  style={{ left: `${20 + (i * 60 / 8)}%`, bottom: '20%',
                    width: `${10 + Math.random() * 15}px`, height: `${10 + Math.random() * 15}px`,
                    animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
          {/* Poop effects */}
          {poopVisible && !bulldozerVisible && <div className={styles.poopEmoji}>💩</div>}
          {bulldozerVisible && (
            <div className={styles.bulldozerContainer}>
              <svg className={styles.bulldozerSvg} viewBox="0 0 120 70" aria-label="Bulldozer">
                <rect x="0" y="16" width="10" height="38" rx="2" fill="#E0A000" stroke="#B8860B" strokeWidth="1.5" />
                <rect x="2" y="12" width="6" height="8" rx="1" fill="#C8930A" />
                <rect x="10" y="28" width="20" height="6" rx="2" fill="#D4A017" />
                <rect x="28" y="10" width="58" height="34" rx="8" fill="#FFD600" />
                <rect x="34" y="14" width="30" height="10" rx="5" fill="white" opacity="0.2" />
                <rect x="56" y="2" width="26" height="28" rx="4" fill="#FFE54C" stroke="#D4A017" strokeWidth="1.5" />
                <rect x="60" y="6" width="18" height="14" rx="3" fill="#81D4FA" opacity="0.8" />
                <rect x="62" y="8" width="6" height="8" rx="2" fill="white" opacity="0.35" />
                <rect x="38" y="2" width="5" height="12" rx="2" fill="#616161" />
                <ellipse cx="40.5" cy="2" rx="4" ry="2" fill="#424242" />
                <rect x="26" y="44" width="64" height="18" rx="9" fill="#424242" />
                <rect x="30" y="47" width="56" height="12" rx="6" fill="#616161" />
                <circle cx="38" cy="53" r="5" fill="#424242" /><circle cx="38" cy="53" r="2.5" fill="#757575" />
                <circle cx="58" cy="53" r="5" fill="#424242" /><circle cx="58" cy="53" r="2.5" fill="#757575" />
                <circle cx="78" cy="53" r="5" fill="#424242" /><circle cx="78" cy="53" r="2.5" fill="#757575" />
                <rect x="32" y="57" width="4" height="3" rx="1" fill="#424242" />
                <rect x="42" y="57" width="4" height="3" rx="1" fill="#424242" />
                <rect x="52" y="57" width="4" height="3" rx="1" fill="#424242" />
                <rect x="62" y="57" width="4" height="3" rx="1" fill="#424242" />
                <rect x="72" y="57" width="4" height="3" rx="1" fill="#424242" />
              </svg>
              <span className={styles.bulldozerPoop}>💩</span>
            </div>
          )}
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
      {phase === 'shopping' ? (
        <div className={styles.actionArea}>
          <div className={styles.shopTabs}>
            {(['food', 'colors', 'accessories'] as const).map(tab => (
              <button key={tab} className={cn(styles.shopTab, shopTab === tab && styles.shopTabActive)}
                onClick={() => setShopTab(tab)}>
                {tab === 'food' ? '🍽️ Food' : tab === 'colors' ? '🎨 Colors' : '👒 Stuff'}
              </button>
            ))}
          </div>
          {shopTab === 'food' ? (
            <>
              <div className={styles.shopCards}>
                {ALL_FOOD.filter(item => unlocked.foods.has(item.emoji)).map(item => {
                  const disabled = item.price > score || inventoryFull;
                  return (
                    <button key={item.emoji} className={cn(styles.shopCard, disabled && styles.shopCardDisabled)}
                      disabled={disabled} onClick={() => buyItem(item)}>
                      <span className={styles.shopCardEmoji}>{item.emoji}</span>
                      <span className={styles.shopCardName}>{item.name}</span>
                      <span className={item.price === 0 ? styles.shopCardFree : styles.shopCardPrice}>
                        {item.price === 0 ? 'Free' : `${item.price} pts`}</span>
                    </button>
                  );
                })}
              </div>
              {inventoryFull && <div className={styles.backHint}>Bag is full!</div>}
            </>
          ) : shopTab === 'colors' ? (
            <div className={styles.shopCards}>
              <button className={cn(styles.shopCard, !petColor && styles.shopCardDisabled)}
                disabled={!petColor} onClick={resetColor}>
                <span className={styles.colorSwatch} style={{ background: 'linear-gradient(135deg, #ccc, #eee)' }}>✕</span>
                <span className={styles.shopCardName}>Default</span>
                <span className={styles.shopCardFree}>Free</span>
              </button>
              {COLOR_OPTIONS.filter(c => unlocked.colors.has(c.id)).map(c => {
                const owned = ownedColors.includes(c.id);
                const active = petColor === c.hex;
                const disabled = !owned && SHOP_COLOR_PRICE > score;
                return (
                  <button key={c.id} className={cn(styles.shopCard, disabled && styles.shopCardDisabled, active && styles.shopCardActive)}
                    disabled={disabled} onClick={() => buyColor(c.id, c.hex)}>
                    <span className={styles.colorSwatch} style={{ background: c.hex }}>{c.emoji}</span>
                    <span className={styles.shopCardName}>{c.name}</span>
                    <span className={owned ? styles.shopCardFree : styles.shopCardPrice}>
                      {owned ? (active ? 'Active' : 'Owned') : `${SHOP_COLOR_PRICE} pts`}</span>
                  </button>
                );
              })}
              {unlocked.colors.size === 0 && <div className={styles.backHint}>Hraj a odemkni barvy!</div>}
            </div>
          ) : (
            <div className={styles.shopCards}>
              <button className={cn(styles.shopCard, !equippedAccessory && styles.shopCardDisabled)}
                disabled={!equippedAccessory}
                onClick={() => { setEquippedAccessory(null); say('Taking it off!'); }}>
                <span className={styles.shopCardEmoji}>🚫</span>
                <span className={styles.shopCardName}>None</span>
                <span className={styles.shopCardFree}>Free</span>
              </button>
              {ACCESSORY_LIST.filter(acc => unlocked.accessories.has(acc.id)).map(acc => {
                const owned = ownedAccessories.includes(acc.id);
                const equipped = equippedAccessory === acc.id;
                const disabled = !owned && SHOP_ACCESSORY_PRICE > score;
                return (
                  <button key={acc.id} className={cn(styles.shopCard, disabled && styles.shopCardDisabled, equipped && styles.shopCardActive)}
                    disabled={disabled} onClick={() => buyAccessory(acc.id)}>
                    <span className={styles.shopCardEmoji}>{acc.emoji}</span>
                    <span className={styles.shopCardName}>{acc.name}</span>
                    <span className={owned ? styles.shopCardFree : styles.shopCardPrice}>
                      {owned ? (equipped ? 'Equipped' : 'Owned') : `${SHOP_ACCESSORY_PRICE} pts`}</span>
                  </button>
                );
              })}
              {unlocked.accessories.size === 0 && <div className={styles.backHint}>Hraj a odemkni doplňky!</div>}
            </div>
          )}
          <button className={styles.backActionBtn} onClick={() => goIdle()}>Back</button>
        </div>
      ) : phase === 'feeding' ? (
        <div className={styles.actionArea}>
          <div className={styles.feedItems}>
            {inventory.map(item => (
              <div key={item.id} className={cn(styles.feedItem, draggingItem === item.id && styles.feedItemDragging)}
                draggable={!busy} onDragStart={(e) => handleDragStart(item.id, e)} onDragEnd={handleDragEnd}
                {...(busy ? {} : getTouchHandlers(item.id))}>{item.emoji}</div>
            ))}
          </div>
          <button className={styles.backActionBtn} onClick={() => goIdle()}>Back</button>
        </div>
      ) : phase === 'idle' ? (
        <div className={styles.actionButtons}>
          <button className={styles.actionBtn} onClick={startShopping} disabled={busy}>
            <span className={styles.actionBtnEmoji}>🛒</span>Shop</button>
          <button className={styles.actionBtn} onClick={startFeeding} disabled={busy || inventory.length === 0}>
            <span className={styles.actionBtnEmoji}>🍽️</span>Feed</button>
          <button className={styles.actionBtn} onClick={startShower} disabled={busy}>
            <span className={styles.actionBtnEmoji}>🚿</span>Shower</button>
          <button className={styles.actionBtn} onClick={startPoop} disabled={busy}>
            <span className={styles.actionBtnEmoji}>💩</span>Poop</button>
        </div>
      ) : null}
    </div>
  );
}
