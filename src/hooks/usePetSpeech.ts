import { useState, useCallback, useRef } from 'react';
import { useSpeech } from './useSpeech';

export function usePetSpeech() {
  const { speak } = useSpeech(null);
  const [speechText, setSpeechText] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [speechFading, setSpeechFading] = useState(false);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return { say, speechText, showSpeech, speechFading };
}
