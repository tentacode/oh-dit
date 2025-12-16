'use client'

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/lib/react-query/queryClient';
import { ReactNode } from 'react';

export default function BetaLayout({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};