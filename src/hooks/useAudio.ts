import { useCallback } from 'react';

export function useAudio() {
  const playFanfare = useCallback(() => {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const duration = 0.15;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ctx.currentTime + i * duration;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
      osc.start(t);
      osc.stop(t + duration);
    });
  }, []);

  const playErrorSound = useCallback(() => {
    const ctx = new AudioContext();
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
    const ctx = new AudioContext();
    const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
    const duration = 0.2;
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ctx.currentTime + i * duration;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
      osc.start(t);
      osc.stop(t + duration);
    });
  }, []);

  const playGameStartSound = useCallback(() => {
    const ctx = new AudioContext();
    const melody = [392.0, 523.25, 659.25, 783.99];
    const duration = 0.15;
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'triangle';
      const t = ctx.currentTime + i * duration;
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration * 1.5);
      osc.start(t);
      osc.stop(t + duration * 1.5);
    });
  }, []);

  return { playFanfare, playErrorSound, playVictoryFanfare, playGameStartSound };
}
