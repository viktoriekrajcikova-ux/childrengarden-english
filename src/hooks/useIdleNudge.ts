import { useEffect, useRef, useCallback } from 'react';
import { IDLE_NUDGE_MS, IDLE_HINT_MS } from '../constants';

const NUDGE_PHRASES = [
  'Come on, you can do it!',
  'Try clicking an answer!',
  'You are doing great, keep going!',
  'Don\'t give up!',
];

export function useIdleNudge(
  speak: (text: string) => void,
  isActive: boolean,
  onAutoHint?: () => void,
) {
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (nudgeTimer.current) {
      clearTimeout(nudgeTimer.current);
      nudgeTimer.current = null;
    }
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
      hintTimer.current = null;
    }
  }, []);

  const startTimers = useCallback(() => {
    clearTimers();
    if (!isActive) return;

    nudgeTimer.current = setTimeout(() => {
      const phrase = NUDGE_PHRASES[Math.floor(Math.random() * NUDGE_PHRASES.length)];
      speak(phrase);
    }, IDLE_NUDGE_MS);

    if (onAutoHint) {
      hintTimer.current = setTimeout(() => {
        onAutoHint();
      }, IDLE_HINT_MS);
    }
  }, [isActive, speak, onAutoHint, clearTimers]);

  const resetIdle = useCallback(() => {
    startTimers();
  }, [startTimers]);

  useEffect(() => {
    startTimers();
    return clearTimers;
  }, [startTimers, clearTimers]);

  return { resetIdle };
}
