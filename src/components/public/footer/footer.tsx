import BuyMeACoffeeButton from '@/components/public/buy-me-a-coffee-button';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='w-full min-h-28 flex py-10'>
      <div className='container flex flex-col items-center   gap-12 justify-between'>
        <div className='flex flex-wrap gap-5 justify-center items-center sm:text-start'>
          <Link href='/privacy'>
            <p>Privacy</p>
          </Link>
          <div>&bull;</div>
          <Link href='/terms'>
            <p>Terms</p>
          </Link>
          <div>&bull;</div>
          <a href='https://x.com/chrisstayte' target='_blank'>
            <p>@ChrisStayte</p>
          </a>
          <div>&bull;</div>
          <Link href='/dashboard'>
            <p>Dashboard</p>
          </Link>
          <div>&bull;</div>
          <a href='https://github.com/chrisstayte/ratemyplate' target='_blank'>
            <p>Source</p>
          </a>
        </div>
        <BuyMeACoffeeButton className='' />
      </div>
    </footer>
  );
};

export default Footer;
