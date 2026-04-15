// Ascension Protocol: Genesis Synchronization 🚀 [Sovereign State]
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, Component } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Preloader } from './components/Preloader';
import { DocsPage } from './features/void/components/pages/DocsPage';
import { MissionControl } from './pages/MissionControl';
import { UnifiedOfficeCockpit, LamaDBOfficeCockpit, SyncStackOfficeCockpit, LamaDBTelemetryCockpit, AgentsOfficeCockpit, BotsOfficeCockpit, SystemsOfficeCockpit } from './pages/OfficeSubappWrappers';
import { Header } from './components/Header';
import DiscordVerifyPage from './pages/DiscordVerifyPage';
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
import AgentsLanding from './pages/AgentsLanding';
import Spoon from './pages/Spoon';
import Product from './pages/Product';
import Changelog from './pages/Changelog';
const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.localStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return { default: () => null }; // Return dummy while reloading
      }
      throw error;
    }
  });

const OpenHub = lazyWithRetry(() => import('./pages/OpenHub'));
const ProfilePage = lazyWithRetry(() => import('./pages/ProfilePage'));
const ProfileSettings = lazyWithRetry(() => import('./pages/ProfileSettings'));

const VoidApp = lazyWithRetry(() => import('./features/void/VoidApp'));
const OfficeDashboard = lazyWithRetry(() => import('./pages/OfficeDashboard'));
const LazyAuthPage = lazyWithRetry(() => import('./features/void/components/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const LazyVerifyEmailPage = lazyWithRetry(() => import('./features/void/components/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const OpenStudioApp = lazyWithRetry(() => import('./features/studio/App'));
const PreviewPage = lazyWithRetry(() => import('./pages/PreviewPage'));

import { ProtectedRoute } from './components/ProtectedRoute';

// Wrapper to handle scroll on route change
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Standalone Applications & Pages (No Shared Layout) */}
        {/* open-studio: Hyper-intelligent Agentic IDE */}
        <Route path="open-studio/*" element={
          <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Materializing Neural Mesh...</div>}>
              <div className="h-screen bg-black overflow-hidden flex flex-col">
                <main className="flex-1 overflow-hidden">
                  <OpenStudioApp />
                </main>
              </div>
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="studio/*" element={<Navigate to="/open-studio" replace />} />
        <Route path="sub0/*" element={<Navigate to="/open-studio" replace />} />
        <Route path="void-ide/*" element={<Navigate to="/open-studio" replace />} />
        <Route path="auth" element={
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <LazyAuthPage />
          </Suspense>
        } />
        <Route path="verify-user" element={
          <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <DiscordVerifyPage />
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

          {/* Primary Unified Products */}
          <Route path="open-hub" element={
            <ProtectedRoute>
              <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white italic tracking-widest">Opening Workspace...</div>}>
                <OpenHub />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* User & Identity */}
          <Route path="user/profile" element={
            <ProtectedRoute>
              <Suspense fallback={null}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="user/:username" element={
            <ProtectedRoute>
              <Suspense fallback={null}>
                <ProfilePage />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="settings/profile" element={
            <ProtectedRoute>
              <Suspense fallback={null}>
                <ProfileSettings />
              </Suspense>
            </ProtectedRoute>
          } />

          {/* Informational */}
          <Route path="changelog" element={<Changelog />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="preview" element={
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Loading Preview...</div>}>
              <PreviewPage />
            </Suspense>
          } />

          {/* Legacy & Internal Redirections (Collapse into Studio) */}
          <Route path="office/*" element={<Navigate to="/open-studio" replace />} />
          <Route path="void" element={<Navigate to="/open-studio" replace />} />
          <Route path="lamadb" element={<Navigate to="/open-studio" replace />} />
          <Route path="syncstack" element={<Navigate to="/open-studio" replace />} />
          <Route path="q-cloud" element={<Navigate to="/open-studio" replace />} />
          <Route path="spoon" element={<Navigate to="/open-studio" replace />} />
          <Route path="agents" element={<Navigate to="/open-studio" replace />} />
          <Route path="products" element={<Navigate to="/open-hub" replace />} />
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
