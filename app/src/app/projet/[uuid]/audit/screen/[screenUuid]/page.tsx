'use client'

import AuditGrid from "@/src/features/rule_set/components/grid/AuditGrid"
import { use } from "react";

export default function ProjectAuditPage({ params }: { params: Promise<{ screenUuid: string }> }) {
    const { screenUuid } = use(params);

    return (
        <AuditGrid screenUuid={screenUuid} />
    );
}