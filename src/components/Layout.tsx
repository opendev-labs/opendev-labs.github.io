import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <Header />
      <main className="pt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
