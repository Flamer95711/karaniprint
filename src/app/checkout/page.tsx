'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import styles from './page.module.css';

type Step = 1 | 2 | 3;

const PAYMENT_OPTIONS = [
  {
    id: 'wire',
    title: 'International Wire Transfer (SWIFT/BIC)',
    desc: 'Preferred for high-volume orders. 0% processing fee.',
    icon: '🏦',
  },
  {
    id: 'card',
    title: 'Corporate Card via Stripe',
    desc: 'Instant processing. Supporting Visa, Mastercard, Amex.',
    icon: '💳',
  },
  {
    id: 'paypal',
    title: 'PayPal Business',
    desc: 'Secure digital wallet for verified entities.',
    icon: '💰',
  },
];

const PORTS = [
  'Port of Rotterdam (Netherlands)',
  'Port of Long Beach (USA)',
  'Port of Jebel Ali (UAE)',
  'Port of Singapore',
];

const SHIPPING_METHODS = [
  'Sea Freight (FCL – Full Container Load)',
  'Sea Freight (LCL – Less than Container Load)',
  'Air Freight Express (Bulk)',
];

const EXPORT_DUTY_RATE = 0.05;
const LOGISTICS_FLAT = 340;

export default function CheckoutPage() {
  const { items } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [payment, setPayment] = useState('wire');
  const [port, setPort] = useState(PORTS[0]);
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [companyName, setCompanyName] = useState('');
  const [gst, setGst] = useState('');
  const [address, setAddress] = useState('');

  const subtotal = items.reduce((s, i) => s + (i.product?.base_price ?? 0) * i.quantity, 0);
  const exportDuty = Math.round(subtotal * EXPORT_DUTY_RATE);
  const grandTotal = subtotal + exportDuty + (items.length > 0 ? LOGISTICS_FLAT : 0);

  const stepLabels = ['Shipping & Export', 'Payment', 'Review'];

  const lineProgress =
    step === 1 ? '0%' : step === 2 ? '50%' : '100%';

  return (
    <div className={styles.pageWrap}>
      {/* ── Secure Header ─────────────────────────── */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.headerLogo}>Artisan Enterprise</Link>
            <div className={styles.headerSecure}>
              🔒 Secure Wholesale Checkout
            </div>
            <div style={{ display: 'flex', gap: 12, opacity: 0.7 }}>
              <span title="Help">❓</span>
              <span title="Account">👤</span>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── Progress Stepper ─────────────────────── */}
        <div className="container">
          <div className={styles.stepper}>
            <div className={styles.stepperTrack}>
              <div className={styles.stepperLine}>
                <div
                  className={styles.stepperLineProgress}
                  style={{ width: lineProgress }}
                />
              </div>
              {stepLabels.map((label, i) => {
                const s = (i + 1) as Step;
                const isDone = step > s;
                const isActive = step === s;
                return (
                  <div key={label} className={styles.stepItem}>
                    <div
                      className={`${styles.stepCircle} ${isActive ? styles.stepCircleActive : ''} ${isDone ? styles.stepCircleDone : ''}`}
                    >
                      {isDone ? '✓' : s}
                    </div>
                    <span
                      className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Main Checkout Grid ──────────────────── */}
        <div className="container">
          <div className={styles.checkoutGrid}>

            {/* ── Left: Form Steps ──────────────────── */}
            <div>
              {/* STEP 1 — Shipping & Export */}
              {step === 1 && (
                <section className={styles.stepPanel} id="checkout-step-1">
                  <h2 className={styles.stepTitle}>Shipping &amp; Export Details</h2>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Company Name</label>
                      <input
                        id="company-name"
                        type="text"
                        className={styles.formInput}
                        placeholder="e.g. Heritage Imports Ltd."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>GST / VAT Number</label>
                      <input
                        id="gst-number"
                        type="text"
                        className={styles.formInput}
                        placeholder="Verified Business ID"
                        value={gst}
                        onChange={(e) => setGst(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Port of Destination</label>
                      <select
                        id="port-destination"
                        className={styles.formSelect}
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                      >
                        {PORTS.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Shipping Method</label>
                      <select
                        id="shipping-method"
                        className={styles.formSelect}
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      >
                        {SHIPPING_METHODS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className={`${styles.formGroup} ${styles.formGridFull}`}>
                      <label className={styles.formLabel}>Warehouse Address</label>
                      <textarea
                        id="warehouse-address"
                        className={styles.formTextarea}
                        placeholder="Street address, City, State, ZIP"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.stepNav}>
                    <button
                      id="next-to-payment"
                      className={styles.nextBtn}
                      onClick={() => setStep(2)}
                    >
                      Continue to Payment →
                    </button>
                  </div>
                </section>
              )}

              {/* STEP 2 — Payment */}
              {step === 2 && (
                <section className={styles.stepPanel} id="checkout-step-2">
                  <h2 className={styles.stepTitle}>Payment Method</h2>
                  <div className={styles.paymentOptions}>
                    {PAYMENT_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`${styles.paymentOption} ${payment === opt.id ? styles.paymentOptionSelected : ''}`}
                        htmlFor={`payment-${opt.id}`}
                      >
                        <input
                          id={`payment-${opt.id}`}
                          type="radio"
                          name="payment"
                          className={styles.paymentRadio}
                          checked={payment === opt.id}
                          onChange={() => setPayment(opt.id)}
                        />
                        <div className={styles.paymentLabel}>
                          <div className={styles.paymentTitle}>{opt.title}</div>
                          <div className={styles.paymentDesc}>{opt.desc}</div>
                        </div>
                        <span className={styles.paymentIcon}>{opt.icon}</span>
                      </label>
                    ))}
                  </div>
                  <div className={styles.stepNavBoth}>
                    <button className={styles.backBtn} onClick={() => setStep(1)}>
                      ← Back to Shipping
                    </button>
                    <button
                      id="next-to-review"
                      className={styles.nextBtn}
                      onClick={() => setStep(3)}
                    >
                      Review Order →
                    </button>
                  </div>
                </section>
              )}

              {/* STEP 3 — Review */}
              {step === 3 && (
                <section className={styles.stepPanel} id="checkout-step-3">
                  <h2 className={styles.stepTitle}>Final Order Review</h2>

                  <div className={styles.reviewAlert}>
                    <span className={styles.reviewAlertIcon}>🛡️</span>
                    <div>
                      <div className={styles.reviewAlertTitle}>Artisan Protection Applied</div>
                      <div className={styles.reviewAlertDesc}>
                        Your purchase is protected by our global trade insurance. Verified quality inspection will be conducted prior to loading at port.
                      </div>
                    </div>
                  </div>

                  <div className={styles.reviewBoxes}>
                    <div className={styles.reviewBox}>
                      <div className={styles.reviewBoxTitle}>Shipping To</div>
                      <div className={styles.reviewBoxText}>
                        {port}<br />
                        {companyName || 'Company Name'}<br />
                        {gst ? `VAT/GST: ${gst}` : 'VAT/GST: Not provided'}
                      </div>
                    </div>
                    <div className={styles.reviewBox}>
                      <div className={styles.reviewBoxTitle}>Payment Method</div>
                      <div className={styles.reviewBoxText}>
                        {PAYMENT_OPTIONS.find((o) => o.id === payment)?.title}<br />
                        Currency: INR<br />
                        Invoice will be generated upon confirmation.
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepNavBoth}>
                    <button className={styles.backBtn} onClick={() => setStep(2)}>
                      ← Edit Details
                    </button>
                    <button
                      id="complete-order-btn"
                      className={`${styles.nextBtn} ${styles.nextBtnLarge}`}
                      onClick={() => alert('Order request submitted! Our team will contact you within 24 hours.')}
                    >
                      ✅ Complete Order Request
                    </button>
                  </div>
                </section>
              )}
            </div>

            {/* ── Right: Order Summary ─────────────────── */}
            <aside className={styles.sidebar}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                {/* Items list */}
                <div className={styles.summaryItems}>
                  {items.slice(0, 4).map((item) => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div className={styles.summaryItemThumb}>
                        {item.product?.image_url ? (
                          <img src={item.product.image_url} alt={item.product?.name} />
                        ) : (
                          <div className={styles.summaryItemThumbPlaceholder}>🖼️</div>
                        )}
                      </div>
                      <div className={styles.summaryItemInfo}>
                        <div className={styles.summaryItemName}>{item.product?.name ?? 'Product'}</div>
                        <div className={styles.summaryItemQty}>Qty: {item.quantity} units</div>
                      </div>
                      <div className={styles.summaryItemPrice}>
                        ₹{((item.product?.base_price ?? 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', textAlign: 'center' }}>
                      + {items.length - 4} more item{items.length - 4 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <hr className={styles.summaryDivider} />

                <div className={styles.summaryRows}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
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
                  <div className={styles.summaryRow}>
                    <span>Duty &amp; Taxes</span>
                    <span className={styles.summaryRowValue}>TBD at Port</span>
                  </div>
                </div>

                <div className={styles.summaryTotal}>
                  <span className={styles.summaryTotalLabel}>Total Due</span>
                  <span className={styles.summaryTotalValue}>₹{grandTotal.toLocaleString()}</span>
                </div>

                <div className={styles.summaryShipNote}>
                  <span>📦</span>
                  <span>Ships from Mumbai Port, India in 12–14 business days.</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>✅ Verified Artisan</div>
                <div className={styles.trustBadge}>🌿 Export Ready</div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary-container)' }}>
              Artisan Enterprise
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: 4 }}>
              © 2024 Artisan Enterprise. Indian Heritage, Global Standards.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', opacity: 0.6, fontSize: '1.25rem' }}>
            <span title="Payments">💰</span>
            <span title="Credit Card">💳</span>
            <span title="Bank Transfer">🏦</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
