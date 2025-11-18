"use client";

import { AuthenticatedLayout } from "@/src/components/layouts/AuthenticatedLayout";
import Tab from "@/src/features/layout/components/Tabs/Tab";
import TabBadge from "@/src/features/layout/components/Tabs/TabBadge";
import TabContainer from "@/src/features/layout/components/Tabs/TabContainer";
import TabsHeaders from "@/src/features/layout/components/Tabs/TabsHeader";
import ProjectDetailHeader from "@/src/features/project/components/ProjectHeader";
import ProjectDataProvider from "@/src/features/project/data_providers/ProjectDataProvider";
import {
  ChartPieIcon,
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Cog6ToothIcon from "@heroicons/react/24/solid/esm/Cog6ToothIcon";
import { useParams, usePathname } from "next/navigation";
import { getProjectUrl, isProjectRoute } from "../routing";

enum AuditTab {
  DASHBOARD = "dashboard",
  AUDIT = "audit",
  RECOMMENDATIONS = "recommendations",
  DELIVERABLES = "deliverables",
  SETTINGS = "settings",
}
 
const getActiveTab = (pathname: string): AuditTab => {
  if (isProjectRoute.audit(pathname)) return AuditTab.AUDIT
  if (isProjectRoute.recommendations(pathname)) return AuditTab.RECOMMENDATIONS
  if (isProjectRoute.deliverables(pathname)) return AuditTab.DELIVERABLES
  if (isProjectRoute.settings(pathname)) return AuditTab.SETTINGS
  return AuditTab.DASHBOARD
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();

  const selectedTab = getActiveTab(pathname);

  return (
    <AuthenticatedLayout mainClass="tabLayout">
      <ProjectDataProvider projectUuid={params.uuid as string}>
        <ProjectDetailHeader />

        <TabsHeaders>
          <Tab isActive={selectedTab === AuditTab.DASHBOARD} href={getProjectUrl.dashboard(params.uuid as string)}>
            <ChartPieIcon /> Résumé
          </Tab>
          <Tab isActive={selectedTab === AuditTab.AUDIT} href={getProjectUrl.audit(params.uuid as string)}>
            <ClipboardDocumentCheckIcon /> Audit
          </Tab>
          <Tab isActive={selectedTab === AuditTab.RECOMMENDATIONS} href={getProjectUrl.recommendations(params.uuid as string)}>
            <ExclamationTriangleIcon />
            Recommandations
            <TabBadge value="5" />
          </Tab>
          <Tab isActive={selectedTab === AuditTab.DELIVERABLES} href={getProjectUrl.deliverables(params.uuid as string)}>
            <DocumentCheckIcon /> Livrables
          </Tab>
          <Tab isActive={selectedTab === AuditTab.SETTINGS} href={getProjectUrl.settings(params.uuid as string)}>
            <Cog6ToothIcon /> Paramètres
          </Tab>
        </TabsHeaders>

        <TabContainer>{children}</TabContainer>
      </ProjectDataProvider>
    </AuthenticatedLayout>
  );
}
