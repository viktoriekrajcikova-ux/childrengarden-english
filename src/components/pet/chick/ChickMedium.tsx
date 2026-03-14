import type { PetMood } from '../Pet';
import { generatePetCSS } from '../petAnimations';

const CSS = generatePetCSS({
  suffix: 'm',
  blinkDuration: 3.5,
  flapDuration: 0.7,
  flapAngle: 30,
  beakDuration: 1.8,
  beakAngle: 8,
  wingOrigins: { left: '32px 72px', right: '108px 72px' },
  beakOrigin: '70px 73px',
  bodyFill: '#FFD54F',
});

/** Young chick SVG — bigger ellipse, smaller eyes (proportionally), bigger beak, flapping wings, tail hint */
export default function ChickMedium({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 140 150" width="140" height="150" aria-label="Young chick">
      <style>{CSS}</style>

      {/* Body — bigger ellipse */}
      <ellipse cx="70" cy="72" rx="40" ry="36" fill="#FFD54F" />

      {/* Left wing */}
      <path
        className="wing-left-m"
        d="M30 65 Q18 72 25 85 Q30 80 32 72"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Right wing */}
      <path
        className="wing-right-m"
        d="M110 65 Q122 72 115 85 Q110 80 108 72"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Eyes — mood dependent */}
      {mood === 'happy' ? (
        <>
          {/* Happy eyes — upward arcs (˘ shape) */}
          <path d="M48 64 Q56 55 64 64" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M76 64 Q84 55 92 64" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          {/* Sad eyes — normal eyes + tilted eyebrows */}
          <circle cx="56" cy="62" r="7" fill="#212121" />
          <circle cx="58" cy="59" r="2.5" fill="white" />
          <circle cx="84" cy="62" r="7" fill="#212121" />
          <circle cx="86" cy="59" r="2.5" fill="white" />
          {/* Sad eyebrows */}
          <line x1="47" y1="50" x2="61" y2="53" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="93" y1="50" x2="79" y2="53" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Neutral eyes — default */}
          <circle cx="56" cy="62" r="7" fill="#212121" />
          <circle cx="58" cy="59" r="2.5" fill="white" />
          <ellipse className="eyelid-m" cx="56" cy="62" rx="8" ry="7" fill="#FFD54F" />
          <circle cx="84" cy="62" r="7" fill="#212121" />
          <circle cx="86" cy="59" r="2.5" fill="white" />
          <ellipse className="eyelid-m" cx="84" cy="62" rx="8" ry="7" fill="#FFD54F" />
        </>
      )}

      {/* Beak — droop animation when sad */}
      {mood === 'sad' ? (
        <>
          <polygon points="63,73 77,73 70,66" fill="#FF9800" />
          <polygon className="beak-droop-m" points="63,73 77,73 70,79" fill="#E65100" />
        </>
      ) : (
        <>
          <polygon className="beak-top-m" points="63,73 77,73 70,66" fill="#FF9800" />
          <polygon className="beak-bot-m" points="63,73 77,73 70,83" fill="#E65100" />
        </>
      )}

      {/* Tail hint */}
      <path
        d="M70 38 Q65 28 58 32 Q63 30 65 38"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Left leg */}
      <line x1="55" y1="107" x2="48" y2="132" stroke="#FF9800" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="48" y1="132" x2="40" y2="136" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="132" x2="52" y2="138" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />

      {/* Right leg */}
      <line x1="85" y1="107" x2="92" y2="132" stroke="#FF9800" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="92" y1="132" x2="84" y2="136" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="92" y1="132" x2="96" y2="138" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />

      {/* Blush cheeks */}
      <circle cx="42" cy="74" r="5" fill="#FFAB91" opacity="0.5" />
      <circle cx="98" cy="74" r="5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
