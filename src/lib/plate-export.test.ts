import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'opentype.js';
import { describe, expect, it } from 'vitest';
import { getPlateArtwork } from '@/lib/plate-artwork';
import {
  createPlateExportSvg,
  normalizeMediaText,
  plateExportFilename,
} from '@/lib/plate-export';
import statePlates from '@/lib/state-plates.json';

const data = readFileSync(join(process.cwd(), 'public/fonts/LICENSE-PLATE-USA.ttf'));
const font = parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
const sources = statePlates.map((plate) => ({
  ...plate,
  svg: readFileSync(join(process.cwd(), `public/images/state-plates/${plate.code}.svg`), 'utf8'),
}));

describe('plate media exports', () => {
  it('preserves every original SVG byte-for-byte for blank downloads without loading a font', () => {
    expect(sources).toHaveLength(50);
    for (const plate of sources) {
      expect(createPlateExportSvg(plate.svg, plate.code, '   ')).toBe(plate.svg);
    }
  });

  it('creates standalone vector artwork for every state with no font or image dependencies', () => {
    for (const plate of sources) {
      const svg = createPlateExportSvg(plate.svg, plate.code, 'R8MYPL8', font);
      expect(svg).toContain(`${plate.state} license plate: R8MYPL8</title>`);
      expect(svg).toContain('<g aria-label="R8MYPL8" transform=');
      expect(svg).not.toMatch(/<text\b|<image\b|@font-face|(?:href|src)=/);
      expect(svg).not.toContain('Registration number area is empty.');
      expect(svg).toMatch(/<path fill="#[a-fA-F0-9]+" d="M.+<\/g><\/svg>$/);
    }
  });

  it('keeps actual outlined glyph bounds inside every serial region, including long values', () => {
    for (const plate of sources) {
      const { serial } = getPlateArtwork(plate.code);
      for (const text of ['R8MYPL8', 'WWWWWWWWWWWW', 'IIIIIIIIIIII', 'A', 'ABC 123', 'R8-MY-PL8']) {
        const svg = createPlateExportSvg(plate.svg, plate.code, text, font);
        const transform = svg.match(/transform="translate\(([\d.]+) 0\) scale\(([\d.]+) 1\)"/);
        expect(transform).not.toBeNull();
        const x = Number(transform![1]);
        const scale = Number(transform![2]);
        const bounds = font.getPath(text, 0, serial.baseline, serial.fontSize).getBoundingBox();
        expect(x + bounds.x1 * scale).toBeGreaterThanOrEqual(serial.x);
        expect(x + bounds.x2 * scale).toBeLessThanOrEqual(serial.x + serial.width);
        expect(bounds.y1).toBeGreaterThanOrEqual(serial.y);
        expect(bounds.y2).toBeLessThanOrEqual(serial.y + serial.height);
      }
    }
  });

  it('accepts only supported plate characters and caps long input', () => {
    expect(normalizeMediaText('r8-my pl8!🚗')).toBe('R8-MY PL8');
    expect(normalizeMediaText('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe('ABCDEFGHIJKL');
    for (const character of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -') {
      expect(font.charToGlyphIndex(character)).not.toBe(0);
    }
    const svg = createPlateExportSvg(sources[0].svg, 'AL', '<>&"\'😀', font);
    expect(svg).toBe(sources[0].svg);
  });

  it('uses descriptive, safe filenames and the selected extension', () => {
    expect(plateExportFilename('CA', '', 'svg')).toBe('ratemyplate-ca-blank.svg');
    expect(plateExportFilename('NY', 'ABC 123', 'png')).toBe('ratemyplate-ny-abc-123.png');
    expect(plateExportFilename('OH', 'r8-mypl8', 'jpg')).toBe('ratemyplate-oh-r8-mypl8.jpg');
  });

  it('fails clearly for unavailable artwork or a missing custom font', () => {
    expect(() => createPlateExportSvg(sources[0].svg, 'DC', '')).toThrow('downloadable artwork');
    expect(() => createPlateExportSvg(sources[0].svg, 'AL', 'ABC')).toThrow('font');
  });
});
