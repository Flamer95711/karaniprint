'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, logout, type UserProfile } from '@/app/actions/auth';
import { useCart } from '@/lib/cart-context';
import styles from './Navbar.module.css';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/dropshipping', label: 'Partnerships' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, [pathname]); // Re-check on navigation

  async function handleLogout() {
    await logout();
    setUser(null);
    router.refresh();
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <nav className={styles.nav}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>Karani</span>
              <span className={styles.logoSub}>Print</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className={styles.navActions}>
            <Link href="/catalog" className={styles.navSearch}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              id="cart-nav-btn"
              className={`${styles.cartBtn} ${pathname === '/cart' ? styles.cartBtnActive : ''}`}
              aria-label={`Shopping cart, ${totalItems} items`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" x2="21" y1="6" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </Link>

            {/* Admin Portal — only if user is admin */}
            {user?.is_admin && (
              <Link href="/admin" className={styles.adminPortalBtn} id="admin-portal-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Admin Portal
              </Link>
            )}

            {/* Auth buttons */}
            {!loadingUser && (
              <>
                {user ? (
                  <div className={styles.userMenu}>
                    <span className={styles.userAvatar}>
                      {(user.first_name?.[0] || 'U').toUpperCase()}
                    </span>
                    <button onClick={handleLogout} className={styles.logoutBtn} id="logout-btn">
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className={styles.loginBtn} id="login-btn">
                      Log In
                    </Link>
                    <Link href="/signup" className="btn-primary" id="signup-btn">
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={menuOpen ? styles.barOpen : ''}></span>
              <span className={menuOpen ? styles.barOpen : ''}></span>
              <span className={menuOpen ? styles.barOpen : ''}></span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className={`${styles.mobileLink} ${pathname === '/cart' ? styles.mobileActive : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            🛒 Cart{totalItems > 0 ? ` (${totalItems})` : ''}
          </Link>
          {user?.is_admin && (
            <Link href="/admin" className={styles.mobileAdminBtn} onClick={() => setMenuOpen(false)}>
              🗂️ Admin Portal
            </Link>
          )}
          {user ? (
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              className={styles.mobileAdminBtn}
            >
              🚪 Logout ({user.first_name})
            </button>
          ) : (
            <>
              <Link href="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Log In
              </Link>
              <Link href="/signup" className="btn-primary" style={{ margin: '4px 16px 16px' }} onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
