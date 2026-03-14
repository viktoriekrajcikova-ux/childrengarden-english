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

  return (
    <div className={styles.inventory}>
      {items.map((item) => (
        <span key={item.id} className={styles.inventoryItem}>
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
