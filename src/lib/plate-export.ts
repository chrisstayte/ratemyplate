import type { Font, PathCommand } from 'opentype.js';
import {
  getPlateArtwork,
  getPlateTextWidth,
  PLATE_HEIGHT,
  PLATE_WIDTH,
} from '@/lib/plate-artwork';

export const MEDIA_TEXT_MAX_LENGTH = 12;
export const PLATE_EXPORT_SCALE = 4;
export type PlateExportFormat = 'svg' | 'png' | 'jpg';

export function normalizeMediaText(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9 -]/g, '').slice(0, MEDIA_TEXT_MAX_LENGTH);
}

export function plateExportFilename(state: string, value: string, format: PlateExportFormat) {
  const text = normalizeMediaText(value).trim();
  return `ratemyplate-${state.toLowerCase()}-${text ? text.toLowerCase().replace(/\s+/g, '-') : 'blank'}.${format}`;
}

function serializePlatePath(commands: PathCommand[]) {
  function coordinates(...values: number[]) {
    return values.map((value) => {
      if (!Number.isFinite(value)) throw new Error('The plate text could not be rendered.');
      return Number(value.toFixed(3)).toString();
    }).join(' ');
  }

  // opentype.js 2.0's toPathData() can emit NaN when rounding coordinates
  // just above an integer. Serialize the original contours with native rounding
  // and preserve their SVG coordinate direction and closing commands.
  return commands.map((command) => {
    switch (command.type) {
      case 'M':
      case 'L':
        return command.type + coordinates(command.x, command.y);
      case 'Q':
        return 'Q' + coordinates(command.x1, command.y1, command.x, command.y);
      case 'C':
        return 'C' + coordinates(command.x1, command.y1, command.x2, command.y2, command.x, command.y);
      case 'Z':
        return 'Z';
    }
  }).join('');
}

/** Inline the serial as outlines so the SVG needs no fonts or external images. */
export function createPlateExportSvg(source: string, state: string, value: string, font?: Font) {
  const artwork = getPlateArtwork(state);
  if (!artwork.imagePath) throw new Error('This state does not have downloadable artwork.');

  const text = normalizeMediaText(value).trim();
  if (!text) return source;
  if (!font) throw new Error('The plate font could not be loaded.');

  const { serial } = artwork;
  const width = getPlateTextWidth(text, serial.width);
  const advance = font.getAdvanceWidth(text, serial.fontSize);
  if (!Number.isFinite(advance) || advance <= 0) throw new Error('The plate text could not be rendered.');

  const x = serial.x + (serial.width - width) / 2;
  const path = serializePlatePath(font.getPath(text, 0, serial.baseline, serial.fontSize).commands);
  const number = `<g aria-label="${text}" transform="translate(${x} 0) scale(${width / advance} 1)"><path fill="${serial.color}" d="${path}"/></g>`;

  return source
    .replace(/(<title\b[^>]*>)[\s\S]*?<\/title>/, `$1${artwork.name} license plate: ${text}</title>`)
    .replace(/(<desc\b[^>]*>)[\s\S]*?<\/desc>/, `$1${artwork.name} plate illustration with custom text ${text}.</desc>`)
    .replace(/<\/svg>\s*$/, `${number}</svg>`);
}

let fontPromise: Promise<Font> | undefined;

function loadPlateFont() {
  if (!fontPromise) {
    fontPromise = Promise.all([
      import('opentype.js'),
      fetch('/fonts/LICENSE-PLATE-USA.ttf').then((response) => {
        if (!response.ok) throw new Error('The plate font could not be loaded.');
        return response.arrayBuffer();
      }),
    ]).then(([opentype, data]) => opentype.parse(data)).catch((error) => {
      fontPromise = undefined;
      throw error;
    });
  }
  return fontPromise;
}

async function rasterizePlate(svg: string, format: 'png' | 'jpg') {
  // Give the source image its export dimensions so browsers rasterize at full resolution.
  const width = PLATE_WIDTH * PLATE_EXPORT_SCALE;
  const height = PLATE_HEIGHT * PLATE_EXPORT_SCALE;
  const scaledSvg = svg.replace(/<svg\b[^>]*>/, (root) => root
    .replace(/\bwidth="[^"]*"/, `width="${width}"`)
    .replace(/\bheight="[^"]*"/, `height="${height}"`));
  const url = URL.createObjectURL(new Blob([scaledSvg], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser could not create this image. Try SVG instead.');
    if (format === 'jpg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error('The image could not be created. Try again.')),
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      0.95,
    ));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadPlate(state: string, value: string, format: PlateExportFormat) {
  const artwork = getPlateArtwork(state);
  if (!artwork.imagePath) throw new Error('This state does not have downloadable artwork.');
  const text = normalizeMediaText(value).trim();
  const [source, font] = await Promise.all([
    fetch(artwork.imagePath).then((response) => {
      if (!response.ok) throw new Error('The plate artwork could not be loaded. Please try again.');
      return response.text();
    }),
    text ? loadPlateFont() : undefined,
  ]);
  const svg = createPlateExportSvg(source, state, text, font);
  const blob = format === 'svg'
    ? new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    : await rasterizePlate(svg, format);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = plateExportFilename(state, text, format);
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Allow browsers time to begin saving before releasing the download URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
