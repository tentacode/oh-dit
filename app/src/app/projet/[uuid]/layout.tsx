"use client";

import { AuthenticatedLayout } from "@/src/components/layouts/AuthenticatedLayout";
import Tab from "@/src/features/layout/components/Tabs/Tab";
import TabContainer from "@/src/features/layout/components/Tabs/TabContainer";
import TabsHeaders from "@/src/features/layout/components/Tabs/TabsHeader";
import ProjectDetailHeader from "@/src/features/project/components/ProjectHeader";
import ProjectDataProvider from "@/src/features/project/data_providers/ProjectDataProvider";
import {
  ChartPieIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Cog6ToothIcon from "@heroicons/react/24/solid/esm/Cog6ToothIcon";
import { useParams, usePathname } from "next/navigation";
import { getProjectUrl, isProjectRoute } from "../routing";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import { useAuditSettingsStore } from "@/src/features/audit/store/auditSettingsStore";

enum AuditTab {
  DASHBOARD = "dashboard",
  AUDIT = "audit",
  RECOMMENDATIONS = "issues",
  DELIVERABLES = "deliverables",
  SETTINGS = "settings",
}
 
const getActiveTab = (pathname: string): AuditTab => {
  if (isProjectRoute.audit(pathname)) return AuditTab.AUDIT
  if (isProjectRoute.issues(pathname)) return AuditTab.RECOMMENDATIONS
  if (isProjectRoute.deliverables(pathname)) return AuditTab.DELIVERABLES
  if (isProjectRoute.settings(pathname)) return AuditTab.SETTINGS
  return AuditTab.DASHBOARD
}

function AuditScreenTab ({ selectedTab, projectUuid }: { selectedTab: AuditTab, projectUuid: string }) {
  const getProjectSetting = useAuditSettingsStore((state) => state.getProjectSetting);
  const projectSetting = getProjectSetting(projectUuid);
  
  let screenUuid = projectSetting.currentScreenUuid;

  const project = useAuditStore((state) => state.project);

  if (!project) {
    return null;
  }

  if (screenUuid === null) {
    screenUuid = project.screens[0]?.uuid || null;
    if (!screenUuid) {
      throw new Error("No screen available for this project.");
    }
  }

  return (
      <Tab isActive={selectedTab === AuditTab.AUDIT} href={getProjectUrl.auditScreen(projectUuid, screenUuid)}>
        <ClipboardDocumentCheckIcon /> Audit
      </Tab>
  );
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();

  const selectedTab = getActiveTab(pathname);

  const issuesCount = useAuditStore((state) => state.issues.length || 0);

  const allIssuesFixed = useAuditStore((state) => 
    state.issues.every((issue) => issue.status === "fixed")
  );

  return (
    <AuthenticatedLayout mainClass="tabLayout">
      <ProjectDataProvider projectUuid={params.uuid as string}>
        <ProjectDetailHeader />

        <TabsHeaders label="Sections de l'audit">
          <Tab isActive={selectedTab === AuditTab.DASHBOARD} href={getProjectUrl.dashboard(params.uuid as string)}>
            <ChartPieIcon /> Résumé
          </Tab>
          <AuditScreenTab selectedTab={selectedTab} projectUuid={params.uuid as string} />
          <Tab isActive={selectedTab === AuditTab.RECOMMENDATIONS} href={getProjectUrl.issues(params.uuid as string)}>
            {issuesCount > 0 && allIssuesFixed && <CheckIcon />}
            {(issuesCount === 0 || !allIssuesFixed) && <ExclamationTriangleIcon />}
            {issuesCount > 0 && "(" + issuesCount.toString() + ") "}
            Recommandations
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
