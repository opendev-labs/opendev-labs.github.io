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
const LazyAuthPage = lazy(() => import('./features/void/components/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const LazyVerifyEmailPage = lazy(() => import('./features/void/components/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));

// Wrapper to handle scroll on route change
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/void/*" element={
          <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Void...</div>}>
            <VoidApp />
          </Suspense>
        } />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="overview/void" element={<VoidLanding />} />
          <Route path="overview/lamadb" element={<LamaDB />} />
          <Route path="lamadb" element={
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading LamaDB...</div>}>
              {/* For now, LamaDB can use its landing page at the root route or we can point to a dashboard */}
              <LamaDB />
            </Suspense>
          } />
          <Route path="q-cloud" element={<QCloud />} />
          <Route path="syncstack" element={<SyncStack />} />
          <Route path="engine" element={<Product />} />
          <Route path="quantum" element={<Placeholder title="Project Quantum" />} />
          <Route path="transcender" element={<Placeholder title="Transcender" />} />
          <Route path="co-writer" element={<Placeholder title="Co-Writer" />} />
          <Route path="agentbash" element={<Placeholder title="AgentBash" />} />
          <Route path="spoon" element={<Spoon />} />
          <Route path="product" element={
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Product Engine...</div>}>
              <VoidApp />
            </Suspense>
          } />
          <Route path="spoon/auth" element={<Navigate to="/auth" replace />} />
          <Route path="cli" element={<Placeholder title="Spoon-CLI" />} />
          <Route path="solutions" element={<Placeholder title="Solutions" />} />
          <Route path="resources" element={<Placeholder title="Resources" />} />
          <Route path="enterprise" element={<Placeholder title="Enterprise" />} />
          <Route path="pricing" element={<Placeholder title="Pricing" />} />
          <Route path="contact" element={<Contact />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="dashboard" element={<NexusDashboard />} />
          <Route path="*" element={<Placeholder title="404 - Not Found" />} />
        </Route>

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
