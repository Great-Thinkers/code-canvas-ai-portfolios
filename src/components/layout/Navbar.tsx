import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded bg-primary w-8 h-8 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-primary-foreground"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </div>
            <span className="font-display text-lg font-semibold">
              CodeCanvas
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/features"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            to="/templates"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Templates
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign up</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-transform",
              isMenuOpen ? "rotate-90" : "",
            )}
          >
            {isMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/features"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Features
              </Link>
              <Link
                to="/templates"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Templates
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-foreground/80 hover:text-foreground"
              >
                Dashboard
              </Link>
              <div className="flex items-center py-2">
                <ThemeToggle />
              </div>
              <div className="flex flex-col pt-2 space-y-2">
                <Link to="/login" className="w-full">
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="w-full">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
