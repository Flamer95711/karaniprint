import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { getProducts } from '@/app/actions/products';

const categories = [
  { name: 'Home Decor', desc: 'Minimalist accents & heritage pieces', icon: '🏺', count: '480+' },
  { name: 'Heritage Textiles', desc: 'Hand-spun organic cotton & silk', icon: '🧵', count: '620+' },
  { name: 'Polished Brass', desc: 'Kitchenware & ceremonial objects', icon: '✨', count: '310+' },
  { name: 'Woodcraft', desc: 'Sheesham, teak & mango artisanry', icon: '🪵', count: '230+' },
  { name: 'Silver Jewelry', desc: 'Handcrafted tribal & artisan jewelry', icon: '💍', count: '390+' },
  { name: 'Block Print', desc: 'Traditional Rajasthani block printing', icon: '🖨️', count: '190+' },
];

const trustStats = [
  { number: '1,200+', label: 'Verified Artisan Clusters' },
  { number: '22', label: 'Indian States Covered' },
  { number: '68', label: 'Export Destinations' },
  { number: '99.2%', label: 'On-Time Delivery Rate' },
];

const whyUs = [
  {
    icon: '🔍',
    title: 'Verified Artisan Network',
    desc: 'Every workshop is audited for ethical labor practices and quality consistency before onboarding.',
  },
  {
    icon: '🚢',
    title: 'Export-Ready Logistics',
    desc: 'Standardized packaging and automated customs documentation for seamless international shipping.',
  },
  {
    icon: '📊',
    title: 'Tiered Wholesale Pricing',
    desc: 'Unlock significant margins with volume-based pricing and direct-from-origin rates.',
  },
  {
    icon: '🌿',
    title: 'Ethical & Sustainable',
    desc: 'All products meet Fair Trade standards. We certify eco-materials and fair wage compliance.',
  },
];

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <Navbar />
      <main>
        {/* ===== HERO ===== */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div className={styles.heroPattern}></div>
          </div>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <div className="section-label">
                  <span>🇮🇳</span> India's Premier B2B Artisan Platform
                </div>
                <h1 className={styles.heroTitle}>
                  Artisan Heritage,
                  <br />
                  <span className={styles.heroAccent}>Global Scale.</span>
                </h1>
                <p className={styles.heroDesc}>
                  Sourcing directly from master artisans. Verified quality, ethical standards, and seamless international logistics for high-volume enterprise partners.
                </p>
                <div className={styles.heroCtas}>
                  <Link href="/catalog" className="btn-primary" id="hero-browse-btn">
                    Browse Wholesale Catalog
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                  <Link href="/dropshipping" className="btn-secondary" id="hero-partner-btn">
                    Partnership Program
                  </Link>
                </div>
                <div className={styles.heroTrust}>
                  {['ISO 9001 Certified', 'Fair Trade Member', 'Export Licensed'].map((t) => (
                    <div key={t} className={styles.heroTrustItem}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary-container)" stroke="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.heroRight}>
                <div className={styles.heroImageGrid}>
                  <div className={styles.heroImgMain}>
                    <img
                      src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=700&fit=crop"
                      alt="Indian artisan crafting pottery"
                    />
                    <div className={styles.heroImgBadge}>
                      <span>🏆</span>
                      <span>1,200+ Verified Artisans</span>
                    </div>
                  </div>
                  <div className={styles.heroImgSide}>
                    <img
                      src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=300&h=200&fit=crop"
                      alt="Indian handicrafts"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=200&fit=crop"
                      alt="Traditional textiles"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS BAR ===== */}
        <section className={styles.statsBar}>
          <div className="container">
            <div className={styles.statsGrid}>
              {trustStats.map((stat) => (
                <div key={stat.label} className={styles.statItem}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <section className="section section-bg">
          <div className="container">
            <div className="section-header">
              <div className="section-label">📦 Product Categories</div>
              <h2>Handpicked Collections <br />Optimized for International Export</h2>
              <p style={{ marginTop: 12, maxWidth: 560 }}>
                Curated directly from certified artisan clusters across India, each category is export-ready with standardized quality controls.
              </p>
            </div>
            <div className={styles.categoriesGrid}>
              {categories.map((cat) => (
                <Link href="/catalog" key={cat.name} className={styles.categoryCard} id={`cat-${cat.name.replace(/\s/g,'-').toLowerCase()}`}>
                  <div className={styles.catIcon}>{cat.icon}</div>
                  <div className={styles.catInfo}>
                    <h3 className={styles.catName}>{cat.name}</h3>
                    <p className={styles.catDesc}>{cat.desc}</p>
                    <span className={styles.catCount}>{cat.count} products</span>
                  </div>
                  <div className={styles.catArrow}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link href="/catalog" className="btn-ghost" id="view-all-categories-btn">
                View All Categories
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FEATURED PRODUCTS ===== */}
        <section className="section">
          <div className="container">
            <div className={styles.sectionHeaderRow}>
              <div>
                <div className="section-label">⭐ Featured Products</div>
                <h2>High-Demand Items with <br />Established Supply Chains</h2>
              </div>
              <Link href="/catalog" className="btn-secondary" id="see-all-products-btn">See All Products</Link>
            </div>

            <div className={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id} className={styles.productCard} id={`product-${product.id}`}>
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
                      <span className="btn-primary" style={{ fontSize: '0.8125rem', padding: '8px 16px' }}>
                        Add to Quote
                      </span>
                    </div>
                  </div>
                  <div className={styles.productInfo}>
                    <span className={styles.productCategory}>{product.category}</span>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <div className={styles.productMeta}>
                      <span className={styles.productOrigin}>
                        📍 {product.origin || 'India'}
                      </span>
                      <div className={styles.productRating}>
                        <span className={styles.star}>★</span>
                        <span>4.8</span>
                        <span className={styles.reviewCount}>(45)</span>
                      </div>
                    </div>
                    <div className={styles.productFooter}>
                      <span className={styles.productPrice}>₹{product.base_price} <small>/unit</small></span>
                      <span className={`badge badge-blue`}>New</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {featuredProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface-variant)', borderRadius: 12 }}>
                <span style={{ fontSize: 40 }}>📦</span>
                <h3>No products available yet</h3>
                <p style={{ color: 'var(--on-surface-variant)', marginTop: 8 }}>Products added in the admin dashboard will appear here.</p>
              </div>
            )}
          </div>
        </section>

        {/* ===== WHY BHARATCRAFT ===== */}
        <section className="section section-bg">
          <div className="container">
            <div className={styles.whyGrid}>
              <div className={styles.whyLeft}>
                <div className="section-label">💡 Why BharatCraft</div>
                <h2>We Bridge the Gap Between Traditional Indian Craftsmanship and International Retail</h2>
                <p style={{ marginTop: 16 }}>
                  Our platform is designed for enterprise procurement teams requiring reliability and scale. We combine century-old artisan knowledge with modern supply chain infrastructure.
                </p>
                <div className={styles.whyStats}>
                  <div className={styles.whyStat}>
                    <span className={styles.whyStatNum}>₹280Cr+</span>
                    <span className={styles.whyStatLabel}>Annual GMV Processed</span>
                  </div>
                  <div className={styles.whyStat}>
                    <span className={styles.whyStatNum}>340+</span>
                    <span className={styles.whyStatLabel}>Enterprise Buyers</span>
                  </div>
                </div>
                <Link href="/dropshipping" className="btn-primary" style={{ marginTop: 32 }} id="learn-more-btn">
                  Learn About Partnerships
                </Link>
              </div>
              <div className={styles.whyRight}>
                {whyUs.map((item) => (
                  <div key={item.title} className={styles.whyCard}>
                    <div className={styles.whyIcon}>{item.icon}</div>
                    <div>
                      <h4 className={styles.whyTitle}>{item.title}</h4>
                      <p className={styles.whyDesc}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA BANNER ===== */}
        <section className={styles.ctaBanner}>
          <div className="container">
            <div className={styles.ctaContent}>
              <div>
                <h2 className={styles.ctaTitle}>Ready to Start Sourcing?</h2>
                <p className={styles.ctaDesc}>
                  Join 340+ enterprise buyers sourcing from 22 Indian states. Get exclusive access to wholesale pricing and dedicated account management.
                </p>
              </div>
              <div className={styles.ctaActions}>
                <Link href="/catalog" className="btn-primary" id="cta-browse-btn">
                  Browse Catalog
                </Link>
                <Link href="/dropshipping" className={styles.ctaSecBtn} id="cta-contact-btn">
                  Contact Sales Team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
