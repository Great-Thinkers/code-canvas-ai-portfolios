import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <div className="bg-brand-50 dark:bg-brand-950/30 py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">
            Ready to showcase your developer journey?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who use CodeCanvas to create
            professional portfolios that get noticed by recruiters and clients.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/signup">
              <Button size="lg" className="font-medium">
                Get started for free
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="font-medium">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
