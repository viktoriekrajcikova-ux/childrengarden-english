import type { PetSvgProps } from '../animalRegistry';
import { generateFoxCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#E67E22';
const DEFAULT_ACCENT = '#FFCC80';

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

/** Young fox SVG — Sparkly-style */
export default function FoxMedium({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;

  return (
    <svg viewBox="0 0 140 150" width="180" height="193" aria-label="Young fox">
      <style>{CSS}</style>

      {/* Tail */}
      <g className={mood === 'sad' ? 'tail-droop-fm' : 'tail-wag-fm'}>
        <path d="M100 76 Q118 54 114 30" stroke={body} strokeWidth="14" strokeLinecap="round" fill="none" />
        <circle cx="114" cy="30" r="7" fill="#FFF8E1" />
      </g>

      {/* Body */}
      <ellipse cx="70" cy="78" rx="34" ry="28" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="60" cy="68" rx="17" ry="12" fill="white" opacity="0.18" transform="rotate(-15 60 68)" />

      {/* White belly */}
      <ellipse cx="70" cy="85" rx="20" ry="18" fill="#FFF8E1" />

      {/* Head */}
      <circle cx="70" cy="40" r="26" fill={body} />
      {/* Head shine */}
      <ellipse cx="62" cy="32" rx="12" ry="8" fill="white" opacity="0.15" transform="rotate(-20 62 32)" />

      {/* White face mask */}
      <path d="M58 38 L70 58 L82 38 Q70 46 58 38" fill="#FFF8E1" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-fm' : 'ear-left-fm'}>
        <polygon points="46,22 56,22 48,-4" fill={body} />
        <polygon points="48,20 54,20 49,0" fill={accent} />
        <polygon points="48,8 52,8 48,-4" fill="#5D4037" />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-fm' : 'ear-right-fm'}>
        <polygon points="84,22 94,22 92,-4" fill={body} />
        <polygon points="86,20 92,20 91,0" fill={accent} />
        <polygon points="88,8 92,8 92,-4" fill="#5D4037" />
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
          <ellipse className="eyelid-fm" cx="60" cy="35" rx="9" ry="8" fill={body} />
          <circle cx="80" cy="35" r="8" fill="#212121" />
          <circle cx="83" cy="31" r="3.2" fill="white" />
          <circle cx="77" cy="38" r="1.6" fill="white" opacity="0.6" />
          <circle cx="84" cy="30" r="0.8" fill="white" opacity="0.9" />
          <ellipse className="eyelid-fm" cx="80" cy="35" rx="9" ry="8" fill={body} />
        </>
      )}

      {/* Nose */}
      <ellipse cx="70" cy="50" rx="4" ry="3" fill="#212121" />

      {/* Mouth */}
      <path d="M66 53 Q70 57 74 53" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left paw */}
      <ellipse cx="54" cy="107" rx="13" ry="7" fill="#5D4037" />
      <circle cx="46" cy="104" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="54" cy="102" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="62" cy="104" r="3.5" fill="#3E2723" opacity="0.4" />

      {/* Right paw */}
      <ellipse cx="86" cy="107" rx="13" ry="7" fill="#5D4037" />
      <circle cx="78" cy="104" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="86" cy="102" r="3.5" fill="#3E2723" opacity="0.4" />
      <circle cx="94" cy="104" r="3.5" fill="#3E2723" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="46" cy="46" r="7" fill="#FFAB91" opacity="0.5" />
      <circle cx="94" cy="46" r="7" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
