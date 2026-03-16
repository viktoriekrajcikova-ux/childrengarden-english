import { useAtomValue } from 'jotai';
import { scoreAtom } from '../../store/atoms';
import { cn } from '../../utils/cn';
import VolumeSlider from '../shared/VolumeSlider';
import styles from './ScoreBoard.module.css';

interface Props {
  variant?: 'game' | 'map';
}

export default function ScoreBoard({ variant = 'game' }: Props) {
  const score = useAtomValue(scoreAtom);
  return (
    <div className={cn(styles.base, variant === 'map' ? styles.scoreBoardMap : styles.scoreBoard)}>
      <span>Skóre: <span>{score}</span> bodů</span>
      <VolumeSlider />
    </div>
  );
}
