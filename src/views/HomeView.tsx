import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Globe2, 
  Award, 
  CheckCircle, 
  Sparkles,
  Search
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory, openLegalPage, setIsConciergeOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new'>('featured');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const displayedProducts = products.filter(p => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'bestsellers') return p.isBestSeller;
    if (activeTab === 'new') return p.isNewArrival;
    return true;
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. STOREFRONT HERO SECTION */}
      <section className="relative bg-stone-950 text-white overflow-hidden border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
                <Globe2 className="w-4 h-4" />
                <span>Direct Import · Curated Global Living · Indian Currency</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-stone-50 leading-[1.15]" style={{ textWrap: 'balance' }}>
                Curated Global Precision. <br />
                <span className="text-stone-300 font-normal italic">Engineered for Indian Living.</span>
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                DODO IMPEX 1689 bypasses multi-tier importer markups. We source studio audio, heritage horology, full-grain commuter leather, and architectural ambient desk pieces directly from certified international manufacturing hubs.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentView('shop');
                  }}
                  className="px-6 py-3.5 bg-white text-stone-950 hover:bg-stone-200 text-xs sm:text-sm font-semibold rounded-md shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Direct Catalog</span>
                  <ArrowRight className="w-4 h-4 text-stone-900" />
                </button>

                <button
                  onClick={() => openLegalPage('about')}
                  className="px-6 py-3.5 border border-stone-700 hover:border-stone-500 text-stone-200 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer"
                >
                  Our Sourcing Model
                </button>
              </div>

              {/* Trust Indicators (Quiet metadata with bullets) */}
              <div className="pt-6 border-t border-stone-800/80 flex flex-wrap items-center gap-4 text-xs text-stone-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  <span>Pan-India Tracked BlueDart / Delhivery</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  <span>Free Shipping on Orders &gt; ₹999</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  <span>7-Day Replacement Guarantee</span>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-stone-800/90 shadow-2xl bg-stone-900">
                <img
                  src="/src/assets/images/hero_luxury_trade_1793356339228.jpg"
                  alt="DODO IMPEX 1689 Curated Luxury Still Life"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover aspect-4/3 sm:aspect-16/10"
                />
                
                {/* Floating Capsule with Genuine Product Link */}
                <div className="absolute bottom-4 left-4 right-4 bg-stone-950/85 backdrop-blur-md border border-stone-800 p-3.5 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                      Flagship Horology Piece
                    </div>
                    <div className="text-xs font-serif font-bold text-white">
                      Chronographe 1689 Heritage Dual-Tone
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const watch = products.find(p => p.sku === 'DD-WAT-1689');
                      if (watch) {
                        useApp().setSelectedProduct(watch);
                      } else {
                        setCurrentView('shop');
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition-colors cursor-pointer"
                  >
                    View ₹6,499
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SPOTLIGHT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'electronics', label: 'Audio & Tech Accessories', count: 'Active ANC & MagSafe', img: '/src/assets/images/product_tech_anc_headphones_1793356340445.jpg' },
            { id: 'fashion', label: 'Horology & Leather Gear', count: 'Chronographs & Packs', img: '/src/assets/images/product_executive_chronograph_1793356342068.jpg' },
            { id: 'desk', label: 'Sculptural Desk Living', count: 'Brass & Valet Trays', img: '/src/assets/images/product_smart_ambient_lamp_1793356342312.jpg' },
            { id: 'lifestyle', label: 'Executive Travel Gear', count: 'Commuter Essentials', img: '/src/assets/images/product_leather_commuter_backpack_1793356342409.jpg' },
          ].map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentView('shop');
              }}
              className="group relative rounded-lg overflow-hidden border border-stone-200 bg-stone-900 aspect-4/3 cursor-pointer"
            >
              <img
                src={cat.img}
                alt={cat.label}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">{cat.count}</span>
                <h3 className="font-serif font-bold text-white text-sm sm:text-base leading-snug group-hover:text-amber-200 transition-colors">
                  {cat.label}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED PRODUCT COLLECTION WITH FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="text-xs uppercase font-semibold tracking-wider text-amber-800">
              Direct Global Sourcing
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
              Curated Catalog Collections
            </h2>
          </div>

          {/* Interactive Filter Tabs (functional segmented buttons) */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'featured' ? 'bg-white text-stone-950 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Featured Curation
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'bestsellers' ? 'bg-white text-stone-950 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'new' ? 'bg-white text-stone-950 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Cards Grid (3 columns desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentView('shop');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 hover:border-stone-900 text-stone-900 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer"
          >
            <span>View Full Catalog & Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. "THE 1689 STANDARD" (WHY DODO IMPEX 1689) */}
      <section className="bg-stone-100 border-y border-stone-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-semibold tracking-widest text-amber-800">
              The 1689 Standard
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950">
              Why Discerning Indian Shoppers Choose DODO IMPEX
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We operate an honest, direct-import supply chain designed to give Indian consumers international luxury craftsmanship at uninflated factory-direct prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-base">
                01
              </div>
              <h3 className="font-serif font-bold text-stone-950 text-base">Direct Global Sourcing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                By ordering directly from specialized international manufacturing lines, we remove multi-layered clearing agents, sub-distributors, and traditional retail overhead.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-base">
                02
              </div>
              <h3 className="font-serif font-bold text-stone-950 text-base">4-Stage Batch Quality Audit</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every consignment arriving at our central Delhi fulfillment hub undergoes cosmetic inspection, electronic telemetry verification, and stress testing before packaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-base">
                03
              </div>
              <h3 className="font-serif font-bold text-stone-950 text-base">Pan-India Express Logistics</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Seamless real-time tracking via BlueDart Air and Delhivery Surface Express. Transparent dispatch milestones and SMS updates to every Indian pincode.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. VERIFIED CLIENT REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
              Verified Client Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
              Words from Discerning Buyers
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            All reviews verified through delivered consignment tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: 'Vikram Sengupta',
              role: 'Design Director',
              city: 'Bengaluru, Karnataka',
              product: 'Aetheris Horizon ANC Headphones',
              quote: 'The acoustic staging and titanium finish rival headphones retailing for thrice the price. Arrived in Bengaluru in 3 business days, double-boxed with factory seal.'
            },
            {
              author: 'Dr. Ananya Roy',
              role: 'Consulting Cardiologist',
              city: 'South Extension, New Delhi',
              product: 'Chronographe 1689 Heritage Watch',
              quote: 'The sapphire crystal AR coating and weight of the 316L steel case are immaculate. An understated luxury piece that easily passes for a high-end Swiss chronograph.'
            },
            {
              author: 'Kabir Varma',
              role: 'Technology Founder',
              city: 'Bandra West, Mumbai',
              product: 'Sovereign Leather Backpack & Desk Tray',
              quote: 'Exceptional full-grain leather that has already developed a subtle patina. The dedicated 16-inch laptop pocket is armored properly for frequent flight travel.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {'★'.repeat(5)}
              </div>
              <blockquote className="text-xs text-stone-700 leading-relaxed italic">
                "{item.quote}"
              </blockquote>
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-950">{item.author}</div>
                  <div className="text-[11px] text-stone-500">{item.role} · {item.city}</div>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CONCIERGE ASSISTANCE CALLOUT & NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-2xl p-8 sm:p-12 border border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>DODO IMPEX Private Client Desk</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-50">
              Need Personal Recommendations or Corporate Gifting?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg">
              Our AI Shopping Concierge is trained on every technical spec, Indian transit route, and custom corporate bulk order quotation.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsConciergeOpen(true)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Launch Digital Concierge</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-stone-950/80 p-6 rounded-xl border border-stone-800 space-y-3">
            <h4 className="text-sm font-semibold text-stone-100">Private Client Dispatch</h4>
            <p className="text-xs text-stone-400">
              Subscribe to receive new direct import arrivals and receive coupon <strong>WELCOME10</strong> (10% off your inaugural order).
            </p>
            {newsletterSubscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Privilege confirmed. Use code <strong>WELCOME10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter executive email..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-md px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-white text-stone-950 hover:bg-stone-200 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  Join Private Client Access
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
