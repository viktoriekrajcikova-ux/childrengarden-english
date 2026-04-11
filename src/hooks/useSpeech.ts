import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { mutedAtom, volumeAtom } from '../store/atoms';
import type { Difficulty } from '../types';

// Declare Android TTS interface for TypeScript
declare global {
  interface Window {
    AndroidTTS?: {
      speak: (text: string, rate: number) => void;
      isAvailable: () => boolean;
      getDiagnostics: () => string;
      openTTSSettings: () => void;
    };
  }
}

const DIFFICULTY_RATE: Record<Difficulty, number> = {
  easy: 0.7,
  medium: 0.85,
  hard: 0.9,
};

export function useSpeech(difficulty?: Difficulty | null) {
  const muted = useAtomValue(mutedAtom);
  const volume = useAtomValue(volumeAtom);
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsChecked, setTtsChecked] = useState(false);

  // Wait for Android TTS to initialize
  useEffect(() => {
    if (!window.AndroidTTS) {
      setTtsChecked(true);
      return;
    }

    let attempts = 0;
    const maxAttempts = 20; // 10 seconds total

    const checkInterval = setInterval(() => {
      attempts++;

      if (window.AndroidTTS && window.AndroidTTS.isAvailable()) {
        console.log('TTS is ready after', attempts * 500, 'ms');
        setTtsReady(true);
        setTtsChecked(true);
        clearInterval(checkInterval);
      } else if (attempts >= maxAttempts) {
        console.warn('TTS failed to initialize after 10 seconds');
        setTtsReady(false);
        setTtsChecked(true);
        clearInterval(checkInterval);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  const speak = useCallback((text: string, rate?: number, pitch = 1) => {
    if (muted) return;
    const effectiveRate = rate ?? (difficulty ? DIFFICULTY_RATE[difficulty] : 0.8);

    // Sanitize text: limit length, strip control chars
    const safeText = text.slice(0, 200).replace(/[\x00-\x1f]/g, '');
    if (!safeText) return;

    try {
      // Try Android TTS first (for Android WebView)
      if (window.AndroidTTS && window.AndroidTTS.isAvailable()) {
        window.AndroidTTS.speak(safeText, effectiveRate);
        return;
      }

      // Fallback to Web Speech API (for browsers)
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(safeText);
        utterance.lang = 'en-US';
        utterance.rate = effectiveRate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onerror = (event) => {
          console.error('Speech Synthesis Error:', event.error);
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        return;
      }

      // No TTS available
      const errorMsg =
        'Text-to-Speech is not available on this device.\n\n' +
        'Please:\n' +
        '1. Install "Speech Services by Google" from Play Store\n' +
        '2. Go to Settings \u2192 Language & input \u2192 Text-to-speech\n' +
        '3. Select Google TTS and download English language\n' +
        '4. Restart the app';

      if (window.AndroidTTS && window.AndroidTTS.openTTSSettings) {
        if (confirm(errorMsg + '\n\nOpen TTS settings now?')) {
          window.AndroidTTS.openTTSSettings();
        }
      } else {
        alert(errorMsg);
      }
    } catch {
      // Speech synthesis unavailable — silent fallback
    }
  }, [muted, difficulty, volume]);

  return { speak, ttsReady, ttsChecked };
}
