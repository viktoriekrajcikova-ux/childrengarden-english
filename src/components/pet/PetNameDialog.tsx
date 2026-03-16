import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { petNameAtom } from '../../store/atoms';
import styles from './PetNameDialog.module.css';

interface Props {
  petEmoji: string;
  onDone: () => void;
}

export default function PetNameDialog({ petEmoji, onDone }: Props) {
  const setPetName = useSetAtom(petNameAtom);
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPetName(trimmed);
    onDone();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.emoji}>{petEmoji}</div>
        <div className={styles.title}>Jak se bude jmenovat tvůj mazlíček?</div>
        <input
          className={styles.input}
          type="text"
          maxLength={12}
          placeholder="Jméno..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />
        <br />
        <button
          className={styles.button}
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          Hotovo!
        </button>
      </div>
    </div>
  );
}
