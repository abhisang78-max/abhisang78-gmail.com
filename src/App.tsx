/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AuthModal } from './components/AuthModal';
import { AIConciergeModal } from './components/AIConciergeModal';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { CustomerDashboardView } from './views/CustomerDashboardView';
import { PartnerPortalView } from './views/PartnerPortalView';
import { AdminPortalView } from './views/AdminPortalView';
import { LegalPageView } from './views/LegalPageView';

import { Sparkles, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setIsConciergeOpen, toastMessage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {currentView === 'account' && <CustomerDashboardView />}
        {currentView === 'partner' && <PartnerPortalView />}
        {currentView === 'admin' && <AdminPortalView />}
        {currentView === 'legal' && <LegalPageView />}
        {currentView === 'track' && <CustomerDashboardView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <TrackOrderModal />
      <AuthModal />
      <AIConciergeModal />

      {/* Floating AI Concierge Action Button */}
      <button
        onClick={() => setIsConciergeOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-stone-950 text-amber-300 hover:text-white hover:bg-stone-800 p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl border border-stone-800 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 cursor-pointer group"
        aria-label="Open AI Shopping Concierge"
      >
        <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          1689 AI Concierge
        </span>
      </button>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
