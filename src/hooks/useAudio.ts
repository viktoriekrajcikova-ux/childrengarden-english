import { useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { mutedAtom, volumeAtom } from '../store/atoms';

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMasterGain(): GainNode {
  getAudioContext();
  return masterGain!;
}

function playMelody(
  notes: number[],
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3,
) {
  const ctx = getAudioContext();
  const master = getMasterGain();
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(master);
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
  const muted = useAtomValue(mutedAtom);
  const volume = useAtomValue(volumeAtom);

  // Keep master gain in sync with volume
  const syncVolume = useCallback(() => {
    const master = getMasterGain();
    master.gain.value = volume;
  }, [volume]);

  const playFanfare = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([523.25, 659.25, 783.99, 1046.5], 0.15);
  }, [muted, syncVolume]);

  const playErrorSound = useCallback(() => {
    if (muted) return;
    syncVolume();
    const ctx = getAudioContext();
    const master = getMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(master);
    osc.frequency.value = 200;
    osc.type = 'sawtooth';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, [muted, syncVolume]);

  const playVictoryFanfare = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51], 0.2);
  }, [muted, syncVolume]);

  const playGameStartSound = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([392.0, 523.25, 659.25, 783.99], 0.15, 'triangle', 0.4);
  }, [muted, syncVolume]);

  const playChirpHappy = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([880, 1100, 1320], 0.08, 'sine', 0.25);
  }, [muted, syncVolume]);

  const playChirpSad = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([600, 440], 0.15, 'sine', 0.2);
  }, [muted, syncVolume]);

  const playMunch = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([200, 250, 200], 0.1, 'square', 0.15);
  }, [muted, syncVolume]);

  const playWaterSplash = useCallback(() => {
    if (muted) return;
    syncVolume();
    const ctx = getAudioContext();
    const master = getMasterGain();
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
    gain.connect(master);
    source.start();
    source.stop(ctx.currentTime + 0.5);
  }, [muted, syncVolume]);

  const playPoopSound = useCallback(() => {
    if (muted) return;
    syncVolume();
    const ctx = getAudioContext();
    const master = getMasterGain();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(master);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, [muted, syncVolume]);

  const playBulldozer = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([80, 90, 80, 90, 80], 0.15, 'sawtooth', 0.1);
  }, [muted, syncVolume]);

  const playCashRegister = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([1200, 1600], 0.1, 'triangle', 0.25);
  }, [muted, syncVolume]);

  const playComboSound = useCallback(() => {
    if (muted) return;
    syncVolume();
    playMelody([523.25, 659.25, 783.99, 1046.5, 1318.51], 0.1, 'sine', 0.35);
  }, [muted, syncVolume]);

  return {
    playFanfare, playErrorSound, playVictoryFanfare, playGameStartSound,
    playChirpHappy, playChirpSad, playMunch, playWaterSplash,
    playPoopSound, playBulldozer, playCashRegister, playComboSound,
  };
}
