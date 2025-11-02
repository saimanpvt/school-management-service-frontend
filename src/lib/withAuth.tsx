import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from './auth';
import { UserRole } from './types';

export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    allowedRoles?: UserRole[]
) {
    return function WithAuthComponent(props: P) {
        const { user, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading) {
                if (!user) {
                    router.replace('/login');
                } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                    router.replace('/dashboard');
                }
            }
        }, [user, isLoading, router]);

        if (isLoading) {
            return <div>Loading...</div>; // Replace with your loading component
        }

        if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}