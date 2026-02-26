"use client";

import AuditGrid from "@/src/features/rule_set/components/grid/AuditGrid";
import { use } from "react";
import AuditFilters from "@/src/features/rule_set/components/grid/AuditFilters";

export default function ProjectAuditPage({
  params,
}: {
  params: Promise<{ screenUuid: string }>;
}) {
  const { screenUuid } = use(params);

  return (
    <>
      <title>Saisie de l'audit - Ohdit</title>
      <div className="horizontalGutter mt-8">
        <h2 className="h2">Saisie de l'audit</h2>

        <AuditFilters />
        <AuditGrid screenUuid={screenUuid} />
      </div>
    </>
  );
}
