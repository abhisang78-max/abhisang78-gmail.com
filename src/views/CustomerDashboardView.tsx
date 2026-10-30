import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  MapPin, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Truck, 
  Clock, 
  User as UserIcon,
  MessageSquare
} from 'lucide-react';
import { Address, Order, SupportTicket } from '../types';

export const CustomerDashboardView: React.FC = () => {
  const { 
    currentUser, 
    logoutUser, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    orders, 
    setIsTrackingModalOpen, 
    setTrackingQueryId,
    showToast,
    refreshOrders
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'support'>('orders');
  const [addresses, setAddresses] = useState<Address[]>(currentUser?.addresses || []);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Add Address Modal state
  const [newAddrModal, setNewAddrModal] = useState(false);
  const [addrFullName, setAddrFullName] = useState(currentUser?.name || '');
  const [addrPhone, setAddrPhone] = useState(currentUser?.phone || '');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrLine, setAddrLine] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');

  // Support Ticket Form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'order' | 'shipping' | 'product' | 'return' | 'other'>('order');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketOrderId, setTicketOrderId] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const fetchTickets = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/support?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (currentUser) {
      setAddresses(currentUser.addresses || []);
      fetchTickets();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-950">Customer Account Access</h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          Please sign in to access your order history, live consignment tracking, saved delivery addresses, and customer support tickets.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
        >
          Sign In or Switch Role
        </button>
      </div>
    );
  }

  const customerOrders = orders.filter(o => 
    o.userId === currentUser.id || o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName || !addrPincode || !addrLine) {
      showToast('Please fill all mandatory address details.');
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      fullName: addrFullName,
      phone: addrPhone,
      pincode: addrPincode,
      addressLine: addrLine,
      city: addrCity || 'Central City',
      state: addrState || 'State',
      isDefault: addresses.length === 0
    };

    const updated = [...addresses, newAddr];
    setAddresses(updated);
    if (currentUser) {
      currentUser.addresses = updated;
    }
    setNewAddrModal(false);
    showToast('New shipping address saved.');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    if (currentUser) {
      currentUser.addresses = updated;
    }
    showToast('Address removed.');
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      showToast('Please provide subject and message.');
      return;
    }

    setSubmittingTicket(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          customerName: currentUser.name,
          customerEmail: currentUser.email,
          orderId: ticketOrderId || undefined,
          subject: ticketSubject,
          message: ticketMessage,
          category: ticketCategory
        })
      });
      const data = await res.json();
      if (data.success) {
        setTickets([data.ticket, ...tickets]);
        setTicketSubject('');
        setTicketMessage('');
        setTicketOrderId('');
        showToast('Support inquiry filed successfully.');
      }
    } catch (e) {
      showToast('Error filing ticket.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Account Welcome Header */}
      <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 border border-stone-800 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-amber-400">
            DODO IMPEX 1689 Client Profile
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            {currentUser.email} · {currentUser.phone || '+91 registered phone'}
          </p>
        </div>

        <button
          onClick={logoutUser}
          className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-md transition-colors cursor-pointer self-start sm:self-auto border border-stone-700"
        >
          <LogOut className="w-3.5 h-3.5 text-stone-400" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-stone-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders & Consignments ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'addresses'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'support'
              ? 'border-stone-900 text-stone-950 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Helpdesk & Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* TAB 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="text-center py-16 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
              <Package className="w-10 h-10 text-stone-400 mx-auto" />
              <h3 className="font-serif font-bold text-stone-900 text-lg">No Orders Placed Yet</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our catalog of direct-import audio, chronographs, and executive lifestyle accessories.
              </p>
            </div>
          ) : (
            customerOrders.map((order) => (
              <div key={order.id} className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-2xs">
                
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-stone-100 text-xs">
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-semibold">Order Reference</span>
                    <div className="font-mono font-bold text-stone-950 text-sm">{order.id}</div>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-semibold">Placed On</span>
                    <div className="text-stone-800">{order.createdAt.substring(0, 10)}</div>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-semibold">Total Amount</span>
                    <div className="font-semibold text-stone-950 tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')} ({order.paymentMethod.toUpperCase()})
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-stone-400 uppercase font-semibold">Status</span>
                    <div>
                      <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTrackingQueryId(order.id);
                      setIsTrackingModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Track Consignment</span>
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage || '/src/assets/images/hero_luxury_trade_1793356339228.jpg'}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded bg-stone-100 border border-stone-200"
                        />
                        <div>
                          <div className="font-medium text-stone-900">{item.productName}</div>
                          <div className="text-[11px] text-stone-500">
                            Qty: {item.quantity} · Rate: ₹{item.unitPrice.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium text-stone-950 tabular-nums">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping address footer */}
                <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-[11px] text-stone-500">
                  <div>
                    Ship to: <span className="text-stone-800">{order.shippingAddress.fullName}, {order.shippingAddress.city} ({order.shippingAddress.pincode})</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="font-mono text-stone-600">AWB: {order.trackingNumber} ({order.courierPartner})</div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-stone-950 text-lg">Registered Shipping Addresses</h3>
            <button
              onClick={() => setNewAddrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded text-xs font-semibold hover:bg-stone-800 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{addr.fullName}</h4>
                    <p className="text-xs text-stone-500">{addr.phone}</p>
                  </div>
                  {addr.isDefault && (
                    <span className="text-[10px] bg-stone-100 font-semibold text-stone-700 px-2 py-0.5 rounded">
                      Default Address
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {addr.addressLine}<br />
                  {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                </p>

                <div className="pt-2 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-stone-400 hover:text-red-600 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {newAddrModal && (
            <div className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-sm text-stone-900">Add Delivery Address</h4>
                  <button onClick={() => setNewAddrModal(false)} className="text-stone-400 hover:text-stone-700">
                    <Trash2 className="hidden" />
                    <span className="text-lg">×</span>
                  </button>
                </div>
                <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={addrFullName}
                      onChange={(e) => setAddrFullName(e.target.value)}
                      className="w-full border border-stone-300 rounded p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full border border-stone-300 rounded p-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        className="w-full border border-stone-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full border border-stone-300 rounded p-2"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={addrLine}
                      onChange={(e) => setAddrLine(e.target.value)}
                      className="w-full border border-stone-300 rounded p-2"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setNewAddrModal(false)}
                      className="px-3 py-1.5 border border-stone-300 rounded text-stone-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-stone-900 text-white rounded font-medium"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Support & Helpdesk */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* New Ticket Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-stone-950 text-base">
              Submit Customer Support Ticket
            </h3>
            <p className="text-xs text-stone-500">
              Our direct trade support executives respond within 24 business hours.
            </p>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-2 text-stone-900"
                >
                  <option value="order">Order Tracking & Status</option>
                  <option value="shipping">Logistics & Pincode Inquiries</option>
                  <option value="product">Product Specs & Guarantee</option>
                  <option value="return">7-Day Replacement Claim</option>
                  <option value="other">General Question</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Order Reference ID (Optional)</label>
                <input
                  type="text"
                  value={ticketOrderId}
                  onChange={(e) => setTicketOrderId(e.target.value)}
                  placeholder="e.g. DODO-2026-1042"
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-2 text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief summary of your inquiry"
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Provide comprehensive details..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-2 text-stone-900"
                />
              </div>

              <button
                type="submit"
                disabled={submittingTicket}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingTicket ? 'Submitting...' : 'File Support Ticket'}
              </button>
            </form>
          </div>

          {/* Ticket Threads */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif font-bold text-stone-950 text-base">
              Your Support Inquiries ({tickets.length})
            </h3>

            {tickets.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-500">
                You currently have no open support tickets.
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-stone-900">{t.id}</span>
                        {t.orderId && (
                          <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                            {t.orderId}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-stone-900 text-sm mt-0.5">{t.subject}</h4>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
                    {t.message}
                  </p>

                  {/* Replies thread */}
                  {t.replies && t.replies.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="text-[11px] font-semibold text-stone-700">Official Responses:</div>
                      {t.replies.map((r, ri) => (
                        <div key={ri} className="bg-amber-50/60 border border-amber-200/70 p-3 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-semibold text-amber-900">
                            <span>{r.sender}</span>
                            <span className="text-[10px] text-stone-400 font-normal">{r.timestamp}</span>
                          </div>
                          <p className="text-stone-700">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
