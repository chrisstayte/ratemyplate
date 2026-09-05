import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rate My Plate Privacy',
  description: 'Privacy Policy for RateMyPlate.',
};

export default function PrivacyPage() {
  return (
    <div className="container flex-col py-12 sm:py-16">
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="font-display text-center text-4xl sm:text-5xl">RateMyPlate Privacy</h1>
        <p className="text-center text-sm text-muted-foreground mt-2 mb-8">Last Updated: July 5, 2024</p>
        <hr />
        <div className="flex flex-col w-full max-w-2xl leading-7 gap-2">
          <p>
            In order to post to the site you must login with one of the oauth
            partners.{' '}
          </p>
          <ul className="list-disc pl-10">
            <li>Google</li>
            <li>Discord</li>
            <li>Github</li>
          </ul>
          <p>
            As far as information stored, I use Better Auth tables for users,
            linked OAuth accounts, sessions, and verification records. This
            information is not sent to the front end beyond what is needed for
            an authenticated session. I primarily retain name and email so we
            can limit abuse and tie a comment to the account that posted it.
            That said, I understand this can still raise privacy concerns.
          </p>
          <p className="font-display text-2xl mt-7">Contact</p>
          <p>
            If you have any questions please reach out to me at{' '}
            <a
              className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              target="_blank"
              href="mailto:ratemyplate@chrisstayte.com"
            >
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
          <p className="font-display text-2xl mt-7">Source Code</p>
          <p>
            I have posted the source code for the project on github. You can
            view all of the code there.{' '}
            <a
              className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              target="_blank"
              href="https://github.com/chrisstayte/ratemyplate"
            >
              Source Code
            </a>
          </p>
          <p className="font-display text-2xl mt-7">Dashboard</p>
          <p>
            I built a dashboard that for now only I have access to. It allows me
            to see the data without having to open a postgres viewer like
            PGAdmin. I am working on a way to allow users to see all of their
            data and comments.
          </p>
          <p className="font-display text-2xl mt-7">Analytics</p>
          <p>
            Plausible analytics was added at the beginning but self hosting
            plausible was really resource intensive. So I have stripped it from
            the site.
          </p>
        </div>
      </div>
    </div>
  );
}
