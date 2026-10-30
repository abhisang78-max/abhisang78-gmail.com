import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Heart, ShieldCheck, Truck, RefreshCw, Star, Check, ArrowRight } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, wishlist, toggleWishlist, setIsCheckoutOpen } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  if (!selectedProduct) return null;

  // Set default variants if not yet chosen
  if (selectedProduct.variants && selectedProduct.variants.length > 0) {
    for (const v of selectedProduct.variants) {
      if (!selectedVariants[v.name] && v.options[0]) {
        setSelectedVariants(prev => ({ ...prev, [v.name]: v.options[0] }));
      }
    }
  }

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const discountPercent = selectedProduct.originalPrice > selectedProduct.sellingPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.sellingPrice) / selectedProduct.originalPrice) * 100)
    : 0;

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeStatus('Please enter a valid 6-digit Indian postal code.');
      return;
    }
    const firstDigit = pincode.charAt(0);
    if (['1', '2', '3', '4'].includes(firstDigit)) {
      setPincodeStatus(`Verified: Express Delivery in 2–3 Business Days to PIN ${pincode} via BlueDart / Delhivery.`);
    } else {
      setPincodeStatus(`Verified: Pan-India Standard Air Delivery in 3–5 Business Days to PIN ${pincode}.`);
    }
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedVariants);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full transition-colors cursor-pointer"
          aria-label="Close Product Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Image Stage */}
          <div className="space-y-4">
            <div className="aspect-4/3 sm:aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200/80 relative">
              <img
                src={selectedProduct.images[0] || '/src/assets/images/hero_luxury_trade_1793356339228.jpg'}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3">
                <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-stone-900/90 text-white rounded">
                  Direct Import
                </span>
              </div>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200/60">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-amber-700 mb-1" />
                <span className="font-medium text-stone-800">100% Genuine</span>
                <span className="text-[10px] text-stone-500">Factory Sealed</span>
              </div>
              <div className="flex flex-col items-center border-x border-stone-200">
                <Truck className="w-4 h-4 text-amber-700 mb-1" />
                <span className="font-medium text-stone-800">Insured Dispatch</span>
                <span className="text-[10px] text-stone-500">Tracked Express</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-4 h-4 text-amber-700 mb-1" />
                <span className="font-medium text-stone-800">7-Day Replace</span>
                <span className="text-[10px] text-stone-500">Easy Claims</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category, SKU & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase tracking-wider font-semibold text-amber-800">
                  {selectedProduct.categoryLabel}
                </span>
                <span className="font-mono text-stone-400">SKU: {selectedProduct.sku}</span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 leading-tight">
                  {selectedProduct.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  {selectedProduct.tagline}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{selectedProduct.rating} / 5.0</span>
                </div>
                <span className="text-stone-500">({selectedProduct.reviewCount} verified client reviews)</span>
              </div>

              {/* Pricing */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200/80">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
                    ₹{selectedProduct.sellingPrice.toLocaleString('en-IN')}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.sellingPrice && (
                    <span className="text-sm text-stone-400 line-through tabular-nums">
                      MRP ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {discountPercent}% Direct
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Inclusive of all taxes & GST. Free Pan-India Delivery on orders above ₹999.
                </p>
              </div>

              {/* Variant Selector */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-3">
                  {selectedProduct.variants.map((v) => (
                    <div key={v.name}>
                      <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wide mb-1.5">
                        {v.name}: <span className="font-normal normal-case text-stone-600">{selectedVariants[v.name]}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariants({ ...selectedVariants, [v.name]: opt })}
                            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                              selectedVariants[v.name] === opt
                                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                                : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock Indicator */}
              <div className="flex items-center gap-2 text-xs">
                {selectedProduct.inventory > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-emerald-800 font-medium">
                      In Stock ({selectedProduct.inventory} units available at central hub)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span className="text-red-700 font-medium">Currently Sold Out</span>
                  </>
                )}
              </div>

              {/* Quantity Stepper & Actions */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold font-mono min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.inventory, quantity + 1))}
                    disabled={quantity >= selectedProduct.inventory}
                    className="px-3 py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct, quantity, selectedVariants)}
                  disabled={selectedProduct.inventory <= 0}
                  className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 text-center"
                >
                  Add to Bag
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={selectedProduct.inventory <= 0}
                  className="py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-1.5"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    isWishlisted ? 'border-red-300 bg-red-50 text-red-600' : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Indian Pincode Delivery Estimator */}
              <div className="pt-3 border-t border-stone-200">
                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter Indian PIN Code (e.g. 110001)"
                    className="flex-1 bg-stone-50 border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded border border-stone-300 cursor-pointer"
                  >
                    Check PIN
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-[11px] text-stone-600 mt-1.5 font-medium">
                    {pincodeStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Information Tabs */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center gap-4 border-b border-stone-200 mb-3 text-xs">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 font-medium cursor-pointer transition-colors relative ${
                    activeTab === 'details' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Overview & Craft
                  {activeTab === 'details' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />}
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 font-medium cursor-pointer transition-colors relative ${
                    activeTab === 'specs' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Technical Specifications
                  {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />}
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 font-medium cursor-pointer transition-colors relative ${
                    activeTab === 'shipping' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Logistics & Warranty
                  {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />}
                </button>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed min-h-24">
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p>{selectedProduct.description}</p>
                    <ul className="space-y-1.5 pt-2">
                      {selectedProduct.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="border border-stone-200 rounded divide-y divide-stone-200">
                    {Object.entries(selectedProduct.specifications || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1.5 px-3">
                        <span className="text-stone-500">{key}</span>
                        <span className="font-medium text-stone-800">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <p className="font-medium text-stone-800">{selectedProduct.shippingEstimate}</p>
                    <p>
                      Dispatched from DODO IMPEX 1689 Central Logistics Center in New Delhi. Every consignment is packed in triple-wall corrugated export-grade mailers with tamper-evident security tape.
                    </p>
                    <p>
                      <strong>Replacement Policy:</strong> 7 days from the delivery date for any verified manufacturing irregularity.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
