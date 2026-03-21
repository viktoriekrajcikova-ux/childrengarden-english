import type { PetSvgProps } from '../animalRegistry';
import { generateLionCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#D4A017';
const DEFAULT_ACCENT = '#C69214';
const DEFAULT_MANE = '#8B6914';
const DEFAULT_MANE_BUMP = '#A07A14';

const CSS = generateLionCSS({
  suffix: 'la',
  blinkDuration: 3,
  earTwitchDuration: 2,
  earTwitchAngle: 8,
  tailWagDuration: 1.5,
  tailWagAngle: 14,
  earOrigins: { left: '58px 24px', right: '102px 24px' },
  tailOrigin: '118px 86px',
});

const MANE_CSS = `
  .mane-la { transform-origin: 80px 36px; animation: manePulse 3s ease-in-out infinite; }
  @keyframes manePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }
`;

/** Adult lion SVG — Sparkly-style */
export default function LionAdult({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;
  const mane = palette ? palette.outline : DEFAULT_MANE;
  const maneBump = palette ? palette.accent : DEFAULT_MANE_BUMP;

  return (
    <svg viewBox="0 0 160 170" width="230" height="245" aria-label="Adult lion">
      <style>{CSS + MANE_CSS}</style>

      {/* Tail with large tuft */}
      <g className={mood === 'sad' ? 'tail-droop-la' : 'tail-wag-la'}>
        <path d="M118 86 Q138 60 134 32" stroke={body} strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="134" cy="32" r="8" fill="#5D4037" />
      </g>

      {/* Body */}
      <ellipse cx="80" cy="92" rx="42" ry="34" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="68" cy="80" rx="22" ry="14" fill="white" opacity="0.18" transform="rotate(-15 68 80)" />

      {/* Belly */}
      <ellipse cx="80" cy="100" rx="26" ry="22" fill="#FFF3E0" />

      {/* Neck */}
      <path d="M80 62 Q82 50 80 40" stroke={body} strokeWidth="22" fill="none" strokeLinecap="round" />

      {/* Full mane */}
      <g className="mane-la">
        <circle cx="80" cy="36" r="42" fill={mane} />
        <circle cx="52" cy="14" r="7" fill={maneBump} />
        <circle cx="72" cy="2" r="8" fill={maneBump} />
        <circle cx="92" cy="2" r="7" fill={maneBump} />
        <circle cx="112" cy="14" r="8" fill={maneBump} />
        <circle cx="118" cy="36" r="7" fill={maneBump} />
        <circle cx="112" cy="58" r="8" fill={maneBump} />
        <circle cx="92" cy="70" r="7" fill={maneBump} />
        <circle cx="68" cy="70" r="7" fill={maneBump} />
        <circle cx="48" cy="58" r="8" fill={maneBump} />
        <circle cx="42" cy="36" r="7" fill={maneBump} />
      </g>

      {/* Head */}
      <circle cx="80" cy="36" r="28" fill={body} />
      {/* Head shine */}
      <ellipse cx="72" cy="26" rx="13" ry="9" fill="white" opacity="0.15" transform="rotate(-20 72 26)" />

      {/* Muzzle */}
      <ellipse cx="80" cy="46" rx="16" ry="12" fill="#FFF3E0" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-la' : 'ear-left-la'}>
        <circle cx="58" cy="14" r="10" fill={body} />
        <circle cx="58" cy="14" r="6" fill={accent} />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-la' : 'ear-right-la'}>
        <circle cx="102" cy="14" r="10" fill={body} />
        <circle cx="102" cy="14" r="6" fill={accent} />
      </g>

      {/* Eyes */}
      {mood === 'happy' ? (
        <>
          <path d="M62 32 Q72 22 82 32" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M78 32 Q88 22 98 32" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="64" cy="26" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="96" cy="26" r="1.5" fill="#FFF" opacity="0.8" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="72" cy="30" r="7" fill="#212121" />
          <circle cx="75" cy="27" r="2.8" fill="white" />
          <circle cx="69" cy="33" r="1.4" fill="white" opacity="0.6" />
          <circle cx="88" cy="30" r="7" fill="#212121" />
          <circle cx="91" cy="27" r="2.8" fill="white" />
          <circle cx="85" cy="33" r="1.4" fill="white" opacity="0.6" />
          <line x1="62" y1="21" x2="76" y2="24" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
          <line x1="98" y1="21" x2="84" y2="24" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="72" cy="30" r="7" fill="#212121" />
          <circle cx="75" cy="27" r="2.8" fill="white" />
          <circle cx="69" cy="33" r="1.4" fill="white" opacity="0.6" />
          <circle cx="76" cy="26" r="0.7" fill="white" opacity="0.9" />
          <ellipse className="eyelid-la" cx="72" cy="30" rx="8" ry="7" fill={body} />
          <circle cx="88" cy="30" r="7" fill="#212121" />
          <circle cx="91" cy="27" r="2.8" fill="white" />
          <circle cx="85" cy="33" r="1.4" fill="white" opacity="0.6" />
          <circle cx="92" cy="26" r="0.7" fill="white" opacity="0.9" />
          <ellipse className="eyelid-la" cx="88" cy="30" rx="8" ry="7" fill={body} />
        </>
      )}

      {/* Nose */}
      <ellipse cx="80" cy="43" rx="4.5" ry="3" fill="#3E2723" />

      {/* Mouth */}
      <path d="M76 47 Q80 51 84 47" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Whisker dots */}
      <circle cx="68" cy="44" r="1.5" fill="#5D4037" opacity="0.5" />
      <circle cx="65" cy="47" r="1.5" fill="#5D4037" opacity="0.5" />
      <circle cx="92" cy="44" r="1.5" fill="#5D4037" opacity="0.5" />
      <circle cx="95" cy="47" r="1.5" fill="#5D4037" opacity="0.5" />

      {/* Left paw */}
      <ellipse cx="63" cy="127" rx="15" ry="8" fill="#A67C00" />
      <circle cx="54" cy="124" r="4" fill="#8D6E00" opacity="0.4" />
      <circle cx="63" cy="122" r="4" fill="#8D6E00" opacity="0.4" />
      <circle cx="72" cy="124" r="4" fill="#8D6E00" opacity="0.4" />

      {/* Right paw */}
      <ellipse cx="97" cy="127" rx="15" ry="8" fill="#A67C00" />
      <circle cx="88" cy="124" r="4" fill="#8D6E00" opacity="0.4" />
      <circle cx="97" cy="122" r="4" fill="#8D6E00" opacity="0.4" />
      <circle cx="106" cy="124" r="4" fill="#8D6E00" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="62" cy="42" r="5.5" fill="#FFAB91" opacity="0.5" />
      <circle cx="98" cy="42" r="5.5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
