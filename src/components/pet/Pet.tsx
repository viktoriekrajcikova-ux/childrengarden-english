import { useRef, useCallback } from 'react';
import { useAtom } from 'jotai';
import type { PetStage, AnimalType } from '../../types';
import { accessoryPositionsAtom } from '../../store/atoms';
import { ANIMAL_REGISTRY } from './animalRegistry';
import { ACCESSORY_DEFS } from './accessories';
import styles from './Pet.module.css';

export type PetAnimation =
  | 'idle' | 'happy' | 'eating' | 'showering' | 'pooping' | 'relieved' | 'sleeping'
  | 'scratching' | 'yawning' | 'jumping' | 'dancing' | 'waving';
export type PetMood = 'happy' | 'sad' | 'neutral';

interface PetProps {
  stage: PetStage;
  animation: PetAnimation;
  mood?: PetMood;
  animalType?: AnimalType;
  bodyColor?: string;
  accessoryId?: string | null;
}

export default function Pet({
  stage,
  animation,
  mood = 'neutral',
  animalType = 'chick',
  bodyColor,
  accessoryId,
}: PetProps) {
  const PetSvg = ANIMAL_REGISTRY[animalType].stages[stage];
  const accessory = accessoryId ? ACCESSORY_DEFS[accessoryId] : null;
  const [positions, setPositions] = useAtom(accessoryPositionsAtom);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // Klíč pro pozici: animal+stage+accessory
  const posKey = accessoryId ? `${animalType}_${stage}_${accessoryId}` : '';
  const pos = posKey ? positions[posKey] : null;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!posKey) return;
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: pos?.x ?? 0,
      oy: pos?.y ?? 0,
    };
  }, [posKey, pos]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current || !posKey) return;
    e.preventDefault();
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    setPositions(prev => ({
      ...prev,
      [posKey]: {
        x: startRef.current.ox + dx,
        y: startRef.current.oy + dy,
      },
    }));
  }, [posKey, setPositions]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return (
    <div ref={wrapperRef} className={`${styles.petWrapper} ${styles[animation]}`}>
      <PetSvg mood={mood} bodyColor={bodyColor} />
      {accessory && (
        <span
          className={styles.accessory}
          style={{
            transform: `translate(${pos?.x ?? 0}px, ${pos?.y ?? 0}px)`,
            cursor: 'grab',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {accessory.emoji}
        </span>
      )}
    </div>
  );
}
