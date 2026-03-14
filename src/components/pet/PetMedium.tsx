/** Young chick SVG — bigger ellipse, smaller eyes (proportionally), bigger beak, flapping wings, tail hint */
export default function PetMedium() {
  return (
    <svg viewBox="0 0 140 150" width="140" height="150" aria-label="Young chick">
      <style>{`
        .wing-left-m { transform-origin: 32px 72px; animation: flapLeftM 0.7s ease-in-out infinite; }
        .wing-right-m { transform-origin: 108px 72px; animation: flapRightM 0.7s ease-in-out infinite; }
        @keyframes flapLeftM { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-30deg); } }
        @keyframes flapRightM { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(30deg); } }
        .eyelid-m { animation: blinkM 3.5s ease-in-out infinite; }
        @keyframes blinkM {
          0%,90%,100% { transform: scaleY(0); }
          95% { transform: scaleY(1); }
        }
        .beak-top-m { transform-origin: 70px 73px; animation: beakTopM 1.8s ease-in-out infinite; }
        .beak-bot-m { transform-origin: 70px 73px; animation: beakBotM 1.8s ease-in-out infinite; }
        @keyframes beakTopM {
          0%,40%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg); }
        }
        @keyframes beakBotM {
          0%,40%,100% { transform: rotate(0deg); }
          20% { transform: rotate(8deg); }
        }
      `}</style>

      {/* Body — bigger ellipse */}
      <ellipse cx="70" cy="72" rx="40" ry="36" fill="#FFD54F" />

      {/* Left wing */}
      <path
        className="wing-left-m"
        d="M30 65 Q18 72 25 85 Q30 80 32 72"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Right wing */}
      <path
        className="wing-right-m"
        d="M110 65 Q122 72 115 85 Q110 80 108 72"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Left eye */}
      <circle cx="56" cy="62" r="7" fill="#212121" />
      <circle cx="58" cy="59" r="2.5" fill="white" />
      <ellipse className="eyelid-m" cx="56" cy="62" rx="8" ry="7" fill="#FFD54F" />

      {/* Right eye */}
      <circle cx="84" cy="62" r="7" fill="#212121" />
      <circle cx="86" cy="59" r="2.5" fill="white" />
      <ellipse className="eyelid-m" cx="84" cy="62" rx="8" ry="7" fill="#FFD54F" />

      {/* Beak — upper half */}
      <polygon className="beak-top-m" points="63,73 77,73 70,66" fill="#FF9800" />
      {/* Beak — lower half */}
      <polygon className="beak-bot-m" points="63,73 77,73 70,83" fill="#E65100" />

      {/* Tail hint */}
      <path
        d="M70 38 Q65 28 58 32 Q63 30 65 38"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1"
      />

      {/* Left leg */}
      <line x1="55" y1="107" x2="48" y2="132" stroke="#FF9800" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="48" y1="132" x2="40" y2="136" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="48" y1="132" x2="52" y2="138" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />

      {/* Right leg */}
      <line x1="85" y1="107" x2="92" y2="132" stroke="#FF9800" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="92" y1="132" x2="84" y2="136" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="92" y1="132" x2="96" y2="138" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />

      {/* Blush cheeks */}
      <circle cx="42" cy="74" r="5" fill="#FFAB91" opacity="0.5" />
      <circle cx="98" cy="74" r="5" fill="#FFAB91" opacity="0.5" />
    </svg>
  );
}
