'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

const footerLinks = {
  'Quick Links': [
    { href: '/catalog', label: 'Wholesale Catalog' },
    { href: '/dropshipping', label: 'Dropshipping' },
    { href: '/catalog', label: 'Artisan Directory' },
    { href: '/catalog', label: 'Export Logistics' },
    { href: '/catalog', label: 'Bulk Inquiry' },
    { href: '/', label: 'Sustainability Report' },
  ],
  'Support': [
    { href: '/', label: 'Contact Account Manager' },
    { href: '/', label: 'Shipping & Returns' },
    { href: '/', label: 'Custom Order Form' },
    { href: '/', label: 'FAQ for Importers' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Top Row */}
        <div className={styles.topRow}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className={styles.logoName}>BharatCraft</span>
            </div>
            <p className={styles.tagline}>
              Connecting the world to India's finest heritage crafts through a professional, scalable B2B ecosystem.
            </p>
            <div className={styles.certBadges}>
              <span className="badge badge-gold">🌿 Eco-Certified</span>
              <span className="badge badge-blue">✓ Fair Trade</span>
              <span className="badge badge-green">🌍 Export Ready</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>{section}</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.footerLink}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className={styles.newsletter}>
            <h4 className={styles.linkGroupTitle}>Stay Updated</h4>
            <p className={styles.newsletterDesc}>
              Subscribe for quarterly trend reports and new artisan catalog launches.
            </p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@company.com"
                className="input"
                style={{ borderRadius: '4px 0 0 4px', borderRight: 'none' }}
                id="footer-email-input"
              />
              <button type="submit" className={styles.subscribeBtn} id="footer-subscribe-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="divider" />

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © 2024 Artisan Enterprise. Indian Heritage, Global Standards.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/" className={styles.bottomLink}>Terms of Trade</Link>
            <Link href="/" className={styles.bottomLink}>Compliance</Link>
          </div>
          <div className={styles.statBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>22 Indian States · 1,200+ Artisan Clusters</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
