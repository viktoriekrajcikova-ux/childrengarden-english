import { useState, useCallback, useRef, useEffect } from 'react';
import { useSpeech } from './useSpeech';

export function usePetSpeech() {
  const { speak, cancel } = useSpeech(null);
  const [speechText, setSpeechText] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  const [speechFading, setSpeechFading] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBubbleTimers = useCallback(() => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    fadeTimerRef.current = null;
    hideTimerRef.current = null;
  }, []);

  const say = useCallback((text: string) => {
    clearBubbleTimers();
    cancel();
    setSpeechText(text);
    setShowSpeech(true);
    setSpeechFading(false);
    speak(text, 0.75, 1.6);
    fadeTimerRef.current = setTimeout(() => setSpeechFading(true), 4000);
    hideTimerRef.current = setTimeout(() => {
      setShowSpeech(false);
      setSpeechFading(false);
    }, 4500);
  }, [speak, cancel, clearBubbleTimers]);

  const stop = useCallback(() => {
    clearBubbleTimers();
    cancel();
    setShowSpeech(false);
    setSpeechFading(false);
  }, [cancel, clearBubbleTimers]);

  useEffect(() => {
    return () => {
      clearBubbleTimers();
      cancel();
    };
  }, [cancel, clearBubbleTimers]);

  return { say, stop, speechText, showSpeech, speechFading };
}
