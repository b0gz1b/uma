import { Outlet } from 'react-router-dom';
import Navigation from '@components/Navigation';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Quiz Master. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

