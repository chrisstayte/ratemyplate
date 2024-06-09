import BuyMeACoffeeButton from '../navbar/buy-me-a-coffee-button';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className='w-full min-h-28 flex py-10'>
      <div className='container flex flex-col items-center   gap-12 justify-between'>
        <div className='flex flex-row gap-3 justify-center items-center sm:text-start'>
          <Link href='/privacy'>
            <p>Privacy</p>
          </Link>
          <div>&bull;</div>
          <a href='https://x.com/chrisstayte' target='_blank'>
            <p>@ChrisStayte</p>
          </a>
        </div>

        <BuyMeACoffeeButton className='' />
      </div>
    </footer>
  );
};

export default Footer;
