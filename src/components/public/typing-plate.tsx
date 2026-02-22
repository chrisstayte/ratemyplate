'use client';

import { useEffect, useState, useCallback } from 'react';
import localFont from 'next/font/local';

const licensePlateFont = localFont({
  src: '../../../public/fonts/LICENSE-PLATE-USA.ttf',
});

const TYPE_SPEED = 100;
const HOLD_TIME = 2000;
const DELETE_SPEED = 60;
const PAUSE_BETWEEN = 400;

export default function TypingPlate({ plates }: { plates: string[] }) {
  const [displayed, setDisplayed] = useState('');
  const [plateIndex, setPlateIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPlate = plates[plateIndex] ?? '';

  const nextPlate = useCallback(() => {
    setPlateIndex((prev) => (prev + 1) % plates.length);
  }, [plates.length]);

  useEffect(() => {
    if (plates.length === 0) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayed.length < currentPlate.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentPlate.slice(0, displayed.length + 1));
        }, TYPE_SPEED);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, HOLD_TIME);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, DELETE_SPEED);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          nextPlate();
        }, PAUSE_BETWEEN);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, currentPlate, nextPlate, plates.length]);

  return (
    <span className="flex flex-col items-center">
      <span className="text-2xl text-muted-foreground mb-2">R8MYPL8</span>
      <span className={`${licensePlateFont.className} tracking-wider`}>
        {displayed}
        <span className="animate-pulse">|</span>
      </span>
    </span>
  );
}
