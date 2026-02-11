import { cn } from '../../utils/cn';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  title?: string;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  title,
  className,
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[variant], className)}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}
