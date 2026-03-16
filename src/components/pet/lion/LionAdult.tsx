import type { PetMood } from '../Pet';
import { generateLionCSS } from '../petAnimations';

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

/** Adult lion SVG — full mane, powerful body, long tail with large tuft, whisker dots */
export default function LionAdult({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 160 170" width="190" height="202" aria-label="Adult lion">
      <style>{CSS + MANE_CSS}</style>

      {/* Tail with large tuft */}
      <g className={mood === 'sad' ? 'tail-droop-la' : 'tail-wag-la'}>
        <path d="M118 86 Q138 60 134 32" stroke="#D4A017" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="134" cy="32" r="8" fill="#5D4037" />
      </g>

      {/* Body */}
      <ellipse cx="80" cy="92" rx="42" ry="34" fill="#D4A017" />

      {/* Belly */}
      <ellipse cx="80" cy="100" rx="26" ry="22" fill="#FFF3E0" />

      {/* Neck */}
      <path
        d="M80 62 Q82 50 80 40"
        stroke="#D4A017"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
      />

      {/* Full mane */}
      <g className="mane-la">
        <circle cx="80" cy="36" r="42" fill="#8B6914" />
        {/* Mane texture bumps */}
        <circle cx="52" cy="14" r="7" fill="#A07A14" />
        <circle cx="72" cy="2" r="8" fill="#A07A14" />
        <circle cx="92" cy="2" r="7" fill="#A07A14" />
        <circle cx="112" cy="14" r="8" fill="#A07A14" />
        <circle cx="118" cy="36" r="7" fill="#A07A14" />
        <circle cx="112" cy="58" r="8" fill="#A07A14" />
        <circle cx="92" cy="70" r="7" fill="#A07A14" />
        <circle cx="68" cy="70" r="7" fill="#A07A14" />
        <circle cx="48" cy="58" r="8" fill="#A07A14" />
        <circle cx="42" cy="36" r="7" fill="#A07A14" />
      </g>

      {/* Head */}
      <circle cx="80" cy="36" r="28" fill="#D4A017" />

      {/* Muzzle */}
      <ellipse cx="80" cy="46" rx="16" ry="12" fill="#FFF3E0" />

      {/* Left ear (partially behind mane) */}
      <g className={mood === 'sad' ? 'ear-droop-left-la' : 'ear-left-la'}>
        <circle cx="58" cy="14" r="10" fill="#D4A017" />
        <circle cx="58" cy="14" r="6" fill="#C69214" />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-la' : 'ear-right-la'}>
        <circle cx="102" cy="14" r="10" fill="#D4A017" />
        <circle cx="102" cy="14" r="6" fill="#C69214" />
      </g>

      {/* Eyes — mood dependent */}
      {mood === 'happy' ? (
        <>
          <path d="M64 32 Q72 24 80 32" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M80 32 Q88 24 96 32" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="72" cy="30" r="5" fill="#212121" />
          <circle cx="74" cy="28" r="2" fill="white" />
          <circle cx="88" cy="30" r="5" fill="#212121" />
          <circle cx="90" cy="28" r="2" fill="white" />
          <line x1="64" y1="22" x2="76" y2="25" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
          <line x1="96" y1="22" x2="84" y2="25" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="72" cy="30" r="5" fill="#212121" />
          <circle cx="74" cy="28" r="2" fill="white" />
          <ellipse className="eyelid-la" cx="72" cy="30" rx="6" ry="5" fill="#D4A017" />
          <circle cx="88" cy="30" r="5" fill="#212121" />
          <circle cx="90" cy="28" r="2" fill="white" />
          <ellipse className="eyelid-la" cx="88" cy="30" rx="6" ry="5" fill="#D4A017" />
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

      {/* Left leg + paw */}
      <rect x="57" y="120" width="12" height="28" rx="6" fill="#A67C00" />
      <ellipse cx="63" cy="150" rx="13" ry="7" fill="#A67C00" />
      <circle cx="56" cy="148" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="63" cy="146" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="70" cy="148" r="3.5" fill="#8D6E00" opacity="0.4" />

      {/* Right leg + paw */}
      <rect x="91" y="120" width="12" height="28" rx="6" fill="#A67C00" />
      <ellipse cx="97" cy="150" rx="13" ry="7" fill="#A67C00" />
      <circle cx="90" cy="148" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="97" cy="146" r="3.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="104" cy="148" r="3.5" fill="#8D6E00" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="64" cy="42" r="4" fill="#FFAB91" opacity="0.4" />
      <circle cx="96" cy="42" r="4" fill="#FFAB91" opacity="0.4" />
    </svg>
  );
}
