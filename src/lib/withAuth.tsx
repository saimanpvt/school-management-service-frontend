import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './auth';
import { UserRole } from './types';
import LoadingDots from '../components/LoadingDots';
import { getDashboardUrl } from '../utils/routing';

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    allowedRoles?: UserRole[]
) {
    return function WithAuthComponent(props: P) {
        const { user, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                const routerInstance = router as any;
                if (!user) {
                    routerInstance?.replace('/login');
                } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                    // Redirect to user's appropriate dashboard
                    const dashboardUrl = getDashboardUrl(user.role, user.id);
                    routerInstance?.replace(dashboardUrl);
                }
            }
        }, [user, isLoading, router]);

        if (isLoading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                }}>
                    <div style={{ textAlign: 'center', color: '#64748b' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}><LoadingDots /></div>
                        <div style={{ fontSize: '0.875rem' }}>Please wait while we load your data.</div>
                    </div>
                </div>
            );
        }

        if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}