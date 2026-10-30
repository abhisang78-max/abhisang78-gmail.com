import { Product, User, Order, Coupon, SupportTicket, SiteSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Aetheris Horizon ANC Wireless Headphones',
    slug: 'aetheris-horizon-anc-headphones',
    sku: 'DD-AUD-9021',
    category: 'electronics',
    categoryLabel: 'Electronics & Audio',
    tagline: 'Custom 40mm titanium drivers with hybrid 42dB active noise cancellation.',
    description: 'Engineered for audio purists and modern executives. The Aetheris Horizon combines aerospace-grade titanium hardware with ultra-soft memory foam ear cushions encased in lambskin-feel leatherette. Offers 48 hours of uninterrupted playback with rapid USB-C fast charging.',
    features: [
      'Hybrid Active Noise Cancellation up to 42dB depth',
      '40mm custom titanium dynamic diaphragms',
      'High-resolution LDAC and AAC codec support',
      '48-hour continuous battery life (32h with ANC on)',
      'Dual multi-point Bluetooth 5.4 connectivity',
      'Brushed champagne brass tactile hinge joints'
    ],
    specifications: {
      'Driver Size': '40mm Titanium composite',
      'Frequency Response': '10Hz – 40kHz',
      'Weight': '258 grams',
      'Bluetooth Version': '5.4 Low Energy',
      'Charging Time': '10 min for 5 hours playback'
    },
    sellingPrice: 4999,
    originalPrice: 7999,
    images: [
      '/src/assets/images/product_tech_anc_headphones_1793356340445.jpg'
    ],
    variants: [
      { name: 'Colorway', options: ['Obsidian Black & Brass', 'Architectural Platinum'] }
    ],
    inventory: 45,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active',
    rating: 4.9,
    reviewCount: 38,
    shippingEstimate: 'Pan-India Delivery in 3–5 Business Days',
    seoTitle: 'Aetheris Horizon ANC Wireless Headphones — DODO IMPEX 1689',
    seoDescription: 'Direct-import high-fidelity active noise-cancelling headphones. 48hr battery life, titanium drivers, and luxury ergonomics at ₹4,999.'
  },
  {
    id: 'prod-002',
    name: 'Chronographe 1689 Heritage Dual-Tone Watch',
    slug: 'chronographe-1689-heritage-watch',
    sku: 'DD-WAT-1689',
    category: 'fashion',
    categoryLabel: 'Luxury Fashion',
    tagline: 'Surgical 316L steel with 18k champagne gold bezel and Italian calfskin strap.',
    description: 'A tribute to classical horology and modern industrial precision. Featuring a scratch-resistant anti-reflective sapphire crystal, Japanese meca-quartz movement with sweeping 1/5th second chronograph hand, and hand-burnished top-grain dark leather strap.',
    features: [
      'Anti-reflective coated sapphire crystal glass',
      'High-precision Japanese meca-quartz caliber',
      '18k electroplated champagne gold tachymeter bezel',
      'Hand-stitched Italian vegetable-tanned leather',
      '50m (5 ATM) water resistance rating'
    ],
    specifications: {
      'Case Diameter': '40mm',
      'Case Thickness': '11.2mm',
      'Lug Width': '20mm',
      'Glass': 'Sapphire Crystal (AR-coated)',
      'Water Resistance': '5 ATM / 50 Meters'
    },
    sellingPrice: 6499,
    originalPrice: 9999,
    images: [
      '/src/assets/images/product_executive_chronograph_1793356342068.jpg'
    ],
    variants: [
      { name: 'Strap Leather', options: ['Espresso Brown Calfskin', 'Onyx Black Saffiano'] }
    ],
    inventory: 28,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active',
    rating: 4.95,
    reviewCount: 52,
    shippingEstimate: 'Insured Pan-India Air Express Delivery (2–4 Days)',
    seoTitle: 'Chronographe 1689 Heritage Watch — DODO IMPEX 1689',
    seoDescription: 'Direct import sapphire crystal luxury chronograph with Japanese meca-quartz movement and Italian leather strap.'
  },
  {
    id: 'prod-003',
    name: 'Sovereign Executive Full-Grain Leather Backpack',
    slug: 'sovereign-executive-leather-backpack',
    sku: 'DD-BAG-4410',
    category: 'fashion',
    categoryLabel: 'Luxury Fashion',
    tagline: 'Dual-tone top-grain leather with dedicated 16-inch armored laptop compartment.',
    description: 'Designed for the discerning frequent flier and urban executive. Handcrafted from durable full-grain cowhide leather that develops a rich individual patina with age. Includes magnetic quick-access pockets, luggage trolley pass-through sleeve, and water-repellent ballistic base.',
    features: [
      'Full-grain vegetable-tanned black and cognac leather',
      'Padded impact-absorption sleeve fits up to 16-inch laptops',
      'Luggage sleeve strap for seamless airport transit',
      'YKK Excella heavy-duty antique brass zippers',
      'Ergonomic contour shoulder harness with breathability mesh'
    ],
    specifications: {
      'Volume': '22 Litres',
      'Dimensions': '44cm x 31cm x 15cm',
      'Weight': '1.35 kg',
      'Hardware': 'Solid Antique Brass',
      'Warranty': '2 Years Craftsmanship Guarantee'
    },
    sellingPrice: 3899,
    originalPrice: 5499,
    images: [
      '/src/assets/images/product_leather_commuter_backpack_1793356342409.jpg'
    ],
    variants: [
      { name: 'Accent Tone', options: ['Cognac & Obsidian', 'Solid Midnight Black'] }
    ],
    inventory: 34,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active',
    rating: 4.88,
    reviewCount: 29,
    shippingEstimate: 'Pan-India Delivery in 3–5 Business Days',
    seoTitle: 'Sovereign Executive Leather Backpack — DODO IMPEX 1689',
    seoDescription: 'Handcrafted full-grain leather commuter backpack with 16-inch laptop armor and antique brass details.'
  },
  {
    id: 'prod-004',
    name: 'Solis Curved Brass Ambient Desk Sculpture',
    slug: 'solis-curved-brass-ambient-desk-lamp',
    sku: 'DD-LMP-8832',
    category: 'desk',
    categoryLabel: 'Executive Desk & Home',
    tagline: 'Brushed champagne gold arch with hand-blown frosted glass sphere diffuser.',
    description: 'A striking union of modern sculpture and warm atmospheric illumination. The Solis desk sculpture features an asymmetrical crescent arch milled from solid aluminum with a brushed champagne gold finish. Houses a warm 2700K flicker-free LED module with 3-step stepless touch dimming.',
    features: [
      'Sculptural crescent arch in brushed champagne gold',
      'Hand-blown frosted opaline sphere diffuser',
      'Stepless capacitive touch dimmer on base',
      'CRI > 95 warm natural 2700K soothing illumination',
      'Braided textile power cable with Indian 3-pin plug'
    ],
    specifications: {
      'Height': '38 cm',
      'Base Diameter': '18 cm',
      'Color Temperature': '2700K Warm White',
      'Power Consumption': '9W LED (60W equivalent)',
      'Lifespan': '45,000 hours'
    },
    sellingPrice: 2799,
    originalPrice: 3999,
    images: [
      '/src/assets/images/product_smart_ambient_lamp_1793356342312.jpg'
    ],
    variants: [
      { name: 'Finish', options: ['Brushed Champagne Gold', 'Matte Architectural Charcoal'] }
    ],
    inventory: 19,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active',
    rating: 4.92,
    reviewCount: 21,
    shippingEstimate: 'Double-Boxed Shock-Proof Courier Delivery (3–5 Days)',
    seoTitle: 'Solis Curved Brass Ambient Desk Lamp — DODO IMPEX 1689',
    seoDescription: 'Architectural sculptural brass desk lamp with frosted sphere diffuser and capacitive touch dimming.'
  },
  {
    id: 'prod-005',
    name: 'Aerolite MagCharge 3-in-1 Foldable Stand',
    slug: 'aerolite-magcharge-stand',
    sku: 'DD-PWR-3301',
    category: 'electronics',
    categoryLabel: 'Electronics & Audio',
    tagline: 'CNC anodized aluminum fast wireless charging station for Phone, Watch, & Buds.',
    description: 'Eliminate cable clutter on your executive workspace. The Aerolite station charges your smartphone (15W Qi2/MagSafe), smartwatch, and wireless earbuds simultaneously from a single 30W USB-C PD input. Folds flat into a 15mm slim profile for effortless business travel.',
    features: [
      'Strong N52 neodymium magnetic alignment',
      'Simultaneous 15W + 5W + 3W multi-device fast charge',
      'CNC milled aerospace aluminum heat dissipation',
      '180-degree adjustable viewing angle for StandBy mode',
      'Safety protections: Over-voltage, temperature, foreign object detection'
    ],
    specifications: {
      'Output': 'Up to 15W Phone / 5W Buds / 3W Watch',
      'Input Requirement': 'USB-C 30W PD (Included)',
      'Dimensions (Folded)': '135mm x 68mm x 16mm',
      'Weight': '210 grams'
    },
    sellingPrice: 2199,
    originalPrice: 3499,
    images: [
      '/src/assets/images/hero_luxury_trade_1793356339228.jpg'
    ],
    variants: [
      { name: 'Aluminum Finish', options: ['Space Gray', 'Silver Metallic'] }
    ],
    inventory: 60,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    status: 'active',
    rating: 4.84,
    reviewCount: 44,
    shippingEstimate: 'Pan-India Delivery in 3–5 Business Days',
    seoTitle: 'Aerolite 3-in-1 Aluminum Wireless Charger — DODO IMPEX 1689',
    seoDescription: 'Anodized aluminum MagSafe compatible 3-in-1 charging dock for smartphone, watch, and earbuds.'
  },
  {
    id: 'prod-006',
    name: 'Aurum Minimalist Anodized Desk Valet Tray',
    slug: 'aurum-minimalist-anodized-desk-valet-tray',
    sku: 'DD-DSK-1120',
    category: 'desk',
    categoryLabel: 'Executive Desk & Home',
    tagline: 'Weighted aluminum catch-all tray lined with microfiber suede.',
    description: 'Keep your everyday carry items organized in timeless style. Precision machined from a solid block of aluminum with a chamfered golden edge and lined with velvety Italian microfiber that protects luxury watches, rings, keys, and pens from scratches.',
    features: [
      'Machined from aircraft-grade solid aluminum billet',
      'Protective Italian microfiber suede inner lining',
      'Non-slip silicone footing pads protect desk finishes',
      'Subtle laser-etched DODO IMPEX 1689 seal of authenticity'
    ],
    specifications: {
      'Dimensions': '24cm x 12cm x 2cm',
      'Weight': '420 grams (substantial desk weight)',
      'Surface': 'Fine bead-blasted satin finish'
    },
    sellingPrice: 1499,
    originalPrice: 2199,
    images: [
      '/src/assets/images/hero_luxury_trade_1793356339228.jpg'
    ],
    variants: [
      { name: 'Color', options: ['Matte Obsidian & Gold', 'Brushed Champagne'] }
    ],
    inventory: 50,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    status: 'active',
    rating: 4.79,
    reviewCount: 16,
    shippingEstimate: 'Pan-India Delivery in 3–5 Business Days',
    seoTitle: 'Aurum Executive Desk Valet Tray — DODO IMPEX 1689',
    seoDescription: 'Weighted aluminum desk catch-all tray with microfiber suede lining for watches, keys, and accessories.'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountPercent: 10,
    minOrderAmount: 999,
    maxDiscount: 1000,
    isActive: true,
    description: '10% discount on your first direct order with DODO IMPEX 1689.'
  },
  {
    code: 'DODO1689',
    discountPercent: 15,
    minOrderAmount: 2499,
    maxDiscount: 2000,
    isActive: true,
    description: 'Special 15% brand inaugural privilege on orders above ₹2,499.'
  },
  {
    code: 'FESTIVE500',
    discountPercent: 12,
    minOrderAmount: 1999,
    maxDiscount: 800,
    isActive: true,
    description: '12% privilege discount for festive gifting.'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'DODO IMPEX Administrator',
    email: 'admin@dodoimpex.in',
    role: 'admin',
    phone: '+91 98765 43210',
    addresses: [
      {
        id: 'addr-admin-1',
        fullName: 'DODO IMPEX 1689 Corporate Office',
        phone: '+91 98765 43210',
        pincode: '110001',
        addressLine: 'Trade Tower, Barakhamba Road, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        landmark: 'Near Metro Gate 2',
        isDefault: true
      }
    ]
  },
  {
    id: 'user-partner',
    name: 'Rajesh Sharma',
    email: 'partner@dodoimpex.in',
    role: 'partner',
    phone: '+91 98200 12345',
    partnerStatus: 'approved',
    partnerCode: 'DODO-RAJESH',
    commissionRate: 10,
    totalCommission: 8450,
    unpaidCommission: 3200,
    bankDetails: {
      accountHolder: 'Rajesh Sharma',
      accountNumber: '918200123450',
      ifsc: 'HDFC0000123',
      upiId: 'rajesh@okaxis'
    },
    addresses: [
      {
        id: 'addr-part-1',
        fullName: 'Rajesh Sharma',
        phone: '+91 98200 12345',
        pincode: '400050',
        addressLine: 'Flat 402, Sea Green Heights, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        isDefault: true
      }
    ]
  },
  {
    id: 'user-customer',
    name: 'Aarav Mehta',
    email: 'customer@dodoimpex.in',
    role: 'customer',
    phone: '+91 99112 88440',
    addresses: [
      {
        id: 'addr-cust-1',
        fullName: 'Aarav Mehta',
        phone: '+91 99112 88440',
        pincode: '560038',
        addressLine: '14/B, 100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        landmark: 'Opposite Defence Colony Park',
        isDefault: true
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'DODO-2026-1042',
    userId: 'user-customer',
    customerName: 'Aarav Mehta',
    customerEmail: 'customer@dodoimpex.in',
    customerPhone: '+91 99112 88440',
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Aarav Mehta',
      phone: '+91 99112 88440',
      pincode: '560038',
      addressLine: '14/B, 100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Opposite Defence Colony Park',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-001',
        productName: 'Aetheris Horizon ANC Wireless Headphones',
        productImage: '/src/assets/images/product_tech_anc_headphones_1793356340445.jpg',
        quantity: 1,
        selectedVariants: { 'Colorway': 'Obsidian Black & Brass' },
        unitPrice: 4999,
        totalPrice: 4999
      }
    ],
    subtotal: 4999,
    discount: 500,
    couponCode: 'WELCOME10',
    shippingFee: 0,
    totalAmount: 4499,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    transactionId: 'UPI-TXN-984021887',
    orderStatus: 'in_transit',
    trackingNumber: 'DEL-SR-84920199',
    courierPartner: 'Delhivery Surface Express',
    createdAt: '2026-10-28T14:30:00Z',
    partnerCode: 'DODO-RAJESH',
    commissionAmount: 450,
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2026-10-28 14:30',
        note: 'Order confirmed and verified via Instant UPI.'
      },
      {
        status: 'Quality Inspected & Packed',
        timestamp: '2026-10-28 17:15',
        note: 'Item serialized and packed in tamper-proof bubble mailer.'
      },
      {
        status: 'Handed to Delhivery Courier',
        timestamp: '2026-10-29 10:00',
        note: 'Dispatched from Central Hub (New Delhi) AWB #DEL-SR-84920199.'
      },
      {
        status: 'In Transit',
        timestamp: '2026-10-29 23:40',
        note: 'Arrived at Bengaluru North Gateway sorting facility.'
      }
    ]
  },
  {
    id: 'DODO-2026-1039',
    userId: 'user-customer',
    customerName: 'Aarav Mehta',
    customerEmail: 'customer@dodoimpex.in',
    customerPhone: '+91 99112 88440',
    shippingAddress: {
      id: 'addr-cust-1',
      fullName: 'Aarav Mehta',
      phone: '+91 99112 88440',
      pincode: '560038',
      addressLine: '14/B, 100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      isDefault: true
    },
    items: [
      {
        productId: 'prod-004',
        productName: 'Solis Curved Brass Ambient Desk Sculpture',
        productImage: '/src/assets/images/product_smart_ambient_lamp_1793356342312.jpg',
        quantity: 1,
        selectedVariants: { 'Finish': 'Brushed Champagne Gold' },
        unitPrice: 2799,
        totalPrice: 2799
      }
    ],
    subtotal: 2799,
    discount: 0,
    shippingFee: 0,
    totalAmount: 2799,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    transactionId: 'PAY-CARD-44109281',
    orderStatus: 'delivered',
    trackingNumber: 'BLUEDART-984210',
    courierPartner: 'BlueDart Air',
    createdAt: '2026-10-20T11:15:00Z',
    timeline: [
      { status: 'Order Placed', timestamp: '2026-10-20 11:15', note: 'Paid via Visa Card.' },
      { status: 'Dispatched', timestamp: '2026-10-21 09:30', note: 'Dispatched via BlueDart Air.' },
      { status: 'Delivered', timestamp: '2026-10-23 15:45', note: 'Delivered and signed by Aarav Mehta.' }
    ]
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-8921',
    userId: 'user-customer',
    customerName: 'Aarav Mehta',
    customerEmail: 'customer@dodoimpex.in',
    orderId: 'DODO-2026-1042',
    subject: 'Estimated delivery window for Bengaluru Indiranagar',
    message: 'Could you confirm whether the courier will attempt delivery during morning hours or afternoon?',
    category: 'shipping',
    status: 'in_progress',
    createdAt: '2026-10-29T16:20:00Z',
    replies: [
      {
        id: 'rep-1',
        sender: 'DODO Support Team',
        text: 'Hello Aarav, your package arrived at the Bengaluru hub this morning and is scheduled for out-for-delivery tomorrow between 11:00 AM and 2:00 PM. The delivery agent will call your registered number beforehand.',
        timestamp: '2026-10-29 18:00',
        isAdmin: true
      }
    ]
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'DODO IMPEX 1689',
  legalEntityName: 'DODO IMPEX 1689 Global Trade Solutions',
  supportEmail: 'care@dodoimpex.in',
  supportPhone: '+91 (011) 4982-1689',
  businessAddress: 'Barakhamba Road, Connaught Place, New Delhi 110001, India',
  gstinPlaceholder: '07AAACD1689P1Z9 (Provisional Incorporation)',
  freeShippingThreshold: 999,
  standardShippingFee: 99,
  enableCod: true,
  codFee: 0,
  partnerDefaultCommission: 10,
  announcementText: 'Complimentary Pan-India Tracked Express Delivery on all orders above ₹999.',
  announcementActive: true
};
