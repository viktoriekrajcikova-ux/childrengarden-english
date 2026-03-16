import type { PetMood } from '../Pet';
import { generateLionCSS } from '../petAnimations';

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

/** Young lion SVG — bigger body, small growing mane, longer tail with tuft */
export default function LionMedium({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 140 150" width="140" height="150" aria-label="Young lion">
      <style>{CSS}</style>

      {/* Tail with tuft */}
      <g className={mood === 'sad' ? 'tail-droop-lm' : 'tail-wag-lm'}>
        <path d="M100 76 Q116 56 112 34" stroke="#D4A017" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="112" cy="34" r="6" fill="#5D4037" />
      </g>

      {/* Body */}
      <ellipse cx="70" cy="78" rx="34" ry="28" fill="#D4A017" />

      {/* Belly */}
      <ellipse cx="70" cy="85" rx="20" ry="18" fill="#FFF3E0" />

      {/* Head */}
      {/* Small growing mane — fluffy ring behind head */}
      <circle cx="70" cy="40" r="32" fill="#B8860B" />

      <circle cx="70" cy="40" r="26" fill="#D4A017" />

      {/* Muzzle */}
      <ellipse cx="70" cy="50" rx="14" ry="10" fill="#FFF3E0" />

      {/* Left ear (round) */}
      <g className={mood === 'sad' ? 'ear-droop-left-lm' : 'ear-left-lm'}>
        <circle cx="50" cy="18" r="10" fill="#D4A017" />
        <circle cx="50" cy="18" r="6" fill="#C69214" />
      </g>

      {/* Right ear (round) */}
      <g className={mood === 'sad' ? 'ear-droop-right-lm' : 'ear-right-lm'}>
        <circle cx="90" cy="18" r="10" fill="#D4A017" />
        <circle cx="90" cy="18" r="6" fill="#C69214" />
      </g>

      {/* Eyes — mood dependent */}
      {mood === 'happy' ? (
        <>
          <path d="M52 36 Q60 28 68 36" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M72 36 Q80 28 88 36" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="60" cy="35" r="6" fill="#212121" />
          <circle cx="62" cy="33" r="2" fill="white" />
          <circle cx="80" cy="35" r="6" fill="#212121" />
          <circle cx="82" cy="33" r="2" fill="white" />
          <line x1="52" y1="26" x2="64" y2="29" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
          <line x1="88" y1="26" x2="76" y2="29" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="60" cy="35" r="6" fill="#212121" />
          <circle cx="62" cy="33" r="2" fill="white" />
          <ellipse className="eyelid-lm" cx="60" cy="35" rx="7" ry="6" fill="#D4A017" />
          <circle cx="80" cy="35" r="6" fill="#212121" />
          <circle cx="82" cy="33" r="2" fill="white" />
          <ellipse className="eyelid-lm" cx="80" cy="35" rx="7" ry="6" fill="#D4A017" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="70" cy="48" rx="4" ry="3" fill="#3E2723" />

      {/* Mouth */}
      <path d="M66 51 Q70 55 74 51" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left leg + paw */}
      <rect x="49" y="102" width="10" height="24" rx="5" fill="#A67C00" />
      <ellipse cx="54" cy="128" rx="11" ry="6" fill="#A67C00" />
      <circle cx="48" cy="126" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="54" cy="125" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="60" cy="126" r="3" fill="#8D6E00" opacity="0.4" />

      {/* Right leg + paw */}
      <rect x="81" y="102" width="10" height="24" rx="5" fill="#A67C00" />
      <ellipse cx="86" cy="128" rx="11" ry="6" fill="#A67C00" />
      <circle cx="80" cy="126" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="86" cy="125" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="92" cy="126" r="3" fill="#8D6E00" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="48" cy="46" r="5" fill="#FFAB91" opacity="0.5" />
      <circle cx="92" cy="46" r="5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
