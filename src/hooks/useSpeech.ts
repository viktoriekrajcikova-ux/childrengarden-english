import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, rate = 0.8, pitch = 1) => {
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
  }, []);

  return { speak };
}
