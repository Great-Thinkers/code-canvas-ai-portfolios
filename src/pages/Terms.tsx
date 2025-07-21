import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <iframe
          src="/terms.html"
          title="Terms of Service"
          className="w-full max-w-3xl h-[80vh] border rounded shadow"
        >
          Your browser does not support iframes. You can view the terms at{" "}
          <a href="/terms.html">/terms.html</a>.
        </iframe>
      </main>
      <Footer />
    </div>
  );
}
