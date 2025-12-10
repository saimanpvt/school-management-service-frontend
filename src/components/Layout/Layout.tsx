import Header from '../Header';
import Footer from '../Footer';
import styles from './Layout.module.css';

type Props = {
  children?: any;
  user?: { name?: string; role?: string };
};

export default function Layout({ children, user }: Props) {
  return (
    <div className={styles.container}>
      <Header user={user} />

      <main className={styles.main}>{children}</main>

      <Footer />
    </div>
  );
}
