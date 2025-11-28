import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { getDashboardUrl } from '../utils/routing';

export default function Dashboard() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            const routerInstance = router as any;
            if (user) {
                const dashboardUrl = getDashboardUrl(user.role, user.userID);
                routerInstance?.push(dashboardUrl);
            } else {
                routerInstance?.push('/');
            }
        }
    }, [user, isLoading, router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
            <div style={{ textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Redirecting...</div>
                <div style={{ fontSize: '0.875rem' }}>Please wait while we redirect you to your dashboard.</div>
            </div>
        </div>
    );
}

