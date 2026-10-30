import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_COUPONS, 
  INITIAL_SUPPORT_TICKETS, 
  INITIAL_SETTINGS 
} from './src/data/initialData.ts';
import { Product, User, Order, Coupon, SupportTicket, SiteSettings, PartnerPayout } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-Memory Database State
let products: Product[] = [...INITIAL_PRODUCTS];
let users: User[] = [...INITIAL_USERS];
let orders: Order[] = [...INITIAL_ORDERS];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let supportTickets: SupportTicket[] = [...INITIAL_SUPPORT_TICKETS];
let siteSettings: SiteSettings = { ...INITIAL_SETTINGS };
let partnerPayouts: PartnerPayout[] = [
  {
    id: 'PO-8821',
    partnerId: 'user-partner',
    partnerName: 'Rajesh Sharma',
    partnerCode: 'DODO-RAJESH',
    amount: 5250,
    status: 'processed',
    payoutMethod: 'UPI (rajesh@okaxis)',
    paymentReference: 'NEFT-AXIS-29104882',
    createdAt: '2026-10-15T10:00:00Z',
    processedAt: '2026-10-16T14:30:00Z'
  }
];

// ======================= API ROUTES =======================

// --- Products ---
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort, status } = req.query;
  let filtered = [...products];

  if (status) {
    filtered = filtered.filter(p => p.status === status);
  } else {
    // default public only gets active
    if (req.headers['x-admin-request'] !== 'true') {
      filtered = filtered.filter(p => p.status === 'active');
    }
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  if (sort === 'price-low') {
    filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sort === 'price-high') {
    filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  res.json({ success: true, count: filtered.length, products: filtered });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

app.post('/api/products', (req: Request, res: Response) => {
  const body = req.body;
  const newProduct: Product = {
    ...body,
    id: `prod-${Date.now()}`,
    slug: (body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    rating: body.rating || 5.0,
    reviewCount: body.reviewCount || 0,
    status: body.status || 'active',
  };
  products.unshift(newProduct);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json({ success: true, product: products[index] });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

// --- Orders ---
app.get('/api/orders', (req: Request, res: Response) => {
  const { userId, email } = req.query;
  let result = [...orders];
  if (userId) {
    result = result.filter(o => o.userId === userId);
  } else if (email) {
    result = result.filter(o => o.customerEmail.toLowerCase() === String(email).toLowerCase());
  }
  res.json({ success: true, orders: result });
});

app.get('/api/orders/track/:query', (req: Request, res: Response) => {
  const q = req.params.query.trim().toLowerCase();
  const order = orders.find(o => 
    o.id.toLowerCase() === q || 
    (o.trackingNumber && o.trackingNumber.toLowerCase() === q) ||
    o.customerPhone.replace(/[^0-9]/g, '').endsWith(q.replace(/[^0-9]/g, ''))
  );
  if (!order) {
    return res.status(404).json({ success: false, message: 'No active order matching this ID or tracking number was found.' });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const body = req.body;
  const orderNum = Math.floor(1000 + Math.random() * 9000);
  const orderId = `DODO-2026-${orderNum}`;

  // Check inventory deduction
  if (Array.isArray(body.items)) {
    for (const item of body.items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.inventory = Math.max(0, prod.inventory - item.quantity);
      }
    }
  }

  // Check affiliate partner commission
  let commissionAmount = 0;
  if (body.partnerCode) {
    const partner = users.find(u => u.partnerCode?.toLowerCase() === body.partnerCode.toLowerCase() && u.partnerStatus === 'approved');
    if (partner) {
      const rate = partner.commissionRate || siteSettings.partnerDefaultCommission || 10;
      commissionAmount = Math.round((body.subtotal * rate) / 100);
      partner.totalCommission = (partner.totalCommission || 0) + commissionAmount;
      partner.unpaidCommission = (partner.unpaidCommission || 0) + commissionAmount;
    }
  }

  const newOrder: Order = {
    id: orderId,
    userId: body.userId || undefined,
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    shippingAddress: body.shippingAddress,
    items: body.items,
    subtotal: body.subtotal,
    discount: body.discount || 0,
    couponCode: body.couponCode,
    shippingFee: body.shippingFee || 0,
    totalAmount: body.totalAmount,
    paymentMethod: body.paymentMethod,
    paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'paid',
    transactionId: body.paymentMethod === 'cod' ? undefined : (body.transactionId || `TXN-IND-${Date.now()}`),
    orderStatus: 'confirmed',
    createdAt: new Date().toISOString(),
    partnerCode: body.partnerCode,
    commissionAmount: commissionAmount > 0 ? commissionAmount : undefined,
    timeline: [
      {
        status: 'Order Placed & Confirmed',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        note: body.paymentMethod === 'cod' 
          ? 'Cash on Delivery order confirmed. Verification SMS sent to recipient phone.' 
          : `Payment of ₹${body.totalAmount.toLocaleString('en-IN')} verified successfully via ${body.paymentMethod.toUpperCase()}.`
      }
    ]
  };

  orders.unshift(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { orderStatus, trackingNumber, courierPartner, note } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierPartner) order.courierPartner = courierPartner;

  order.timeline.push({
    status: orderStatus ? `Status updated: ${orderStatus.replace(/_/g, ' ').toUpperCase()}` : 'Order Updated',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    note: note || (trackingNumber ? `Assigned tracking ${trackingNumber} with courier ${courierPartner || 'Logistics Partner'}` : 'Updated by administrator')
  });

  res.json({ success: true, order });
});

app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
  const { reason } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.orderStatus === 'dispatched' || order.orderStatus === 'in_transit' || order.orderStatus === 'delivered') {
    return res.status(400).json({ success: false, message: 'Order has already been dispatched. You may request a return upon delivery.' });
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason || 'Customer requested cancellation prior to dispatch';
  order.timeline.push({
    status: 'Order Cancelled',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    note: `Cancellation confirmed: ${order.cancellationReason}`
  });

  // Restore inventory
  for (const item of order.items) {
    const prod = products.find(p => p.id === item.productId);
    if (prod) {
      prod.inventory += item.quantity;
    }
  }

  res.json({ success: true, order, message: 'Order cancelled successfully.' });
});

app.post('/api/orders/:id/return', (req: Request, res: Response) => {
  const { reason } = req.body;
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.orderStatus = 'return_requested';
  order.returnReason = reason || 'Customer return requested';
  order.timeline.push({
    status: 'Return & Refund Requested',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    note: `Return ticket opened: ${order.returnReason}. Support team will review within 24 business hours.`
  });

  res.json({ success: true, order, message: 'Return request submitted successfully.' });
});

// --- Coupons ---
app.get('/api/coupons', (req: Request, res: Response) => {
  res.json({ success: true, coupons });
});

app.post('/api/coupons/verify', (req: Request, res: Response) => {
  const { code, cartSubtotal } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Coupon code required' });
  }

  const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired promotional code' });
  }

  if (cartSubtotal < coupon.minOrderAmount) {
    return res.status(400).json({ 
      success: false, 
      message: `Minimum cart value of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for code ${coupon.code}` 
    });
  }

  let discount = Math.round((cartSubtotal * coupon.discountPercent) / 100);
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  res.json({ success: true, coupon, discount });
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const { code, discountPercent, minOrderAmount, maxDiscount, description } = req.body;
  const newCoupon: Coupon = {
    code: code.trim().toUpperCase(),
    discountPercent: Number(discountPercent),
    minOrderAmount: Number(minOrderAmount) || 0,
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    isActive: true,
    description: description || ''
  };
  coupons.push(newCoupon);
  res.status(201).json({ success: true, coupon: newCoupon });
});

// --- Partners / Affiliates ---
app.get('/api/partners', (req: Request, res: Response) => {
  const partnerUsers = users.filter(u => u.role === 'partner');
  res.json({ success: true, partners: partnerUsers, payouts: partnerPayouts });
});

app.post('/api/partners/apply', (req: Request, res: Response) => {
  const { name, email, phone, businessType, experience, promotionalChannels, upiOrBank } = req.body;

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
  }

  const partnerCode = `DODO-${name.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  const newPartner: User = {
    id: `user-partner-${Date.now()}`,
    name,
    email,
    role: 'partner',
    phone,
    partnerStatus: 'pending',
    partnerCode,
    commissionRate: siteSettings.partnerDefaultCommission || 10,
    totalCommission: 0,
    unpaidCommission: 0,
    bankDetails: {
      accountHolder: name,
      accountNumber: '',
      ifsc: '',
      upiId: upiOrBank || ''
    },
    addresses: []
  };

  users.push(newPartner);
  res.status(201).json({ 
    success: true, 
    partner: newPartner, 
    message: 'Your DODO IMPEX 1689 Partner Application has been submitted for administrative compliance review.' 
  });
});

app.patch('/api/partners/:id/status', (req: Request, res: Response) => {
  const { status, commissionRate } = req.body;
  const partner = users.find(u => u.id === req.params.id && u.role === 'partner');
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }

  if (status) partner.partnerStatus = status;
  if (commissionRate) partner.commissionRate = Number(commissionRate);

  res.json({ success: true, partner });
});

app.post('/api/partners/payout-request', (req: Request, res: Response) => {
  const { partnerId, amount, paymentMethod } = req.body;
  const partner = users.find(u => u.id === partnerId);
  if (!partner || partner.role !== 'partner') {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }

  if ((partner.unpaidCommission || 0) < amount) {
    return res.status(400).json({ success: false, message: 'Requested amount exceeds unpaid commission balance.' });
  }

  const payout: PartnerPayout = {
    id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
    partnerId: partner.id,
    partnerName: partner.name,
    partnerCode: partner.partnerCode || '',
    amount,
    status: 'pending',
    payoutMethod: paymentMethod || partner.bankDetails?.upiId || 'Direct Bank NEFT',
    createdAt: new Date().toISOString()
  };

  partner.unpaidCommission = (partner.unpaidCommission || 0) - amount;
  partnerPayouts.unshift(payout);

  res.json({ success: true, payout, message: 'Payout request initiated. Funds will be released via NEFT/UPI within 48 hours.' });
});

// --- Support Tickets ---
app.get('/api/support', (req: Request, res: Response) => {
  const { userId, email } = req.query;
  let result = [...supportTickets];
  if (userId) {
    result = result.filter(t => t.userId === userId);
  } else if (email) {
    result = result.filter(t => t.customerEmail.toLowerCase() === String(email).toLowerCase());
  }
  res.json({ success: true, tickets: result });
});

app.post('/api/support', (req: Request, res: Response) => {
  const { customerName, customerEmail, orderId, subject, message, category, userId } = req.body;
  const newTicket: SupportTicket = {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    userId,
    customerName,
    customerEmail,
    orderId,
    subject,
    message,
    category: category || 'other',
    status: 'open',
    createdAt: new Date().toISOString(),
    replies: []
  };
  supportTickets.unshift(newTicket);
  res.status(201).json({ success: true, ticket: newTicket });
});

app.post('/api/support/:id/reply', (req: Request, res: Response) => {
  const { sender, text, isAdmin } = req.body;
  const ticket = supportTickets.find(t => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Ticket not found' });
  }

  ticket.replies.push({
    id: `rep-${Date.now()}`,
    sender: sender || 'Support Executive',
    text,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    isAdmin: !!isAdmin
  });

  if (isAdmin) {
    ticket.status = 'in_progress';
  }

  res.json({ success: true, ticket });
});

// --- Analytics & Settings ---
app.get('/api/analytics', (req: Request, res: Response) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
  const totalOrders = orders.length;
  const totalDelivered = orders.filter(o => o.orderStatus === 'delivered').length;
  const totalActivePartners = users.filter(u => u.role === 'partner' && u.partnerStatus === 'approved').length;
  const totalCommissionPaid = partnerPayouts.filter(p => p.status === 'processed').reduce((sum, p) => sum + p.amount, 0);

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      totalDelivered,
      totalActivePartners,
      totalCommissionPaid,
      averageOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
      activeProductsCount: products.filter(p => p.status === 'active').length,
      outOfStockCount: products.filter(p => p.inventory <= 0).length
    }
  });
});

app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, settings: siteSettings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  siteSettings = { ...siteSettings, ...req.body };
  res.json({ success: true, settings: siteSettings });
});

// ======================= REAL GEMINI AI INTEGRATION =======================

// 1. AI Product Description Generator for Admin
app.post('/api/gemini/generate-description', async (req: Request, res: Response) => {
  try {
    const { productName, category, keyFeatures, price } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback if API key is temporarily absent
      return res.json({
        success: true,
        data: {
          tagline: `Precision engineered ${category || 'luxury lifestyle item'} for modern discerning consumers.`,
          description: `The ${productName} embodies the highest standards of international manufacturing, blending minimalist aesthetics with exceptional functional durability. Curated for the Indian market by DODO IMPEX 1689.`,
          features: [
            'Premium aerospace-grade finish and robust construction',
            'Carefully calibrated ergonomics for everyday durability',
            'Direct-import quality assurance backed by manufacturer guarantee',
            'Pan-India express delivery with insured packaging'
          ],
          seoTitle: `${productName} — Premium Direct Import | DODO IMPEX 1689`,
          seoDescription: `Order authentic ${productName} with insured delivery across India. High quality direct import with 7-day hassle-free replacement.`
        }
      });
    }

    const prompt = `You are a world-class luxury e-commerce copywriter for "DODO IMPEX 1689", an Indian direct-import premium e-commerce brand specializing in minimalist luxury, executive lifestyle gear, and high-fidelity electronics.
Write compelling, high-converting, honest product copy for:
- Product Name: ${productName}
- Category: ${category}
- Raw Features / Notes: ${keyFeatures || 'Premium build, direct import'}
- Price: ₹${price || ''}

Respond in clean, valid JSON with exactly the following keys:
{
  "tagline": "A single refined sentence summarizing the product essence",
  "description": "2 paragraphs describing craftsmanship, materials, user experience, and authentic value",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
  "seoTitle": "Optimized SEO title under 60 chars",
  "seoDescription": "Optimized SEO meta description under 155 chars with price/warranty appeal"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Gemini Generate Description Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error generating AI description' });
  }
});

// 2. AI Customer Support Concierge & Shopping Assistant
app.post('/api/gemini/concierge', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    const catalogSummary = products.map(p => 
      `- ${p.name} (₹${p.sellingPrice}, Category: ${p.categoryLabel}, Stock: ${p.inventory > 0 ? `${p.inventory} available` : 'Out of Stock'})`
    ).join('\n');

    const systemInstruction = `You are the digital concierge for "DODO IMPEX 1689" — a premier Indian direct-import lifestyle and electronics e-commerce house.
Brand Values: Minimalist luxury, honest direct-factory pricing, transparent Pan-India courier transit, 7-day replacement policy.
Current Product Catalog:
${catalogSummary}

Key Policies:
- Free delivery across all Indian pin codes for orders over ₹999 (Flat ₹99 below ₹999).
- Delivery Time: 2–4 days for metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata), 4–6 days rest of India.
- Payment Modes: UPI (GPay, PhonePe, Paytm, BHIM), Cards (Visa, RuPay, Mastercard), Net Banking, and Cash on Delivery (COD).
- Return Policy: 7-day hassle-free replacement or return for manufacturing defects.
- Reseller/Partner Program: Authorised partners earn 10% commission on eligible verified delivered sales with zero upfront investment.

Tone: Courteous, articulate, prompt, professional, concise (1–3 paragraphs max). Always quote prices in Indian Rupees (₹).`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        reply: `Welcome to DODO IMPEX 1689. We offer curated direct-import lifestyle and electronics with complimentary tracked delivery across India for orders over ₹999. We support UPI, Cards, NetBanking, and Cash on Delivery with a 7-day replacement guarantee. How may I assist your shopping today?`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      }
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    console.error('Gemini Concierge Error:', error);
    res.json({
      success: true,
      reply: 'Thank you for reaching out to DODO IMPEX 1689. Our customer concierge is momentarily busy, but all orders above ₹999 enjoy free Pan-India tracked dispatch with full UPI, Card, and COD support.'
    });
  }
});

// --- Boot Server & Mount Vite ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DODO IMPEX 1689 Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
