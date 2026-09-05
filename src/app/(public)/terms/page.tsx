import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rate My Terms',
  description: 'Terms and Conditions for RateMyPlate.',
};

export default function TermsPage() {
  return (
    <div className="container flex-col py-12 sm:py-16">
      <div className="flex flex-col gap-2 justify-center items-center">
        <h1 className="font-display text-center text-4xl sm:text-5xl">RateMyPlate Terms</h1>
        <p className="text-center text-sm text-muted-foreground mt-2 mb-8">Last Updated: August 13, 2026</p>
        <hr />
        <div className="flex flex-col w-full max-w-2xl leading-7 gap-4">
          <p>
            These terms govern use of RateMyPlate at{' '}
            <a
              className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              target="_blank"
              href="https://ratemyplate.wtf"
            >
              https://ratemyplate.wtf
            </a>
            . By using the site, you agree to them.
          </p>

          <p className="font-display text-2xl">
            <strong>The service</strong>
          </p>
          <p>
            RateMyPlate lets people search U.S. license plates and post ratings
            and comments about driving experiences tied to those plates. Content
            is user-generated and may be incomplete, inaccurate, or unfair.
          </p>

          <p className="font-display text-2xl">
            <strong>Accounts and public anonymity</strong>
          </p>
          <p>
            Posting requires signing in with an OAuth provider (such as Google,
            GitHub, or Discord). Your account is linked to reviews for abuse
            prevention and moderation. Public plate pages do not display your
            name or profile as the author of a review. That is &quot;publicly
            anonymous,&quot; not invisible to RateMyPlate operators.
          </p>

          <p className="font-display text-2xl">
            <strong>Acceptable use</strong>
          </p>
          <p>You agree that you will not:</p>
          <ul className="list-disc list-inside pl-5">
            <li>Post content that doxes, threatens, or harasses anyone</li>
            <li>
              Knowingly post false statements intended to harm a person or
              business
            </li>
            <li>Attempt to scrape, spam, or disrupt the service</li>
            <li>
              Use the site for commercial solicitation without permission
            </li>
          </ul>

          <p className="font-display text-2xl">
            <strong>Your content</strong>
          </p>
          <p>
            You retain ownership of the reviews you post. You grant RateMyPlate
            a non-exclusive license to host, display, moderate, and remove that
            content as needed to operate the service. RateMyPlate does not
            pre-screen every comment and does not endorse user opinions.
          </p>

          <p className="font-display text-2xl">
            <strong>Moderation</strong>
          </p>
          <p>
            We may edit or remove content that violates these terms, applicable
            law, or community safety. We may suspend or restrict accounts that
            abuse the service. Report doxing or other harmful content to{' '}
            <a
              className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              href="mailto:ratemyplate@chrisstayte.com"
            >
              ratemyplate@chrisstayte.com
            </a>
            .
          </p>

          <p className="font-display text-2xl">
            <strong>Intellectual property</strong>
          </p>
          <p>
            Site design, branding, and original code remain the property of
            RateMyPlate and its licensors. You may not republish or redistribute
            site materials for commercial use without permission.
          </p>

          <p className="font-display text-2xl">
            <strong>Disclaimer</strong>
          </p>
          <p>
            The service is provided as-is, without warranties of any kind. To
            the fullest extent allowed by law, RateMyPlate is not liable for
            losses arising from user content, reliance on ratings, or
            availability of the site. Nothing in these terms limits liability
            that cannot be limited under applicable law.
          </p>

          <p className="font-display text-2xl">
            <strong>Changes</strong>
          </p>
          <p>
            We may update these terms from time to time. Continued use after
            changes are posted means you accept the updated terms. The date at
            the top of this page shows the latest revision.
          </p>

          <p className="font-display text-2xl">
            <strong>Contact</strong>
          </p>
          <p>
            Questions about these terms:{' '}
            <a
              className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              href="mailto:ratemyplate@chrisstayte.com"
            >
              ratemyplate@chrisstayte.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
