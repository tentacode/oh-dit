'use client'

import type { ReactNode } from 'react'
import TopBar from '../features/debug/TopBar';

export const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <TopBar />
            {children}
        </>
    );
};