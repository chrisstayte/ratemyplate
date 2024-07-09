'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface BuyMeACoffeeButtonProps {
  className: string;
}

const BuyMeACoffeeButton: FC<BuyMeACoffeeButtonProps> = ({ className }) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className='h-12' />;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const imageUrl =
    currentTheme === 'dark'
      ? '/images/bmc-logo.svg'
      : '/images/bmc-logo-whitecup.svg';

  return (
    <Button asChild className={`${className} h-12`}>
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
