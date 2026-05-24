'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { getProducts, type Product } from '@/app/actions/products';
import { useCart } from '@/lib/cart-context';

const categories = ['All', 'Home Decor', 'Textiles', 'Woodcraft', 'Brass', 'Jewelry'];

export default function CatalogPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then(data => setAllProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleQuickAdd(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    e.stopPropagation();
    const moq = product.lots?.[0]?.qty ?? 1;
    await addToCart(product.id, moq);
    setAddedIds(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds(prev => { const s = new Set(prev); s.delete(product.id); return s; });
    }, 2000);
  }

  const filtered = allProducts
    .filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.origin || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice =
        priceRange === 'all' ? true :
        priceRange === 'low' ? p.base_price < 500 :
        priceRange === 'mid' ? p.base_price >= 500 && p.base_price < 1500 :
        p.base_price >= 1500;
      return matchCat && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.base_price - b.base_price;
      if (sortBy === 'price-desc') return b.base_price - a.base_price;
      return 0; // Default or popular sort fallback
    });

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className="container">
            <div className="section-label">🛒 Wholesale Catalog</div>
            <h1>Browse Our Wholesale Collection</h1>
            <p>Sourced from 1,200+ verified artisan clusters across 22 Indian states.</p>
          </div>
        </div>

        <div className="container">
          <div className={styles.catalogLayout}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
              <div className={styles.filterCard}>
                <h3 className={styles.filterTitle}>Categories</h3>
                <div className={styles.filterList}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      id={`filter-${cat.replace(/\s/g,'-').toLowerCase()}`}
                      className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterActive : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                      <span className={styles.filterCount}>
                        {cat === 'All' ? allProducts.length : allProducts.filter(p => p.category === cat).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterCard}>
                <h3 className={styles.filterTitle}>Price Range (₹/unit)</h3>
                <div className={styles.filterList}>
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'low', label: 'Under ₹500' },
                    { value: 'mid', label: '₹500 – ₹1,500' },
                    { value: 'high', label: 'Above ₹1,500' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      id={`price-${opt.value}`}
                      className={`${styles.filterBtn} ${priceRange === opt.value ? styles.filterActive : ''}`}
                      onClick={() => setPriceRange(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterCard}>
                <h3 className={styles.filterTitle}>Trust Badges</h3>
                <div className={styles.badgeFilters}>
                  {['Verified Artisan', 'Eco-Friendly', 'Export Ready', 'Fair Trade'].map((b) => (
                    <span key={b} className="badge badge-blue" style={{ cursor: 'pointer' }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* Bulk Inquiry Box */}
              <div className={styles.inquiryBox}>
                <h4>🤝 Bulk Inquiry</h4>
                <p>Need custom specifications for your enterprise order?</p>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} id="bulk-inquiry-btn">
                  Request Custom Quote
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className={styles.mainContent}>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                  <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    id="catalog-search"
                    type="text"
                    placeholder="Search products or origin..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className={styles.sortWrap}>
                  <span className={styles.sortLabel}>{filtered.length} products</span>
                  <select
                    id="catalog-sort"
                    className="input"
                    style={{ width: 'auto' }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className={styles.emptyState}>
                  <span>⏳</span>
                  <p>Loading catalog...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <span>🔍</span>
                  <p>No products match your filters. Try adjusting the search.</p>
                </div>
              ) : (
                <div className={styles.productsGrid}>
                  {filtered.map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard} id={`catalog-product-${product.id}`}>
                      <div className={styles.productImageWrap}>
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className={styles.productImage} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-variant)' }}>
                            <span style={{ fontSize: 40 }}>🖼️</span>
                          </div>
                        )}
                        <span className={`badge badge-gold ${styles.moqBadge}`}>MOQ: 50</span>
                        <div className={styles.productOverlay}>
                            <button
                              id={`quick-add-${product.id}`}
                              className="btn-primary"
                              style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
                              onClick={(e) => handleQuickAdd(e, product)}
                            >
                              {addedIds.has(product.id) ? '✓ Added!' : '🛒 Add to Cart'}
                            </button>
                          </div>
                      </div>
                      <div className={styles.productInfo}>
                        <div className={styles.productTopRow}>
                          <span className={styles.productCategory}>{product.category}</span>
                          <span className="badge badge-blue" style={{ fontSize: '0.6875rem' }}>New</span>
                        </div>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <div className={styles.productOrigin}>📍 {product.origin || 'India'}</div>
                        <div className={styles.productFooter}>
                          <div>
                            <span className={styles.productPrice}>₹{product.base_price.toLocaleString()}</span>
                            <span className={styles.perUnit}>/unit</span>
                          </div>
                          <div className={styles.productRating}>
                            <span className={styles.star}>★</span>
                            <span>4.8</span>
                            <span className={styles.reviewCount}>(45)</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
