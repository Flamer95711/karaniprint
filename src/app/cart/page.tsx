'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import styles from './page.module.css';

const EXPORT_DUTY_RATE = 0.05;   // 5%
const LOGISTICS_FLAT   = 340;    // flat fee USD

const DESTINATIONS = [
  'United States (NYC Port)',
  'United Kingdom (London Gateway)',
  'European Union (Rotterdam)',
  'United Arab Emirates (Jebel Ali)',
  'Singapore (PSA)',
];

export default function CartPage() {
  const { items, totalItems, loading, updateQuantity, removeItem, clearCart } = useCart();
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [clearing, setClearing] = useState(false);
  const router = useRouter();

  // ── Price helpers ──────────────────────────────
  function unitPrice(item: typeof items[0]): number {
    const product = item.product;
    if (!product) return 0;
    return product.base_price;
  }

  function lineTotal(item: typeof items[0]): number {
    return unitPrice(item) * item.quantity;
  }

  const subtotal      = items.reduce((s, i) => s + lineTotal(i), 0);
  const exportDuty    = Math.round(subtotal * EXPORT_DUTY_RATE);
  const grandTotal    = subtotal + exportDuty + (items.length > 0 ? LOGISTICS_FLAT : 0);
  const totalQty      = items.reduce((s, i) => s + i.quantity, 0);

  async function handleClear() {
    setClearing(true);
    await clearCart();
    setClearing(false);
  }

  return (
    <>
      <Navbar />
      <div className={styles.pageWrap}>
        <div className={styles.pageHeader}>
          <div className="container">
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.pageTitle}>Wholesale Shopping Cart</h1>
                {!loading && (
                  <p className={styles.itemCount}>
                    {totalItems > 0
                      ? `${totalItems} item${totalItems !== 1 ? 's' : ''} · ${totalQty} total units`
                      : 'Your cart is empty'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className={styles.cartLayout}>

            {/* ── Items Section ─────────────────────────── */}
            <section className={styles.itemsSection}>
              {loading ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>⏳</div>
                  <h2 className={styles.emptyTitle}>Loading your cart…</h2>
                </div>
              ) : items.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>🛒</div>
                  <h2 className={styles.emptyTitle}>Your cart is empty</h2>
                  <p className={styles.emptyDesc}>
                    Browse our wholesale catalog and add items to start building your order.
                  </p>
                  <Link href="/catalog" className="btn-primary" id="cart-browse-btn">
                    Browse Wholesale Catalog
                  </Link>
                </div>
              ) : (
                <>
                  <div className={styles.tableCard}>
                    <table className={styles.table}>
                      <thead className={styles.tableThead}>
                        <tr>
                          <th>Product Details</th>
                          <th style={{ textAlign: 'center' }}>Unit Price</th>
                          <th style={{ textAlign: 'center' }}>Quantity</th>
                          <th style={{ textAlign: 'right' }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => {
                          const product = item.product;
                          const moq = product?.lots?.[0]?.qty ?? 1;
                          return (
                            <tr key={item.id} className={styles.tableRow}>
                              {/* Product Details */}
                              <td className={styles.td}>
                                <div className={styles.productCell}>
                                  <div className={styles.productThumb}>
                                    {product?.image_url ? (
                                      <img src={product.image_url} alt={product?.name ?? ''} />
                                    ) : (
                                      <div className={styles.productThumbPlaceholder}>🖼️</div>
                                    )}
                                  </div>
                                  <div className={styles.productInfo}>
                                    <div>
                                      <h3 className={styles.productName}>{product?.name ?? 'Product'}</h3>
                                      <p className={styles.productSku}>ID: {item.product_id}</p>
                                      <span className={styles.productCategory}>
                                        {product?.category ?? 'Artisan'}
                                      </span>
                                    </div>
                                    <button
                                      id={`remove-item-${item.id}`}
                                      className={styles.removeBtn}
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                                      </svg>
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Unit Price */}
                              <td className={styles.tdCenter}>
                                <div className={styles.unitPrice}>₹{unitPrice(item).toLocaleString()}</div>
                                <div className={styles.moqNote}>MOQ: {moq} units</div>
                              </td>

                              {/* Quantity Stepper */}
                              <td className={styles.tdCenter}>
                                <div className={styles.qtyStepper}>
                                  <button
                                    id={`qty-minus-${item.id}`}
                                    className={styles.qtyBtn}
                                    disabled={item.quantity <= moq}
                                    onClick={() => updateQuantity(item.id, Math.max(moq, item.quantity - 1))}
                                  >
                                    −
                                  </button>
                                  <input
                                    id={`qty-input-${item.id}`}
                                    type="number"
                                    min={moq}
                                    value={item.quantity}
                                    className={styles.qtyInput}
                                    onChange={(e) => {
                                      const v = parseInt(e.target.value, 10);
                                      if (!isNaN(v) && v >= moq) updateQuantity(item.id, v);
                                    }}
                                  />
                                  <button
                                    id={`qty-plus-${item.id}`}
                                    className={styles.qtyBtn}
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              {/* Subtotal */}
                              <td className={styles.tdRight}>
                                <span className={styles.subtotal}>
                                  ₹{lineTotal(item).toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Actions */}
                  <div className={styles.tableFooter}>
                    <Link href="/catalog" className={styles.continueBtn} id="continue-shopping-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                      Continue Sourcing
                    </Link>
                    <button
                      id="clear-cart-btn"
                      className={styles.clearBtn}
                      onClick={handleClear}
                      disabled={clearing}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                      </svg>
                      {clearing ? 'Clearing…' : 'Clear Cart'}
                    </button>
                  </div>
                </>
              )}
            </section>

            {/* ── Order Summary Sidebar ─────────────────── */}
            <aside className={styles.sidebar}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                <div className={styles.summaryRows}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal ({totalQty} units)</span>
                    <span className={styles.summaryRowValue}>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Export Duties (Est. 5%)</span>
                    <span className={styles.summaryRowValue}>₹{exportDuty.toLocaleString()}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Wholesale Logistics</span>
                    <span className={styles.summaryRowValue}>
                      {items.length > 0 ? `₹${LOGISTICS_FLAT.toLocaleString()}` : '—'}
                    </span>
                  </div>
                </div>

                <div className={styles.summaryTotal}>
                  <span className={styles.summaryTotalLabel}>Grand Total</span>
                  <span className={styles.summaryTotalValue}>₹{grandTotal.toLocaleString()}</span>
                </div>

                {/* Shipping Destination */}
                <div className={styles.shippingSection}>
                  <label className={styles.shippingLabel}>Shipping Destination</label>
                  <select
                    id="shipping-destination"
                    className={styles.shippingSelect}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <p className={styles.shippingNote}>
                    * Final logistics costs will be calculated upon shipping documentation verification.
                  </p>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  id="proceed-checkout-btn"
                  className={`${styles.checkoutBtn} ${items.length === 0 ? styles.checkoutBtnDisabled : ''}`}
                  aria-disabled={items.length === 0}
                  onClick={(e) => { if (items.length === 0) e.preventDefault(); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Proceed to Secure Checkout
                </Link>

                {/* Trust icons */}
                <div className={styles.trustIcons}>
                  <span title="Verified Secure">🔒</span>
                  <span title="Credit Card">💳</span>
                  <span title="International Shipping">🌐</span>
                  <span title="Fast Delivery">🚚</span>
                </div>
              </div>

              {/* Assurance Card */}
              <div className={styles.assuranceCard}>
                <div className={styles.assuranceIcon}>✅</div>
                <div>
                  <div className={styles.assuranceTitle}>Artisan Assurance</div>
                  <p className={styles.assuranceText}>
                    Every bulk order is inspected by our quality control team at the craft center before final export.
                  </p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
