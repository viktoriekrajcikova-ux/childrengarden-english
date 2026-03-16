import type { PetMood } from '../Pet';
import { generateFoxCSS } from '../petAnimations';

const CSS = generateFoxCSS({
  suffix: 'fa',
  blinkDuration: 3,
  earTwitchDuration: 2,
  earTwitchAngle: 8,
  tailWagDuration: 1.5,
  tailWagAngle: 12,
  earOrigins: { left: '60px 18px', right: '100px 18px' },
  tailOrigin: '118px 86px',
});

/** Adult fox SVG — full body, tall ears, large bushy tail, whiskers, white chest ruff */
export default function FoxAdult({ mood = 'neutral' }: { mood?: PetMood }) {
  return (
    <svg viewBox="0 0 160 170" width="190" height="202" aria-label="Adult fox">
      <style>{CSS}</style>

      {/* Tail (behind body) — large and bushy */}
      <g className={mood === 'sad' ? 'tail-droop-fa' : 'tail-wag-fa'}>
        <path d="M118 86 Q142 58 136 30" stroke="#E67E22" strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="136" cy="30" r="9" fill="#FFF8E1" />
      </g>

      {/* Body */}
      <ellipse cx="80" cy="90" rx="42" ry="34" fill="#E67E22" />

      {/* White chest ruff */}
      <ellipse cx="80" cy="98" rx="26" ry="22" fill="#FFF8E1" />

      {/* Neck */}
      <path
        d="M80 60 Q82 48 80 38"
        stroke="#E67E22"
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
      />

      {/* Head */}
      <circle cx="80" cy="34" r="28" fill="#E67E22" />

      {/* White face mask */}
      <path d="M66 34 L80 58 L94 34 Q80 44 66 34" fill="#FFF8E1" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-fa' : 'ear-left-fa'}>
        <polygon points="54,18 66,18 56,-12" fill="#E67E22" />
        <polygon points="56,16 64,16 58,-8" fill="#FFCC80" />
        <polygon points="56,2 60,2 56,-12" fill="#5D4037" />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-fa' : 'ear-right-fa'}>
        <polygon points="94,18 106,18 104,-12" fill="#E67E22" />
        <polygon points="96,16 104,16 102,-8" fill="#FFCC80" />
        <polygon points="100,2 104,2 104,-12" fill="#5D4037" />
      </g>

      {/* Eyes — mood dependent */}
      {mood === 'happy' ? (
        <>
          <path d="M66 32 Q74 24 82 32" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M78 32 Q86 24 94 32" stroke="#212121" strokeWidth="2.5" fill="none" strokeLinecap="round" />
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
          <ellipse className="eyelid-fa" cx="72" cy="30" rx="6" ry="5" fill="#E67E22" />
          <circle cx="88" cy="30" r="5" fill="#212121" />
          <circle cx="90" cy="28" r="2" fill="white" />
          <ellipse className="eyelid-fa" cx="88" cy="30" rx="6" ry="5" fill="#E67E22" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="80" cy="46" rx="4.5" ry="3" fill="#212121" />

      {/* Mouth */}
      <path d="M76 49 Q80 53 84 49" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Whiskers */}
      <line x1="62" y1="44" x2="48" y2="40" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
      <line x1="62" y1="47" x2="46" y2="47" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
      <line x1="62" y1="50" x2="48" y2="54" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
      <line x1="98" y1="44" x2="112" y2="40" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
      <line x1="98" y1="47" x2="114" y2="47" stroke="#5D4037" strokeWidth="1" opacity="0.5" />
      <line x1="98" y1="50" x2="112" y2="54" stroke="#5D4037" strokeWidth="1" opacity="0.5" />

      {/* Left leg + paw */}
      <rect x="57" y="120" width="12" height="28" rx="6" fill="#5D4037" />
      <ellipse cx="63" cy="150" rx="13" ry="7" fill="#5D4037" />
      <circle cx="56" cy="148" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="63" cy="146" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="70" cy="148" r="3.5" fill="#3E2723" opacity="0.4" />

      {/* Right leg + paw */}
      <rect x="91" y="120" width="12" height="28" rx="6" fill="#5D4037" />
      <ellipse cx="97" cy="150" rx="13" ry="7" fill="#5D4037" />
      <circle cx="90" cy="148" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="97" cy="146" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="104" cy="148" r="3.5" fill="#3E2723" opacity="0.4" />

      {/* Blush cheek */}
      <circle cx="64" cy="42" r="4" fill="#FFAB91" opacity="0.4" />
      <circle cx="96" cy="42" r="4" fill="#FFAB91" opacity="0.4" />
    </svg>
  );
}
