import { useAtomValue } from 'jotai';
import { scoreAtom } from '../../store/atoms';
import styles from './ScoreBoard.module.css';

interface Props {
  variant?: 'game' | 'map';
}

export default function ScoreBoard({ variant = 'game' }: Props) {
  const score = useAtomValue(scoreAtom);
  return (
    <div className={variant === 'map' ? styles.scoreBoardMap : styles.scoreBoard}>
      Skóre: <span>{score}</span> bodů
    </div>
  );
}
