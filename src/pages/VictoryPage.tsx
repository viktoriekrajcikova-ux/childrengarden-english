import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { scoreAtom } from '../store/atoms';
import { useAudio } from '../hooks/useAudio';
import styles from './VictoryPage.module.css';

export default function VictoryPage() {
  const score = useAtomValue(scoreAtom);
  const navigate = useNavigate();
  const { playVictoryFanfare } = useAudio();

  useEffect(() => {
    playVictoryFanfare();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎉 Gratulujeme! 🎉</h2>
      <p className={styles.text}>Dokončil jsi všechny levely!</p>
      <p className={styles.text}>Tvoje skóre: {score} bodů</p>
      <button className={styles.button} onClick={() => navigate('/review?mode=practice')}>
        🔄 Procvičit vše
      </button>
      <button className={styles.button} onClick={() => navigate('/map')}>
        🗺️ Zpět na mapu
      </button>
    </div>
  );
}
