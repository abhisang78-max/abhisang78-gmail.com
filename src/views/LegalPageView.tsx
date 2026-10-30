import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Phone, MapPin, Building2, Check, ArrowRight } from 'lucide-react';

export const LegalPageView: React.FC = () => {
  const { legalPageType, openLegalPage, setCurrentView, showToast } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    showToast('Your inquiry has been received by our corporate desk.');
  };

  const navItems = [
    { id: 'about', label: 'About DODO IMPEX 1689' },
    { id: 'contact', label: 'Contact Corporate Desk' },
    { id: 'shipping', label: 'Shipping & Pan-India Logistics' },
    { id: 'returns', label: '7-Day Return & Refund Policy' },
    { id: 'cancellation', label: 'Order Cancellation Policy' },
    { id: 'privacy', label: 'Privacy & Data Protection' },
    { id: 'terms', label: 'Terms of Service' },
    { id: 'partner-terms', label: 'Partner & Reseller Affiliate Terms' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 pb-28">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => setCurrentView('home')} className="hover:text-stone-900 cursor-pointer">Home</button>
        <span>/</span>
        <span className="font-semibold text-stone-900 capitalize">{legalPageType.replace('-', ' ')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sticky Sidebar of Legal Pages */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-4 space-y-1.5 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 py-2">
            Corporate & Compliance
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => openLegalPage(item.id as any)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex justify-between items-center ${
                legalPageType === item.id
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <span>{item.label}</span>
              {legalPageType === item.id && <ArrowRight className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          ))}
        </div>

        {/* Right Main Legal Prose */}
        <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-6 sm:p-10 shadow-sm text-xs text-stone-700 leading-relaxed space-y-6">
          
          {/* ABOUT US */}
          {legalPageType === 'about' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Global Direct Import Foundation
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  About DODO IMPEX 1689
                </h1>
              </div>

              <p className="text-sm text-stone-800 leading-relaxed">
                Founded on the principle of direct global procurement, <strong>DODO IMPEX 1689</strong> is an Indian international e-commerce house dedicated to bridging world-class design manufacturing with Indian consumers at honest, factory-direct prices.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                The Direct-Import Advantage
              </h2>
              <p>
                In the traditional Indian retail landscape, imported luxury goods travel through foreign master distributors, Indian national clearing agents, regional sub-stockists, and third-party marketplace markups. By the time a product reaches your hands, over 60% of its price tag represents middleman margins rather than manufacturing value.
              </p>
              <p>
                DODO IMPEX 1689 eliminates these superfluous layers. We contract directly with specialized manufacturing lines across Asia and Europe, conduct rigid in-house cosmetic and electronic quality inspections, and fulfill directly from our central New Delhi logistics hub to any destination in India.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                Ethical Sourcing & Long-Term Scalability
              </h2>
              <p>
                Beginning as an agile direct-import and e-commerce operation, our technical architecture is built to scale into large-volume cross-border import-export operations, empowering domestic entrepreneurs and partners along the way.
              </p>

              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-1 text-stone-600">
                <div className="font-semibold text-stone-900">Corporate Details:</div>
                <div>Entity: DODO IMPEX 1689 Global Trade Solutions</div>
                <div>Operational Center: Barakhamba Road, Connaught Place, New Delhi 110001, India</div>
                <div>GSTIN: [Provisional Incorporation: 07AAACD1689P1Z9]</div>
              </div>
            </article>
          )}

          {/* CONTACT US */}
          {legalPageType === 'contact' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Customer Care & Inquiries
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  Contact DODO IMPEX 1689
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <Mail className="w-4 h-4 text-amber-700" />
                  <div className="font-semibold text-stone-900">Direct Client Support</div>
                  <div className="text-stone-600">care@dodoimpex.in</div>
                  <div className="text-[11px] text-stone-400">Response within 24 business hours</div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <Phone className="w-4 h-4 text-amber-700" />
                  <div className="font-semibold text-stone-900">Helpline</div>
                  <div className="text-stone-600">+91 (011) 4982-1689</div>
                  <div className="text-[11px] text-stone-400">Monday – Saturday, 10:00 AM – 6:30 PM IST</div>
                </div>
              </div>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                Corporate Inquiries & Wholesale Desk
              </h2>
              {contactSent ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 space-y-2">
                  <div className="font-bold">Message Dispatched</div>
                  <p>Thank you, {contactName}. A designated operations representative will contact your email ({contactEmail}) promptly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Corporate or Personal Email *</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded p-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Inquiry / Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please outline the nature of your inquiry or consignment question..."
                      className="w-full bg-stone-50 border border-stone-300 rounded p-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-stone-950 text-white font-semibold rounded hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Send Inquiry
                  </button>
                </form>
              )}
            </article>
          )}

          {/* SHIPPING POLICY */}
          {legalPageType === 'shipping' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Logistics & Dispatch
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  Shipping & Pan-India Delivery Policy
                </h1>
              </div>

              <p>
                DODO IMPEX 1689 fulfills consignments to all serviceable pin codes across the Republic of India through premier logistics partners including <strong>BlueDart Express</strong>, <strong>Delhivery</strong>, and Shiprocket integration channels.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                1. Transit Timelines
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata:</strong> 2 to 4 business days.</li>
                <li><strong>Tier-2 and Tier-3 Indian Municipalities:</strong> 3 to 6 business days.</li>
                <li><strong>Remote or North-East Territories:</strong> 5 to 7 business days.</li>
              </ul>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                2. Shipping Fees
              </h2>
              <p>
                We provide <strong>Complimentary Pan-India Tracked Express Delivery</strong> on all orders with a net subtotal of ₹999 or greater. For orders below ₹999, a nominal standard fulfillment fee of ₹99 is applied at checkout.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                3. Consignment Tracking
              </h2>
              <p>
                Upon parcel dispatch from our Central Fulfillment Center in New Delhi, an Air Waybill (AWB) number and direct tracking URL are generated and dispatched via SMS and email. Customers may also enter their Order ID on our Track Order portal for real-time milestone logs.
              </p>
            </article>
          )}

          {/* RETURN & REFUND */}
          {legalPageType === 'returns' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Client Assurance
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  7-Day Return & Replacement Guarantee
                </h1>
              </div>

              <p>
                At DODO IMPEX 1689, we inspect every product prior to dispatch. However, in the rare event of transit damage or manufacturing irregularity, we offer a straightforward <strong>7-Day Replacement Policy</strong>.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                Eligibility Conditions
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Claim must be initiated within 7 calendar days of confirmed courier delivery.</li>
                <li>Item must be returned with its original packaging, documentation, warranty card, and accessories.</li>
                <li>Consignment must not show signs of intentional physical abuse, water ingress (beyond IP ratings), or tampering.</li>
              </ul>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                Refund Processing
              </h2>
              <p>
                Once the returned item is inspected at our hub (typically 48 hours from arrival), the replacement unit is dispatched via Air Express. If a replacement is out of inventory, a 100% refund is initiated back to your original payment mode (UPI, card, or direct bank transfer for COD orders) within 5–7 banking days.
              </p>
            </article>
          )}

          {/* CANCELLATION */}
          {legalPageType === 'cancellation' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Pre-Dispatch Cancellation
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  Order Cancellation Policy
                </h1>
              </div>

              <p>
                Orders may be cancelled free of charge at any moment prior to handoff to our courier partners (indicated by the 'Dispatched' milestone).
              </p>
              <p>
                To cancel an order prior to dispatch, navigate to <strong>Track Order</strong> or <strong>My Orders</strong> in your dashboard and select 'Cancel Order Prior to Dispatch'. The cancellation is executed immediately, and full refund is released within 24 hours.
              </p>
              <p>
                Once an order has been assigned an AWB and handed over to Delhivery or BlueDart, in-transit cancellation is not possible; customers may instead refuse delivery or request a return upon arrival under our 7-Day Guarantee.
              </p>
            </article>
          )}

          {/* PRIVACY POLICY */}
          {legalPageType === 'privacy' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Information Technology Act, 2000
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  Privacy & Data Protection Policy
                </h1>
              </div>

              <p>
                DODO IMPEX 1689 respects the privacy of its clients. We do not sell, rent, or lease consumer personal information to third-party marketing entities.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                1. Information We Collect
              </h2>
              <p>
                We collect your name, shipping address, Indian phone number, and email strictly for the purposes of order verification, GST tax invoicing, and logistics coordination.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                2. Payment Security
              </h2>
              <p>
                We do not store raw card numbers, CVVs, or banking credentials on our servers. All digital transactions are routed through 256-bit SSL encrypted PCI-DSS certified Indian gateways (Razorpay / UPI sandbox).
              </p>
            </article>
          )}

          {/* TERMS OF SERVICE */}
          {legalPageType === 'terms' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Legal Agreement
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  Terms & Conditions of Service
                </h1>
              </div>

              <p>
                By accessing or placing an order through the DODO IMPEX 1689 portal, you agree to be bound by these Terms of Service under the jurisdiction of the courts of New Delhi, India.
              </p>
              <p>
                All retail prices are displayed in Indian Rupees (INR ₹) and are inclusive of applicable Goods and Services Tax (GST). DODO IMPEX 1689 reserves the right to correct typographical pricing errors prior to order fulfillment.
              </p>
            </article>
          )}

          {/* PARTNER TERMS */}
          {legalPageType === 'partner-terms' && (
            <article className="space-y-6">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
                  Affiliate Governance
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 mt-1">
                  Authorised Partner & Reseller Agreement
                </h1>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 font-medium">
                Mandatory Notice: The DODO IMPEX 1689 Partner Program operates strictly as a legitimate product affiliate system. Recruitment bonuses, registration fees, and multi-tier downline commissions are strictly forbidden.
              </div>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                1. Commission Eligibility
              </h2>
              <p>
                Commissions (standard 10%) are generated exclusively upon completed and delivered retail sales placed through the partner's verified referral link or coupon code. In the event of a customer return or order cancellation, the associated commission is debited.
              </p>

              <h2 className="text-base font-serif font-bold text-stone-950 pt-2 border-t border-stone-100">
                2. Payouts & Taxation
              </h2>
              <p>
                Partners may request payouts once their unpaid commission balance exceeds ₹500. Payouts are remitted via Indian NEFT or verified UPI ID within 48 business hours. Applicable Tax Deducted at Source (TDS) is deducted where required under Indian income tax guidelines.
              </p>
            </article>
          )}

        </div>

      </div>

    </div>
  );
};
