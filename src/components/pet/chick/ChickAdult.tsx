import type { PetSvgProps } from '../animalRegistry';
import { generatePetCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#FFD54F';
const DEFAULT_ACCENT = '#FFC107';
const DEFAULT_OUTLINE = '#F9A825';

function makeCSS(bodyFill: string) {
  return generatePetCSS({
    suffix: 'a',
    blinkDuration: 3,
    flapDuration: 0.6,
    flapAngle: 35,
    beakDuration: 2,
    beakAngle: 6,
    wingOrigins: { left: '34px 92px', right: '126px 92px' },
    beakOrigin: '114px 30px',
    bodyFill,
  });
}

/** Adult hen SVG — Sparkly-style */
export default function ChickAdult({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;
  const outline = palette?.outline ?? DEFAULT_OUTLINE;
  const CSS = makeCSS(body);

  return (
    <svg viewBox="0 0 160 170" width="230" height="245" aria-label="Adult hen">
      <style>{CSS}</style>

      {/* Tail feathers */}
      <path d="M40 55 Q25 35 30 20" stroke={outline} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M45 50 Q28 28 35 12" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 48 Q38 25 42 10" stroke={body} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="80" cy="85" rx="48" ry="38" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="68" cy="72" rx="24" ry="16" fill="white" opacity="0.18" transform="rotate(-15 68 72)" />

      {/* Left wing */}
      <path className="wing-left-a" d="M32 78 Q14 90 22 110 Q30 105 34 92" fill={accent} stroke={outline} strokeWidth="1.5" />

      {/* Right wing */}
      <path className="wing-right-a" d="M128 78 Q146 90 138 110 Q130 105 126 92" fill={accent} stroke={outline} strokeWidth="1.5" />

      {/* Neck */}
      <path d="M95 55 Q100 40 97 28" stroke={body} strokeWidth="18" fill="none" strokeLinecap="round" />

      {/* Head */}
      <circle cx="97" cy="25" r="18" fill={body} />

      {/* Comb */}
      <path d="M88 10 Q90 2 95 8 Q97 0 102 8 Q105 2 107 10" fill="#F44336" stroke="#D32F2F" strokeWidth="1" />

      {/* Eye */}
      {mood === 'happy' ? (
        <>
          <path d="M95 24 Q103 15 111 24" stroke="#212121" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="97" cy="18" r="1.2" fill="#FFF" opacity="0.8" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="103" cy="22" r="7" fill="#212121" />
          <circle cx="106" cy="19" r="2.8" fill="white" />
          <circle cx="100" cy="24" r="1.5" fill="white" opacity="0.6" />
          <line x1="95" y1="12" x2="109" y2="15" stroke="#212121" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="103" cy="22" r="7" fill="#212121" />
          <circle cx="106" cy="19" r="2.8" fill="white" />
          <circle cx="100" cy="24" r="1.5" fill="white" opacity="0.6" />
          <circle cx="107" cy="17" r="0.8" fill="white" opacity="0.9" />
          <ellipse className="eyelid-a" cx="103" cy="22" rx="8" ry="7" fill={body} />
        </>
      )}

      {/* Beak */}
      {mood === 'sad' ? (
        <>
          <polygon points="114,26 126,28 114,30" fill="#FF9800" />
          <polygon className="beak-droop-a" points="114,30 126,32 114,33" fill="#E65100" />
        </>
      ) : (
        <>
          <polygon className="beak-top-a" points="114,26 126,28 114,30" fill="#FF9800" />
          <polygon className="beak-bot-a" points="114,30 126,32 114,34" fill="#E65100" />
        </>
      )}

      {/* Wattle */}
      <ellipse cx="110" cy="38" rx="4" ry="6" fill="#F44336" />

      {/* Left paw */}
      <ellipse cx="65" cy="124" rx="15" ry="8" fill="#FF9800" />
      <circle cx="55" cy="121" r="4.5" fill="#E65100" opacity="0.35" />
      <circle cx="65" cy="119" r="4.5" fill="#E65100" opacity="0.35" />
      <circle cx="75" cy="121" r="4.5" fill="#E65100" opacity="0.35" />

      {/* Right paw */}
      <ellipse cx="95" cy="124" rx="15" ry="8" fill="#FF9800" />
      <circle cx="85" cy="121" r="4.5" fill="#E65100" opacity="0.35" />
      <circle cx="95" cy="119" r="4.5" fill="#E65100" opacity="0.35" />
      <circle cx="105" cy="121" r="4.5" fill="#E65100" opacity="0.35" />

      {/* Blush cheek */}
      <circle cx="89" cy="30" r="5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
