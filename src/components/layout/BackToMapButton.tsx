import { useNavigate } from 'react-router-dom';
import styles from './BackToMapButton.module.css';

export default function BackToMapButton() {
  const navigate = useNavigate();
  return (
    <button className={styles.backToMap} onClick={() => navigate('/map')}>
      🗺️ Zpět na mapu
    </button>
  );
}
