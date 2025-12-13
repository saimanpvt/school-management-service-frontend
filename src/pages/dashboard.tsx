import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { getDashboardUrl } from '../lib/utils/routing';
import LoadingDots from '../components/LoadingDots/LoadingDots';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      const dashboardUrl = getDashboardUrl(user.role, user.userID);
      router.push(dashboardUrl);
    } else {
      router.push('/');
    }
  }, [user, router]);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoadingDots />
      </div>
    </div>
  );
}
