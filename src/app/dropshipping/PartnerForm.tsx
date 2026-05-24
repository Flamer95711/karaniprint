'use client';

import styles from './page.module.css';

export default function PartnerForm() {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="company-name" className={styles.formLabel}>Company Name *</label>
          <input id="company-name" type="text" className="input" placeholder="Acme Retail Co." />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="contact-name" className={styles.formLabel}>Contact Person *</label>
          <input id="contact-name" type="text" className="input" placeholder="John Smith" />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>Business Email *</label>
          <input id="email" type="email" className="input" placeholder="john@company.com" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
          <input id="phone" type="tel" className="input" placeholder="+1 555 000 0000" />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="business-type" className={styles.formLabel}>Business Type *</label>
        <select id="business-type" className="input">
          <option value="">Select type</option>
          <option>E-commerce Retailer</option>
          <option>Brick & Mortar Store</option>
          <option>Marketplace Seller</option>
          <option>Wholesale Distributor</option>
          <option>Interior Designer / Stylist</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="monthly-volume" className={styles.formLabel}>Expected Monthly Order Volume</label>
        <select id="monthly-volume" className="input">
          <option value="">Select range</option>
          <option>1 – 50 orders</option>
          <option>51 – 200 orders</option>
          <option>201 – 1,000 orders</option>
          <option>1,000+ orders</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.formLabel}>Tell us about your business</label>
        <textarea
          id="message"
          className="input"
          rows={4}
          placeholder="Describe your business model, target markets, and why you want to partner with BharatCraft..."
          style={{ resize: 'vertical' }}
        ></textarea>
      </div>
      <button
        type="submit"
        id="submit-application-btn"
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
      >
        Submit Partner Application
      </button>
    </form>
  );
}
