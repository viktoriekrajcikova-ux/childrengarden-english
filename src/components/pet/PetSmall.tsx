/** Baby chick SVG — yellow ball with big eyes, beak, tiny wings, legs, eggshell fragment */
export default function PetSmall() {
  return (
    <svg viewBox="0 0 120 130" width="120" height="130" aria-label="Baby chick">
      <style>{`
        .wing-left-s { transform-origin: 34px 62px; animation: flapLeftS 0.8s ease-in-out infinite; }
        .wing-right-s { transform-origin: 86px 62px; animation: flapRightS 0.8s ease-in-out infinite; }
        @keyframes flapLeftS { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-20deg); } }
        @keyframes flapRightS { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(20deg); } }
      `}</style>

      {/* Eggshell fragment */}
      <path
        d="M30 85 Q35 100 45 95 Q50 105 60 98 Q70 105 75 95 Q85 100 90 85"
        fill="#F5F5F5"
        stroke="#BDBDBD"
        strokeWidth="1.5"
      />

      {/* Body — yellow circle */}
      <circle cx="60" cy="62" r="32" fill="#FFD54F" />

      {/* Left tiny wing */}
      <path
        className="wing-left-s"
        d="M30 58 Q24 64 28 72 Q32 67 34 60"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Right tiny wing */}
      <path
        className="wing-right-s"
        d="M90 58 Q96 64 92 72 Q88 67 86 60"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Left eye */}
      <circle cx="48" cy="55" r="8" fill="#212121" />
      <circle cx="50" cy="52" r="3" fill="white" />

      {/* Right eye */}
      <circle cx="72" cy="55" r="8" fill="#212121" />
      <circle cx="74" cy="52" r="3" fill="white" />

      {/* Beak */}
      <polygon points="56,68 64,68 60,76" fill="#FF9800" />

      {/* Left leg */}
      <line x1="50" y1="93" x2="45" y2="115" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="45" y1="115" x2="38" y2="118" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="45" y1="115" x2="48" y2="120" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />

      {/* Right leg */}
      <line x1="70" y1="93" x2="75" y2="115" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="75" y1="115" x2="68" y2="118" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="115" x2="78" y2="120" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />

      {/* Blush cheeks */}
      <circle cx="38" cy="65" r="5" fill="#FFAB91" opacity="0.5" />
      <circle cx="82" cy="65" r="5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
