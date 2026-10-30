import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingBag, User as UserIcon, Heart, Menu, X, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    openLegalPage, 
    cartCount, 
    setIsCartOpen, 
    wishlist, 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    setIsTrackingModalOpen,
    setSelectedCategory
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { setSearchQuery } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setCurrentView('shop');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' as const },
    { label: 'Shop', view: 'shop' as const, action: () => { setSelectedCategory('all'); setCurrentView('shop'); } },
    { label: 'Categories', view: 'shop' as const, action: () => { setCurrentView('shop'); } },
    { label: 'About Us', view: 'legal' as const, action: () => openLegalPage('about') },
    { label: 'Track Order', view: 'track' as const, action: () => setIsTrackingModalOpen(true) },
    { label: 'Contact', view: 'legal' as const, action: () => openLegalPage('contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <button
            onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-xl md:text-2xl font-serif font-bold tracking-tight text-stone-950 uppercase hover:text-stone-800 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            DODO IMPEX <span className="font-sans font-light tracking-widest text-amber-600 text-sm md:text-base ml-1">1689</span>
          </button>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action ? link.action : () => setCurrentView(link.view)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer hover:text-stone-950 relative py-1 ${
                  currentView === link.view ? 'text-stone-950 font-semibold' : 'text-stone-600'
                }`}
              >
                {link.label}
                {currentView === link.view && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Functional Interactive Actions */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Search Catalog"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                setCurrentView('shop');
              }}
              className="relative p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors hidden sm:flex cursor-pointer"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-md transition-colors cursor-pointer text-xs md:text-sm font-medium whitespace-nowrap shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-stone-950 text-xs font-bold px-1.5 py-0.2 rounded-full min-w-5 text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / User Portal */}
            <button
              onClick={() => {
                if (currentUser) {
                  if (currentUser.role === 'admin') setCurrentView('admin');
                  else if (currentUser.role === 'partner') setCurrentView('partner');
                  else setCurrentView('account');
                } else {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }
              }}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
              title={currentUser ? `${currentUser.name} (${currentUser.role})` : 'Sign In'}
              aria-label="Account"
            >
              <UserIcon className="w-5 h-5" />
              {currentUser && (
                <span className="hidden xl:inline text-xs font-semibold text-stone-900 max-w-28 truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="py-3 px-1 border-t border-stone-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search headphones, luxury chronographs, executive leather, lamps..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-11 pr-24 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 px-3 py-1 bg-stone-900 text-white text-xs font-medium rounded hover:bg-stone-800 cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.action) link.action();
                  else setCurrentView(link.view);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-base font-medium py-2 border-b border-stone-100 ${
                  currentView === link.view ? 'text-amber-700 font-bold' : 'text-stone-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsTrackingModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm font-medium rounded-md text-center cursor-pointer"
            >
              Track Your Shipment
            </button>
            <button
              onClick={() => {
                if (currentUser) {
                  setCurrentView(currentUser.role === 'admin' ? 'admin' : currentUser.role === 'partner' ? 'partner' : 'account');
                } else {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-md text-center cursor-pointer"
            >
              {currentUser ? `Signed in as ${currentUser.name}` : 'Customer Sign In'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
