import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rate My Plate Privacy',
  description: 'Privacy Policy for RateMyPlate.',
};

export default function PrivacyPage() {
  return (
    <div className='container flex-col py-10'>
      <div className='flex flex-col gap-2 justify-center items-center'>
        <p className='text-center text-3xl'>RateMyPlate Privacy</p>
        <p className='text-center text-lg'>Last Updated: June 12, 2024</p>
        <hr />
        <div className='flex flex-col w-full max-w-lg gap-2'>
          <p>
            In order to post to the site you must login with one of the oauth
            partners.{' '}
          </p>
          <ul className='list-disc pl-10'>
            <li>Google</li>
            <li>Discord</li>
            <li>Github</li>
          </ul>
          <p>
            As far as information stored. I use the default schema in AUTH js to
            store users, accounts, sessions, etc. This information is not sent
            to the front end just the comments and plates. I believe it captures
            the email and name. I do not use this information for anything other
            than keeping bots from flooding the website. I do however tie each
            comment to the associated account as well if said person was the
            first commenter on a plate. That being said I can see how this could
            be a privacy concern.
          </p>
          <p className='text-xl mt-7'>Contact</p>
          <p>
            If you have any questions please reach out to me at{' '}
            <a
              className='text-purple-500'
              target='_blank'
              href='mailto:ratemyplate@chrisstayte.com'>
              ratemyplate@chrisstayte.com
            </a>
          </p>
          <p>
            I am working on a way to delete your account and all associated data
            from the site automatically. If you would like to delete your
            account please reach out to me at the email above.
          </p>
          <p>
            If there is content that is doxing in nature please reach out to me
            and I can manually remove it from the site.
          </p>
          <p className='text-xl mt-7'>Source Code</p>
          <p>
            I am working on setting a license that protects my IP but allows me
            to publicly show the source code so it can all be above board. I
            will update this page when I have that in place.
          </p>
        </div>
      </div>
    </div>
  );
}