import type { PetMood } from '../Pet';
import { generateFoxCSS } from '../petAnimations';

const CSS = generateFoxCSS({
  suffix: 'fs',
  blinkDuration: 4,
  earTwitchDuration: 3,
  earTwitchAngle: 5,
  tailWagDuration: 2,
  tailWagAngle: 8,
  earOrigins: { left: '45px 22px', right: '75px 22px' },
  tailOrigin: '84px 66px',
});

/** Baby fox cub SVG — round body, big eyes, small ears, stubby tail with white tip */
export default function FoxSmall({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 120 130" width="100" height="108" aria-label="Baby fox cub">
      <style>{CSS}</style>

      {/* Tail (behind body) */}
      <g className={mood === 'sad' ? 'tail-droop-fs' : 'tail-wag-fs'}>
        <path d="M84 66 Q98 48 94 32" stroke="#E67E22" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="32" r="6" fill="#FFF8E1" />
      </g>

      {/* Body */}
      <ellipse cx="60" cy="68" rx="28" ry="24" fill="#E67E22" />

      {/* White belly */}
      <ellipse cx="60" cy="74" rx="16" ry="14" fill="#FFF8E1" />

      {/* Head */}
      <circle cx="60" cy="38" r="22" fill="#E67E22" />

      {/* White face mask */}
      <path d="M50 36 L60 52 L70 36 Q60 42 50 36" fill="#FFF8E1" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-fs' : 'ear-left-fs'}>
        <polygon points="40,22 50,22 43,0" fill="#E67E22" />
        <polygon points="42,20 48,20 44,4" fill="#FFCC80" />
        <polygon points="42,10 46,10 43,0" fill="#5D4037" />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-fs' : 'ear-right-fs'}>
        <polygon points="70,22 80,22 77,0" fill="#E67E22" />
        <polygon points="72,20 78,20 76,4" fill="#FFCC80" />
        <polygon points="74,10 78,10 77,0" fill="#5D4037" />
      </g>

      {/* Eyes — mood dependent */}
      {mood === 'happy' ? (
        <>
          <path d="M42 34 Q50 26 58 34" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M62 34 Q70 26 78 34" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="50" cy="33" r="6" fill="#212121" />
          <circle cx="52" cy="31" r="2" fill="white" />
          <circle cx="70" cy="33" r="6" fill="#212121" />
          <circle cx="72" cy="31" r="2" fill="white" />
          <line x1="42" y1="24" x2="54" y2="27" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="24" x2="66" y2="27" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="50" cy="33" r="6" fill="#212121" />
          <circle cx="52" cy="31" r="2" fill="white" />
          <ellipse className="eyelid-fs" cx="50" cy="33" rx="7" ry="6" fill="#E67E22" />
          <circle cx="70" cy="33" r="6" fill="#212121" />
          <circle cx="72" cy="31" r="2" fill="white" />
          <ellipse className="eyelid-fs" cx="70" cy="33" rx="7" ry="6" fill="#E67E22" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="60" cy="46" rx="3.5" ry="2.5" fill="#212121" />

      {/* Mouth */}
      <path d="M57 49 Q60 52 63 49" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left leg + paw */}
      <rect x="42" y="88" width="8" height="20" rx="4" fill="#5D4037" />
      <ellipse cx="46" cy="110" rx="9" ry="5" fill="#5D4037" />
      <circle cx="41" cy="108" r="2.5" fill="#3E2723" opacity="0.4" />
      <circle cx="46" cy="107" r="2.5" fill="#3E2723" opacity="0.4" />
      <circle cx="51" cy="108" r="2.5" fill="#3E2723" opacity="0.4" />

      {/* Right leg + paw */}
      <rect x="70" y="88" width="8" height="20" rx="4" fill="#5D4037" />
      <ellipse cx="74" cy="110" rx="9" ry="5" fill="#5D4037" />
      <circle cx="69" cy="108" r="2.5" fill="#3E2723" opacity="0.4" />
      <circle cx="74" cy="107" r="2.5" fill="#3E2723" opacity="0.4" />
      <circle cx="79" cy="108" r="2.5" fill="#3E2723" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="40" cy="42" r="4" fill="#FFAB91" opacity="0.5" />
      <circle cx="80" cy="42" r="4" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
