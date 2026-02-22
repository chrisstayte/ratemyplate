'use client';

import { useState, useEffect } from 'react';

export default function StateCycler({ svgs }: { svgs: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (svgs.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % svgs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [svgs.length]);

  return (
    <div className="relative size-48">
      {svgs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 size-full object-contain transition-opacity duration-700"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
