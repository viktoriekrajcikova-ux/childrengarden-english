import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { completedLevelsAtom } from '../../store/atoms';
import Button from './Button';

export default function PracticeButton() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const navigate = useNavigate();

  if (completedLevels.length === 0) return null;

  return (
    <Button onClick={() => navigate('/review?mode=practice')}>
      🔄 Procvičit vše
    </Button>
  );
}
