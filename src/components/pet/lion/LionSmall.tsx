import type { PetMood } from '../Pet';
import { generateLionCSS } from '../petAnimations';

const CSS = generateLionCSS({
  suffix: 'ls',
  blinkDuration: 4,
  earTwitchDuration: 3,
  earTwitchAngle: 5,
  tailWagDuration: 2.2,
  tailWagAngle: 10,
  earOrigins: { left: '42px 28px', right: '78px 28px' },
  tailOrigin: '84px 66px',
});

/** Baby lion cub SVG — round golden body, big eyes, round ears, faint spots, stubby tail with tuft */
export default function LionSmall({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 120 130" width="100" height="108" aria-label="Baby lion cub">
      <style>{CSS}</style>

      {/* Tail with dark tuft */}
      <g className={mood === 'sad' ? 'tail-droop-ls' : 'tail-wag-ls'}>
        <path d="M84 66 Q96 50 94 36" stroke="#D4A017" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="36" r="5" fill="#5D4037" />
      </g>

      {/* Body */}
      <ellipse cx="60" cy="68" rx="28" ry="24" fill="#D4A017" />

      {/* Belly */}
      <ellipse cx="60" cy="74" rx="16" ry="14" fill="#FFF3E0" />

      {/* Cub spots */}
      <circle cx="45" cy="62" r="3" fill="#C69214" opacity="0.3" />
      <circle cx="72" cy="58" r="2.5" fill="#C69214" opacity="0.3" />
      <circle cx="55" cy="78" r="2.5" fill="#C69214" opacity="0.3" />
      <circle cx="68" cy="74" r="3" fill="#C69214" opacity="0.3" />

      {/* Head */}
      <circle cx="60" cy="38" r="22" fill="#D4A017" />

      {/* Muzzle */}
      <ellipse cx="60" cy="46" rx="12" ry="8" fill="#FFF3E0" />

      {/* Left ear (round) */}
      <g className={mood === 'sad' ? 'ear-droop-left-ls' : 'ear-left-ls'}>
        <circle cx="42" cy="20" r="8" fill="#D4A017" />
        <circle cx="42" cy="20" r="5" fill="#C69214" />
      </g>

      {/* Right ear (round) */}
      <g className={mood === 'sad' ? 'ear-droop-right-ls' : 'ear-right-ls'}>
        <circle cx="78" cy="20" r="8" fill="#D4A017" />
        <circle cx="78" cy="20" r="5" fill="#C69214" />
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
          <ellipse className="eyelid-ls" cx="50" cy="33" rx="7" ry="6" fill="#D4A017" />
          <circle cx="70" cy="33" r="6" fill="#212121" />
          <circle cx="72" cy="31" r="2" fill="white" />
          <ellipse className="eyelid-ls" cx="70" cy="33" rx="7" ry="6" fill="#D4A017" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="60" cy="44" rx="3.5" ry="2.5" fill="#3E2723" />

      {/* Mouth */}
      <path d="M57 47 Q60 50 63 47" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left leg + paw */}
      <rect x="42" y="88" width="8" height="20" rx="4" fill="#A67C00" />
      <ellipse cx="46" cy="110" rx="9" ry="5" fill="#A67C00" />
      <circle cx="41" cy="108" r="2.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="46" cy="107" r="2.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="51" cy="108" r="2.5" fill="#8D6E00" opacity="0.4" />

      {/* Right leg + paw */}
      <rect x="70" y="88" width="8" height="20" rx="4" fill="#A67C00" />
      <ellipse cx="74" cy="110" rx="9" ry="5" fill="#A67C00" />
      <circle cx="69" cy="108" r="2.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="74" cy="107" r="2.5" fill="#8D6E00" opacity="0.4" />
      <circle cx="79" cy="108" r="2.5" fill="#8D6E00" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="40" cy="42" r="4" fill="#FFAB91" opacity="0.5" />
      <circle cx="80" cy="42" r="4" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
