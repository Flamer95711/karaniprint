'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '@/app/actions/auth';
import styles from './page.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signup(formData);
      if (result.success) {
        router.push('/login?registered=true');
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className={styles.page}>
      {/* Left: Hero Visual */}
      <div className={styles.heroSide}>
        <img
          src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=1200&h=1600&fit=crop"
          alt="Indian Heritage Crafts"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Empowering Artisans, <br />Scaling Heritage.
          </h1>
          <p className={styles.heroSubtitle}>
            Join our network of verified wholesale partners and gain exclusive access to curated Indian handicrafts tailored for international markets.
          </p>
          <div className={styles.heroBadges}>
            <span className={styles.heroBadge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Verified Artisan Partner
            </span>
            <span className={styles.heroBadge}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Export Ready
            </span>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <header className={styles.formHeader}>
            <Link href="/" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              Back to Home
            </Link>
            <h2 className={styles.formTitle}>Create Your Account</h2>
            <p className={styles.formSubtitle}>
              Fill out the form below to start sourcing heritage-quality goods at wholesale scale.
            </p>
          </header>

          {error && (
            <div className={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name Row */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="first_name" className={styles.label}>First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="Arjun"
                  required
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="last_name" className={styles.label}>Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Sharma"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                className={styles.input}
              />
            </div>

            {/* Phone (optional) */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className={styles.input}
              />
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordWrap}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className={styles.termsRow}>
              <input type="checkbox" id="terms" required className={styles.checkbox} />
              <label htmlFor="terms" className={styles.termsLabel}>
                I agree to the <a href="#" className={styles.link}>Wholesale Policies</a> and <a href="#" className={styles.link}>Privacy Statement</a>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className={styles.submitBtn}
              id="signup-submit-btn"
            >
              {isPending ? 'Creating Account…' : 'Create Account'}
            </button>

            <p className={styles.switchText}>
              Already have an account?{' '}
              <Link href="/login" className={styles.link}>Log in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
