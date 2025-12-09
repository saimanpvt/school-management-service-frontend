import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      © {new Date().getFullYear()} School Management System
    </footer>
  );
}
