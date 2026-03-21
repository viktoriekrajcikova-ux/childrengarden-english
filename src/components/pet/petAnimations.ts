export interface PetAnimConfig {
  suffix: string;
  blinkDuration: number;
  flapDuration: number;
  flapAngle: number;
  beakDuration: number;
  beakAngle: number;
  wingOrigins: { left: string; right: string };
  beakOrigin: string;
  bodyFill: string;
}

export function generatePetCSS(c: PetAnimConfig): string {
  const s = c.suffix;
  const S = s.toUpperCase();
  return `
    .wing-left-${s} { transform-origin: ${c.wingOrigins.left}; animation: flapLeft${S} ${c.flapDuration}s ease-in-out infinite; }
    .wing-right-${s} { transform-origin: ${c.wingOrigins.right}; animation: flapRight${S} ${c.flapDuration}s ease-in-out infinite; }
    @keyframes flapLeft${S} { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-${c.flapAngle}deg); } }
    @keyframes flapRight${S} { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(${c.flapAngle}deg); } }
    .eyelid-${s} { transform-box: fill-box; transform-origin: center top; animation: blink${S} ${c.blinkDuration}s ease-in-out infinite; }
    @keyframes blink${S} {
      0%,90%,100% { transform: scaleY(0); }
      95% { transform: scaleY(1); }
    }
    .beak-top-${s} { transform-origin: ${c.beakOrigin}; animation: beakTop${S} ${c.beakDuration}s ease-in-out infinite; }
    .beak-bot-${s} { transform-origin: ${c.beakOrigin}; animation: beakBot${S} ${c.beakDuration}s ease-in-out infinite; }
    @keyframes beakTop${S} {
      0%,40%,100% { transform: rotate(0deg); }
      20% { transform: rotate(-${c.beakAngle}deg); }
    }
    @keyframes beakBot${S} {
      0%,40%,100% { transform: rotate(0deg); }
      20% { transform: rotate(${c.beakAngle}deg); }
    }
    .beak-droop-${s} { transform-origin: ${c.beakOrigin}; animation: beakDroop${S} 2s ease-in-out infinite; }
    @keyframes beakDroop${S} { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
  `;
}

/* ── Fox animations ── */

export interface FoxAnimConfig {
  suffix: string;
  blinkDuration: number;
  earTwitchDuration: number;
  earTwitchAngle: number;
  tailWagDuration: number;
  tailWagAngle: number;
  earOrigins: { left: string; right: string };
  tailOrigin: string;
}

export function generateFoxCSS(c: FoxAnimConfig): string {
  const s = c.suffix;
  const S = s.toUpperCase();
  return `
    .ear-left-${s} { transform-origin: ${c.earOrigins.left}; animation: earTwitchL${S} ${c.earTwitchDuration}s ease-in-out infinite; }
    .ear-right-${s} { transform-origin: ${c.earOrigins.right}; animation: earTwitchR${S} ${c.earTwitchDuration}s ease-in-out infinite; }
    @keyframes earTwitchL${S} { 0%,80%,100% { transform: rotate(0deg); } 90% { transform: rotate(-${c.earTwitchAngle}deg); } }
    @keyframes earTwitchR${S} { 0%,80%,100% { transform: rotate(0deg); } 90% { transform: rotate(${c.earTwitchAngle}deg); } }
    .eyelid-${s} { transform-box: fill-box; transform-origin: center top; animation: blink${S} ${c.blinkDuration}s ease-in-out infinite; }
    @keyframes blink${S} {
      0%,90%,100% { transform: scaleY(0); }
      95% { transform: scaleY(1); }
    }
    .tail-wag-${s} { transform-origin: ${c.tailOrigin}; animation: tailWag${S} ${c.tailWagDuration}s ease-in-out infinite; }
    @keyframes tailWag${S} {
      0%,100% { transform: rotate(0deg); }
      25% { transform: rotate(-${c.tailWagAngle}deg); }
      75% { transform: rotate(${c.tailWagAngle}deg); }
    }
    .tail-droop-${s} { transform-origin: ${c.tailOrigin}; animation: tailDroop${S} 2s ease-in-out infinite; }
    @keyframes tailDroop${S} { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
    .ear-droop-left-${s} { transform-origin: ${c.earOrigins.left}; animation: earDroopL${S} 2s ease-in-out infinite; }
    .ear-droop-right-${s} { transform-origin: ${c.earOrigins.right}; animation: earDroopR${S} 2s ease-in-out infinite; }
    @keyframes earDroopL${S} { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(15deg); } }
    @keyframes earDroopR${S} { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-15deg); } }
  `;
}

/* ── Lion animations (same ear+tail pattern) ── */

export type LionAnimConfig = FoxAnimConfig;
export const generateLionCSS = generateFoxCSS;
