import type { PetSvgProps } from '../animalRegistry';
import { generateLionCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#D4A017';
const DEFAULT_ACCENT = '#C69214';
const DEFAULT_MANE = '#B8860B';

const CSS = generateLionCSS({
  suffix: 'lm',
  blinkDuration: 3.5,
  earTwitchDuration: 2.5,
  earTwitchAngle: 7,
  tailWagDuration: 1.8,
  tailWagAngle: 12,
  earOrigins: { left: '50px 30px', right: '90px 30px' },
  tailOrigin: '100px 76px',
});

/** Young lion SVG — Sparkly-style */
export default function LionMedium({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;
  const mane = palette ? palette.outline : DEFAULT_MANE;

  return (
    <svg viewBox="0 0 140 150" width="180" height="193" aria-label="Young lion">
      <style>{CSS}</style>

      {/* Tail with tuft */}
      <g className={mood === 'sad' ? 'tail-droop-lm' : 'tail-wag-lm'}>
        <path d="M100 76 Q116 56 112 34" stroke={body} strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="112" cy="34" r="6" fill="#5D4037" />
      </g>

      {/* Body */}
      <ellipse cx="70" cy="78" rx="34" ry="28" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="60" cy="68" rx="17" ry="12" fill="white" opacity="0.18" transform="rotate(-15 60 68)" />

      {/* Belly */}
      <ellipse cx="70" cy="85" rx="20" ry="18" fill="#FFF3E0" />

      {/* Small growing mane */}
      <circle cx="70" cy="40" r="32" fill={mane} />

      {/* Head */}
      <circle cx="70" cy="40" r="26" fill={body} />
      {/* Head shine */}
      <ellipse cx="62" cy="32" rx="12" ry="8" fill="white" opacity="0.15" transform="rotate(-20 62 32)" />

      {/* Muzzle */}
      <ellipse cx="70" cy="50" rx="14" ry="10" fill="#FFF3E0" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-lm' : 'ear-left-lm'}>
        <circle cx="50" cy="18" r="10" fill={body} />
        <circle cx="50" cy="18" r="6" fill={accent} />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-lm' : 'ear-right-lm'}>
        <circle cx="90" cy="18" r="10" fill={body} />
        <circle cx="90" cy="18" r="6" fill={accent} />
      </g>

      {/* Eyes */}
      {mood === 'happy' ? (
        <>
          <path d="M50 36 Q60 26 70 36" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M70 36 Q80 26 90 36" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="52" cy="30" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="88" cy="30" r="1.5" fill="#FFF" opacity="0.8" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="60" cy="35" r="8" fill="#212121" />
          <circle cx="63" cy="31" r="3.2" fill="white" />
          <circle cx="57" cy="38" r="1.6" fill="white" opacity="0.6" />
          <circle cx="80" cy="35" r="8" fill="#212121" />
          <circle cx="83" cy="31" r="3.2" fill="white" />
          <circle cx="77" cy="38" r="1.6" fill="white" opacity="0.6" />
          <line x1="50" y1="25" x2="64" y2="28" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="90" y1="25" x2="76" y2="28" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="60" cy="35" r="8" fill="#212121" />
          <circle cx="63" cy="31" r="3.2" fill="white" />
          <circle cx="57" cy="38" r="1.6" fill="white" opacity="0.6" />
          <circle cx="64" cy="30" r="0.8" fill="white" opacity="0.9" />
          <ellipse className="eyelid-lm" cx="60" cy="35" rx="9" ry="8" fill={body} />
          <circle cx="80" cy="35" r="8" fill="#212121" />
          <circle cx="83" cy="31" r="3.2" fill="white" />
          <circle cx="77" cy="38" r="1.6" fill="white" opacity="0.6" />
          <circle cx="84" cy="30" r="0.8" fill="white" opacity="0.9" />
          <ellipse className="eyelid-lm" cx="80" cy="35" rx="9" ry="8" fill={body} />
        </>
      )}

      {/* Nose */}
      <ellipse cx="70" cy="48" rx="4" ry="3" fill="#3E2723" />

      {/* Mouth */}
      <path d="M66 51 Q70 55 74 51" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left paw */}
      <ellipse cx="54" cy="107" rx="13" ry="7" fill="#A67C00" />
      <circle cx="46" cy="104" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="54" cy="102" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="62" cy="104" r="3.5" fill="#8D6E00" opacity="0.4" />

      {/* Right paw */}
      <ellipse cx="86" cy="107" rx="13" ry="7" fill="#A67C00" />
      <circle cx="78" cy="104" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="86" cy="102" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="94" cy="104" r="3.5" fill="#8D6E00" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="46" cy="46" r="7" fill="#FFAB91" opacity="0.5" />
      <circle cx="94" cy="46" r="7" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
