import type { PetSvgProps } from '../animalRegistry';
import { generateFoxCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#E67E22';
const DEFAULT_ACCENT = '#FFCC80';

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

/** Adult fox SVG — Sparkly-style */
export default function FoxAdult({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;

  return (
    <svg viewBox="0 0 160 170" width="230" height="245" aria-label="Adult fox">
      <style>{CSS}</style>

      {/* Tail — large and bushy */}
      <g className={mood === 'sad' ? 'tail-droop-fa' : 'tail-wag-fa'}>
        <path d="M118 86 Q142 58 136 30" stroke={body} strokeWidth="18" strokeLinecap="round" fill="none" />
        <circle cx="136" cy="30" r="9" fill="#FFF8E1" />
      </g>

      {/* Body */}
      <ellipse cx="80" cy="90" rx="42" ry="34" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="68" cy="78" rx="22" ry="14" fill="white" opacity="0.18" transform="rotate(-15 68 78)" />

      {/* White chest ruff */}
      <ellipse cx="80" cy="98" rx="26" ry="22" fill="#FFF8E1" />

      {/* Neck */}
      <path d="M80 60 Q82 48 80 38" stroke={body} strokeWidth="20" fill="none" strokeLinecap="round" />

      {/* Head */}
      <circle cx="80" cy="34" r="28" fill={body} />
      {/* Head shine */}
      <ellipse cx="72" cy="24" rx="13" ry="9" fill="white" opacity="0.15" transform="rotate(-20 72 24)" />

      {/* White face mask */}
      <path d="M66 34 L80 58 L94 34 Q80 44 66 34" fill="#FFF8E1" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-fa' : 'ear-left-fa'}>
        <polygon points="54,18 66,18 56,-12" fill={body} />
        <polygon points="56,16 64,16 58,-8" fill={accent} />
        <polygon points="56,2 60,2 56,-12" fill="#5D4037" />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-fa' : 'ear-right-fa'}>
        <polygon points="94,18 106,18 104,-12" fill={body} />
        <polygon points="96,16 104,16 102,-8" fill={accent} />
        <polygon points="100,2 104,2 104,-12" fill="#5D4037" />
      </g>

      {/* Eyes */}
      {mood === 'happy' ? (
        <>
          <path d="M64 32 Q74 22 84 32" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M76 32 Q86 22 96 32" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="66" cy="26" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="94" cy="26" r="1.5" fill="#FFF" opacity="0.8" />
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
          <ellipse className="eyelid-fa" cx="72" cy="30" rx="8" ry="7" fill={body} />
          <circle cx="88" cy="30" r="7" fill="#212121" />
          <circle cx="91" cy="27" r="2.8" fill="white" />
          <circle cx="85" cy="33" r="1.4" fill="white" opacity="0.6" />
          <circle cx="92" cy="26" r="0.7" fill="white" opacity="0.9" />
          <ellipse className="eyelid-fa" cx="88" cy="30" rx="8" ry="7" fill={body} />
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

      {/* Left paw */}
      <ellipse cx="63" cy="125" rx="15" ry="8" fill="#5D4037" />
      <circle cx="54" cy="122" r="4" fill="#3E2723" opacity="0.4" />
      <circle cx="63" cy="120" r="4" fill="#3E2723" opacity="0.4" />
      <circle cx="72" cy="122" r="4" fill="#3E2723" opacity="0.4" />

      {/* Right paw */}
      <ellipse cx="97" cy="125" rx="15" ry="8" fill="#5D4037" />
      <circle cx="88" cy="122" r="4" fill="#3E2723" opacity="0.4" />
      <circle cx="97" cy="120" r="4" fill="#3E2723" opacity="0.4" />
      <circle cx="106" cy="122" r="4" fill="#3E2723" opacity="0.4" />

      {/* Blush cheeks */}
      <circle cx="62" cy="42" r="5.5" fill="#FFAB91" opacity="0.5" />
      <circle cx="98" cy="42" r="5.5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
