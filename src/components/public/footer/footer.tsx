import BuyMeACoffeeButton from '@/components/public/buy-me-a-coffee-button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { isCurrentUserAdmin } from '@/auth';
import { LayoutDashboard } from 'lucide-react';

const Footer = async () => {
  const isAdmin = await isCurrentUserAdmin();

  return (
    <footer className="w-full border-t border-border bg-card/50">
      <div className="max-w-6xl w-full mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>RateMyPlate</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              See what others are saying about drivers. Share your own
              experiences. Stay anonymous.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/map"
                  className="hover:text-foreground transition-colors"
                >
                  Map
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="hover:text-foreground transition-colors"
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Connect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/chrisstayte/ratemyplate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/chrisstayte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  @ChrisStayte
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} RateMyPlate
          </p>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
            <BuyMeACoffeeButton className="" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
