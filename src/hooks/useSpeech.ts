import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, rate = 0.8) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}
