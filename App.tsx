import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { UpgradePage } from './components/UpgradePage';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  // Views: 'landing' | 'auth' | 'dashboard' | 'upgrade'
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'upgrade'>('landing');
  const [user, setUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingSession(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // If user logs out, ensure we go back to landing
      if (!session?.user) {
        setCurrentView('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMainAction = () => {
    // If user is logged in, they are already on dashboard (handled by render logic below)
    // If not logged in, go to auth page
    if (!user) {
      setCurrentView('auth');
      window.scrollTo(0, 0);
    }
  };

  const handleLoginSuccess = () => {
    // Auth state listener will catch the user update and re-render showing Dashboard
    // We just ensure view state is clean
    setCurrentView('landing');
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Authenticated User -> Dashboard or Upgrade Page
  if (user) {
    if (currentView === 'upgrade') {
      return <UpgradePage onBack={() => setCurrentView('landing')} />;
    }
    return <Dashboard user={user} onUpgradeClick={() => setCurrentView('upgrade')} />;
  }

  // 2. Authentication Page
  if (currentView === 'auth') {
    return <AuthPage onBack={() => setCurrentView('landing')} onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. Landing Page (Default)
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200 font-sans overflow-x-hidden relative">
      {/* Global Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10">
        <Header onAction={handleMainAction} user={user} />

        <main className="container mx-auto px-4 md:px-8 max-w-7xl">
          <Hero onAction={handleMainAction} user={user} />
          <HowItWorks />
          <Testimonials />
          <FAQ />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;