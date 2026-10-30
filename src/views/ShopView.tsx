import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { 
    products, 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    setIsConciergeOpen
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [priceRange, setPriceRange] = useState<'all' | 'under2k' | '2kto5k' | 'above5k'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Curations' },
    { id: 'electronics', label: 'Audio & Electronics' },
    { id: 'fashion', label: 'Horology & Leather' },
    { id: 'desk', label: 'Executive Desk & Home' },
    { id: 'lifestyle', label: 'Lifestyle & Travel' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Price bracket
    if (priceRange === 'under2k') {
      list = list.filter(p => p.sellingPrice < 2000);
    } else if (priceRange === '2kto5k') {
      list = list.filter(p => p.sellingPrice >= 2000 && p.sellingPrice <= 5000);
    } else if (priceRange === 'above5k') {
      list = list.filter(p => p.sellingPrice > 5000);
    }

    // In stock
    if (inStockOnly) {
      list = list.filter(p => p.inventory > 0);
    }

    // Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 pb-24">
      
      {/* Header Banner */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-semibold tracking-wider text-amber-800">
            DODO IMPEX 1689 Storefront
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 mt-1">
            Curated Direct-Import Collection
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Inspected international lifestyle pieces and technology accessories at fair factory pricing in Indian Rupees (₹).
          </p>
        </div>

        {/* Quick AI Search Assistant Button */}
        <button
          onClick={() => setIsConciergeOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-amber-300 hover:bg-stone-800 rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Concierge for Advice</span>
        </button>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-6">
          
          {/* Search box in sidebar */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-900 uppercase tracking-wide">
              Keyword Filter
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titanium, leather, lamps..."
                className="w-full bg-stone-50 border border-stone-300 rounded-md pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
              Product Categories
            </h3>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors cursor-pointer flex justify-between items-center ${
                    selectedCategory === c.id
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="text-[11px] opacity-70">
                    {c.id === 'all' ? products.length : products.filter(p => p.category === c.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wide">
              Price Range (INR ₹)
            </h3>
            <div className="space-y-1.5 text-xs text-stone-700">
              {[
                { id: 'all', label: 'All Price Tiers' },
                { id: 'under2k', label: 'Under ₹2,000' },
                { id: '2kto5k', label: '₹2,000 – ₹5,000' },
                { id: 'above5k', label: 'Above ₹5,000' }
              ].map((tier) => (
                <label key={tier.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === tier.id}
                    onChange={() => setPriceRange(tier.id as any)}
                    className="accent-amber-600"
                  />
                  <span>{tier.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-2 border-t border-stone-200">
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-amber-600"
              />
              <span>In Stock Only ({products.filter(p => p.inventory > 0).length})</span>
            </label>
          </div>

          {/* Reset Filters */}
          <div className="pt-2 border-t border-stone-200">
            <button
              onClick={resetAllFilters}
              className="w-full py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>

        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar: Active count & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-stone-100/70 border border-stone-200 rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900">
                {filteredProducts.length} items available
              </span>
              {(selectedCategory !== 'all' || searchQuery || priceRange !== 'all' || inStockOnly) && (
                <span className="text-[11px] text-amber-800">· Filtered</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded font-medium text-stone-800 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                <span className="text-stone-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer font-medium"
                >
                  <option value="featured">Featured Curation</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden p-4 bg-white border border-stone-200 rounded-lg space-y-4 shadow-sm text-xs">
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Category</h4>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1.5 rounded border text-xs cursor-pointer ${
                        selectedCategory === c.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-300 text-stone-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-stone-900 mb-1.5">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'under2k', label: '< ₹2,000' },
                    { id: '2kto5k', label: '₹2,000 - ₹5,000' },
                    { id: 'above5k', label: '> ₹5,000' }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setPriceRange(tier.id as any)}
                      className={`px-2.5 py-1 rounded border text-xs cursor-pointer ${
                        priceRange === tier.id ? 'bg-stone-900 text-white' : 'bg-stone-50 border-stone-300 text-stone-700'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button onClick={resetAllFilters} className="text-stone-500 underline cursor-pointer">
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="px-4 py-1.5 bg-stone-900 text-white rounded font-medium cursor-pointer"
                >
                  Apply & Close
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-stone-50 border border-stone-200 rounded-xl p-8">
              <h3 className="font-serif font-bold text-stone-900 text-xl">No Matching Curations Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                We could not find any products matching your specific search query or active price brackets.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
