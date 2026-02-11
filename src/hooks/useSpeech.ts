import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, rate = 0.8) => {
    try {
      if (!window.speechSynthesis) return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis unavailable — silent fallback
    }
  }, []);

  return { speak };
}
