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

  const playChirpHappy = useCallback(() => {
    playMelody([880, 1100, 1320], 0.08, 'sine', 0.25);
  }, []);

  const playChirpSad = useCallback(() => {
    playMelody([600, 440], 0.15, 'sine', 0.2);
  }, []);

  const playMunch = useCallback(() => {
    playMelody([200, 250, 200], 0.1, 'square', 0.15);
  }, []);

  const playWaterSplash = useCallback(() => {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + 0.5);
  }, []);

  const playPoopSound = useCallback(() => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, []);

  const playBulldozer = useCallback(() => {
    playMelody([80, 90, 80, 90, 80], 0.15, 'sawtooth', 0.1);
  }, []);

  const playCashRegister = useCallback(() => {
    playMelody([1200, 1600], 0.1, 'triangle', 0.25);
  }, []);

  return {
    playFanfare, playErrorSound, playVictoryFanfare, playGameStartSound,
    playChirpHappy, playChirpSad, playMunch, playWaterSplash,
    playPoopSound, playBulldozer, playCashRegister,
  };
}
