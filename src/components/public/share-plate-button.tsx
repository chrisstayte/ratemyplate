'use client';

import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface SharePlateButtonProps {
  plateNumber: string;
  state: string;
}

export default function SharePlateButton({
  plateNumber,
  state,
}: SharePlateButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/${state}/${plateNumber}`;
    const shareData = {
      title: `${plateNumber} in ${state} — Rate My Plate`,
      text: `Check out this license plate on Rate My Plate!`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard access denied — ignore
      }
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      {copied ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <Share2 className="size-4" />
      )}
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
}
