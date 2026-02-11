import { useAtomValue, useSetAtom } from 'jotai';
import { difficultyAtom, addScoreAtom, subtractScoreAtom } from '../store/atoms';
import { useAudio } from './useAudio';
import { useSpeech } from './useSpeech';
import { useLevelCompletion } from './useLevelCompletion';

export function useGameSetup() {
  const difficulty = useAtomValue(difficultyAtom);
  const addScore = useSetAtom(addScoreAtom);
  const subtractScore = useSetAtom(subtractScoreAtom);
  const { playFanfare, playErrorSound } = useAudio();
  const { speak } = useSpeech();
  const { completeLevel } = useLevelCompletion();

  return { difficulty, addScore, subtractScore, playFanfare, playErrorSound, speak, completeLevel };
}
