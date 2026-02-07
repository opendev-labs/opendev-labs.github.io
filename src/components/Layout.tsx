import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col">
      <Header />
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
      {isHomePage && <Footer />}
    </div>
  );
}
