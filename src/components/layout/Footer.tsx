import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-t-border/40 py-6 md:py-0">
      <div className="container flex flex-col md:h-16 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center py-6 md:py-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded bg-primary w-6 h-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 text-primary-foreground"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </div>
            <span className="font-display text-sm font-semibold">
              CodeCanvas
            </span>
          </Link>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeCanvas. All rights reserved.
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground md:items-center">
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
