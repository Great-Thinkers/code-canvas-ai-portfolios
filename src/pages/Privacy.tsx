import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <iframe
          src="/privacy-policy.html"
          title="Privacy Policy"
          className="w-full max-w-3xl h-[80vh] border rounded shadow"
        >
          Your browser does not support iframes. You can view the privacy policy
          at <a href="/privacy-policy.html">/privacy-policy.html</a>.
        </iframe>
      </main>
      <Footer />
    </div>
  );
}
