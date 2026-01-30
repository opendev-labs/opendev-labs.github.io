import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Placeholder from './pages/Placeholder';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import VoidLanding from './pages/VoidLanding';
import LamaDB from './pages/LamaDB';
import QCloud from './pages/QCloud';
import SyncStack from './pages/SyncStack';
import Changelog from './pages/Changelog';
import Spoon from './pages/Spoon';
import Product from './pages/Product';
import NexusDashboard from './pages/NexusDashboard';
import { Navigate } from 'react-router-dom';

const VoidApp = lazy(() => import('./features/void/VoidApp'));
const OfficeDashboard = lazy(() => import('./pages/OfficeDashboard').then(m => ({ default: m.OfficeDashboard })));
const LazyAuthPage = lazy(() => import('./features/void/components/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const LazyVerifyEmailPage = lazy(() => import('./features/void/components/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));

// Wrapper to handle scroll on route change
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="office/*" element={
          <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-bold uppercase tracking-[0.3em]">Opening Office...</div>}>
            <OfficeDashboard />
          </Suspense>
        } />
        <Route path="void/*" element={
          <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Void...</div>}>
            <VoidApp />
          </Suspense>
        } />
        <Route path="dashboard" element={<Navigate to="/office" replace />} />
        <Route path="auth" element={
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LazyAuthPage />
          </Suspense>
        } />
        <Route path="verify-email" element={
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LazyVerifyEmailPage />
          </Suspense>
        } />
        <Route path="*" element={<Placeholder title="404 - Not Found" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  )
}
