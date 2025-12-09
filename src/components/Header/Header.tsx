import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

type Props = {
  user?: { name?: string; role?: string };
};

export default function Header({ user }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <Link href="/" className={styles.logo}>
            School<span className={styles.logoText}>Mgmt</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/courses" className={styles.navLink}>
              Courses
            </Link>
            <Link href="/students" className={styles.navLink}>
              Students
            </Link>
            <Link href="/teachers" className={styles.navLink}>
              Teachers
            </Link>
            <Link href="/exams" className={styles.navLink}>
              Exams
            </Link>
          </nav>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.desktopAuth}>
            {!user && (
              <>
                <Link
                  href="/auth/login"
                  className={styles.loginButton}
                >
                  Login
                </Link>
              </>
            )}

            {user && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>
                  {user.role}
                </span>
              </div>
            )}
          </div>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={styles.menuIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <Link href="/" className={styles.mobileMenuLink}>
              Home
            </Link>
            <Link href="/courses" className={styles.mobileMenuLink}>
              Courses
            </Link>
            <Link href="/students" className={styles.mobileMenuLink}>
              Students
            </Link>
            <Link href="/teachers" className={styles.mobileMenuLink}>
              Teachers
            </Link>
            <Link href="/exams" className={styles.mobileMenuLink}>
              Exams
            </Link>
            {!user && (
              <>
                <Link href="/auth/login" className={styles.mobileMenuLink}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
