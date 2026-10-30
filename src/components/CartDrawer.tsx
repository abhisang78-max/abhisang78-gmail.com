import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    appliedCoupon, 
    couponDiscount, 
    applyCoupon, 
    removeCoupon,
    settings,
    setIsCheckoutOpen,
    setCurrentView
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = cartSubtotal === 0 ? 0 : (isFreeShipping ? 0 : settings.standardShippingFee);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const totalAmount = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    setCouponError(null);
    const result = await applyCoupon(couponInput.trim());
    setIsApplying(false);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              <h2 className="font-serif font-bold text-base text-stone-900 tracking-tight">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-500 hover:text-stone-950 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-stone-100 border-b border-stone-200 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You have unlocked Complimentary Pan-India Express Delivery!</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-stone-700 font-medium">
                  <span>Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} more for Free Delivery</span>
                  <span className="text-stone-500">{freeShippingPercent}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-medium text-stone-900 text-lg">Your bag is currently empty</h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Discover direct-import electronics, executive horology, and lifestyle goods.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0] || '/src/assets/images/hero_luxury_trade_1793356339228.jpg'}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 object-cover rounded-md bg-stone-100 border border-stone-200/80 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariants)}
                          className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant badges */}
                      {Object.entries(item.selectedVariants).length > 0 && (
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                        </p>
                      )}

                      <div className="text-xs font-semibold text-stone-950 mt-1 tabular-nums">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-stone-200 rounded bg-stone-50 text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedVariants)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-1 font-mono font-medium text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedVariants)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[11px] text-stone-500 tabular-nums">
                        = ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Code <strong>{appliedCoupon.code}</strong> applied (-₹{couponDiscount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-red-600 underline cursor-pointer text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code (e.g. WELCOME10)"
                      className="flex-1 bg-white border border-stone-300 rounded px-3 py-1.5 text-xs text-stone-900 uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={isApplying || !couponInput.trim()}
                      className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-stone-500 pt-0.5">
                    <span>Try: </span>
                    <button type="button" onClick={() => setCouponInput('WELCOME10')} className="underline hover:text-stone-800 cursor-pointer">WELCOME10 (10% off)</button>
                    <span>·</span>
                    <button type="button" onClick={() => setCouponInput('DODO1689')} className="underline hover:text-stone-800 cursor-pointer">DODO1689 (15% off)</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Summary & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilege Discount</span>
                    <span className="tabular-nums">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Pan-India Logistics</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                  <span>Total Amount (Inc. GST)</span>
                  <span className="text-base tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Proceed to India Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Encrypted 256-bit checkout · UPI, Cards, NetBanking, COD</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
