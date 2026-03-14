/** Adult hen SVG — full body with neck, head, red comb + wattle, flapping wings, tail feathers, chicken legs */
export default function PetAdult() {
  return (
    <svg viewBox="0 0 160 170" width="160" height="170" aria-label="Adult hen">
      <style>{`
        .wing-left-a { transform-origin: 34px 92px; animation: flapLeftA 0.6s ease-in-out infinite; }
        .wing-right-a { transform-origin: 126px 92px; animation: flapRightA 0.6s ease-in-out infinite; }
        @keyframes flapLeftA { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-35deg); } }
        @keyframes flapRightA { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(35deg); } }
        .eyelid-a { animation: blinkA 3s ease-in-out infinite; }
        @keyframes blinkA {
          0%,90%,100% { transform: scaleY(0); }
          95% { transform: scaleY(1); }
        }
        .beak-top-a { transform-origin: 114px 30px; animation: beakTopA 2s ease-in-out infinite; }
        .beak-bot-a { transform-origin: 114px 30px; animation: beakBotA 2s ease-in-out infinite; }
        @keyframes beakTopA {
          0%,40%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-6deg); }
        }
        @keyframes beakBotA {
          0%,40%,100% { transform: rotate(0deg); }
          20% { transform: rotate(6deg); }
        }
      `}</style>

      {/* Tail feathers */}
      <path d="M40 55 Q25 35 30 20" stroke="#F9A825" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M45 50 Q28 28 35 12" stroke="#FFC107" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 48 Q38 25 42 10" stroke="#FFD54F" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Body */}
      <ellipse cx="80" cy="85" rx="48" ry="38" fill="#FFD54F" />

      {/* Left wing */}
      <path
        className="wing-left-a"
        d="M32 78 Q14 90 22 110 Q30 105 34 92"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1.5"
      />

      {/* Right wing */}
      <path
        className="wing-right-a"
        d="M128 78 Q146 90 138 110 Q130 105 126 92"
        fill="#FFC107"
        stroke="#F9A825"
        strokeWidth="1.5"
      />

      {/* Neck */}
      <path
        d="M95 55 Q100 40 97 28"
        stroke="#FFD54F"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />

      {/* Head */}
      <circle cx="97" cy="25" r="18" fill="#FFD54F" />

      {/* Comb */}
      <path
        d="M88 10 Q90 2 95 8 Q97 0 102 8 Q105 2 107 10"
        fill="#F44336"
        stroke="#D32F2F"
        strokeWidth="1"
      />

      {/* Eye */}
      <circle cx="103" cy="22" r="5" fill="#212121" />
      <circle cx="105" cy="20" r="2" fill="white" />
      <ellipse className="eyelid-a" cx="103" cy="22" rx="6" ry="5" fill="#FFD54F" />

      {/* Beak — upper half */}
      <polygon className="beak-top-a" points="114,26 126,28 114,30" fill="#FF9800" />
      {/* Beak — lower half */}
      <polygon className="beak-bot-a" points="114,30 126,32 114,34" fill="#E65100" />

      {/* Wattle */}
      <ellipse cx="110" cy="38" rx="4" ry="6" fill="#F44336" />

      {/* Left leg */}
      <line x1="65" y1="122" x2="58" y2="150" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" />
      <line x1="58" y1="150" x2="48" y2="155" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="150" x2="54" y2="158" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="150" x2="63" y2="157" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />

      {/* Right leg */}
      <line x1="95" y1="122" x2="102" y2="150" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" />
      <line x1="102" y1="150" x2="92" y2="155" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="102" y1="150" x2="98" y2="158" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />
      <line x1="102" y1="150" x2="107" y2="157" stroke="#FF9800" strokeWidth="3" strokeLinecap="round" />

      {/* Blush cheek */}
      <circle cx="90" cy="30" r="4" fill="#FFAB91" opacity="0.4" />
    </svg>
  );
}
