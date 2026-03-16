import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { mutedAtom, volumeAtom } from '../store/atoms';
import type { Difficulty } from '../types';

const DIFFICULTY_RATE: Record<Difficulty, number> = {
  easy: 0.7,
  medium: 0.85,
  hard: 0.9,
};

export function useSpeech(difficulty?: Difficulty | null) {
  const muted = useAtomValue(mutedAtom);
  const volume = useAtomValue(volumeAtom);

  const speak = useCallback((text: string, rate?: number, pitch = 1) => {
    if (muted) return;
    try {
      if (!window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate ?? (difficulty ? DIFFICULTY_RATE[difficulty] : 0.8);
      utterance.pitch = pitch;
      utterance.volume = volume;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis unavailable — silent fallback
    }
  }, [muted, difficulty, volume]);

  return { speak };
}
