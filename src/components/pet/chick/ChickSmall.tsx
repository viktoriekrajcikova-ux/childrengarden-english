import type { PetSvgProps } from '../animalRegistry';
import { generatePetCSS } from '../petAnimations';
import { derivePalette } from '../../../utils/colorUtils';

const DEFAULT_BODY = '#FFD54F';
const DEFAULT_ACCENT = '#FFC107';
const DEFAULT_OUTLINE = '#F9A825';

function makeCSS(bodyFill: string) {
  return generatePetCSS({
    suffix: 's',
    blinkDuration: 4,
    flapDuration: 0.8,
    flapAngle: 20,
    beakDuration: 1.5,
    beakAngle: 8,
    wingOrigins: { left: '34px 62px', right: '86px 62px' },
    beakOrigin: '60px 68px',
    bodyFill,
  });
}

/** Baby chick SVG — Sparkly-style: big shiny eyes, round, cute */
export default function ChickSmall({ mood = 'neutral', bodyColor }: PetSvgProps) {
  const palette = bodyColor ? derivePalette(bodyColor) : null;
  const body = palette?.body ?? DEFAULT_BODY;
  const accent = palette?.accent ?? DEFAULT_ACCENT;
  const outline = palette?.outline ?? DEFAULT_OUTLINE;
  const CSS = makeCSS(body);

  return (
    <svg viewBox="0 0 120 130" width="140" height="151" aria-label="Baby chick">
      <style>{CSS}</style>

      {/* Eggshell fragment */}
      <path
        d="M30 85 Q35 100 45 95 Q50 105 60 98 Q70 105 75 95 Q85 100 90 85"
        fill="#F5F5F5"
        stroke="#BDBDBD"
        strokeWidth="1.5"
      />

      {/* Body — yellow circle */}
      <circle cx="60" cy="62" r="32" fill={body} />
      {/* Glossy body highlight */}
      <ellipse cx="52" cy="52" rx="16" ry="12" fill="white" opacity="0.18" transform="rotate(-15 52 52)" />

      {/* Left tiny wing */}
      <path
        className="wing-left-s"
        d="M30 58 Q24 64 28 72 Q32 67 34 60"
        fill={accent}
        stroke={outline}
        strokeWidth="1"
      />

      {/* Right tiny wing */}
      <path
        className="wing-right-s"
        d="M90 58 Q96 64 92 72 Q88 67 86 60"
        fill={accent}
        stroke={outline}
        strokeWidth="1"
      />

      {/* Eyes — mood dependent */}
      {mood === 'happy' ? (
        <>
          {/* Happy eyes — thick upward arcs */}
          <path d="M38 57 Q48 45 58 57" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M62 57 Q72 45 82 57" stroke="#212121" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Tiny sparkles */}
          <circle cx="40" cy="50" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="80" cy="50" r="1.5" fill="#FFF" opacity="0.8" />
        </>
      ) : mood === 'sad' ? (
        <>
          {/* Sad — big sparkly eyes + eyebrows */}
          <circle cx="48" cy="55" r="10" fill="#212121" />
          <circle cx="51" cy="51" r="4" fill="white" />
          <circle cx="45" cy="58" r="2" fill="white" opacity="0.6" />
          <circle cx="72" cy="55" r="10" fill="#212121" />
          <circle cx="75" cy="51" r="4" fill="white" />
          <circle cx="69" cy="58" r="2" fill="white" opacity="0.6" />
          {/* Sad eyebrows */}
          <line x1="37" y1="42" x2="53" y2="45" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="83" y1="42" x2="67" y2="45" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Neutral — big sparkly eyes with multiple highlights */}
          <circle cx="48" cy="55" r="10" fill="#212121" />
          <circle cx="51" cy="51" r="4" fill="white" />
          <circle cx="45" cy="58" r="2" fill="white" opacity="0.6" />
          <circle cx="52" cy="49" r="1" fill="white" opacity="0.9" />
          <ellipse className="eyelid-s" cx="48" cy="55" rx="11" ry="10" fill={body} />
          <circle cx="72" cy="55" r="10" fill="#212121" />
          <circle cx="75" cy="51" r="4" fill="white" />
          <circle cx="69" cy="58" r="2" fill="white" opacity="0.6" />
          <circle cx="76" cy="49" r="1" fill="white" opacity="0.9" />
          <ellipse className="eyelid-s" cx="72" cy="55" rx="11" ry="10" fill={body} />
        </>
      )}

      {/* Beak */}
      {mood === 'sad' ? (
        <>
          <polygon points="54,68 66,68 60,63" fill="#FF9800" />
          <polygon className="beak-droop-s" points="54,68 66,68 60,73" fill="#E65100" />
        </>
      ) : (
        <>
          <polygon className="beak-top-s" points="54,68 66,68 60,63" fill="#FF9800" />
          <polygon className="beak-bot-s" points="54,68 66,68 60,76" fill="#E65100" />
        </>
      )}

      {/* Left paw */}
      <ellipse cx="48" cy="96" rx="11" ry="6" fill="#FF9800" />
      <circle cx="41" cy="94" r="3.5" fill="#E65100" opacity="0.35" />
      <circle cx="48" cy="92" r="3.5" fill="#E65100" opacity="0.35" />
      <circle cx="55" cy="94" r="3.5" fill="#E65100" opacity="0.35" />

      {/* Right paw */}
      <ellipse cx="72" cy="96" rx="11" ry="6" fill="#FF9800" />
      <circle cx="65" cy="94" r="3.5" fill="#E65100" opacity="0.35" />
      <circle cx="72" cy="92" r="3.5" fill="#E65100" opacity="0.35" />
      <circle cx="79" cy="94" r="3.5" fill="#E65100" opacity="0.35" />

      {/* Blush cheeks — bigger, more prominent */}
      <circle cx="36" cy="65" r="7" fill="#FFAB91" opacity="0.45" />
      <circle cx="84" cy="65" r="7" fill="#FFAB91" opacity="0.45" />
    </svg>
  );
}
