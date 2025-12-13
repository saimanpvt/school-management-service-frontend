import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '../lib/auth';
import { NotificationProvider } from '../components/Toaster';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
