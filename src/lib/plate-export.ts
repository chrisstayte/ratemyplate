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

export function plateExportZipFilename(value: string, format: PlateExportFormat) {
  const text = normalizeMediaText(value).trim();
  return `ratemyplate-all-states-${text ? text.toLowerCase().replace(/\s+/g, '-') : 'blank'}-${format}.zip`;
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

async function createPlateExportBlob(state: string, value: string, format: PlateExportFormat) {
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
  return format === 'svg'
    ? new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    : await rasterizePlate(svg, format);
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Allow browsers time to begin saving before releasing the download URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadPlate(state: string, value: string, format: PlateExportFormat) {
  const text = normalizeMediaText(value).trim();
  const blob = await createPlateExportBlob(state, text, format);
  triggerDownload(blob, plateExportFilename(state, text, format));
}

type ZipBytes = Uint8Array<ArrayBuffer>;

type ZipEntry = {
  filename: string;
  data: ZipBytes;
};

const ZIP_UINT16_MAX = 0xffff;
const ZIP_UINT32_MAX = 0xffff_ffff;

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let index = 0; index < table.length; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
}

const crcTable = createCrcTable();

function crc32(data: Uint8Array) {
  let checksum = 0xffff_ffff;
  for (const byte of data) checksum = crcTable[(checksum ^ byte) & 0xff]! ^ (checksum >>> 8);
  return (checksum ^ 0xffff_ffff) >>> 0;
}

function zipTimestamp(date: Date) {
  const year = Math.max(1980, date.getFullYear());
  return {
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
  };
}

function writeUint16(data: ZipBytes, offset: number, value: number) {
  new DataView(data.buffer, data.byteOffset, data.byteLength).setUint16(offset, value, true);
}

function writeUint32(data: ZipBytes, offset: number, value: number) {
  new DataView(data.buffer, data.byteOffset, data.byteLength).setUint32(offset, value, true);
}

/**
 * Creates a portable ZIP archive using ZIP's uncompressed "store" method.
 * Image data is already compressed and storing it avoids a large extra client-side dependency.
 */
export function createZipArchive(entries: ZipEntry[], modifiedAt = new Date()) {
  if (entries.length > ZIP_UINT16_MAX) throw new Error('Too many files to create a ZIP archive.');

  const encoder = new TextEncoder();
  const { date, time } = zipTimestamp(modifiedAt);
  const files: ZipBytes[] = [];
  const directory: ZipBytes[] = [];
  let localOffset = 0;

  for (const entry of entries) {
    const filename: ZipBytes = new Uint8Array(encoder.encode(entry.filename));
    const size = entry.data.byteLength;
    if (filename.byteLength > ZIP_UINT16_MAX || size > ZIP_UINT32_MAX || localOffset > ZIP_UINT32_MAX) {
      throw new Error('The files are too large to create a ZIP archive.');
    }

    const checksum = crc32(entry.data);
    const localHeader = new Uint8Array(30);
    writeUint32(localHeader, 0, 0x04034b50);
    writeUint16(localHeader, 4, 20);
    writeUint16(localHeader, 6, 0);
    writeUint16(localHeader, 8, 0);
    writeUint16(localHeader, 10, time);
    writeUint16(localHeader, 12, date);
    writeUint32(localHeader, 14, checksum);
    writeUint32(localHeader, 18, size);
    writeUint32(localHeader, 22, size);
    writeUint16(localHeader, 26, filename.byteLength);
    writeUint16(localHeader, 28, 0);
    files.push(localHeader, filename, entry.data);

    const directoryHeader = new Uint8Array(46);
    writeUint32(directoryHeader, 0, 0x02014b50);
    writeUint16(directoryHeader, 4, 20);
    writeUint16(directoryHeader, 6, 20);
    writeUint16(directoryHeader, 8, 0);
    writeUint16(directoryHeader, 10, 0);
    writeUint16(directoryHeader, 12, time);
    writeUint16(directoryHeader, 14, date);
    writeUint32(directoryHeader, 16, checksum);
    writeUint32(directoryHeader, 20, size);
    writeUint32(directoryHeader, 24, size);
    writeUint16(directoryHeader, 28, filename.byteLength);
    writeUint16(directoryHeader, 30, 0);
    writeUint16(directoryHeader, 32, 0);
    writeUint16(directoryHeader, 34, 0);
    writeUint16(directoryHeader, 36, 0);
    writeUint32(directoryHeader, 38, 0);
    writeUint32(directoryHeader, 42, localOffset);
    directory.push(directoryHeader, filename);

    localOffset += localHeader.byteLength + filename.byteLength + size;
  }

  const directorySize = directory.reduce((size, part) => size + part.byteLength, 0);
  if (localOffset + directorySize > ZIP_UINT32_MAX) throw new Error('The files are too large to create a ZIP archive.');

  const end = new Uint8Array(22);
  writeUint32(end, 0, 0x06054b50);
  writeUint16(end, 4, 0);
  writeUint16(end, 6, 0);
  writeUint16(end, 8, entries.length);
  writeUint16(end, 10, entries.length);
  writeUint32(end, 12, directorySize);
  writeUint32(end, 16, localOffset);
  writeUint16(end, 20, 0);

  return new Blob([...files, ...directory, end], { type: 'application/zip' });
}

export type PlateZipProgress = {
  completed: number;
  total: number;
};

export async function downloadPlatesZip(
  states: string[],
  value: string,
  format: PlateExportFormat,
  onProgress?: (progress: PlateZipProgress) => void,
) {
  const text = normalizeMediaText(value).trim();
  const entries: ZipEntry[] = [];
  onProgress?.({ completed: 0, total: states.length });

  for (const [index, state] of states.entries()) {
    const blob = await createPlateExportBlob(state, text, format);
    entries.push({
      filename: plateExportFilename(state, text, format),
      data: new Uint8Array(await blob.arrayBuffer()),
    });
    onProgress?.({ completed: index + 1, total: states.length });
  }

  triggerDownload(createZipArchive(entries), plateExportZipFilename(text, format));
}
