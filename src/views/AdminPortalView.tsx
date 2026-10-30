import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  LifeBuoy, 
  Settings, 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Truck, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Search,
  ExternalLink
} from 'lucide-react';
import { Product, Order, User, Coupon, SupportTicket, SiteSettings } from '../types';
import { INITIAL_USERS } from '../data/initialData';

export const AdminPortalView: React.FC = () => {
  const { 
    currentUser, 
    loginUser, 
    products, 
    refreshProducts, 
    orders, 
    refreshOrders, 
    settings, 
    updateSettings, 
    showToast,
    setSelectedProduct 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'partners' | 'coupons' | 'support' | 'settings'>('overview');
  
  // Analytics State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalDelivered: 0,
    totalActivePartners: 0,
    totalCommissionPaid: 0,
    averageOrderValue: 0
  });

  // Partners & Payouts State
  const [partners, setPartners] = useState<User[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);

  // Coupons State
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);

  // Support Tickets State
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Product Edit Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Order Update State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<string>('dispatched');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [courierInput, setCourierInput] = useState('Delhivery Surface');

  // Coupon Creation State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('10');
  const [newCouponMin, setNewCouponMin] = useState('999');

  const isAdmin = currentUser?.role === 'admin';

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, partnersRes, couponsRes, supportRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/partners'),
        fetch('/api/coupons'),
        fetch('/api/support')
      ]);

      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) setStats(analyticsData.stats);

      const partnersData = await partnersRes.json();
      if (partnersData.success) {
        setPartners(partnersData.partners);
        setPayouts(partnersData.payouts);
      }

      const couponsData = await couponsRes.json();
      if (couponsData.success) setCouponsList(couponsData.coupons);

      const supportData = await supportRes.json();
      if (supportData.success) setAllTickets(supportData.tickets);
    } catch (e) {
      console.error('Error fetching admin details:', e);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
      refreshProducts();
      refreshOrders();
    }
  }, [isAdmin]);

  // If not admin, render authorization lock
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 mx-auto">
          <ShieldCheck className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-950">
          DODO IMPEX 1689 Administration Console
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed">
          This portal requires verified administrative security clearance. Sensitive financial records, courier dispatches, and inventory controls are restricted to authorized personnel.
        </p>
        <button
          onClick={() => {
            const adminUser = INITIAL_USERS.find(u => u.role === 'admin');
            if (adminUser) loginUser(adminUser);
          }}
          className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors cursor-pointer"
        >
          Sign In as DODO IMPEX Administrator
        </button>
      </div>
    );
  }

  // --- Handlers ---
  const handleGenerateAICopy = async () => {
    if (!editingProduct?.name) {
      showToast('Please enter a product name first.');
      return;
    }
    setAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: editingProduct.name,
          category: editingProduct.category || 'electronics',
          keyFeatures: editingProduct.tagline || 'Direct import, premium materials',
          price: editingProduct.sellingPrice || 2999
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEditingProduct(prev => ({
          ...prev,
          tagline: data.data.tagline || prev?.tagline,
          description: data.data.description || prev?.description,
          features: data.data.features || prev?.features,
          seoTitle: data.data.seoTitle || prev?.seoTitle,
          seoDescription: data.data.seoDescription || prev?.seoDescription
        }));
        showToast('AI Generated luxury copy, features, and SEO metadata!');
      }
    } catch (e) {
      showToast('Error generating AI product copy.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.sellingPrice) {
      showToast('Product name and selling price are mandatory.');
      return;
    }

    try {
      const isNew = !editingProduct.id;
      const url = isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = {
        ...editingProduct,
        originalPrice: editingProduct.originalPrice || editingProduct.sellingPrice,
        inventory: Number(editingProduct.inventory) || 0,
        sellingPrice: Number(editingProduct.sellingPrice),
        categoryLabel: editingProduct.category === 'electronics' ? 'Electronics & Audio' :
          editingProduct.category === 'fashion' ? 'Luxury Fashion' :
          editingProduct.category === 'desk' ? 'Executive Desk & Home' : 'Lifestyle & Travel',
        images: editingProduct.images && editingProduct.images.length > 0 
          ? editingProduct.images 
          : ['/src/assets/images/hero_luxury_trade_1793356339228.jpg']
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setProductModalOpen(false);
        setEditingProduct(null);
        showToast(isNew ? 'New product created.' : 'Product updated.');
        refreshProducts();
      }
    } catch (e) {
      showToast('Error saving product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted.');
        refreshProducts();
      }
    } catch (e) {
      showToast('Error deleting product.');
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newOrderStatus,
          trackingNumber: trackingNumberInput || undefined,
          courierPartner: courierInput || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order #${selectedOrder.id} status updated to ${newOrderStatus.toUpperCase()}`);
        setSelectedOrder(null);
        refreshOrders();
      }
    } catch (e) {
      showToast('Error updating order status.');
    }
  };

  const handlePartnerAction = async (partnerId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/partners/${partnerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Partner status updated to ${status}.`);
        fetchAdminData();
      }
    } catch (e) {
      showToast('Error updating partner.');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponCode,
          discountPercent: Number(newCouponDiscount),
          minOrderAmount: Number(newCouponMin),
          description: `Admin privilege coupon: ${newCouponDiscount}% off`
        })
      });
      const data = await res.json();
      if (data.success) {
        setCouponsList([...couponsList, data.coupon]);
        setNewCouponCode('');
        showToast(`Coupon ${data.coupon.code} created.`);
      }
    } catch (e) {
      showToast('Error creating coupon.');
    }
  };

  const handleReplyTicket = async (ticketId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/support/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'DODO Senior Operations Specialist',
          text: replyText.trim(),
          isAdmin: true
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Reply dispatched to client.');
        setReplyTicketId(null);
        setReplyText('');
        fetchAdminData();
      }
    } catch (e) {
      showToast('Error dispatching reply.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Admin Top Header */}
      <div className="bg-stone-900 text-white rounded-xl p-6 sm:p-8 border border-stone-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-amber-400">
            DODO IMPEX 1689 Central Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Executive Operations & Business Intelligence
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Signed in with Administrator Root Permissions ({currentUser.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingProduct({
                name: '',
                category: 'electronics',
                sellingPrice: 2499,
                originalPrice: 3999,
                inventory: 50,
                status: 'active',
                tagline: '',
                description: '',
                features: ['Direct factory import', 'Insured delivery across India', '7-Day replacement guarantee'],
                specifications: { 'Origin': 'International Direct Import', 'Warranty': '1 Year' },
                images: ['/src/assets/images/hero_luxury_trade_1793356339228.jpg']
              });
              setProductModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product Catalog Entry</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 text-xs font-semibold overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Analytics Overview', icon: BarChart3 },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'partners', label: `Partners (${partners.length})`, icon: Users },
          { id: 'coupons', label: `Coupons (${couponsList.length})`, icon: Tag },
          { id: 'support', label: `Support Tickets (${allTickets.length})`, icon: LifeBuoy },
          { id: 'settings', label: 'E-Commerce Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-950 font-bold bg-stone-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Analytics Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] text-stone-500 uppercase font-semibold">Total Verified Revenue</span>
              <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                ₹{orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-stone-400">All direct e-commerce transactions</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] text-stone-500 uppercase font-semibold">Total Orders Processed</span>
              <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                {orders.length}
              </div>
              <p className="text-[10px] text-stone-400">Pan-India consignments routed</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] text-stone-500 uppercase font-semibold">Average Order Value (AOV)</span>
              <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                ₹{orders.length ? Math.round(orders.reduce((s, o) => s + o.totalAmount, 0) / orders.length).toLocaleString('en-IN') : 0}
              </div>
              <p className="text-[10px] text-stone-400">Exceeds free shipping threshold</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-1 shadow-2xs">
              <span className="text-[11px] text-stone-500 uppercase font-semibold">Active Catalog SKUs</span>
              <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                {products.length}
              </div>
              <p className="text-[10px] text-stone-400">Direct-import audited products</p>
            </div>
          </div>

          {/* Recent Orders table snapshot */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-stone-950 text-base">Recent Consignments</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer"
              >
                View All Consignments →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">City & PIN</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Payment</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-mono font-bold">{o.id}</td>
                      <td className="py-2.5 px-3 font-medium text-stone-900">{o.customerName}</td>
                      <td className="py-2.5 px-3 text-stone-600">{o.shippingAddress.city} ({o.shippingAddress.pincode})</td>
                      <td className="py-2.5 px-3 font-semibold tabular-nums">₹{o.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-stone-600 uppercase text-[11px]">{o.paymentMethod}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          {o.orderStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Product Management */}
      {activeTab === 'products' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-stone-950 text-lg">Product Inventory & Catalog</h3>
              <p className="text-xs text-stone-500">Manage pricing, variants, warehouse stock and AI descriptions.</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  category: 'electronics',
                  sellingPrice: 2499,
                  originalPrice: 3999,
                  inventory: 40,
                  status: 'active',
                  tagline: '',
                  description: '',
                  features: ['Direct factory import', 'Insured pan-India courier'],
                  specifications: { 'Origin': 'International Direct Import' },
                  images: ['/src/assets/images/hero_luxury_trade_1793356339228.jpg']
                });
                setProductModalOpen(true);
              }}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold cursor-pointer"
            >
              + Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price (INR)</th>
                  <th className="py-2.5 px-3">MRP (INR)</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0] || '/src/assets/images/hero_luxury_trade_1793356339228.jpg'}
                          alt={p.name}
                          className="w-9 h-9 object-cover rounded bg-stone-100 border border-stone-200"
                        />
                        <span className="font-semibold text-stone-900 max-w-48 truncate">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">{p.sku}</td>
                    <td className="py-2.5 px-3 text-stone-600 uppercase text-[10px]">{p.category}</td>
                    <td className="py-2.5 px-3 font-semibold tabular-nums">₹{p.sellingPrice.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-stone-400 line-through tabular-nums">₹{p.originalPrice.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3">
                      <span className={`font-mono font-medium ${p.inventory < 10 ? 'text-red-600 font-bold' : 'text-stone-800'}`}>
                        {p.inventory} units
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct({ ...p });
                            setProductModalOpen(true);
                          }}
                          className="p-1 text-stone-600 hover:text-stone-950 rounded hover:bg-stone-100 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Order Management */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-serif font-bold text-stone-950 text-lg">Consignment Logistics & Status Dispatch</h3>
            <p className="text-xs text-stone-500">Update BlueDart / Delhivery AWB numbers and advance delivery stages.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Consignee & Phone</th>
                  <th className="py-2.5 px-3">Destination Address</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Courier & Tracking</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/50">
                    <td className="py-2.5 px-3 font-mono font-bold">{o.id}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-stone-900">{o.customerName}</div>
                      <div className="text-[10px] text-stone-500">{o.customerPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 max-w-44 truncate">
                      {o.shippingAddress.addressLine}, {o.shippingAddress.city} ({o.shippingAddress.pincode})
                    </td>
                    <td className="py-2.5 px-3 font-semibold tabular-nums">
                      ₹{o.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        {o.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">
                      {o.trackingNumber ? `${o.courierPartner}: ${o.trackingNumber}` : 'Pending Dispatch'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setNewOrderStatus(o.orderStatus);
                          setTrackingNumberInput(o.trackingNumber || '');
                          setCourierInput(o.courierPartner || 'Delhivery Surface');
                        }}
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-[11px] font-medium cursor-pointer"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Partner Management */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-stone-950 text-lg">Authorised Affiliate Resellers</h3>
            <p className="text-xs text-stone-500">Review pending partner applications and set eligible commission rates.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Partner Name</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Referral Code</th>
                    <th className="py-2.5 px-3">Commission %</th>
                    <th className="py-2.5 px-3">Total Earned</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {partners.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-medium text-stone-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-stone-600">{p.email}<br />{p.phone}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-800">{p.partnerCode}</td>
                      <td className="py-2.5 px-3 font-semibold">{p.commissionRate || 10}%</td>
                      <td className="py-2.5 px-3 font-semibold tabular-nums">₹{(p.totalCommission || 0).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          p.partnerStatus === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {p.partnerStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {p.partnerStatus !== 'approved' ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handlePartnerAction(p.id, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePartnerAction(p.id, 'rejected')}
                              className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded text-[11px] cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px]">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Coupons */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-stone-950 text-base">Generate Privilege Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VIP2026"
                  className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={50}
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Minimum Order Subtotal (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded p-2 text-stone-900 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold cursor-pointer"
              >
                Create Promo Code
              </button>
            </form>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-stone-950 text-base">Active Promotional Privilege Codes</h3>
            <div className="space-y-2">
              {couponsList.map((c) => (
                <div key={c.code} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-950">{c.code}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                        {c.discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">{c.description || `Min cart: ₹${c.minOrderAmount}`}</p>
                  </div>
                  <span className="text-stone-700 font-medium text-[11px]">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Customer Support Management */}
      {activeTab === 'support' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h3 className="font-serif font-bold text-stone-950 text-lg">Customer Support Inquiries</h3>
          <div className="space-y-4">
            {allTickets.map((t) => (
              <div key={t.id} className="border border-stone-200 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900">{t.id}</span>
                      <span className="text-stone-500">· from {t.customerName} ({t.customerEmail})</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm mt-0.5">{t.subject}</h4>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                    {t.status}
                  </span>
                </div>

                <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-100">
                  {t.message}
                </p>

                {t.replies && t.replies.length > 0 && (
                  <div className="space-y-1.5 pl-3 border-l-2 border-amber-500 text-xs">
                    {t.replies.map((r, ri) => (
                      <div key={ri} className="bg-stone-50 p-2.5 rounded text-[11px]">
                        <strong>{r.sender}:</strong> {r.text}
                      </div>
                    ))}
                  </div>
                )}

                {replyTicketId === t.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type official reply to client..."
                      className="w-full border border-stone-300 rounded p-2 text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyTicketId(null)}
                        className="px-3 py-1 border border-stone-300 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReplyTicket(t.id)}
                        className="px-4 py-1 bg-stone-900 text-white rounded text-xs font-semibold"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setReplyTicketId(t.id);
                        setReplyText('');
                      }}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded cursor-pointer"
                    >
                      Reply as Admin
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: E-Commerce Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6 max-w-2xl">
          <h3 className="font-serif font-bold text-stone-950 text-xl">Store Operations Configuration</h3>
          
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => updateSettings({ ...settings, brandName: e.target.value })}
                className="w-full border border-stone-300 rounded p-2"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Corporate Entity</label>
              <input
                type="text"
                value={settings.legalEntityName}
                onChange={(e) => updateSettings({ ...settings, legalEntityName: e.target.value })}
                className="w-full border border-stone-300 rounded p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Free Delivery Threshold (INR ₹)</label>
                <input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => updateSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Standard Courier Fee (INR ₹)</label>
                <input
                  type="number"
                  value={settings.standardShippingFee}
                  onChange={(e) => updateSettings({ ...settings, standardShippingFee: Number(e.target.value) })}
                  className="w-full border border-stone-300 rounded p-2 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => updateSettings({ ...settings, announcementText: e.target.value })}
                className="w-full border border-stone-300 rounded p-2"
              />
            </div>

            <button
              onClick={() => showToast('Settings saved to database.')}
              className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded font-semibold cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal with AI Copy Generator */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-5 border border-stone-200">
            
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-950 text-lg">
                {editingProduct.id ? `Edit Product: ${editingProduct.name}` : 'New Product Entry'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Copywriting Button */}
            <div className="bg-stone-950 text-white p-3.5 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-serif font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini AI Copywriter Assistant</span>
                </div>
                <div className="text-[11px] text-stone-300">
                  Auto-generate luxury copywriting, bullet features, and SEO metadata from product name.
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerateAICopy}
                disabled={aiGenerating}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded cursor-pointer disabled:opacity-50"
              >
                {aiGenerating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Aetheris Horizon ANC Headphones"
                    className="w-full border border-stone-300 rounded p-2 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || 'electronics'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full border border-stone-300 rounded p-2 text-stone-900"
                  >
                    <option value="electronics">Electronics & Audio</option>
                    <option value="fashion">Luxury Fashion & Horology</option>
                    <option value="desk">Executive Desk & Home</option>
                    <option value="lifestyle">Lifestyle & Travel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Selling Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.sellingPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sellingPrice: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">MRP / Original (INR ₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Inventory Units *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.inventory || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inventory: Number(e.target.value) })}
                    className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Short Tagline</label>
                <input
                  type="text"
                  value={editingProduct.tagline || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  placeholder="Single punchy luxury value statement"
                  className="w-full border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">SEO Title (Search Engines)</label>
                <input
                  type="text"
                  value={editingProduct.seoTitle || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, seoTitle: e.target.value })}
                  className="w-full border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-900 text-white rounded font-semibold hover:bg-stone-800"
                >
                  Save to Catalog
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <h4 className="font-bold text-sm text-stone-900">Update Consignment {selectedOrder.id}</h4>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Delivery Stage Status</label>
                <select
                  value={newOrderStatus}
                  onChange={(e) => setNewOrderStatus(e.target.value)}
                  className="w-full border border-stone-300 rounded p-2 text-stone-900 font-semibold uppercase"
                >
                  <option value="confirmed">Confirmed & Inspecting</option>
                  <option value="dispatched">Dispatched from Delhi Hub</option>
                  <option value="in_transit">In Transit (Courier Hub)</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered to Recipient</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refund Issued</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Courier Logistics Partner</label>
                <input
                  type="text"
                  value={courierInput}
                  onChange={(e) => setCourierInput(e.target.value)}
                  placeholder="e.g. Delhivery Express or BlueDart Air"
                  className="w-full border border-stone-300 rounded p-2 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">AWB Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="e.g. DEL-SR-84920199"
                  className="w-full border border-stone-300 rounded p-2 text-stone-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1.5 border border-stone-300 rounded text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-white rounded font-semibold hover:bg-stone-800"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
