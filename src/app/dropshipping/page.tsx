import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PartnerForm from './PartnerForm';
import styles from './page.module.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dropshipping Partnership | BharatCraft Wholesale',
  description: 'Partner with BharatCraft for seamless dropshipping of Indian artisan products. White-label fulfillment, real-time inventory, and automated logistics.',
};

const benefits = [
  { icon: '🏭', title: 'Direct Manufacturer Access', desc: 'Skip intermediaries. Connect directly with 1,200+ verified artisan workshops.' },
  { icon: '📦', title: 'White-Label Fulfillment', desc: 'We pack and ship under your brand. Custom inserts and packaging available.' },
  { icon: '🔄', title: 'Real-Time Inventory Sync', desc: 'Live API feed keeps your storefront updated with accurate stock levels.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track your orders, revenue, and artisan performance in one unified view.' },
  { icon: '🚢', title: 'Global Shipping', desc: 'Ship to 68 countries with automated customs documentation and tracking.' },
  { icon: '🌿', title: 'Sustainability Reports', desc: 'Get quarterly impact reports on artisan welfare and eco-material usage.' },
];

const plans = [
  {
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    desc: 'For boutique retailers and new importers',
    features: ['Up to 50 SKUs', '10 Orders/day', 'Standard packaging', 'Email support', 'Basic analytics'],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '₹14,999',
    period: '/month',
    desc: 'For growing e-commerce businesses',
    features: ['Up to 300 SKUs', '100 Orders/day', 'White-label packaging', 'Priority support', 'Advanced analytics', 'Custom inserts', 'Dedicated account manager'],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large-scale retail and marketplace operations',
    features: ['Unlimited SKUs', 'Unlimited orders', 'Custom packaging line', '24/7 support', 'Full API access', 'SLA guarantees', 'On-site audits'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const steps = [
  { num: '01', title: 'Apply & Onboard', desc: 'Fill out the partner application. Our team reviews and approves within 2 business days.' },
  { num: '02', title: 'Select Products', desc: 'Browse our verified catalog and add products to your dropship portfolio.' },
  { num: '03', title: 'Integrate & Sync', desc: 'Connect via API or CSV. Sync inventory and pricing with your storefront.' },
  { num: '04', title: 'Sell & Fulfill', desc: 'Your customer orders. We pack, ship, and handle customs under your brand.' },
];

export default function DropshippingPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72 }}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <div className={styles.heroLeft}>
                <div className="section-label">🤝 Partnership Program</div>
                <h1>Scale Your Retail Business with Indian Artisan Products</h1>
                <p className={styles.heroDesc}>
                  Bridging Indian heritage and global standards through reliable wholesale partnerships. No inventory risk. We handle fulfillment, customs, and logistics.
                </p>
                <div className={styles.heroCtas}>
                  <Link href="#apply" className="btn-primary" id="apply-partner-btn">
                    Apply as Partner
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                  <Link href="/catalog" className="btn-secondary" id="view-catalog-link">
                    View Catalog
                  </Link>
                </div>
              </div>
              <div className={styles.heroRight}>
                <div className={styles.heroStats}>
                  {[
                    { num: '340+', label: 'Active Partners' },
                    { num: '68', label: 'Countries Served' },
                    { num: '₹280Cr+', label: 'Partner Revenue' },
                    { num: '99.2%', label: 'Fulfillment Rate' },
                  ].map((s) => (
                    <div key={s.label} className={styles.heroStat}>
                      <span className={styles.heroStatNum}>{s.num}</span>
                      <span className={styles.heroStatLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section section-bg">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>✨ Partner Benefits</div>
              <h2>Everything You Need to Succeed</h2>
            </div>
            <div className={styles.benefitsGrid}>
              {benefits.map((b) => (
                <div key={b.title} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>{b.icon}</div>
                  <h3 className={styles.benefitTitle}>{b.title}</h3>
                  <p className={styles.benefitDesc}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>🔄 Process</div>
              <h2>How Dropshipping Works</h2>
            </div>
            <div className={styles.stepsGrid}>
              {steps.map((step, i) => (
                <div key={step.num} className={styles.step}>
                  <div className={styles.stepNum}>{step.num}</div>
                  {i < steps.length - 1 && <div className={styles.stepConnector}></div>}
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="section section-bg" id="apply">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>💰 Pricing</div>
              <h2>Transparent Partnership Plans</h2>
              <p style={{ marginTop: 12 }}>No hidden fees. Scale as you grow.</p>
            </div>
            <div className={styles.plansGrid}>
              {plans.map((plan) => (
                <div key={plan.name} className={`${styles.planCard} ${plan.highlighted ? styles.planHighlighted : ''}`}>
                  {plan.highlighted && <div className={styles.planBadge}>Most Popular</div>}
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planDesc}>{plan.desc}</p>
                  <div className={styles.planPrice}>
                    <span className={styles.planAmount}>{plan.price}</span>
                    <span className={styles.planPeriod}>{plan.period}</span>
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f) => (
                      <li key={f} className={styles.planFeature}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={plan.highlighted ? 'white' : 'var(--primary-container)'} strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    id={`plan-${plan.name.toLowerCase()}-btn`}
                    className={plan.highlighted ? `btn-primary ${styles.planCta}` : `btn-secondary ${styles.planCta}`}
                    style={plan.highlighted ? { background: 'white', color: 'var(--primary-container)', border: 'none' } : {}}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Application Form */}
        <section className="section">
          <div className="container">
            <div className={styles.formSection}>
              <div className={styles.formLeft}>
                <div className="section-label">📋 Apply Now</div>
                <h2>Start Your Partner Application</h2>
                <p style={{ marginTop: 12 }}>
                  Our partnership team reviews all applications within 2 business days. We look for businesses that align with our commitment to quality and ethical sourcing.
                </p>
                <div className={styles.formTrust}>
                  {['✓ No long-term commitment required', '✓ Free onboarding support', '✓ Dedicated account manager', '✓ API integration assistance'].map((t) => (
                    <div key={t} className={styles.formTrustItem}>{t}</div>
                  ))}
                </div>
              </div>
              <PartnerForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
