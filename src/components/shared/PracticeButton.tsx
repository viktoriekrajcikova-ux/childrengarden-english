import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { completedLevelsAtom } from '../../store/atoms';
import styles from './PracticeButton.module.css';

export default function PracticeButton() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const navigate = useNavigate();

  if (completedLevels.length === 0) return null;

  return (
    <button
      className={styles.button}
      onClick={() => navigate('/review?mode=practice')}
    >
      🔄 Procvičit vše
    </button>
  );
}
