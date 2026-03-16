import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { scoreAtom } from '../store/atoms';
import { useAudio } from '../hooks/useAudio';
import Button from '../components/shared/Button';
import styles from './VictoryPage.module.css';

export default function VictoryPage() {
  const score = useAtomValue(scoreAtom);
  const navigate = useNavigate();
  const { playVictoryFanfare } = useAudio();

  useEffect(() => {
    playVictoryFanfare();
  }, [playVictoryFanfare]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎉 Gratulujeme! 🎉</h2>
      <p className={styles.text}>Dokončil jsi všechny levely!</p>
      <p className={styles.text}>Tvoje skóre: {score} bodů</p>
      <Button onClick={() => navigate('/certificate')}>
        Diplom
      </Button>
      <Button onClick={() => navigate('/review?mode=practice')}>
        Procvičit vše
      </Button>
      <Button onClick={() => navigate('/map')}>
        Zpět na mapu
      </Button>
    </div>
  );
}
