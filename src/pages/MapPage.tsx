import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { completedLevelsAtom, difficultyAtom, resetGameAtom, pendingGroupModalAtom, animalTypeAtom, addScoreAtom, claimedRewardsAtom } from '../store/atoms';
import { useDailyStreak } from '../hooks/useDailyStreak';
import { useLevelGroups } from '../hooks/useLevelGroups';
import { getLevelIcon, isGameLevel } from '../utils/levelGrouping';
import { getPetStage, getPetEmoji } from '../utils/petUtils';
import { DAILY_REWARD_BASE, DAILY_REWARD_PER_STREAK, DAILY_REWARD_MAX } from '../constants';
import { getRewardForGroup } from '../data/rewards';
import type { Reward } from '../data/rewards';
import { cn } from '../utils/cn';
import ScoreBoard from '../components/layout/ScoreBoard';
import GroupCompletionModal from '../components/shared/GroupCompletionModal';
import AchievementsModal from '../components/shared/AchievementsModal';
import PopupModal from '../components/shared/PopupModal';
import DailyStreakBanner from '../components/shared/DailyStreakBanner';
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
  const addScore = useSetAtom(addScoreAtom);
  const [claimedRewards, setClaimedRewards] = useAtom(claimedRewardsAtom);
  const { playedToday, currentStreak, recordToday } = useDailyStreak();
  const [modalGroup, setModalGroup] = useState<number | null>(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [pendingReward, setPendingReward] = useState<{ reward: Reward; gameGroupIndex: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dailyRewardChecked = useRef(false);

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

  // Daily reward check
  useEffect(() => {
    if (dailyRewardChecked.current || !difficulty) return;
    dailyRewardChecked.current = true;
    if (!playedToday) {
      setShowDailyReward(true);
    }
  }, [difficulty, playedToday]);

  const handleClaimReward = () => {
    if (!pendingReward) return;
    const { reward, gameGroupIndex } = pendingReward;
    if (reward.type === 'bonus' && reward.points) {
      addScore(reward.points);
    }
    setClaimedRewards([...claimedRewards, gameGroupIndex]);
    setPendingReward(null);
  };

  const handleRewardTileClick = (gameGroupIndex: number) => {
    if (claimedRewards.includes(gameGroupIndex)) return;
    const reward = getRewardForGroup(gameGroupIndex);
    setPendingReward({ reward, gameGroupIndex });
  };

  const claimDailyReward = () => {
    const bonus = Math.min(DAILY_REWARD_BASE + currentStreak * DAILY_REWARD_PER_STREAK, DAILY_REWARD_MAX);
    addScore(bonus);
    recordToday();
    setShowDailyReward(false);
  };

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
      {/* Hamburger tlačítko */}
      <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
        <span className={cn(styles.hamburger, menuOpen && styles.hamburgerOpen)} />
      </button>

      {/* Overlay pro zavření menu */}
      {menuOpen && <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)} />}

      {/* Vysouvací boční menu */}
      <div className={cn(styles.drawer, menuOpen && styles.drawerOpen)}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Menu</span>
        </div>

        <div className={styles.drawerContent}>
          <div className={cn(styles.inventory, completedGroupIndices.length === 0 && styles.inventoryEmpty)}>
            <span className={styles.inventoryCount}>{completedGroupIndices.filter((gi) => gi < 5).length}x</span>
            <span className={styles.inventoryItem}>👑</span>
            <span className={styles.inventoryCount}>{completedGroupIndices.filter((gi) => gi >= 5).length}x</span>
            <span className={styles.inventoryItem}>💎</span>
          </div>

          <DailyStreakBanner />

          <button className={styles.drawerButton} onClick={() => { navigate('/pet-care'); setMenuOpen(false); }}>
            <span className={styles.drawerButtonIcon}>{getPetEmoji(getPetStage(completedGroupIndices.length), animalType)}</span>
            <span>Moje zvířátko</span>
          </button>

          <button className={styles.drawerButton} onClick={() => { setShowAchievements(true); setMenuOpen(false); }}>
            <span className={styles.drawerButtonIcon}>🏆</span>
            <span>Úspěchy</span>
          </button>

          {completedLevels.length > 0 && (
            <button className={styles.drawerButton} onClick={() => { handlePractice(); setMenuOpen(false); }}>
              <span className={styles.drawerButtonIcon}>📚</span>
              <span>Procvičování</span>
            </button>
          )}

          <button className={styles.drawerButton} onClick={() => { navigate('/difficulty'); setMenuOpen(false); }}>
            <span className={styles.drawerButtonIcon}>⚙️</span>
            <span>Změnit obtížnost</span>
          </button>

          <button className={cn(styles.drawerButton, styles.drawerButtonDanger)} onClick={() => { handleReset(); setMenuOpen(false); }}>
            <span className={styles.drawerButtonIcon}>🔄</span>
            <span>Reset hry</span>
          </button>
        </div>
      </div>

      <h1 className={styles.title}>🗺️ Mapa levelů</h1>

      <div className={styles.mapGrid}>
        {(() => {
          let gameGroupCount = 0;
          return groups.map((group, gIdx) => {
            const isGame = isGameLevel(group.levels[0].level);
            const currentGameGroupIndex = isGame ? gameGroupCount++ : -1;
            const reward = isGame ? getRewardForGroup(currentGameGroupIndex) : null;
            const isClaimed = isGame && claimedRewards.includes(currentGameGroupIndex);

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
                {isGame && reward && (
                  <>
                    <div className={styles.groupArrow}>
                      <div className={styles.groupArrowIcon}>⬇</div>
                    </div>
                    <div
                      className={cn(
                        styles.rewardTile,
                        !group.isCompleted && styles.rewardTileLocked,
                        isClaimed && styles.rewardTileClaimed,
                      )}
                      onClick={group.isCompleted && !isClaimed ? () => handleRewardTileClick(currentGameGroupIndex) : undefined}
                    >
                      <span className={styles.rewardTileIcon}>
                        {!group.isCompleted ? '🔒' : isClaimed ? '✅' : reward.emoji}
                      </span>
                      <span className={styles.rewardTileName}>
                        {isClaimed ? 'Vyzvednuto' : 'Odměna'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          });
        })()}
      </div>

      {modalGroup !== null && (
        <GroupCompletionModal
          groupIndex={modalGroup}
          onClose={() => setModalGroup(null)}
        />
      )}

      {pendingReward && (
        <PopupModal
          emoji={pendingReward.reward.emoji}
          title={pendingReward.reward.title}
          text={pendingReward.reward.description}
          onAction={handleClaimReward}
        />
      )}
      {showAchievements && (
        <AchievementsModal onClose={() => setShowAchievements(false)} />
      )}
      {showDailyReward && (
        <PopupModal
          emoji="🎁"
          title="Denní odměna!"
          text={currentStreak > 0
            ? `Série ${currentStreak + 1} dní! Bonus: +${Math.min(DAILY_REWARD_BASE + currentStreak * DAILY_REWARD_PER_STREAK, DAILY_REWARD_MAX)} bodů`
            : 'Vítej zpět! +5 bodů'}
          onAction={claimDailyReward}
        />
      )}
    </div>
    </>
  );
}
