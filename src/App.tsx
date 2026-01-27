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

const VoidApp = lazy(() => import('./features/void/VoidApp'));
const LazyLoginPage = lazy(() => import('./features/void/components/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const LazySignUpPage = lazy(() => import('./features/void/components/pages/SignUpPage').then(m => ({ default: m.SignUpPage })));

// Wrapper to handle scroll on route change
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/ide/*" element={
          <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Void...</div>}>
            <VoidApp />
          </Suspense>
        } />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="void" element={<VoidLanding />} />
          <Route path="lamadb" element={<LamaDB />} />
          <Route path="q-cloud" element={<QCloud />} />
          <Route path="syncstack" element={<SyncStack />} />
          <Route path="solutions" element={<Placeholder title="Solutions" />} />
          <Route path="resources" element={<Placeholder title="Resources" />} />
          <Route path="enterprise" element={<Placeholder title="Enterprise" />} />
          <Route path="pricing" element={<Placeholder title="Pricing" />} />
          <Route path="contact" element={<Contact />} />

          <Route path="login" element={
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
              <LazyLoginPage />
            </Suspense>
          } />
          <Route path="signup" element={
            <Suspense fallback={<div className="min-h-screen bg-black" />}>
              <LazySignUpPage />
            </Suspense>
          } />
          <Route path="dashboard" element={<Placeholder title="User Dashboard" />} />

          <Route path="*" element={<Placeholder title="404 - Not Found" />} />
        </Route>
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
