import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, RefreshCw, Lock, Sparkles, Building2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, openLegalPage, setAuthModalMode, setIsAuthModalOpen, currentUser } = useApp();

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-sm">
      {/* Trust Commitments Strip */}
      <div className="border-b border-stone-800/80 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">100% Genuine Direct Import</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Direct-from-factory international sourcing with strict batch quality inspection.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Pan-India Express Dispatch</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Complimentary delivery on orders above ₹999 via BlueDart & Delhivery partners.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-amber-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">7-Day Replacement Guarantee</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Transparent hassle-free returns for verified manufacturing issues.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-stone-900 border border-stone-800 rounded-lg text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Encrypted India Checkout</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">UPI (GPay/PhonePe), RuPay, Visa, Mastercard & Verified Cash on Delivery.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-xl font-serif font-bold text-white tracking-wide">
              DODO IMPEX <span className="font-sans text-amber-500 font-light text-sm ml-1 tracking-widest">1689</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An India-first, modern international e-commerce ecosystem. Sourcing curated electronics accessories, horology, executive leather, and sculptural home goods directly from global manufacturing hubs without unnecessary middleman markups.
            </p>
            <div className="text-xs text-stone-500 space-y-1 pt-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Corporate Hub: Connaught Place, New Delhi 110001, India</span>
              </div>
              <div>Direct Inquiries: care@dodoimpex.in · +91 (011) 4982-1689</div>
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Collections</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Audio & Electronics
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Heritage Chronographs
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Executive Leather Gear
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Sculptural Living & Desk
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shop')} className="hover:text-white transition-colors cursor-pointer">
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Customer Care</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openLegalPage('shipping')} className="hover:text-white transition-colors cursor-pointer">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => openLegalPage('returns')} className="hover:text-white transition-colors cursor-pointer">
                  7-Day Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => openLegalPage('cancellation')} className="hover:text-white transition-colors cursor-pointer">
                  Order Cancellation
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('account')} className="hover:text-white transition-colors cursor-pointer">
                  Track My Consignment
                </button>
              </li>
              <li>
                <button onClick={() => openLegalPage('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Support & Helpdesk
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-200">Legal & Governance</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => openLegalPage('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => openLegalPage('terms')} className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => openLegalPage('partner-terms')} className="hover:text-white transition-colors cursor-pointer">
                  Partner Affiliate Terms
                </button>
              </li>
              <li>
                <button onClick={() => openLegalPage('about')} className="hover:text-white transition-colors cursor-pointer">
                  About DODO IMPEX 1689
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Portals */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 DODO IMPEX 1689 Global Trade Solutions. All rights reserved. Prices inclusive of applicable GST in India (INR ₹).
          </div>

          {/* Discreet Portals Access */}
          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => {
                if (currentUser && currentUser.role === 'partner') {
                  setCurrentView('partner');
                } else {
                  setCurrentView('partner');
                }
              }}
              className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Authorised Partner Portal
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setCurrentView('admin');
              }}
              className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Admin Management Console
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
