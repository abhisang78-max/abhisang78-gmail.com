import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, Package, AlertCircle } from 'lucide-react';
import { Order } from '../types';

export const TrackOrderModal: React.FC = () => {
  const { isTrackingModalOpen, setIsTrackingModalOpen, trackingQueryId, setTrackingQueryId, showToast, refreshOrders } = useApp();

  const [inputQuery, setInputQuery] = useState(trackingQueryId || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  const fetchTrackOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setNotFound(true);
      }
    } catch (e) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trackingQueryId) {
      setInputQuery(trackingQueryId);
      fetchTrackOrder(trackingQueryId);
    }
  }, [trackingQueryId]);

  if (!isTrackingModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackOrder(inputQuery);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason || 'Customer requested cancellation prior to courier dispatch' })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setCancelModalOpen(false);
        showToast('Order successfully cancelled. Refund initiated.');
        refreshOrders();
      } else {
        showToast(data.message || 'Cannot cancel this order.');
      }
    } catch (e) {
      showToast('Network error.');
    }
  };

  const handleReturnOrder = async () => {
    if (!order) return;
    try {
      const res = await fetch(`/api/orders/${order.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: returnReason || 'Return request' })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setReturnModalOpen(false);
        showToast('Return request filed. Support team will contact you.');
        refreshOrders();
      } else {
        showToast(data.message || 'Cannot file return.');
      }
    } catch (e) {
      showToast('Network error.');
    }
  };

  const getStepProgress = (status: string) => {
    switch (status) {
      case 'placed': return 1;
      case 'confirmed': return 2;
      case 'dispatched': return 3;
      case 'in_transit': return 4;
      case 'out_for_delivery': return 5;
      case 'delivered': return 6;
      case 'cancelled': return 0;
      default: return 2;
    }
  };

  const currentStep = order ? getStepProgress(order.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-200">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif font-bold text-base text-stone-950 tracking-tight">
              Consignment Tracking & Logistics
            </h2>
          </div>
          <button
            onClick={() => {
              setIsTrackingModalOpen(false);
              setTrackingQueryId('');
            }}
            className="p-1.5 text-stone-500 hover:text-stone-950 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Close tracking"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
              Enter Order ID, Phone Number, or AWB Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. DODO-2026-1042 or DEL-SR-84920199"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Locating...' : 'Track'}
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Try sample order: <button type="button" onClick={() => { setInputQuery('DODO-2026-1042'); fetchTrackOrder('DODO-2026-1042'); }} className="underline font-mono text-amber-800 hover:text-stone-900 cursor-pointer">DODO-2026-1042</button>
            </p>
          </form>

          {/* Not Found State */}
          {notFound && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Consignment not found:</strong> No active consignment was found for "{inputQuery}". Please double check your 14-character Order ID or ensure you have provided the exact phone number registered at checkout.
              </div>
            </div>
          )}

          {/* Order Details Stage */}
          {order && (
            <div className="space-y-6 pt-2">
              
              {/* Order Meta Header */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="text-[11px] text-stone-500 uppercase font-semibold">Consignment Number</div>
                  <div className="font-mono font-bold text-sm text-stone-950 mt-0.5">{order.id}</div>
                </div>

                <div>
                  <div className="text-[11px] text-stone-500 uppercase font-semibold">Courier Partner</div>
                  <div className="font-medium text-stone-900 mt-0.5">
                    {order.courierPartner || 'Assigned to Delhivery Surface / BlueDart'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-stone-500 uppercase font-semibold">AWB Airway Bill</div>
                  <div className="font-mono font-semibold text-stone-800 mt-0.5">
                    {order.trackingNumber || 'Awaiting Hub Scan'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-stone-500 uppercase font-semibold">Current State</div>
                  <div className="font-semibold text-amber-800 uppercase mt-0.5">
                    {order.orderStatus.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Progress Milestones Bar */}
              {order.orderStatus !== 'cancelled' ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-stone-600 font-medium">
                    <span className={currentStep >= 1 ? 'text-amber-800 font-semibold' : ''}>Placed</span>
                    <span className={currentStep >= 2 ? 'text-amber-800 font-semibold' : ''}>Inspected</span>
                    <span className={currentStep >= 3 ? 'text-amber-800 font-semibold' : ''}>Dispatched</span>
                    <span className={currentStep >= 4 ? 'text-amber-800 font-semibold' : ''}>In Transit</span>
                    <span className={currentStep >= 6 ? 'text-emerald-700 font-bold' : ''}>Delivered</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(16, (currentStep / 6) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  This consignment was cancelled. Reason: {order.cancellationReason || 'Requested by customer'}.
                </div>
              )}

              {/* Milestones Log */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Consignment Milestone Log
                </h3>
                <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 bg-white">
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event, idx) => (
                      <div key={idx} className="p-3 flex items-start gap-3 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-stone-900">{event.status}</span>
                            <span className="text-[11px] text-stone-400 font-mono">{event.timestamp}</span>
                          </div>
                          <p className="text-stone-600 text-[11px] mt-0.5">{event.note}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-stone-500">Awaiting initial warehouse milestone scan.</div>
                  )}
                </div>
              </div>

              {/* Items in Consignment */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Items in this Consignment
                </h3>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-md border border-stone-200 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-stone-500 shrink-0" />
                        <div>
                          <div className="font-medium text-stone-900">{item.productName}</div>
                          <div className="text-[10px] text-stone-500">Qty: {item.quantity} · Price: ₹{item.unitPrice.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="font-semibold text-stone-950 tabular-nums">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions: Cancellation or Return Request */}
              <div className="pt-2 border-t border-stone-200 flex flex-wrap gap-2 justify-end">
                {['placed', 'confirmed'].includes(order.orderStatus) && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="px-4 py-2 border border-red-300 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Cancel Order Prior to Dispatch
                  </button>
                )}

                {order.orderStatus === 'delivered' && (
                  <button
                    onClick={() => setReturnModalOpen(true)}
                    className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Request 7-Day Return / Replacement
                  </button>
                )}
              </div>

            </div>
          )}

          {/* Cancellation Sub-modal */}
          {cancelModalOpen && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3 text-xs text-red-900">
              <h4 className="font-semibold">Confirm Order Cancellation</h4>
              <p>Since this consignment has not yet been handed to our courier partner, it is eligible for full instant cancellation and refund.</p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation (optional)"
                className="w-full bg-white border border-red-200 rounded p-2 text-xs text-stone-900"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 rounded text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          )}

          {/* Return Sub-modal */}
          {returnModalOpen && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3 text-xs text-stone-900">
              <h4 className="font-semibold">Request 7-Day Replacement or Return</h4>
              <p>Please describe the reason for return (e.g. damaged packaging, factory defect, size issue):</p>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Details of the issue..."
                className="w-full bg-white border border-stone-300 rounded p-2 text-xs text-stone-900"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setReturnModalOpen(false)}
                  className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 rounded text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnOrder}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Submit Return Claim
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
