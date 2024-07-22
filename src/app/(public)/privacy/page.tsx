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
        <p className='text-center text-lg'>Last Updated: July 5, 2024</p>
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
            I have posted the source code for the project on github. You can
            view all of the code there.{' '}
            <a
              className='text-purple-500'
              target='_blank'
              href='https://github.com/chrisstayte/ratemyplate'>
              Source Code
            </a>
          </p>
          <p className='text-xl mt-7'>Dashboard</p>
          <p>
            I built a dashboard that for now only I have access to. It allows me
            to see the data without having to open a postgres viewer like
            PGAdmin. I am working on a way to allow users to see all of their
            data and comments.
          </p>
          <p className='text-xl mt-7'>Analytics</p>
          <p>
            As of July 21, 2024 I have added plausible analytics to the site.
            Plausible is an open source analytics tool that does not track any
            personal information. This was added as I wanted to see if the site
            was getting traffic. You can view the{' '}
            <a
              className='text-purple-500'
              target='_blank'
              href='https://plausible.chrisstayte.com/ratemyplate.wtf'>
              Dashboard
            </a>{' '}
            as well!
          </p>
        </div>
      </div>
    </div>
  );
}
