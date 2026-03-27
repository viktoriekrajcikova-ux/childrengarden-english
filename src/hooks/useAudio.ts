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

function playNoise(filterFreq: number, duration: number, vol: number) {
  const ctx = getAudioContext();
  const master = getMasterGain();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = filterFreq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start();
  source.stop(ctx.currentTime + duration);
}

function playTone(freq: number, endFreq: number | null, duration: number, type: OscillatorType, vol: number) {
  const ctx = getAudioContext();
  const master = getMasterGain();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(master);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function useAudio() {
  const muted = useAtomValue(mutedAtom);
  const volume = useAtomValue(volumeAtom);

  const withSound = useCallback(
    (fn: () => void) => {
      if (muted) return;
      getMasterGain().gain.value = volume;
      fn();
    },
    [muted, volume],
  );

  const playFanfare = useCallback(() => withSound(() => playMelody([523.25, 659.25, 783.99, 1046.5], 0.15)), [withSound]);
  const playErrorSound = useCallback(() => withSound(() => playTone(200, null, 0.3, 'sawtooth', 0.3)), [withSound]);
  const playVictoryFanfare = useCallback(() => withSound(() => playMelody([523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51], 0.2)), [withSound]);
  const playGameStartSound = useCallback(() => withSound(() => playMelody([392.0, 523.25, 659.25, 783.99], 0.15, 'triangle', 0.4)), [withSound]);
  const playChirpHappy = useCallback(() => withSound(() => playMelody([880, 1100, 1320], 0.08, 'sine', 0.25)), [withSound]);
  const playChirpSad = useCallback(() => withSound(() => playMelody([600, 440], 0.15, 'sine', 0.2)), [withSound]);
  const playMunch = useCallback(() => withSound(() => playMelody([200, 250, 200], 0.1, 'square', 0.15)), [withSound]);
  const playWaterSplash = useCallback(() => withSound(() => playNoise(2000, 0.5, 0.2)), [withSound]);
  const playPoopSound = useCallback(() => withSound(() => playTone(300, 80, 0.3, 'sine', 0.25)), [withSound]);
  const playBulldozer = useCallback(() => withSound(() => playMelody([80, 90, 80, 90, 80], 0.15, 'sawtooth', 0.1)), [withSound]);
  const playCashRegister = useCallback(() => withSound(() => playMelody([1200, 1600], 0.1, 'triangle', 0.25)), [withSound]);
  const playComboSound = useCallback(() => withSound(() => playMelody([523.25, 659.25, 783.99, 1046.5, 1318.51], 0.1, 'sine', 0.35)), [withSound]);

  return {
    playFanfare, playErrorSound, playVictoryFanfare, playGameStartSound,
    playChirpHappy, playChirpSad, playMunch, playWaterSplash,
    playPoopSound, playBulldozer, playCashRegister, playComboSound,
  };
}
