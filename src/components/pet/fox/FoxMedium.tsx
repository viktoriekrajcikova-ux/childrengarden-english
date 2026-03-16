import type { PetMood } from '../Pet';
import { generateFoxCSS } from '../petAnimations';

const CSS = generateFoxCSS({
  suffix: 'fm',
  blinkDuration: 3.5,
  earTwitchDuration: 2.5,
  earTwitchAngle: 7,
  tailWagDuration: 1.8,
  tailWagAngle: 10,
  earOrigins: { left: '51px 22px', right: '89px 22px' },
  tailOrigin: '100px 76px',
});

/** Young fox SVG — bigger body, taller ears, bushier tail, more defined markings */
export default function FoxMedium({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 140 150" width="140" height="150" aria-label="Young fox">
      <style>{CSS}</style>

      {/* Tail (behind body) */}
      <g className={mood === 'sad' ? 'tail-droop-fm' : 'tail-wag-fm'}>
        <path d="M100 76 Q118 54 114 30" stroke="#E67E22" strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="114" cy="30" r="7" fill="#FFF8E1" />
      </g>

      {/* Body */}
      <ellipse cx="70" cy="78" rx="34" ry="28" fill="#E67E22" />

      {/* White belly */}
      <ellipse cx="70" cy="85" rx="20" ry="18" fill="#FFF8E1" />

      {/* Head */}
      <circle cx="70" cy="40" r="26" fill="#E67E22" />

      {/* White face mask */}
      <path d="M58 38 L70 58 L82 38 Q70 46 58 38" fill="#FFF8E1" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-fm' : 'ear-left-fm'}>
        <polygon points="46,22 56,22 48,-4" fill="#E67E22" />
        <polygon points="48,20 54,20 49,0" fill="#FFCC80" />
        <polygon points="48,8 52,8 48,-4" fill="#5D4037" />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-fm' : 'ear-right-fm'}>
        <polygon points="84,22 94,22 92,-4" fill="#E67E22" />
        <polygon points="86,20 92,20 91,0" fill="#FFCC80" />
        <polygon points="88,8 92,8 92,-4" fill="#5D4037" />
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
          <ellipse className="eyelid-fm" cx="60" cy="35" rx="7" ry="6" fill="#E67E22" />
          <circle cx="80" cy="35" r="6" fill="#212121" />
          <circle cx="82" cy="33" r="2" fill="white" />
          <ellipse className="eyelid-fm" cx="80" cy="35" rx="7" ry="6" fill="#E67E22" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="70" cy="50" rx="4" ry="3" fill="#212121" />

      {/* Mouth */}
      <path d="M66 53 Q70 57 74 53" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left leg + paw */}
      <rect x="49" y="102" width="10" height="24" rx="5" fill="#5D4037" />
      <ellipse cx="54" cy="128" rx="11" ry="6" fill="#5D4037" />
      <circle cx="48" cy="126" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="54" cy="125" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="60" cy="126" r="3" fill="#3E2723" opacity="0.4" />

      {/* Right leg + paw */}
      <rect x="81" y="102" width="10" height="24" rx="5" fill="#5D4037" />
      <ellipse cx="86" cy="128" rx="11" ry="6" fill="#5D4037" />
      <circle cx="80" cy="126" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="86" cy="125" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="92" cy="126" r="3" fill="#3E2723" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="48" cy="46" r="5" fill="#FFAB91" opacity="0.5" />
      <circle cx="92" cy="46" r="5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
