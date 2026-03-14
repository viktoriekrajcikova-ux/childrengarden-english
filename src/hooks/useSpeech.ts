import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { mutedAtom } from '../store/atoms';

export function useSpeech() {
  const muted = useAtomValue(mutedAtom);

  const speak = useCallback((text: string, rate = 0.8, pitch = 1) => {
    if (muted) return;
    try {
      if (!window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = pitch;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis unavailable — silent fallback
    }
  }, [muted]);

  return { speak };
}
