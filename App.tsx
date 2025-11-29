import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { UpgradePage } from './components/UpgradePage';
import { ThankYouPage } from './components/ThankYouPage';
import { ThankYouPage2 } from './components/ThankYouPage2';
import { LegalPage } from './components/LegalPage';
import { FacePage } from './components/FacePage';
import { supabase } from './lib/supabase';
import { metaService } from './services/metaService';

// Scroll to Top Component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track PageView with CAPI support
    metaService.trackEvent({ eventName: 'PageView' });

    // Track ViewContent for specific pages
    if (pathname === '/' || pathname === '/dashboard') {
         metaService.trackEvent({
            eventName: 'ViewContent',
            contentName: pathname === '/' ? 'Landing Page' : 'Dashboard',
        });
    }
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement; user: any }> = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Landing Page Component
const LandingPage: React.FC<{ onAction: () => void; user: any }> = ({ onAction, user }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans overflow-x-hidden relative">
      {/* Global Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10">
        <Header onAction={onAction} user={user} />

        <main className="container mx-auto px-4 md:px-8 max-w-7xl">
          <Hero onAction={onAction} user={user} />
          <HowItWorks />
          <Testimonials />
          <FAQ />
        </main>

        <Footer />
      </div>
    </div>
  );
};

// Main App Router Component
const AppRouter: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        // Clear invalid session
        supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoadingSession(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/');
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Check URL parameters for payment success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      // Navigate to Thank You page with state to verify origin
      navigate('/thankyou', { state: { purchaseCompleted: true }, replace: true });
    }
  }, [navigate]);

  const handleMainAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage onAction={handleMainAction} user={user} />} />

        {/* Auth Page */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onBack={() => navigate('/')} onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} onUpgradeClick={() => navigate('/upgrade')} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upgrade"
          element={
            <ProtectedRoute user={user}>
              <UpgradePage onBack={() => navigate('/dashboard')} user={user} />
            </ProtectedRoute>
          }
        />

        {/* Thank You Page (accessible to anyone) */}
        <Route
          path="/thankyou"
          element={<ThankYouPage onGoToDashboard={() => navigate('/dashboard')} />}
        />

        {/* Thank You Page 2 - For Face page purchases */}
        <Route
          path="/thankyou2"
          element={<ThankYouPage2 />}
        />

        {/* Legal Pages */}
        <Route
          path="/privacy"
          element={<LegalPage type="privacy" onBack={() => navigate('/')} />}
        />
        <Route
          path="/terms"
          element={<LegalPage type="terms" onBack={() => navigate('/')} />}
        />

        {/* Face Page - Landing without login */}
        <Route
          path="/face"
          element={<FacePage />}
        />

        {/* Redirect any unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;