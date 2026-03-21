/** Converts hex color to HSL */
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export interface ColorPalette {
  body: string;
  accent: string;
  outline: string;
}

/** Derives a 3-color palette from a base color */
export function derivePalette(baseColor: string): ColorPalette {
  const [h, s, l] = hexToHsl(baseColor);
  return {
    body: baseColor,
    accent: hslToHex(h, Math.min(s + 10, 100), Math.max(l - 15, 15)),
    outline: hslToHex(h, Math.min(s + 5, 100), Math.max(l - 30, 10)),
  };
}

/** Available color sprays for the shop */
export const COLOR_OPTIONS: { id: string; name: string; hex: string; emoji: string }[] = [
  { id: 'pink', name: 'Pink', hex: '#F48FB1', emoji: '🩷' },
  { id: 'blue', name: 'Blue', hex: '#64B5F6', emoji: '💙' },
  { id: 'green', name: 'Green', hex: '#81C784', emoji: '💚' },
  { id: 'purple', name: 'Purple', hex: '#B39DDB', emoji: '💜' },
  { id: 'red', name: 'Red', hex: '#EF5350', emoji: '❤️' },
  { id: 'gold', name: 'Gold', hex: '#FFD700', emoji: '💛' },
  { id: 'cyan', name: 'Cyan', hex: '#4DD0E1', emoji: '🩵' },
  { id: 'orange', name: 'Orange', hex: '#FFB74D', emoji: '🧡' },
];
