import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

export default function Layout() {
  return (
    // We added a subtle gradient from your light blue to your light peach here!
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-light via-white to-secondary-light text-gray-800 font-sans">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}