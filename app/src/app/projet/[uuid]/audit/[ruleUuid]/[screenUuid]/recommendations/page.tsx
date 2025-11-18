'use client';

import Drawer from "@/src/components/drawer/Drawer";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import { useRouter } from "next/navigation";

export default function AuditRuleRecommandationsPage() {
  const router = useRouter();

  const project = useAuditStore((state) => state.project);
  
  if (!project) {
    return null;
  }

  const redirectToAuditPage = () => {
    router.push(`/projet/${project.uuid}/audit`);
    // @TODO : set focus on last rule/page
  }

  return <Drawer onClose={() => redirectToAuditPage()} closeLabel="Fermer les recommandations"><h2>Recommandations</h2></Drawer>;
}
