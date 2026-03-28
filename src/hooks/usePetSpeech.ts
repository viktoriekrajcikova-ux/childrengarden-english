import { useState, useCallback, useRef } from 'react';
import { useSpeech } from './useSpeech';

export function usePetSpeech() {
  const { speak } = useSpeech(null);
  const [speechText, setSpeechText] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [speechFading, setSpeechFading] = useState(false);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyUntilRef = useRef(0);

  const say = useCallback((text: string) => {
    const now = Date.now();
    const delay = Math.max(0, busyUntilRef.current - now);

    // Naplánuj řeč po skončení předchozí
    setTimeout(() => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (speechFadeTimerRef.current) clearTimeout(speechFadeTimerRef.current);
      setSpeechText(text);
      setShowSpeech(true);
      setSpeechFading(false);
      speak(text, 0.75, 1.6);
      speechFadeTimerRef.current = setTimeout(() => setSpeechFading(true), 4000);
      speechTimerRef.current = setTimeout(() => {
        setShowSpeech(false);
        setSpeechFading(false);
      }, 4500);
    }, delay);

    // Označ že jsme busy na ~2.5s (průměrná délka promluvy)
    busyUntilRef.current = now + delay + 2500;
  }, [speak]);

  return { say, speechText, showSpeech, speechFading };
}
