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
    .eyelid-${s} { animation: blink${S} ${c.blinkDuration}s ease-in-out infinite; }
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
