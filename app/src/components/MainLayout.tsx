'use client'

import type { ReactNode } from 'react'
import SideBar from '../features/layout/SideBar';
import BetaBanner from '../features/layout/BetaBanner';

export const MainLayout = ({ children }: { children: ReactNode }) => {
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
        <>
            <div style={bodyContainerStyle}>
                <BetaBanner />
                <div style={appContainerStyle}>
                    <SideBar />
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};