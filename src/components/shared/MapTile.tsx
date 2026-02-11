import { cn } from '../../utils/cn';
import styles from './MapTile.module.css';

interface MapTileProps {
  id: string;
  icon: string;
  number: number;
  name: string;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export default function MapTile({ id, icon, number, name, isCompleted, isLocked, onClick }: MapTileProps) {
  return (
    <div
      id={id}
      className={cn(
        styles.mapTile,
        isCompleted && styles.tileCompleted,
        isLocked && styles.tileLocked,
      )}
      onClick={onClick}
    >
      <div className={styles.tileIcon}>{icon}</div>
      <div className={styles.tileNumber}>{number}</div>
      <div className={styles.tileName}>{name}</div>
    </div>
  );
}
