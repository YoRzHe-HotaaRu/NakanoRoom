'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has seen welcome screen (client-side only)
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome') === 'true';
    setShowWelcome(!hasSeenWelcome);
    setIsLoading(false);
  }, []);

  const handleEnter = () => {
    setShowWelcome(false);
  };

  // Show nothing while checking localStorage (prevents flash)
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-sakura-400 text-xl animate-pulse">🌸</div>
      </div>
    );
  }

  // Show welcome screen for first-time visitors
  if (showWelcome) {
    return <WelcomeScreen onEnter={handleEnter} />;
  }

  // Show main app
  return <MainLayout />;
}

