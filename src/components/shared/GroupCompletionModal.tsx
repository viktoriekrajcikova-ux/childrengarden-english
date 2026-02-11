import styles from './GroupCompletionModal.module.css';

interface Props {
  groupIndex: number;
  onClose: () => void;
}

export default function GroupCompletionModal({ groupIndex, onClose }: Props) {
  const isCrown = groupIndex < 5;
  const icon = isCrown ? '👑' : '💎';
  const rewardName = isCrown ? 'korunu' : 'diamant';

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.title}>Gratulujeme!</div>
        <div className={styles.message}>
          Dokončil jsi skupinu {groupIndex + 1} a získal jsi {rewardName}!
        </div>
        <button className={styles.button} onClick={onClose}>
          Pokračovat
        </button>
      </div>
    </div>
  );
}
