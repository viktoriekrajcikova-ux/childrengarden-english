import type { PetSvgProps } from '../animalRegistry';
import { generateFoxCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#E67E22';
const DEFAULT_ACCENT = '#FFCC80';

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

/** Baby fox cub SVG — Sparkly-style: big shiny eyes, round, cute */
export default function FoxSmall({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;

  return (
    <svg viewBox="0 0 120 130" width="140" height="151" aria-label="Baby fox cub">
      <style>{CSS}</style>

      {/* Tail */}
      <g className={mood === 'sad' ? 'tail-droop-fs' : 'tail-wag-fs'}>
        <path d="M84 66 Q98 48 94 32" stroke={body} strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="32" r="6" fill="#FFF8E1" />
      </g>

      {/* Body */}
      <ellipse cx="60" cy="68" rx="28" ry="24" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="52" cy="60" rx="14" ry="10" fill="white" opacity="0.18" transform="rotate(-15 52 60)" />

      {/* White belly */}
      <ellipse cx="60" cy="74" rx="16" ry="14" fill="#FFF8E1" />

      {/* Head */}
      <circle cx="60" cy="38" r="22" fill={body} />
      {/* Head shine */}
      <ellipse cx="54" cy="30" rx="10" ry="7" fill="white" opacity="0.15" transform="rotate(-20 54 30)" />

      {/* White face mask */}
      <path d="M50 36 L60 52 L70 36 Q60 42 50 36" fill="#FFF8E1" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-fs' : 'ear-left-fs'}>
        <polygon points="40,22 50,22 43,0" fill={body} />
        <polygon points="42,20 48,20 44,4" fill={accent} />
        <polygon points="42,10 46,10 43,0" fill="#5D4037" />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-fs' : 'ear-right-fs'}>
        <polygon points="70,22 80,22 77,0" fill={body} />
        <polygon points="72,20 78,20 76,4" fill={accent} />
        <polygon points="74,10 78,10 77,0" fill="#5D4037" />
      </g>

      {/* Eyes */}
      {mood === 'happy' ? (
        <>
          <path d="M40 34 Q50 24 60 34" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M60 34 Q70 24 80 34" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="42" cy="28" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="78" cy="28" r="1.5" fill="#FFF" opacity="0.8" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="50" cy="33" r="8" fill="#212121" />
          <circle cx="53" cy="29" r="3.2" fill="white" />
          <circle cx="47" cy="36" r="1.6" fill="white" opacity="0.6" />
          <circle cx="70" cy="33" r="8" fill="#212121" />
          <circle cx="73" cy="29" r="3.2" fill="white" />
          <circle cx="67" cy="36" r="1.6" fill="white" opacity="0.6" />
          <line x1="40" y1="23" x2="54" y2="26" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="23" x2="66" y2="26" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="50" cy="33" r="8" fill="#212121" />
          <circle cx="53" cy="29" r="3.2" fill="white" />
          <circle cx="47" cy="36" r="1.6" fill="white" opacity="0.6" />
          <circle cx="54" cy="28" r="0.8" fill="white" opacity="0.9" />
          <ellipse className="eyelid-fs" cx="50" cy="33" rx="9" ry="8" fill={body} />
          <circle cx="70" cy="33" r="8" fill="#212121" />
          <circle cx="73" cy="29" r="3.2" fill="white" />
          <circle cx="67" cy="36" r="1.6" fill="white" opacity="0.6" />
          <circle cx="74" cy="28" r="0.8" fill="white" opacity="0.9" />
          <ellipse className="eyelid-fs" cx="70" cy="33" rx="9" ry="8" fill={body} />
        </>
      )}

      {/* Nose */}
      <ellipse cx="60" cy="46" rx="4" ry="3" fill="#212121" />

      {/* Mouth */}
      <path d="M57 49 Q60 52 63 49" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left paw */}
      <ellipse cx="46" cy="93" rx="11" ry="6" fill="#5D4037" />
      <circle cx="40" cy="91" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="46" cy="89" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="52" cy="91" r="3" fill="#3E2723" opacity="0.4" />

      {/* Right paw */}
      <ellipse cx="74" cy="93" rx="11" ry="6" fill="#5D4037" />
      <circle cx="68" cy="91" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="74" cy="89" r="3" fill="#3E2723" opacity="0.4" />
      <circle cx="80" cy="91" r="3" fill="#3E2723" opacity="0.4" />

      {/* Blush cheeks — bigger */}
      <circle cx="38" cy="42" r="6" fill="#FFAB91" opacity="0.5" />
      <circle cx="82" cy="42" r="6" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
