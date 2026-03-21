import type { PetSvgProps } from '../animalRegistry';
import { generatePetCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#FFD54F';
const DEFAULT_ACCENT = '#FFC107';
const DEFAULT_OUTLINE = '#F9A825';

function makeCSS(bodyFill: string) {
  return generatePetCSS({
    suffix: 'm',
    blinkDuration: 3.5,
    flapDuration: 0.7,
    flapAngle: 30,
    beakDuration: 1.8,
    beakAngle: 8,
    wingOrigins: { left: '32px 72px', right: '108px 72px' },
    beakOrigin: '70px 73px',
    bodyFill,
  });
}

/** Young chick SVG — Sparkly-style */
export default function ChickMedium({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;
  const outline = palette?.outline ?? DEFAULT_OUTLINE;
  const CSS = makeCSS(body);

  return (
    <svg viewBox="0 0 140 150" width="180" height="193" aria-label="Young chick">
      <style>{CSS}</style>

      {/* Body */}
      <ellipse cx="70" cy="72" rx="40" ry="36" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="60" cy="60" rx="20" ry="14" fill="white" opacity="0.18" transform="rotate(-15 60 60)" />

      {/* Left wing */}
      <path className="wing-left-m" d="M30 65 Q18 72 25 85 Q30 80 32 72" fill={accent} stroke={outline} strokeWidth="1" />

      {/* Right wing */}
      <path className="wing-right-m" d="M110 65 Q122 72 115 85 Q110 80 108 72" fill={accent} stroke={outline} strokeWidth="1" />

      {/* Eyes */}
      {mood === 'happy' ? (
        <>
          <path d="M46 64 Q56 52 66 64" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M74 64 Q84 52 94 64" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="48" cy="57" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="92" cy="57" r="1.5" fill="#FFF" opacity="0.8" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="56" cy="62" r="9" fill="#212121" />
          <circle cx="59" cy="58" r="3.5" fill="white" />
          <circle cx="53" cy="65" r="1.8" fill="white" opacity="0.6" />
          <circle cx="84" cy="62" r="9" fill="#212121" />
          <circle cx="87" cy="58" r="3.5" fill="white" />
          <circle cx="81" cy="65" r="1.8" fill="white" opacity="0.6" />
          <line x1="45" y1="49" x2="61" y2="52" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="95" y1="49" x2="79" y2="52" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="56" cy="62" r="9" fill="#212121" />
          <circle cx="59" cy="58" r="3.5" fill="white" />
          <circle cx="53" cy="65" r="1.8" fill="white" opacity="0.6" />
          <circle cx="60" cy="56" r="1" fill="white" opacity="0.9" />
          <ellipse className="eyelid-m" cx="56" cy="62" rx="10" ry="9" fill={body} />
          <circle cx="84" cy="62" r="9" fill="#212121" />
          <circle cx="87" cy="58" r="3.5" fill="white" />
          <circle cx="81" cy="65" r="1.8" fill="white" opacity="0.6" />
          <circle cx="88" cy="56" r="1" fill="white" opacity="0.9" />
          <ellipse className="eyelid-m" cx="84" cy="62" rx="10" ry="9" fill={body} />
        </>
      )}

      {/* Beak */}
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
      <path d="M70 38 Q65 28 58 32 Q63 30 65 38" fill={accent} stroke={outline} strokeWidth="1" />

      {/* Left paw */}
      <ellipse cx="55" cy="110" rx="13" ry="7" fill="#FF9800" />
      <circle cx="47" cy="107" r="4" fill="#E65100" opacity="0.35" />
      <circle cx="55" cy="105" r="4" fill="#E65100" opacity="0.35" />
      <circle cx="63" cy="107" r="4" fill="#E65100" opacity="0.35" />

      {/* Right paw */}
      <ellipse cx="85" cy="110" rx="13" ry="7" fill="#FF9800" />
      <circle cx="77" cy="107" r="4" fill="#E65100" opacity="0.35" />
      <circle cx="85" cy="105" r="4" fill="#E65100" opacity="0.35" />
      <circle cx="93" cy="107" r="4" fill="#E65100" opacity="0.35" />

      {/* Blush cheeks */}
      <circle cx="40" cy="74" r="7" fill="#FFAB91" opacity="0.45" />
      <circle cx="100" cy="74" r="7" fill="#FFAB91" opacity="0.45" />
    </svg>
  );
}
