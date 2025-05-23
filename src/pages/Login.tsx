
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
