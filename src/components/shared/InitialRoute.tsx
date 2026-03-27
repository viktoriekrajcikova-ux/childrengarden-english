import { Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { difficultyAtom } from '../../store/atoms';

export default function InitialRoute() {
  const difficulty = useAtomValue(difficultyAtom);

  if (difficulty) {
    return <Navigate to="/map" replace />;
  }

  return <Navigate to="/difficulty" replace />;
}
