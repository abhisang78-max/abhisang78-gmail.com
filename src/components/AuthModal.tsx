import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, User as UserIcon, Mail, Phone, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { INITIAL_USERS } from '../data/initialData';
import { User } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    loginUser, 
    showToast,
    setCurrentView
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter email and password.');
      return;
    }

    // Match with existing demo users or create session
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      loginUser(matched);
      if (matched.role === 'admin') setCurrentView('admin');
      else if (matched.role === 'partner') setCurrentView('partner');
      else setCurrentView('account');
    } else {
      // Register custom customer
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        phone: phone || '+91 98000 00000',
        role: 'customer',
        addresses: []
      };
      loginUser(newUser);
      setCurrentView('account');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill all required fields.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || '+91 98000 00000',
      role: 'customer',
      addresses: []
    };
    loginUser(newUser);
    setCurrentView('account');
  };

  const handleQuickLogin = (role: 'admin' | 'partner' | 'customer') => {
    const user = INITIAL_USERS.find(u => u.role === role);
    if (user) {
      loginUser(user);
      if (role === 'admin') setCurrentView('admin');
      else if (role === 'partner') setCurrentView('partner');
      else setCurrentView('account');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="font-serif font-bold text-base text-stone-950 tracking-tight">
              DODO IMPEX <span className="font-sans text-xs text-amber-700 tracking-widest font-normal">PORTAL</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {authModalMode === 'login' ? 'Access your account & tracked orders' : 'Create an exclusive customer profile'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-stone-500 hover:text-stone-950 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Close authentication"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-stone-200 text-xs font-semibold">
          <button
            onClick={() => { setAuthModalMode('login'); setForgotPasswordSent(false); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalMode === 'login'
                ? 'border-stone-900 text-stone-950 bg-stone-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthModalMode('register'); setForgotPasswordSent(false); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              authModalMode === 'register'
                ? 'border-stone-900 text-stone-950 bg-stone-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Form */}
          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordSent(true);
                      showToast('Password recovery instructions sent to registered email.');
                    }}
                    className="text-[11px] text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {forgotPasswordSent && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800">
                  Password reset link has been dispatched to your email address.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Authorize & Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Mehta"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Number (+91)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Switcher Strip */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>1-Click Verified Role Switcher:</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="p-2 text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-xs transition-colors cursor-pointer"
              >
                <div className="font-semibold text-stone-900 text-[11px]">Customer</div>
                <div className="text-[10px] text-stone-500 truncate">Aarav Mehta</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('partner')}
                className="p-2 text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-xs transition-colors cursor-pointer"
              >
                <div className="font-semibold text-stone-900 text-[11px]">Partner</div>
                <div className="text-[10px] text-stone-500 truncate">Rajesh Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 text-left bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 rounded text-xs transition-colors cursor-pointer"
              >
                <div className="font-semibold text-amber-900 text-[11px]">Admin</div>
                <div className="text-[10px] text-amber-700 truncate">Full Access</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
