'use client'

import type { ReactNode } from 'react'
import SideBar from '../../features/layout/components/SideBar';
import BetaBanner from '../../features/layout/components/BetaBanner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/lib/react-query/queryClient';

export const AuthenticatedLayout = ({ children }: { children: ReactNode }) => {
    const bodyContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    } as const;

    const appContainerStyle = {
        flex: 1,
        display: 'flex',
    } as const;

    return (
        <QueryClientProvider client={queryClient}>
            <div style={bodyContainerStyle}>
                <BetaBanner />
                <div style={appContainerStyle}>
                    <SideBar />
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </QueryClientProvider>
    );
};