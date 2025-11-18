'use client'

import AuditGrid from "@/src/features/rule_set/components/grid/AuditGrid"

export default function ProjectAuditPage({ children }: { children: React.ReactNode }) {
    return (
        <>
        <AuditGrid>
            {children}
        </AuditGrid>
        </>
    );
}