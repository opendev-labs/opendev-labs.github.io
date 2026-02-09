import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, Component } from 'react';
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
import AgentsLanding from './pages/AgentsLanding';
import Spoon from './pages/Spoon';
import Product from './pages/Product';
import Changelog from './pages/Changelog';
import OpenHub from './pages/OpenHub';
import { Preloader } from './components/Preloader';
import { DocsPage } from './features/void/components/pages/DocsPage';
import { MissionControl } from './pages/MissionControl';
import { UnifiedOfficeCockpit, LamaDBOfficeCockpit, SyncStackOfficeCockpit, LamaDBTelemetryCockpit, AgentsOfficeCockpit, BotsOfficeCockpit, SystemsOfficeCockpit } from './pages/OfficeSubappWrappers';
import { Header } from './components/Header';
import DiscordVerifyPage from './pages/DiscordVerifyPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSettings from './pages/ProfileSettings';
import UserProfilePage from './pages/UserProfilePage';
import TranscendersPage from './pages/TranscendersPage';

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

const VoidApp = lazyWithRetry(() => import('./features/void/VoidApp'));
const OfficeDashboard = lazyWithRetry(() => import('./pages/OfficeDashboard'));
const LazyAuthPage = lazyWithRetry(() => import('./features/void/components/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const LazyVerifyEmailPage = lazyWithRetry(() => import('./features/void/components/pages/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })));
const OpenStudioApp = lazyWithRetry(() => import('./features/void/components/pages/new/open-studio/App'));

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
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading open-studio...</div>}>
              <div className="flex flex-col h-screen overflow-hidden">
                <Header />
                <div className="flex-1 overflow-hidden mt-14">
                  <OpenStudioApp />
                </div>
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

          {/* Protected Product Hubs */}
          <Route path="open-hub" element={
            <ProtectedRoute>
              <OpenHub />
            </ProtectedRoute>
          } />
          <Route path="office" element={
            <ProtectedRoute>
              <OfficeDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<UnifiedOfficeCockpit />} />
            <Route path="void" element={<UnifiedOfficeCockpit />} />
            <Route path="lamadb" element={<LamaDBOfficeCockpit />} />
            <Route path="lamadb/console" element={<LamaDBOfficeCockpit />} />
            <Route path="lamadb/new" element={<LamaDBOfficeCockpit />} />
            <Route path="lamadb/telemetry" element={<LamaDBTelemetryCockpit />} />

            <Route path="syncstack" element={<SyncStack />} />
            <Route path="syncstack/console" element={<SyncStackOfficeCockpit />} />

            <Route path="agents" element={<AgentsOfficeCockpit />} />
            <Route path="bots" element={<BotsOfficeCockpit />} />
            <Route path="systems" element={<SystemsOfficeCockpit />} />
            <Route path="telemetry" element={<LamaDBTelemetryCockpit />} />
          </Route>

          <Route path="open-studio" element={
            <ProtectedRoute>
              <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading open-studio...</div>}>
                <div className="flex flex-col h-screen overflow-hidden">
                  <Header />
                  <div className="flex-1 overflow-hidden mt-14">
                    <OpenStudioApp />
                  </div>
                </div>
              </Suspense>
            </ProtectedRoute>
          } />

          {/* Unified Identity Protocol: Everything locked behind ProtectedRoute */}
          <Route path="lamadb" element={<ProtectedRoute><LamaDB /></ProtectedRoute>} />
          <Route path="syncstack" element={<ProtectedRoute><SyncStack /></ProtectedRoute>} />
          <Route path="void" element={<ProtectedRoute><VoidLanding /></ProtectedRoute>} />
          <Route path="q-cloud" element={<ProtectedRoute><QCloud /></ProtectedRoute>} />
          <Route path="spoon" element={<ProtectedRoute><Spoon /></ProtectedRoute>} />
          <Route path="agents" element={<ProtectedRoute><AgentsLanding /></ProtectedRoute>} />


          <Route path="user/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="user/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="users/:username" element={<UserProfilePage />} />
          <Route path="products/transcenders" element={<TranscendersPage />} />
          <Route path="settings/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

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
