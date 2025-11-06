'use client'

import "../../styles/markdown.css";

import type { ReactNode } from 'react'
import { MainLayout } from './MainLayout';

export const MdxLayout = ({ children }: { children: ReactNode }) => {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
};