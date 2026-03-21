import type { PetSvgProps } from '../animalRegistry';
import { generateLionCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#D4A017';
const DEFAULT_ACCENT = '#C69214';

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

/** Baby lion cub SVG — Sparkly-style: big shiny eyes, round, cute */
export default function LionSmall({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;

  return (
    <svg viewBox="0 0 120 130" width="140" height="151" aria-label="Baby lion cub">
      <style>{CSS}</style>

      {/* Tail with dark tuft */}
      <g className={mood === 'sad' ? 'tail-droop-ls' : 'tail-wag-ls'}>
        <path d="M84 66 Q96 50 94 36" stroke={body} strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="94" cy="36" r="5" fill="#5D4037" />
      </g>

      {/* Body */}
      <ellipse cx="60" cy="68" rx="28" ry="24" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="52" cy="60" rx="14" ry="10" fill="white" opacity="0.18" transform="rotate(-15 52 60)" />

      {/* Belly */}
      <ellipse cx="60" cy="74" rx="16" ry="14" fill="#FFF3E0" />

      {/* Cub spots */}
      <circle cx="45" cy="62" r="3" fill={accent} opacity="0.3" />
      <circle cx="72" cy="58" r="2.5" fill={accent} opacity="0.3" />
      <circle cx="55" cy="78" r="2.5" fill={accent} opacity="0.3" />
      <circle cx="68" cy="74" r="3" fill={accent} opacity="0.3" />

      {/* Head */}
      <circle cx="60" cy="38" r="22" fill={body} />
      {/* Head shine */}
      <ellipse cx="54" cy="30" rx="10" ry="7" fill="white" opacity="0.15" transform="rotate(-20 54 30)" />

      {/* Muzzle */}
      <ellipse cx="60" cy="46" rx="12" ry="8" fill="#FFF3E0" />

      {/* Left ear */}
      <g className={mood === 'sad' ? 'ear-droop-left-ls' : 'ear-left-ls'}>
        <circle cx="42" cy="20" r="8" fill={body} />
        <circle cx="42" cy="20" r="5" fill={accent} />
      </g>

      {/* Right ear */}
      <g className={mood === 'sad' ? 'ear-droop-right-ls' : 'ear-right-ls'}>
        <circle cx="78" cy="20" r="8" fill={body} />
        <circle cx="78" cy="20" r="5" fill={accent} />
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
          <ellipse className="eyelid-ls" cx="50" cy="33" rx="9" ry="8" fill={body} />
          <circle cx="70" cy="33" r="8" fill="#212121" />
          <circle cx="73" cy="29" r="3.2" fill="white" />
          <circle cx="67" cy="36" r="1.6" fill="white" opacity="0.6" />
          <circle cx="74" cy="28" r="0.8" fill="white" opacity="0.9" />
          <ellipse className="eyelid-ls" cx="70" cy="33" rx="9" ry="8" fill={body} />
        </>
      )}

      {/* Nose */}
      <ellipse cx="60" cy="44" rx="3.5" ry="2.5" fill="#3E2723" />

      {/* Mouth */}
      <path d="M57 47 Q60 50 63 47" stroke="#5D4037" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Left paw */}
      <ellipse cx="46" cy="93" rx="11" ry="6" fill="#A67C00" />
      <circle cx="40" cy="91" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="46" cy="89" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="52" cy="91" r="3" fill="#8D6E00" opacity="0.4" />

      {/* Right paw */}
      <ellipse cx="74" cy="93" rx="11" ry="6" fill="#A67C00" />
      <circle cx="68" cy="91" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="74" cy="89" r="3" fill="#8D6E00" opacity="0.4" />
      <circle cx="80" cy="91" r="3" fill="#8D6E00" opacity="0.4" />

      {/* Blush cheeks — bigger */}
      <circle cx="38" cy="42" r="6" fill="#FFAB91" opacity="0.5" />
      <circle cx="82" cy="42" r="6" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
