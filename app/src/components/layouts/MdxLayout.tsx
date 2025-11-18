'use client'

import "../../styles/markdown.css";

import type { ReactNode } from 'react'
import { AuthenticatedLayout } from './AuthenticatedLayout';

export const MdxLayout = ({ children }: { children: ReactNode }) => {
    return (
        <AuthenticatedLayout mainClass="markdown">
            {children}
        </AuthenticatedLayout>
    );
};