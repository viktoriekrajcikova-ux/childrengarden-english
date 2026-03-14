import type { PetMood } from '../Pet';
import { generatePetCSS } from '../petAnimations';

const CSS = generatePetCSS({
  suffix: 's',
  blinkDuration: 4,
  flapDuration: 0.8,
  flapAngle: 20,
  beakDuration: 1.5,
  beakAngle: 8,
  wingOrigins: { left: '34px 62px', right: '86px 62px' },
  beakOrigin: '60px 68px',
  bodyFill: '#FFD54F',
});

/** Baby chick SVG — yellow ball with big eyes, beak, tiny wings, legs, eggshell fragment */
export default function ChickSmall({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 120 130" width="100" height="108" aria-label="Baby chick">
      <style>{CSS}</style>

      {/* Eggshell fragment */}
      <path
        d="M30 85 Q35 100 45 95 Q50 105 60 98 Q70 105 75 95 Q85 100 90 85"
        fill="#F5F5F5"
        stroke="#BDBDBD"
        strokeWidth="1.5"
      />

      {/* Body — yellow circle */}
      <circle cx="60" cy="62" r="32" fill="#FFD54F" />

      {/* Left tiny wing */}
      <path
        className="wing-left-s"
        d="M30 58 Q24 64 28 72 Q32 67 34 60"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Right tiny wing */}
      <path
        className="wing-right-s"
        d="M90 58 Q96 64 92 72 Q88 67 86 60"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Eyes — mood dependent */}
      {mood === 'happy' ? (
        <>
          {/* Happy eyes — upward arcs (˘ shape) */}
          <path d="M40 57 Q48 48 56 57" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M64 57 Q72 48 80 57" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          {/* Sad eyes — normal eyes + tilted eyebrows */}
          <circle cx="48" cy="55" r="8" fill="#212121" />
          <circle cx="50" cy="52" r="3" fill="white" />
          <circle cx="72" cy="55" r="8" fill="#212121" />
          <circle cx="74" cy="52" r="3" fill="white" />
          {/* Sad eyebrows — angled inward-down */}
          <line x1="39" y1="43" x2="53" y2="46" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="81" y1="43" x2="67" y2="46" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Neutral eyes — default */}
          <circle cx="48" cy="55" r="8" fill="#212121" />
          <circle cx="50" cy="52" r="3" fill="white" />
          <ellipse className="eyelid-s" cx="48" cy="55" rx="9" ry="8" fill="#FFD54F" />
          <circle cx="72" cy="55" r="8" fill="#212121" />
          <circle cx="74" cy="52" r="3" fill="white" />
          <ellipse className="eyelid-s" cx="72" cy="55" rx="9" ry="8" fill="#FFD54F" />
        </>
      )}

      {/* Beak — droop animation when sad */}
      {mood === 'sad' ? (
        <>
          <polygon points="54,68 66,68 60,63" fill="#FF9800" />
          <polygon className="beak-droop-s" points="54,68 66,68 60,73" fill="#E65100" />
        </>
      ) : (
        <>
          <polygon className="beak-top-s" points="54,68 66,68 60,63" fill="#FF9800" />
          <polygon className="beak-bot-s" points="54,68 66,68 60,76" fill="#E65100" />
        </>
      )}

      {/* Left leg */}
      <line x1="50" y1="93" x2="45" y2="115" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="115" x2="38" y2="118" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="115" x2="48" y2="120" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />

      {/* Right leg */}
      <line x1="70" y1="93" x2="75" y2="115" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="115" x2="68" y2="118" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="115" x2="78" y2="120" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />

      {/* Blush cheeks */}
      <circle cx="38" cy="65" r="5" fill="#FFAB91" opacity="0.5" />
      <circle cx="82" cy="65" r="5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
