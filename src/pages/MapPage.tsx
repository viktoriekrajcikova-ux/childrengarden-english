import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { completedLevelsAtom, difficultyAtom, resetGameAtom } from '../store/atoms';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { useLevelCompletion } from '../hooks/useLevelCompletion';
import { getLevelIcon } from '../utils/levelGrouping';
import ScoreBoard from '../components/layout/ScoreBoard';
import GroupCompletionModal from '../components/shared/GroupCompletionModal';
import styles from './MapPage.module.css';

const difficultyIcons: Record<string, string> = {
  easy: '🐣',
  medium: '🦊',
  hard: '🦁',
};

export default function MapPage() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const difficulty = useAtomValue(difficultyAtom);
  const resetGame = useSetAtom(resetGameAtom);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { groups, completedGroupIndices } = useLevelGroups();
  const { getPendingModal } = useLevelCompletion();
  const [modalGroup, setModalGroup] = useState<number | null>(null);

  useEffect(() => {
    if (!difficulty) {
      navigate('/');
      return;
    }
    const pending = getPendingModal();
    if (pending) {
      setModalGroup(pending.groupIndex);
    }
  }, [difficulty, navigate, getPendingModal]);

  // Scroll to the level specified in query param
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      const el = document.getElementById(`level-tile-${scrollTo}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [searchParams]);

  const handleReset = () => {
    if (confirm('Opravdu chceš resetovat hru? Ztratíš všechno skóre, postup a vrátíš se k výběru obtížnosti!')) {
      resetGame();
      navigate('/');
    }
  };

  const handlePractice = () => {
    if (completedLevels.length === 0) return;
    navigate('/review?mode=practice');
  };

  const handleLevelClick = (levelIndex: number, isLocked: boolean) => {
    if (isLocked) return;
    navigate(`/level/${levelIndex}`);
  };

  const getLevelGroupClass = (count: number) => {
    const map: Record<number, string> = {
      1: styles.levelGroup1,
      2: styles.levelGroup2,
      3: styles.levelGroup3,
      4: styles.levelGroup4,
      5: styles.levelGroup5,
    };
    return map[count] || styles.levelGroup5;
  };

  return (
    <>
    <ScoreBoard variant="map" />
    <div className={styles.mapScreen}>
      <div className={styles.controls}>
        <div className={`${styles.inventory} ${completedGroupIndices.length === 0 ? styles.inventoryEmpty : ''}`}>
          <div className={styles.inventoryItems}>
            {completedGroupIndices.map((gi) => (
              <span key={gi} className={styles.inventoryItem}>
                {gi < 5 ? '👑' : '💎'}
              </span>
            ))}
          </div>
        </div>
        <button className={`${styles.controlButton} ${styles.resetButton}`} onClick={handleReset} title="Reset hry">
          🔄
        </button>
        {completedLevels.length > 0 && (
          <button className={`${styles.controlButton} ${styles.practiceButton}`} onClick={handlePractice} title="Procvičit vše">
            📚
          </button>
        )}
        <button className={`${styles.controlButton} ${styles.difficultyButton}`} onClick={() => navigate('/')} title="Změnit obtížnost">
          <span>{difficultyIcons[difficulty || 'easy']}</span>
        </button>
      </div>

      <h1 className={styles.title}>🗺️ Mapa levelů</h1>

      <div className={styles.mapGrid}>
        {groups.map((group, gIdx) => (
          <div key={gIdx}>
            {gIdx > 0 && (
              <div className={styles.groupArrow}>
                <div className={styles.groupArrowIcon}>⬇</div>
              </div>
            )}
            <div
              className={[
                styles.levelGroup,
                getLevelGroupClass(group.levels.length),
                group.isLocked ? styles.locked : '',
                group.isCompleted ? styles.completed : '',
                group.isCompleted && group.groupNumber <= 5 ? styles.crown : '',
              ].filter(Boolean).join(' ')}
            >
              {group.levels.map(({ level, index }) => {
                const isCompleted = completedLevels.includes(index);
                const icon = getLevelIcon(level, group.isLocked);

                return (
                  <div
                    key={index}
                    id={`level-tile-${index}`}
                    className={[
                      styles.mapTile,
                      isCompleted ? styles.tileCompleted : '',
                      group.isLocked ? styles.tileLocked : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => handleLevelClick(index, group.isLocked)}
                  >
                    <div className={styles.tileIcon}>{icon}</div>
                    <div className={styles.tileNumber}>{index + 1}</div>
                    <div className={styles.tileName}>{level.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {modalGroup !== null && (
        <GroupCompletionModal
          groupIndex={modalGroup}
          onClose={() => setModalGroup(null)}
        />
      )}
    </div>
    </>
  );
}
