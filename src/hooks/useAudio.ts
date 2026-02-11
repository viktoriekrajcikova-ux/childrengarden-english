import { useCallback } from 'react';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playMelody(
  notes: number[],
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
) {
  const ctx = getAudioContext();
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    const t = ctx.currentTime + i * duration;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
    osc.start(t);
    osc.stop(t + duration);
  });
}

export function useAudio() {
  const playFanfare = useCallback(() => {
    playMelody([523.25, 659.25, 783.99, 1046.5], 0.15);
  }, []);

  const playErrorSound = useCallback(() => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 200;
    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  const playVictoryFanfare = useCallback(() => {
    playMelody([523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51], 0.2);
  }, []);

  const playGameStartSound = useCallback(() => {
    playMelody([392.0, 523.25, 659.25, 783.99], 0.15, 'triangle', 0.4);
  }, []);

  return { playFanfare, playErrorSound, playVictoryFanfare, playGameStartSound };
}
