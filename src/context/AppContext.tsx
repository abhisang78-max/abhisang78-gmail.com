import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, Order, Coupon, CartItem, SiteSettings, SupportTicket } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';

interface AppContextType {
  // Navigation & Views
  currentView: 'home' | 'shop' | 'track' | 'account' | 'partner' | 'admin' | 'legal';
  setCurrentView: (view: 'home' | 'shop' | 'track' | 'account' | 'partner' | 'admin' | 'legal') => void;
  legalPageType: 'about' | 'contact' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'cancellation' | 'partner-terms';
  openLegalPage: (type: 'about' | 'contact' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'cancellation' | 'partner-terms') => void;

  // Selected Product for Details
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Catalog State
  products: Product[];
  refreshProducts: () => Promise<void>;
  updateLocalProduct: (p: Product) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;

  // Coupon
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // User & Auth
  currentUser: User | null;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'switch';
  setAuthModalMode: (mode: 'login' | 'register' | 'switch') => void;

  // Orders
  orders: Order[];
  refreshOrders: () => Promise<void>;
  placedOrder: Order | null;
  setPlacedOrder: (o: Order | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Tracking Modal
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackingQueryId: string;
  setTrackingQueryId: (id: string) => void;

  // AI Concierge
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;

  // Affiliate Referral Tracking
  affiliateCode: string | null;

  // Site Settings
  settings: SiteSettings;
  updateSettings: (newSettings: SiteSettings) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'track' | 'account' | 'partner' | 'admin' | 'legal'>('home');
  const [legalPageType, setLegalPageType] = useState<'about' | 'contact' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'cancellation' | 'partner-terms'>('about');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dodo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dodo_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dodo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'switch'>('login');
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingQueryId, setTrackingQueryId] = useState('');
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Check URL params for affiliate referral: ?ref=DODO-XXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setAffiliateCode(ref);
      showToast(`Affiliate Partner Referral Applied: ${ref}`);
    }
  }, []);

  // Fetch initial products
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products?status=all', {
        headers: { 'x-admin-request': 'true' }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  };

  const refreshOrders = async () => {
    try {
      const url = currentUser?.role === 'admin' 
        ? '/api/orders' 
        : (currentUser ? `/api/orders?userId=${currentUser.id}` : '/api/orders');
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
    fetchSettings();
  }, [currentUser]);

  // Save cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dodo_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('dodo_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1, selectedVariants: Record<string, string> = {}) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product,
          quantity,
          selectedVariants,
          unitPrice: product.sellingPrice
        }];
      }
    });

    showToast(`Added "${product.name}" to your bag.`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedVariants: Record<string, string> = {}) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedVariants);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants)) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, selectedVariants: Record<string, string> = {}) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && JSON.stringify(item.selectedVariants) === JSON.stringify(selectedVariants))
    ));
    showToast('Item removed from your bag.');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved wishlist.');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist.');
        return [...prev, productId];
      }
    });
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartSubtotal })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discount);
        showToast(`Privilege Code ${data.coupon.code} applied! Saved ₹${data.discount.toLocaleString('en-IN')}`);
        return { success: true, message: `Code ${data.coupon.code} applied successfully.` };
      } else {
        return { success: false, message: data.message || 'Invalid coupon code.' };
      }
    } catch (e: any) {
      return { success: false, message: 'Could not verify coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Privilege code removed.');
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('dodo_user', JSON.stringify(user));
    } catch (e) {}
    showToast(`Welcome, ${user.name}`);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('dodo_user');
    } catch (e) {}
    showToast('You have been logged out.');
  };

  const openLegalPage = (type: 'about' | 'contact' | 'privacy' | 'terms' | 'shipping' | 'returns' | 'cancellation' | 'partner-terms') => {
    setLegalPageType(type);
    setCurrentView('legal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateLocalProduct = (p: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(item => item.id === p.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = p;
        return next;
      }
      return [p, ...prev];
    });
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        legalPageType,
        openLegalPage,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        products,
        refreshProducts,
        updateLocalProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        currentUser,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        orders,
        refreshOrders,
        placedOrder,
        setPlacedOrder,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingQueryId,
        setTrackingQueryId,
        isConciergeOpen,
        setIsConciergeOpen,
        affiliateCode,
        settings,
        updateSettings,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
