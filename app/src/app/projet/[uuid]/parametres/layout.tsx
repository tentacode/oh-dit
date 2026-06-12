"use client";

import AsideContent from "@/src/design-system/components/sidebar/AsideContent";
import PageWithSidebar from "@/src/design-system/components/sidebar/PageWithSidebar";
import SidebarItem from "@/src/design-system/components/sidebar/SidebarItem";
import SidebarMenu from "@/src/design-system/components/sidebar/SidebarMenu";
import {
  ArchiveBoxIcon,
  Cog6ToothIcon,
  DocumentIcon,
  PuzzlePieceIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { getProjectUrl } from "../../routing";
import { use } from "react";
import SidebarLink from "@/src/design-system/components/sidebar/SidebarLink";
import { usePathname } from "next/navigation";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import { useTranslations } from "next-intl";

export default function ProjectSettingsLayout({
  params,
  children,
}: {
  params: Promise<{ uuid: string }>;
  children: React.ReactNode;
}) {
  const ruleSet = useAuditStore((state) => state.ruleSet);


  const projectUuid = use(params).uuid;

  const pathname = usePathname();

  const t = useTranslations();

  const isPageActive = (page: "project" | "screens" | "delete") => {
    return (
      (pathname === getProjectUrl.settingsProject(projectUuid) &&
        page === "project") ||
      (pathname === getProjectUrl.settingsScreens(projectUuid) &&
        page === "screens") ||
      (pathname === getProjectUrl.settingsDelete(projectUuid) &&
        page === "delete")
    );
  };

  if (!ruleSet) {
    return null;
  }

  let ruleSetType: "web" | "mobile" | "document" = "web";
  
  if (ruleSet.name === "RAAM") {
    ruleSetType = "mobile";
  }
  
  if (ruleSet.name === "RAPDF") {
    ruleSetType = "document";
  }

  return (
    <PageWithSidebar>
      <SidebarMenu>
        <SidebarLink
          active={isPageActive("project")}
          href={getProjectUrl.settingsProject(projectUuid)}
        >
          <Cog6ToothIcon />
          Projet
        </SidebarLink>
        <SidebarLink
          active={isPageActive("screens")}
          href={getProjectUrl.settingsScreens(projectUuid)}
        >
          <DocumentIcon />
          {t(`ruleSet.${ruleSetType}.screens`)}
        </SidebarLink>
        <SidebarItem badge="bientôt">
          <PuzzlePieceIcon />
          Intégrations
        </SidebarItem>
        <SidebarItem badge="bientôt">
          <ArchiveBoxIcon />
          Archiver
        </SidebarItem>
        <SidebarLink
          active={isPageActive("delete")}
          href={getProjectUrl.settingsDelete(projectUuid)}
        >
          <TrashIcon />
          Supprimer
        </SidebarLink>
      </SidebarMenu>
      <AsideContent>{children}</AsideContent>
    </PageWithSidebar>
  );
}
