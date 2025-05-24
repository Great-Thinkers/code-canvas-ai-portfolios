
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PricingSection from '@/components/home/PricingSection';

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-muted/50">
          <div className="container py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Start building your professional portfolio today. Upgrade anytime as your needs grow.
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <div className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-display font-semibold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I switch plans anytime?</h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">What happens to my portfolios if I downgrade?</h3>
              <p className="text-muted-foreground">Your portfolios remain active, but some premium features may be disabled. You'll always have access to export your data.</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground">Yes, we offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Can I use my own domain?</h3>
              <p className="text-muted-foreground">Custom domains are available for Pro and Enterprise plans. You can connect your domain through our deployment settings.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
