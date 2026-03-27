import styles from '../../pages/MapPage.module.css';

interface Props {
  currentStreak: number;
  bonus: number;
  onClaim: () => void;
}

export default function DailyRewardModal({ currentStreak, bonus, onClaim }: Props) {
  return (
    <div className={styles.achievementOverlay} onClick={onClaim}>
      <div className={styles.dailyRewardModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dailyRewardEmoji}>🎁</div>
        <h2 className={styles.dailyRewardTitle}>Denní odměna!</h2>
        <p className={styles.dailyRewardText}>
          {currentStreak > 0
            ? `Série ${currentStreak + 1} dní! Bonus: +${bonus} bodů`
            : 'Vítej zpět! +5 bodů'}
        </p>
        <button className={styles.dailyRewardBtn} onClick={onClaim}>
          Vyzvednout!
        </button>
      </div>
    </div>
  );
}
