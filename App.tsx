import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { supabase } from './lib/supabase';
import { metaService } from './services/metaService';

// Lazy load below-the-fold and route components for better LCP
const HowItWorks = lazy(() => import('./components/HowItWorks').then(m => ({ default: m.HowItWorks })));
const Testimonials = lazy(() => import('./components/Testimonials').then(m => ({ default: m.Testimonials })));
const FAQ = lazy(() => import('./components/FAQ').then(m => ({ default: m.FAQ })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const AuthPage = lazy(() => import('./components/AuthPage').then(m => ({ default: m.AuthPage })));
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const UpgradePage = lazy(() => import('./components/UpgradePage').then(m => ({ default: m.UpgradePage })));
const ThankYouPage = lazy(() => import('./components/ThankYouPage').then(m => ({ default: m.ThankYouPage })));
const ThankYouPage2 = lazy(() => import('./components/ThankYouPage2').then(m => ({ default: m.ThankYouPage2 })));
const LegalPage = lazy(() => import('./components/LegalPage').then(m => ({ default: m.LegalPage })));
const FacePage = lazy(() => import('./components/FacePage').then(m => ({ default: m.FacePage })));
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton').then(m => ({ default: m.WhatsAppButton })));

// Lazy load SEO pages
const PuxarAssuntoPage = lazy(() => import('./components/seo/PuxarAssuntoPage').then(m => ({ default: m.PuxarAssuntoPage })));
const FlertePage = lazy(() => import('./components/seo/FlertePage').then(m => ({ default: m.FlertePage })));
const ConversasPage = lazy(() => import('./components/seo/ConversasPage').then(m => ({ default: m.ConversasPage })));
const BlogIndexPage = lazy(() => import('./components/seo/BlogIndexPage').then(m => ({ default: m.BlogIndexPage })));
const CantadasPage = lazy(() => import('./components/seo/CantadasPage').then(m => ({ default: m.CantadasPage })));
const TinderDicasPage = lazy(() => import('./components/seo/TinderDicasPage').then(m => ({ default: m.TinderDicasPage })));
const RespostasWhatsAppPage = lazy(() => import('./components/seo/RespostasWhatsAppPage').then(m => ({ default: m.RespostasWhatsAppPage })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
    <div className="min-h-screen bg-[#080808] text-white selection:bg-rose-500/30 selection:text-rose-200 font-sans overflow-x-hidden relative">
      {/* Background Light Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-red-900/10 via-red-900/5 to-transparent pointer-events-none z-0" />
      <div className="fixed top-1/4 right-[-10%] w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 left-[-10%] w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="relative z-10">
        <Header onAction={onAction} user={user} />

        <main className="container mx-auto px-4 md:px-8 max-w-7xl">
          <Hero onAction={onAction} user={user} />
          <Suspense fallback={<LoadingFallback />}>
            <HowItWorks />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <Testimonials onAction={onAction} />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <FAQ />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
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
    // Initialize Meta fbc parameter capture (captures fbclid from URL)
    metaService.initializeFbc();
    
    // Pre-fetch client IP for Meta CAPI (preferably IPv6)
    metaService.getClientIp();
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Session error:', error);
        // Clear invalid session
        supabase.auth.signOut();
        setUser(null);
        metaService.clearUserData();
      } else {
        setUser(session?.user ?? null);
        // Persist user data for Meta CAPI (improves event matching quality)
        if (session?.user) {
          metaService.setUserData(session.user.email, session.user.id);
        }
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
        // Update stored user data
        if (session?.user) {
          metaService.setUserData(session.user.email, session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        metaService.clearUserData();
        navigate('/');
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        // Persist user data for Meta CAPI
        if (session?.user) {
          metaService.setUserData(session.user.email, session.user.id);
        }
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
      <Suspense fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
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

        {/* SEO Blog Pages */}
        <Route
          path="/blog"
          element={<BlogIndexPage onBack={() => navigate('/')} onAction={handleMainAction} />}
        />
        <Route
          path="/blog/puxar-assunto"
          element={<PuxarAssuntoPage onBack={() => navigate('/blog')} onAction={handleMainAction} />}
        />
        <Route
          path="/blog/flerte"
          element={<FlertePage onBack={() => navigate('/blog')} onAction={handleMainAction} />}
        />
        <Route
          path="/blog/conversas"
          element={<ConversasPage onBack={() => navigate('/blog')} onAction={handleMainAction} />}
        />
        <Route
          path="/blog/cantadas"
          element={<CantadasPage onBack={() => navigate('/blog')} onAction={handleMainAction} />}
        />
        <Route
          path="/blog/tinder-dicas"
          element={<TinderDicasPage onBack={() => navigate('/blog')} onAction={handleMainAction} />}
        />
        <Route
          path="/blog/respostas-whatsapp"
          element={<RespostasWhatsAppPage onBack={() => navigate('/blog')} onAction={handleMainAction} />}
        />

        {/* Redirect any unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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