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
  const label = `${number}. ${name}${isCompleted ? ' – dokončeno' : ''}${isLocked ? ' – zamčeno' : ''}`;
  return (
    <div
      id={id}
      role="button"
      tabIndex={isLocked ? -1 : 0}
      aria-label={label}
      aria-disabled={isLocked || undefined}
      className={cn(
        styles.mapTile,
        isCompleted && styles.tileCompleted,
        isLocked && styles.tileLocked,
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.tileIcon}>{icon}</div>
      <div className={styles.tileNumber}>{number}</div>
      <div className={styles.tileName}>{name}</div>
    </div>
  );
}
