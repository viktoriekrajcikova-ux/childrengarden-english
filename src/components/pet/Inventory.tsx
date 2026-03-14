import styles from '../../pages/PetCarePage.module.css';

export interface FoodItem {
  id: string;
  emoji: string;
  name: string;
}

interface InventoryProps {
  items: FoodItem[];
}

export default function Inventory({ items }: InventoryProps) {
  if (items.length === 0) return null;

  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.emoji, (counts.get(item.emoji) || 0) + 1);
  }

  return (
    <div className={styles.inventory}>
      {[...counts.entries()].map(([emoji, count]) => (
        <span key={emoji} className={styles.inventoryItem}>
          {count > 1 && <span className={styles.inventoryCount}>{count}x</span>}
          {emoji}
        </span>
      ))}
    </div>
  );
}
