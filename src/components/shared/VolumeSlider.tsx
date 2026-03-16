import { useAtom } from 'jotai';
import { volumeAtom, mutedAtom } from '../../store/atoms';
import styles from './VolumeSlider.module.css';

export default function VolumeSlider() {
  const [volume, setVolume] = useAtom(volumeAtom);
  const [muted, setMuted] = useAtom(mutedAtom);

  const icon = muted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊';

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} onClick={() => setMuted(!muted)}>
        {icon}
      </span>
      <input
        type="range"
        className={styles.slider}
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        onChange={(e) => {
          const v = Number(e.target.value) / 100;
          setVolume(v);
          if (v > 0 && muted) setMuted(false);
        }}
      />
    </div>
  );
}
