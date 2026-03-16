import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { scoreAtom, petNameAtom, animalTypeAtom } from '../store/atoms';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { getPetStage, getPetEmoji } from '../utils/petUtils';
import { cn } from '../utils/cn';
import styles from './CertificatePage.module.css';

export default function CertificatePage() {
  const navigate = useNavigate();
  const score = useAtomValue(scoreAtom);
  const petName = useAtomValue(petNameAtom);
  const animalType = useAtomValue(animalTypeAtom);
  const { completedGroupIndices } = useLevelGroups();
  const petStage = getPetStage(completedGroupIndices.length);

  const today = new Date().toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.certificate}>
        <div className={styles.header}>Certifikát</div>
        <h1 className={styles.title}>Diplom</h1>
        <div className={styles.divider} />
        <div className={styles.petEmoji}>{getPetEmoji(petStage, animalType)}</div>
        {petName && <div className={styles.petName}>{petName}</div>}
        <p className={styles.text}>
          Úspěšně dokončil/a všechny levely<br />
          v aplikaci Angličtina do školky!
        </p>
        <div className={styles.score}>Skóre: {score} bodů</div>
        <div className={styles.date}>{today}</div>
        <div className={styles.actions}>
          <button className={cn(styles.button, styles.printButton)} onClick={() => window.print()}>
            Vytisknout
          </button>
          <button className={styles.button} onClick={() => navigate('/map')}>
            Zpět na mapu
          </button>
        </div>
      </div>
    </div>
  );
}
