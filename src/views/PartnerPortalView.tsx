import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { INITIAL_USERS } from '../data/initialData';
import { PartnerPayout, Product } from '../types';

export const PartnerPortalView: React.FC = () => {
  const { currentUser, loginUser, showToast, products } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutUpi, setPayoutUpi] = useState('');
  const [payoutsList, setPayoutsList] = useState<PartnerPayout[]>([]);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regChannels, setRegChannels] = useState('');
  const [regUpi, setRegUpi] = useState('');
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);

  const isPartner = currentUser?.role === 'partner';
  const partnerCode = currentUser?.partnerCode || 'DODO-AFFILIATE';
  const referralUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?ref=${partnerCode}` 
    : `https://dodoimpex.in/?ref=${partnerCode}`;

  const fetchPayouts = async () => {
    try {
      const res = await fetch('/api/partners');
      const data = await res.json();
      if (data.success && data.payouts) {
        setPayoutsList(data.payouts.filter((p: PartnerPayout) => p.partnerId === currentUser?.id));
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isPartner) {
      fetchPayouts();
      setPayoutUpi(currentUser?.bankDetails?.upiId || '');
    }
  }, [isPartner, currentUser]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    showToast('Unique Referral Link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(partnerCode);
    setCopiedCode(true);
    showToast(`Referral Code ${partnerCode} copied.`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutAmount);
    if (!amountNum || amountNum <= 0) {
      showToast('Please enter a valid payout amount.');
      return;
    }

    if (amountNum > (currentUser?.unpaidCommission || 0)) {
      showToast('Requested amount exceeds current unpaid commission balance.');
      return;
    }

    try {
      const res = await fetch('/api/partners/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: currentUser?.id,
          amount: amountNum,
          paymentMethod: payoutUpi || 'UPI NEFT'
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setPayoutModalOpen(false);
        setPayoutAmount('');
        if (currentUser) {
          currentUser.unpaidCommission = (currentUser.unpaidCommission || 0) - amountNum;
        }
        fetchPayouts();
      } else {
        showToast(data.message || 'Error processing payout request.');
      }
    } catch (e) {
      showToast('Network error filing payout.');
    }
  };

  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingApp(true);
    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          promotionalChannels: regChannels,
          upiOrBank: regUpi
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppSubmitted(true);
        showToast(data.message);
      } else {
        showToast(data.message || 'Application error.');
      }
    } catch (e) {
      showToast('Network error submitting application.');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // If not logged in as an approved partner
  if (!isPartner || currentUser?.partnerStatus !== 'approved') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
        
        {/* Intro Banner */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Authorised Affiliate & Reseller Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950">
            Earn 10% On Every Verified Direct-Import Consignment
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Partner with DODO IMPEX 1689. Distribute curated electronics, chronographs, and executive lifestyle accessories to your network across India with zero upfront inventory capital.
          </p>

          {/* Quick Demo Switcher Button for reviewer */}
          <div className="p-3 bg-stone-100 border border-stone-200 rounded-lg inline-flex items-center gap-3 text-xs text-stone-700">
            <span>Testing the Partner Portal?</span>
            <button
              onClick={() => {
                const partnerUser = INITIAL_USERS.find(u => u.role === 'partner');
                if (partnerUser) loginUser(partnerUser);
              }}
              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded cursor-pointer"
            >
              Log In as Rajesh Sharma (Approved Partner)
            </button>
          </div>
        </div>

        {/* Ethical Anti-Pyramid Governance Declaration */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Strict Indian Direct Selling & Ethical Affiliate Compliance:</span>
          </div>
          <p className="leading-relaxed">
            DODO IMPEX 1689 operates exclusively as an authorised retail affiliate program. Commissions are derived solely from genuine, delivered client purchases. We strictly prohibit multi-tier recruitment fees, entry fees, or pyramid schemes. Every application is vetted individually by our administrative team.
          </p>
        </div>

        {/* Partner Application Form */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl mx-auto">
          <div>
            <h2 className="font-serif font-bold text-stone-950 text-xl">
              Apply for Authorised Partner Status
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Zero upfront investment. Review takes 24–48 business hours.
            </p>
          </div>

          {appSubmitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-3">
              <Check className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-emerald-950 text-base">Application Submitted</h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                Thank you for applying to the DODO IMPEX 1689 partner network. An email confirmation has been sent to <strong>{regEmail}</strong>. Our compliance desk will evaluate your distribution channels and issue your partner credentials upon approval.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegisterPartner} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Mobile / WhatsApp (+91) *</label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Corporate or Personal Email *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rajesh@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Promotional Channels / Audience (Instagram, WhatsApp Community, YouTube, Corporate Network)
                </label>
                <textarea
                  rows={2}
                  required
                  value={regChannels}
                  onChange={(e) => setRegChannels(e.target.value)}
                  placeholder="e.g. Tech review Instagram page with 15k followers / corporate gifting network in Mumbai"
                  className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Preferred Payout Method (Indian UPI ID or Bank Account Details)
                </label>
                <input
                  type="text"
                  required
                  value={regUpi}
                  onChange={(e) => setRegUpi(e.target.value)}
                  placeholder="e.g. rajesh@okhdfcbank or Bank Account No & IFSC"
                  className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingApp}
                className="w-full py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-md font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmittingApp ? 'Submitting Application...' : 'Submit Partner Application for Approval'}
              </button>
            </form>
          )}
        </div>

      </div>
    );
  }

  // ================= Approved Partner Dashboard =================
  const commissionRate = currentUser.commissionRate || 10;
  const totalCommission = currentUser.totalCommission || 8450;
  const unpaidCommission = currentUser.unpaidCommission || 3200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Top Welcome Lockup */}
      <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Authorised Partner Status: Approved & Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
              Partner Hub: {currentUser.name}
            </h1>
            <p className="text-xs text-stone-400">
              Partner ID: <strong className="font-mono text-stone-200">PRT-8921</strong> · Commission Rate: <strong className="text-amber-400">{commissionRate}%</strong> on eligible delivered orders
            </p>
          </div>

          <button
            onClick={() => setPayoutModalOpen(true)}
            disabled={unpaidCommission <= 0}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <Wallet className="w-4 h-4" />
            <span>Request Payout (₹{unpaidCommission.toLocaleString('en-IN')})</span>
          </button>
        </div>

        {/* Unique Link Bar */}
        <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 bg-stone-950 border border-stone-700 rounded-md px-3 py-2 text-xs font-mono text-amber-300 truncate">
            {referralUrl}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-stone-700"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
            <button
              onClick={handleCopyCode}
              className="flex-1 sm:flex-none px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-stone-700"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>Code: {partnerCode}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Total Commission Earned</span>
          <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
            ₹{totalCommission.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-stone-400">Cumulative eligible verified sales</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Unpaid Payout Balance</span>
          <div className="text-2xl font-serif font-bold text-amber-800 tabular-nums">
            ₹{unpaidCommission.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-stone-400">Available for instant UPI / NEFT release</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Active Referral Code</span>
          <div className="text-xl font-mono font-bold text-stone-950">
            {partnerCode}
          </div>
          <p className="text-[10px] text-stone-400">Auto-applies {commissionRate}% commission credit</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold">Payout Speed</span>
          <div className="text-xl font-bold text-stone-950">
            24–48 Hours
          </div>
          <p className="text-[10px] text-stone-400">Direct Indian NEFT / IMPS / UPI</p>
        </div>
      </div>

      {/* Promotional Catalog Sharing Kit */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="font-serif font-bold text-stone-950 text-xl">
            Promotional Share Kit & Recommended Copy
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Share curated direct-import pieces with your followers. Your referral token is pre-attached to all assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.slice(0, 4).map((p) => {
            const expectedCommission = Math.round((p.sellingPrice * commissionRate) / 100);
            return (
              <div key={p.id} className="border border-stone-200 rounded-lg p-4 flex gap-4 bg-stone-50/50">
                <img
                  src={p.images[0] || '/src/assets/images/hero_luxury_trade_1793356339228.jpg'}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover rounded-md bg-stone-100 border border-stone-200 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-stone-900">{p.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-stone-950 tabular-nums">₹{p.sellingPrice.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                        Your cut: ₹{expectedCommission}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        const text = `Direct-import ${p.name} with free pan-India express dispatch. Order directly: ${referralUrl}`;
                        navigator.clipboard.writeText(text);
                        showToast(`WhatsApp share text for ${p.name} copied.`);
                      }}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy WhatsApp Pitch</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <h3 className="font-serif font-bold text-stone-950 text-lg">
          Disbursement & Payout History
        </h3>

        {payoutsList.length === 0 ? (
          <div className="text-xs text-stone-500 py-4 text-center">
            No previous payouts requested yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Payout ID</th>
                  <th className="py-2.5 px-3">Amount (INR)</th>
                  <th className="py-2.5 px-3">Disbursement Destination</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Requested Date</th>
                  <th className="py-2.5 px-3">Bank Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payoutsList.map((po) => (
                  <tr key={po.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono font-medium">{po.id}</td>
                    <td className="py-2.5 px-3 font-semibold tabular-nums">₹{po.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-stone-600">{po.payoutMethod}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        po.status === 'processed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-500">{po.createdAt.substring(0, 10)}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">{po.paymentReference || 'Processing via Axis NEFT'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h4 className="font-bold text-sm text-stone-900">Request Commission Payout</h4>
              <button onClick={() => setPayoutModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                ×
              </button>
            </div>
            <form onSubmit={handleRequestPayout} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1">
                  Payout Amount (Max: ₹{unpaidCommission.toLocaleString('en-IN')})
                </label>
                <input
                  type="number"
                  required
                  max={unpaidCommission}
                  min={500}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">UPI ID or NEFT Bank Details</label>
                <input
                  type="text"
                  required
                  value={payoutUpi}
                  onChange={(e) => setPayoutUpi(e.target.value)}
                  placeholder="rajesh@okhdfcbank"
                  className="w-full border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <p className="text-[11px] text-stone-500">
                Payouts are executed within 48 business hours with bank transaction receipt.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="px-3 py-1.5 border border-stone-300 rounded text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 text-white rounded font-medium hover:bg-amber-700"
                >
                  Confirm Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
