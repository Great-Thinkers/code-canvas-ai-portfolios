import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded shadow p-8">
          <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
          <p className="mb-4">
            For support, email us at{" "}
            <a
              href="mailto:michaelndoh9@gmail.com"
              className="text-blue-600 underline"
            >
              michaelndoh9@gmail.com
            </a>
            .
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Email
              </label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                placeholder="How can we help you?"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded px-4 py-2 font-semibold"
              disabled
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
