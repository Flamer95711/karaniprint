'use client';

import { useState, use, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { getProduct, type Product } from '@/app/actions/products';
import { useCart } from '@/lib/cart-context';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping'>('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const qtyRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct(Number(id))
      .then(data => {
        setProduct(data);
        if (data?.sizes?.length) {
          setSelectedSize(data.sizes[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    const qty = parseInt(qtyRef.current?.value ?? '1', 10);
    await addToCart(product.id, isNaN(qty) ? 1 : qty);
    setAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.notFound} style={{ paddingTop: 100, textAlign: 'center' }}>
          <h1>⏳ Loading product...</h1>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className={styles.notFound}>
          <h1>Product not found</h1>
          <Link href="/catalog" className="btn-secondary">Back to Catalog</Link>
        </main>
      </>
    );
  }

  const gallery = product.image_url ? [product.image_url] : ['https://via.placeholder.com/700x800'];
  const moqTiers = product.lots && product.lots.length > 0 
    ? product.lots 
    : [{ qty: 50, price: product.base_price }];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        <div className={styles.breadcrumb}>
          <div className="container">
            <div className={styles.breadcrumbRow}>
              <Link href="/">Home</Link>
              <span>›</span>
              <Link href="/catalog">Catalog</Link>
              <span>›</span>
              <span>{product.category}</span>
              <span>›</span>
              <span className={styles.breadcrumbCurrent}>{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.productLayout}>
            <div className={styles.gallery}>
              <div className={styles.mainImageWrap}>
                <img
                  src={gallery[selectedImage] || gallery[0]}
                  alt={product.name}
                  className={styles.mainImage}
                />
                <span className={`badge badge-gold ${styles.mainBadge}`}>New</span>
              </div>
              <div className={styles.thumbnails}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    id={`thumbnail-${i}`}
                    className={`${styles.thumbnail} ${selectedImage === i ? styles.thumbActive : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.productDetails}>
              <div className={styles.detailsTop}>
                <span className={styles.categoryLabel}>{product.category}</span>
                <div className={styles.ratingRow}>
                  <span className={styles.stars}>★★★★★</span>
                  <span className={styles.ratingNum}>4.8</span>
                  <span className={styles.ratingCount}>(45 buyer reviews)</span>
                </div>
              </div>

              <h1 className={styles.productTitle}>{product.name}</h1>

              <div className={styles.artisanRow}>
                <div className={styles.artisanAvatar}>🏺</div>
                <div>
                  <div className={styles.artisanName}>Verified Artisan Workshop</div>
                  <div className={styles.artisanOrigin}>📍 {product.origin || 'India'}</div>
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className={styles.sizesSection}>
                  <h4 className={styles.sizesTitle}>Available Sizes</h4>
                  <div className={styles.sizesList}>
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeBtnActive : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className={styles.sizesSection} style={{ marginTop: 20 }}>
                  <h4 className={styles.sizesTitle}>Available Colors</h4>
                  <div className={styles.sizesList} style={{ display: 'flex', gap: 10 }}>
                    {product.colors.map((c) => (
                      <div key={c} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: '1px solid #ddd' }} title={c}></div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.pricingCard}>
                <h3 className={styles.pricingTitle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Tiered Wholesale Pricing
                </h3>
                <table className={styles.pricingTable}>
                  <thead>
                    <tr>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moqTiers.map((tier, i) => (
                      <tr key={i} className={i === 0 ? styles.tierHighlight : ''}>
                        <td>{tier.qty} units</td>
                        <td className={styles.tierPrice}>₹{tier.price}</td>
                        <td className={styles.tierSavings}>
                          {i === 0 ? 'Base price' : `Save ₹${moqTiers[0].price - tier.price}/unit`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.addToQuote}>
                <div className={styles.quantityWrap}>
                  <label htmlFor="qty-input" className={styles.qtyLabel}>Order Quantity</label>
                  <input
                    id="qty-input"
                    ref={qtyRef}
                    type="number"
                    min={moqTiers[0]?.qty || 1}
                    defaultValue={moqTiers[0]?.qty || 50}
                    className={`input ${styles.qtyInput}`}
                  />
                </div>
                <button
                  id="add-to-cart-btn"
                  className={`btn-primary ${styles.quoteBtn}`}
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? '⏳ Adding…' : addedToCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
                </button>
              </div>

              <div className={styles.certifications}>
                <span className={styles.certBadge}>🌿 Eco-Certified Materials</span>
                <span className={styles.certBadge}>✓ Fair Trade Workshop</span>
                <span className={styles.certBadge}>🚢 Export Licensed</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabsSection}>
            <div className={styles.tabs}>
              {(['description', 'specs', 'shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'description' ? 'Product Description' : tab === 'specs' ? 'Specifications' : 'Shipping & Export'}
                </button>
              ))}
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'description' && (
                <div className={styles.tabDescription}>
                  <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--on-surface-variant)' }}>
                    {product.description || 'No description provided for this product.'}
                  </p>
                </div>
              )}
              {activeTab === 'specs' && (
                <table className={styles.specsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.specKey}>Category</td>
                      <td className={styles.specValue}>{product.category}</td>
                    </tr>
                    <tr>
                      <td className={styles.specKey}>Origin</td>
                      <td className={styles.specValue}>{product.origin || 'India'}</td>
                    </tr>
                    <tr>
                      <td className={styles.specKey}>Stock Status</td>
                      <td className={styles.specValue}>{product.stock_status}</td>
                    </tr>
                  </tbody>
                </table>
              )}
              {activeTab === 'shipping' && (
                <div className={styles.shippingInfo}>
                  {[
                    { icon: '📦', title: 'Standard Export Packaging', desc: 'Individual bubble wrap with export-grade carton, max 24 units per carton.' },
                    { icon: '🚢', title: 'Shipping Modes', desc: 'Air freight (3–5 days), Sea freight (18–25 days). FOB Mumbai or Delhi.' },
                    { icon: '📋', title: 'Documentation', desc: 'Auto-generated Certificate of Origin, Packing List, Commercial Invoice, and Phytosanitary certificate if needed.' },
                    { icon: '🔄', title: 'Returns Policy', desc: 'Quality-defective items accepted within 30 days of delivery. Replacement or credit note issued within 5 business days.' },
                  ].map((item) => (
                    <div key={item.title} className={styles.shippingCard}>
                      <span className={styles.shippingIcon}>{item.icon}</span>
                      <div>
                        <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', marginBottom: 4 }}>{item.title}</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{item.desc}</p>
                      </div>
                    </div>
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
