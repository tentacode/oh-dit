'use client'

import MainNavigation from '../../features/layout/components/MainNavigation';
import BetaBanner from '../../features/layout/components/BetaBanner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/lib/react-query/queryClient';
import { ReactNode } from 'react';
import UserDataProvider from '@/src/features/authentication/data_providers/UserDataProvider';

interface AuthenticatedLayoutProps {
    children: ReactNode
    mainClass?: string
};

export const AuthenticatedLayout = ({ children, mainClass }: AuthenticatedLayoutProps) => {
    const bodyContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    } as const;

    return (
        <QueryClientProvider client={queryClient}>
            <UserDataProvider>
                <div style={bodyContainerStyle}>
                    <BetaBanner />
                    <MainNavigation />
                    <main className={mainClass}>
                        {children}
                    </main>
                </div>
            </UserDataProvider>
        </QueryClientProvider>
    );
};