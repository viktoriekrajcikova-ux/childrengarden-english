import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { animalTypeAtom, petNameAtom, hasHatchedAtom } from '../store/atoms';
import { useAudio } from '../hooks/useAudio';
import { useSpeech } from '../hooks/useSpeech';
import Pet from '../components/pet/Pet';
import PetNameDialog from '../components/pet/PetNameDialog';
import { getPetEmoji } from '../utils/petUtils';
import styles from './EggHatchPage.module.css';

const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🌟', '🎊', '💖'];

const EGG_COLORS: Record<string, { base: string; spot: string }> = {
  chick: { base: '#FFF8DC', spot: '#FFD700' },
  fox: { base: '#FFE4C4', spot: '#FF8C00' },
  lion: { base: '#FFEFD5', spot: '#DAA520' },
};

export default function EggHatchPage() {
  const navigate = useNavigate();
  const animalType = useAtomValue(animalTypeAtom);
  const petName = useAtomValue(petNameAtom);
  const setHasHatched = useSetAtom(hasHatchedAtom);
  const { playFanfare, playChirpHappy, playVictoryFanfare } = useAudio();
  const { speak } = useSpeech(null);

  const [taps, setTaps] = useState(0);
  const [phase, setPhase] = useState<'egg' | 'hatching' | 'hatched' | 'naming'>('egg');
  const [showConfetti, setShowConfetti] = useState(false);

  const colors = EGG_COLORS[animalType] || EGG_COLORS.chick;

  const handleTap = useCallback(() => {
    if (phase !== 'egg') return;

    const newTaps = taps + 1;
    setTaps(newTaps);
    playChirpHappy();

    if (newTaps >= 3) {
      // Start hatching animation
      setPhase('hatching');
      playFanfare();

      setTimeout(() => {
        setPhase('hatched');
        setShowConfetti(true);
        playVictoryFanfare();
        speak('Hello! I am your new friend!', 0.85, 1.8);

        setTimeout(() => {
          setShowConfetti(false);
          if (!petName) {
            setPhase('naming');
          } else {
            setHasHatched(true);
            navigate('/map');
          }
        }, 3000);
      }, 1500);
    }
  }, [phase, taps, playChirpHappy, playFanfare, playVictoryFanfare, speak, petName, setHasHatched, navigate]);

  const handleNameDone = () => {
    setHasHatched(true);
    navigate('/map');
  };

  const hintText = taps === 0
    ? 'Ťukni na vajíčko!'
    : taps === 1
      ? 'Ještě jednou!'
      : taps === 2
        ? 'Ještě jednou!'
        : '';

  return (
    <div className={styles.screen}>
      {/* Confetti */}
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className={styles.confettiPiece}
              style={{
                left: `${5 + Math.random() * 90}%`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            >
              {CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
            </span>
          ))}
        </div>
      )}

      {phase === 'naming' && (
        <PetNameDialog
          petEmoji={getPetEmoji('small', animalType)}
          onDone={handleNameDone}
        />
      )}

      <div className={styles.content}>
        {(phase === 'egg' || phase === 'hatching') && (
          <>
            <h1 className={styles.title}>
              {phase === 'egg' ? 'Někdo se chce vyklubat!' : 'Klube se...!'}
            </h1>

            <div
              className={`${styles.eggContainer} ${
                taps === 1 ? styles.eggWobble1 : ''
              } ${taps === 2 ? styles.eggWobble2 : ''} ${
                phase === 'hatching' ? styles.eggHatching : ''
              }`}
              onClick={handleTap}
            >
              {/* Egg SVG */}
              <svg viewBox="0 0 200 260" className={styles.eggSvg}>
                {/* Shadow */}
                <ellipse cx="100" cy="250" rx="60" ry="10" fill="rgba(0,0,0,0.1)" />
                {/* Egg body */}
                <ellipse cx="100" cy="140" rx="75" ry="100" fill={colors.base} stroke="#ccc" strokeWidth="2" />
                {/* Spots */}
                <circle cx="70" cy="110" r="12" fill={colors.spot} opacity="0.5" />
                <circle cx="130" cy="130" r="10" fill={colors.spot} opacity="0.4" />
                <circle cx="90" cy="170" r="8" fill={colors.spot} opacity="0.3" />
                {/* Shine */}
                <ellipse cx="75" cy="95" rx="15" ry="25" fill="white" opacity="0.3" transform="rotate(-20 75 95)" />

                {/* Cracks */}
                {taps >= 1 && (
                  <path
                    d="M60 140 L75 125 L65 110 L80 100"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={styles.crack}
                  />
                )}
                {taps >= 2 && (
                  <path
                    d="M140 135 L125 120 L135 105 L120 95"
                    fill="none"
                    stroke="#888"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={styles.crack}
                  />
                )}
                {phase === 'hatching' && (
                  <>
                    <path
                      d="M75 140 L100 130 L90 115 L110 105 L100 90"
                      fill="none"
                      stroke="#888"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className={styles.crack}
                    />
                    <path
                      d="M125 145 L110 135 L120 120 L105 110"
                      fill="none"
                      stroke="#888"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className={styles.crack}
                    />
                  </>
                )}
              </svg>

              {/* Tap indicator */}
              {phase === 'egg' && (
                <div className={styles.tapIndicator}>
                  <span className={styles.tapHand}>👆</span>
                </div>
              )}
            </div>

            <p className={styles.hint}>{hintText}</p>

            {/* Progress dots */}
            <div className={styles.progressDots}>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${taps > i ? styles.dotFilled : ''}`}
                />
              ))}
            </div>
          </>
        )}

        {phase === 'hatched' && (
          <>
            <h1 className={styles.title}>Hurá, vyklubalo se!</h1>
            <div className={styles.petReveal}>
              <Pet stage="small" animation="happy" mood="happy" animalType={animalType} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
