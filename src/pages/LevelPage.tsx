import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { difficultyAtom } from '../store/atoms';
import { levels } from '../data/levels';
import GameLayout from '../components/layout/GameLayout';
import StandardGame from '../components/games/StandardGame';
import MemoryGame from '../components/games/MemoryGame';
import ColoringGame from '../components/games/ColoringGame';
import DragDropGame from '../components/games/DragDropGame';
import CountingGame from '../components/games/CountingGame';
import RestaurantGame from '../components/games/RestaurantGame';
import RhythmGame from '../components/games/RhythmGame';
import PracticeButton from '../components/shared/PracticeButton';
import styles from './LevelPage.module.css';

export default function LevelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const difficulty = useAtomValue(difficultyAtom);
  const levelIndex = parseInt(id || '0', 10);
  const level = levels[levelIndex];

  useEffect(() => {
    if (!difficulty) {
      navigate('/');
      return;
    }
    if (!level) {
      navigate('/map');
      return;
    }
    // Auto-review levels redirect to review page
    if (level.type === 'autoReview') {
      navigate(`/review?mode=auto&start=${level.reviewLevelsRange[0]}&end=${level.reviewLevelsRange[1]}&levelIndex=${levelIndex}`);
    }
  }, [difficulty, level, levelIndex, navigate]);

  if (!level || !difficulty || level.type === 'autoReview') return null;

  const isRestaurant = level.type === 'restaurant';

  const renderGame = () => {
    switch (level.type) {
      case 'standard':
        return <StandardGame level={level} levelIndex={levelIndex} />;
      case 'memory':
        return <MemoryGame levelIndex={levelIndex} />;
      case 'coloring':
        return <ColoringGame level={level} levelIndex={levelIndex} />;
      case 'dragDrop':
        return <DragDropGame level={level} levelIndex={levelIndex} />;
      case 'counting':
        return <CountingGame level={level} levelIndex={levelIndex} />;
      case 'restaurant':
        return <RestaurantGame level={level} levelIndex={levelIndex} />;
      case 'rhythm':
        return <RhythmGame levelIndex={levelIndex} />;
      default:
        return null;
    }
  };

  return (
    <GameLayout
      title={`Level ${levelIndex + 1}`}
      className={isRestaurant ? styles.restaurantBg : undefined}
    >
      {renderGame()}
      <PracticeButton />
    </GameLayout>
  );
}
