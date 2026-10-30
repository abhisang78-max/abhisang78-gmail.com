export type ProductCategory = 
  | 'electronics' 
  | 'lifestyle' 
  | 'fashion' 
  | 'desk' 
  | 'home';

export interface ProductVariant {
  name: string; // e.g. "Color" or "Storage"
  options: string[]; // e.g. ["Obsidian Black", "Champagne Gold"]
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: ProductCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  sellingPrice: number; // in INR ₹
  originalPrice: number; // in INR ₹
  images: string[];
  variants: ProductVariant[];
  inventory: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  status: 'active' | 'draft' | 'archived';
  rating: number;
  reviewCount: number;
  shippingEstimate: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
  landmark?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'partner' | 'admin';
  phone?: string;
  partnerStatus?: 'pending' | 'approved' | 'rejected';
  partnerCode?: string;
  commissionRate?: number; // e.g. 10 for 10%
  totalCommission?: number;
  unpaidCommission?: number;
  bankDetails?: {
    accountHolder: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
  };
  addresses: Address[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
  unitPrice: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  selectedVariants: Record<string, string>;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderMilestone {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string; // e.g. DODO-2026-9812
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  transactionId?: string;
  orderStatus: 
    | 'placed' 
    | 'confirmed' 
    | 'dispatched' 
    | 'in_transit' 
    | 'out_for_delivery' 
    | 'delivered' 
    | 'cancelled' 
    | 'return_requested' 
    | 'refunded';
  trackingNumber?: string;
  courierPartner?: string;
  createdAt: string;
  timeline: OrderMilestone[];
  partnerCode?: string;
  commissionAmount?: number;
  cancellationReason?: string;
  returnReason?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount?: number;
  isActive: boolean;
  description: string;
}

export interface SupportReply {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  orderId?: string;
  subject: string;
  message: string;
  category: 'order' | 'shipping' | 'product' | 'return' | 'partner' | 'other';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  replies: SupportReply[];
}

export interface PartnerPayout {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerCode: string;
  amount: number;
  status: 'pending' | 'processed' | 'declined';
  payoutMethod: string;
  paymentReference?: string;
  createdAt: string;
  processedAt?: string;
}

export interface SiteSettings {
  brandName: string;
  legalEntityName: string;
  supportEmail: string;
  supportPhone: string;
  businessAddress: string;
  gstinPlaceholder: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  enableCod: boolean;
  codFee: number;
  partnerDefaultCommission: number;
  announcementText: string;
  announcementActive: boolean;
}
