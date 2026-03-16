import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { completedLevelsAtom, difficultyAtom, resetGameAtom, pendingGroupModalAtom, animalTypeAtom, achievementsAtom } from '../store/atoms';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { getLevelIcon, isGameLevel } from '../utils/levelGrouping';
import { getPetStage, getPetEmoji } from '../utils/petUtils';
import { ACHIEVEMENTS } from '../data/achievements';
import { cn } from '../utils/cn';
import ScoreBoard from '../components/layout/ScoreBoard';
import GroupCompletionModal from '../components/shared/GroupCompletionModal';
import MapTile from '../components/shared/MapTile';
import styles from './MapPage.module.css';

export default function MapPage() {
  const completedLevels = useAtomValue(completedLevelsAtom);
  const difficulty = useAtomValue(difficultyAtom);
  const resetGame = useSetAtom(resetGameAtom);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { groups, completedGroupIndices } = useLevelGroups();
  const animalType = useAtomValue(animalTypeAtom);
  const pendingModal = useAtomValue(pendingGroupModalAtom);
  const clearPendingModal = useSetAtom(pendingGroupModalAtom);
  const unlockedAchievements = useAtomValue(achievementsAtom);
  const [modalGroup, setModalGroup] = useState<number | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    if (!difficulty) {
      navigate('/');
      return;
    }
    if (pendingModal) {
      setModalGroup(pendingModal.groupIndex);
      clearPendingModal(null);
    }
  }, [difficulty, navigate, pendingModal, clearPendingModal]);

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
        <div className={cn(styles.inventory, completedGroupIndices.length === 0 && styles.inventoryEmpty)}>
          <span className={styles.inventoryCount}>{completedGroupIndices.filter((gi) => gi < 5).length}x</span>
          <span className={styles.inventoryItem}>👑</span>
          <span className={styles.inventoryCount}>{completedGroupIndices.filter((gi) => gi >= 5).length}x</span>
          <span className={styles.inventoryItem}>💎</span>
        </div>
        <button className={cn(styles.controlButton, styles.resetButton)} onClick={handleReset} title="Reset hry">
          🔄
        </button>
        {completedLevels.length > 0 && (
          <button className={cn(styles.controlButton, styles.practiceButton)} onClick={handlePractice} title="Procvičit vše">
            📚
          </button>
        )}
        <button className={cn(styles.controlButton, styles.difficultyButton)} onClick={() => navigate('/')} title="Změnit obtížnost">
          <span>{getPetEmoji(getPetStage(completedGroupIndices.length), animalType)}</span>
        </button>
        <button className={cn(styles.controlButton, styles.practiceButton)} onClick={() => setShowAchievements(true)} title="Úspěchy">
          🏆
        </button>
      </div>

      <h1 className={styles.title}>🗺️ Mapa levelů</h1>

      <div className={styles.mapGrid}>
        {groups.map((group, gIdx) => {
          const isGame = isGameLevel(group.levels[0].level);
          const nextGroupFirstLevel = gIdx + 1 < groups.length
            ? groups[gIdx + 1].levels[0].index
            : group.levels[group.levels.length - 1].index;

          return (
            <div key={gIdx}>
              {gIdx > 0 && (
                <div className={styles.groupArrow}>
                  <div className={styles.groupArrowIcon}>⬇</div>
                </div>
              )}
              <div
                className={cn(
                  styles.levelGroup,
                  getLevelGroupClass(group.levels.length),
                  group.isLocked && styles.locked,
                  group.isCompleted && styles.completed,
                  group.isCompleted && group.groupNumber <= 5 && styles.crown,
                )}
              >
                {group.levels.map(({ level, index }) => (
                  <MapTile
                    key={index}
                    id={`level-tile-${index}`}
                    icon={getLevelIcon(level, group.isLocked)}
                    number={index + 1}
                    name={level.name}
                    isCompleted={completedLevels.includes(index)}
                    isLocked={group.isLocked}
                    onClick={() => handleLevelClick(index, group.isLocked)}
                  />
                ))}
              </div>
              {isGame && (
                <>
                  <div className={styles.groupArrow}>
                    <div className={styles.groupArrowIcon}>⬇</div>
                  </div>
                  <div
                    className={cn(styles.rewardTile, !group.isCompleted && styles.rewardTileLocked)}
                    onClick={group.isCompleted ? () => navigate(`/pet-care?nextLevel=${nextGroupFirstLevel}`) : undefined}
                  >
                    <span className={styles.rewardTileIcon}>
                      {group.isCompleted ? getPetEmoji(getPetStage(completedGroupIndices.length), animalType) : '🔒'}
                    </span>
                    <span className={styles.rewardTileName}>Odměna</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {modalGroup !== null && (
        <GroupCompletionModal
          groupIndex={modalGroup}
          onClose={() => setModalGroup(null)}
        />
      )}

      {showAchievements && (
        <div className={styles.achievementOverlay} onClick={() => setShowAchievements(false)}>
          <div className={styles.achievementModal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.achievementTitle}>🏆 Úspěchy</h2>
            <div className={styles.achievementList}>
              {ACHIEVEMENTS.map((a) => {
                const unlocked = unlockedAchievements.includes(a.id);
                return (
                  <div key={a.id} className={cn(styles.achievementItem, !unlocked && styles.achievementLocked)}>
                    <span className={styles.achievementEmoji}>{unlocked ? a.emoji : '🔒'}</span>
                    <div>
                      <div className={styles.achievementName}>{a.title}</div>
                      <div className={styles.achievementDesc}>{a.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className={styles.achievementCloseBtn} onClick={() => setShowAchievements(false)}>
              Zavřít
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
