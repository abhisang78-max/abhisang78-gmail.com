import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, ShieldCheck, Truck, Lock, CreditCard, Smartphone, Building, Banknote, ArrowRight } from 'lucide-react';
import { Address, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    clearCart, 
    cartSubtotal, 
    appliedCoupon, 
    couponDiscount, 
    settings,
    currentUser,
    affiliateCode,
    showToast,
    refreshOrders,
    setPlacedOrder,
    setIsTrackingModalOpen,
    setTrackingQueryId
  } = useApp();

  const [step, setStep] = useState<'address' | 'payment' | 'confirmed'>('address');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Form
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [pincode, setPincode] = useState('110001');
  const [addressLine, setAddressLine] = useState('Suite 402, Barakhamba Road');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [landmark, setLandmark] = useState('Near Metro Station');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'id'>('gpay');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('889');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isCheckoutOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : settings.standardShippingFee;
  const totalAmount = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  // Auto-fill city/state based on Indian PIN prefix
  const handlePincodeChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
    setPincode(clean);
    if (clean.length === 6) {
      const prefix = clean.substring(0, 2);
      if (prefix === '11') { setCity('New Delhi'); setState('Delhi'); }
      else if (prefix === '40') { setCity('Mumbai'); setState('Maharashtra'); }
      else if (prefix === '56') { setCity('Bengaluru'); setState('Karnataka'); }
      else if (prefix === '50') { setCity('Hyderabad'); setState('Telangana'); }
      else if (prefix === '60') { setCity('Chennai'); setState('Tamil Nadu'); }
      else if (prefix === '70') { setCity('Kolkata'); setState('West Bengal'); }
      else if (prefix === '38') { setCity('Ahmedabad'); setState('Gujarat'); }
      else if (prefix === '30') { setCity('Jaipur'); setState('Rajasthan'); }
      else if (prefix === '20') { setCity('Noida'); setState('Uttar Pradesh'); }
      else if (prefix === '12') { setCity('Gurugram'); setState('Haryana'); }
      else { setCity('Central City'); setState('India State'); }
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !pincode || !addressLine) {
      showToast('Please fill all mandatory shipping address fields.');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const shippingAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName,
        phone,
        pincode,
        addressLine,
        city,
        state,
        landmark,
        isDefault: true
      };

      const orderItems = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0] || '',
        quantity: item.quantity,
        selectedVariants: item.selectedVariants,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity
      }));

      const payload = {
        userId: currentUser?.id,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress,
        items: orderItems,
        subtotal: cartSubtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code,
        shippingFee,
        totalAmount,
        paymentMethod,
        partnerCode: affiliateCode || undefined
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setCreatedOrder(data.order);
        setPlacedOrder(data.order);
        clearCart();
        refreshOrders();
        setStep('confirmed');
        showToast(`Order #${data.order.id} confirmed!`);
      } else {
        showToast(data.message || 'Error processing order.');
      }
    } catch (err: any) {
      showToast('Payment sandbox network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackCreatedOrder = () => {
    if (createdOrder) {
      setTrackingQueryId(createdOrder.id);
      setIsCheckoutOpen(false);
      setIsTrackingModalOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="font-serif font-bold text-base text-stone-950 tracking-tight">
              DODO IMPEX <span className="font-sans text-xs text-amber-700 tracking-widest font-normal">SECURE CHECKOUT</span>
            </div>
            {affiliateCode && (
              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                Partner Ref: {affiliateCode}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-stone-500 hover:text-stone-950 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        {step !== 'confirmed' && (
          <div className="flex border-b border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setStep('address')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                step === 'address' 
                  ? 'border-amber-600 text-stone-900 bg-amber-50/40' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              1. Delivery Address
            </button>
            <button
              onClick={() => setStep('payment')}
              className={`flex-1 py-3 text-center transition-colors border-b-2 ${
                step === 'payment' 
                  ? 'border-amber-600 text-stone-900 bg-amber-50/40' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              2. India Payment & Review
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          
          {/* STEP 1: Address */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-stone-800 text-sm font-semibold pb-1 border-b border-stone-100">
                <Truck className="w-4 h-4 text-amber-700" />
                <span>Consignee Details & Pan-India Destination</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Mobile Phone (+91) * (For Courier SMS & Verification)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address * (For Tax Invoice & BlueDart/Delhivery Tracking)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Indian PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    placeholder="110001"
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Flat / House No. / Building / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Flat 402, Signature Residency, 100 Feet Road"
                  className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near Central Mall"
                  className="w-full bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Order Summary Strip */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Deliver To:</span>
                  <span className="font-semibold text-stone-900">{fullName} ({phone}) · PIN {pincode}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Items ({cart.length} unique):</span>
                  <span className="text-stone-900 font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Privilege Discount ({appliedCoupon?.code}):</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Express Logistics:</span>
                  <span className="font-semibold text-stone-900">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                  <span>Net Payable Amount:</span>
                  <span className="text-base text-amber-800 tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wide mb-3">
                  Select Indian Payment Method
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="text-xs font-semibold text-stone-900">UPI Instant</div>
                    <div className="text-[10px] text-stone-500">GPay, PhonePe, BHIM</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="text-xs font-semibold text-stone-900">Cards</div>
                    <div className="text-[10px] text-stone-500">RuPay, Visa, MC</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <Building className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="text-xs font-semibold text-stone-900">Net Banking</div>
                    <div className="text-[10px] text-stone-500">All Indian Banks</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="text-xs font-semibold text-stone-900">Pay on Delivery</div>
                    <div className="text-[10px] text-stone-500">Cash / QR on delivery</div>
                  </button>
                </div>
              </div>

              {/* Sub-view for selected method */}
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <p className="font-medium text-stone-800">Select Instant UPI Provider or Enter VPA:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'gpay', name: 'Google Pay' },
                        { id: 'phonepe', name: 'PhonePe' },
                        { id: 'paytm', name: 'Paytm UPI' },
                        { id: 'id', name: 'Other UPI ID' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setUpiApp(item.id as any)}
                          className={`px-3 py-1.5 rounded border text-xs font-medium cursor-pointer ${
                            upiApp === item.id
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {upiApp === 'id' && (
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="e.g. mobile@okaxis, yourname@okhdfcbank"
                        className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 mt-2"
                      />
                    )}

                    <p className="text-[11px] text-stone-500">
                      Sandbox Simulation Mode: Order is approved directly without requesting live bank credentials.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-stone-800">Encrypted Card Terminal</span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 256-bit PCI Compliant
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-xs font-mono text-stone-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-xs font-mono text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-600 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-xs font-mono text-stone-900"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-500">
                      Testing sandbox: Card details are never transmitted or stored on servers.
                    </p>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <label className="block font-medium text-stone-800">Select Banking Partner:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-stone-900">Cash on Delivery (COD) Selected</p>
                    <p className="text-stone-600">
                      You can pay via Cash or UPI QR scan to the courier executive upon delivery at PIN {pincode}.
                      A verification SMS has been staged for {phone}.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  ← Edit Address
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Verifying Transaction...' : `Confirm & Authorize ₹${totalAmount.toLocaleString('en-IN')}`}</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Confirmed Screen */}
          {step === 'confirmed' && createdOrder && (
            <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                  Order Successfully Verified
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-950 mt-1">
                  Thank you, {createdOrder.customerName}
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Your direct-import consignment has been routed to our Central Fulfillment Center in New Delhi.
                </p>
              </div>

              {/* Order Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 text-left text-xs space-y-3 max-w-md mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Order Reference ID:</span>
                  <span className="font-mono font-bold text-stone-950 text-sm">{createdOrder.id}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Total Paid (INR):</span>
                  <span className="font-semibold text-stone-900">₹{createdOrder.totalAmount.toLocaleString('en-IN')} ({createdOrder.paymentMethod.toUpperCase()})</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Delivery Address:</span>
                  <span className="text-stone-900 text-right">{createdOrder.shippingAddress.addressLine}, {createdOrder.shippingAddress.city} ({createdOrder.shippingAddress.pincode})</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Initial Status:</span>
                  <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Confirmed & Packing
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={handleTrackCreatedOrder}
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
                >
                  Track Consignment Live
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
