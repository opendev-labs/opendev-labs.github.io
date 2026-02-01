import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Placeholder from './pages/Placeholder';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './features/void/contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import VoidLanding from './pages/VoidLanding';
import LamaDB from './pages/LamaDB';
import QCloud from './pages/QCloud';
import SyncStack from './pages/SyncStack';
import Changelog from './pages/Changelog';
import Spoon from './pages/Spoon';
import Product from './pages/Product';
import NexusDashboard from './pages/NexusDashboard';
import { Preloader } from './components/Preloader';
import { DocsPage } from './features/void/components/pages/DocsPage';
import { MissionControl } from './pages/MissionControl';
import { VoidOfficeCockpit, LamaDBOfficeCockpit } from './pages/OfficeSubappWrappers';

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
        {/* Standalone Applications & Pages (No Shared Layout) */}
        <Route path="void/*" element={
          <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Void...</div>}>
            <VoidApp />
          </Suspense>
        } />
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

        {/* Main Website (Shared Layout) */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="office" element={
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-bold uppercase tracking-[0.3em]">Opening Office...</div>}>
              <OfficeDashboard />
            </Suspense>
          }>
            <Route index element={<MissionControl />} />
            <Route path="syncstack" element={<SyncStack />} />
            <Route path="void" element={<VoidOfficeCockpit />} />
            <Route path="lamadb" element={<LamaDBOfficeCockpit />} />
          </Route>
          <Route path="dashboard" element={<Navigate to="/office" replace />} />

          {/* Product Pages */}
          <Route path="lamadb" element={<LamaDB />} />
          <Route path="q-cloud" element={<QCloud />} />
          <Route path="syncstack" element={<Navigate to="/office/syncstack" replace />} />
          <Route path="spoon" element={<Spoon />} />
          <Route path="products" element={<Products />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="product/:slug" element={<Product />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Preloader />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  )
}
