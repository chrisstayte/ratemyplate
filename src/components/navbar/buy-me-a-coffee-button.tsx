'use client';

import { Button } from '../ui/button';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface BuyMeACoffeeButtonProps {
  className: string;
}

const BuyMeACoffeeButton: FC<BuyMeACoffeeButtonProps> = ({ className }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const imageUrl =
    theme == 'dark' ? '/images/bmc-logo.svg' : '/images/bmc-logo-whitecup.svg';

  return (
    <Button asChild className={`${className}`}>
      <a
        className='flex items-center '
        href='https://www.buymeacoffee.com/chrisstayte'
        target='_blank'>
        <Image src={imageUrl} alt='' width={20} height={20} className='mr-2' />
        <p> Buy me a coffee</p>
      </a>
    </Button>
  );
};

export default BuyMeACoffeeButton;
