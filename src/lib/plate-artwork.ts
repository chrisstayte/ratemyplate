import statePlates from '@/lib/state-plates.json';
import states from '../../public/data/states.json';

export const PLATE_WIDTH = 600;
export const PLATE_HEIGHT = 300;

const fallbackSerial = {
  x: 80,
  y: 105,
  width: 440,
  height: 120,
  color: '#18181b',
  baseline: 205,
  fontSize: 108,
};

export function getPlateArtwork(state: string) {
  const code = state.trim().toUpperCase();
  const artwork = statePlates.find((plate) => plate.code === code);
  const serial = artwork?.serial ?? fallbackSerial;
  // LICENSE-PLATE-USA.ttf has a 1.083em ascent and 0.274em descent.
  // Reserve 1.4em for its full line box, including browser rounding, and
  // center that box inside the artwork's recommended serial region.
  const fontSize = Math.min(serial.fontSize, serial.height / 1.4);

  return {
    code,
    name:
      artwork?.state ??
      states.find((state) => state.abbreviation === code)?.name ??
      code,
    imagePath: artwork ? `/images/state-plates/${code}.svg` : null,
    serial: {
      ...serial,
      fontSize,
      baseline: serial.y + (serial.height + fontSize * (1.083 - 0.274)) / 2,
    },
  };
}

export function getPlateTextWidth(value: string, availableWidth: number) {
  return Math.min(availableWidth, Array.from(value).length * 62);
}
