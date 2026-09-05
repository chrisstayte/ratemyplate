import { licensePlateFont } from '@/lib/fonts';
import {
  getPlateArtwork,
  getPlateTextWidth,
  PLATE_HEIGHT,
  PLATE_WIDTH,
} from '@/lib/plate-artwork';
import type { Plate } from '@/lib/plates';
import { cn } from '@/lib/utils';

interface PlateArtworkProps {
  plate: Plate;
  className?: string;
}

/** Artwork and serial share one coordinate system at every display size. */
export default function PlateArtwork({ plate, className }: PlateArtworkProps) {
  const artwork = getPlateArtwork(plate.state);
  const serial = artwork.serial;
  const value = plate.plateNumber.toUpperCase();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${PLATE_WIDTH} ${PLATE_HEIGHT}`}
      width={PLATE_WIDTH}
      height={PLATE_HEIGHT}
      role="img"
      aria-label={`${artwork.name} license plate${value ? `: ${value}` : ', blank'}`}
      className={cn('block h-auto w-full aspect-[2/1] select-none', className)}
    >
      {artwork.imagePath ? (
        <image
          href={artwork.imagePath}
          width={PLATE_WIDTH}
          height={PLATE_HEIGHT}
        />
      ) : (
        <>
          <rect
            x="3"
            y="3"
            width="594"
            height="294"
            rx="19"
            fill="#fafafa"
            stroke="#d4d4d8"
            strokeWidth="2"
          />
          <text x="300" y="64" textAnchor="middle" fontSize="28" fill="#18181b">
            {artwork.name}
          </text>
        </>
      )}
      {value && (
        <text
          className={licensePlateFont.className}
          x={serial.x + serial.width / 2}
          y={serial.baseline}
          textAnchor="middle"
          fontSize={serial.fontSize}
          fill={serial.color}
          textLength={getPlateTextWidth(value, serial.width)}
          lengthAdjust="spacingAndGlyphs"
        >
          {value}
        </text>
      )}
    </svg>
  );
}
