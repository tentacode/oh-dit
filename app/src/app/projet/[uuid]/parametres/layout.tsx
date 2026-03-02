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

export default function ProjectSettingsLayout({
  params,
  children,
}: {
  params: Promise<{ uuid: string }>;
  children: React.ReactNode;
}) {
  const projectUuid = use(params).uuid;

  const pathname = usePathname();

  const isPageActive = (page: "project" | "screens") => {
    return (
      (pathname === getProjectUrl.settingsProject(projectUuid) &&
        page === "project") ||
      (pathname === getProjectUrl.settingsScreens(projectUuid) &&
        page === "screens")
    );
  };

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
        {/* <SidebarLink
          active={isPageActive("screens")}
          href={getProjectUrl.settingsScreens(projectUuid)}
        >
          <DocumentIcon />
          Pages
        </SidebarLink> */}
        <SidebarItem badge="bientôt">
          <DocumentIcon />
          Pages
        </SidebarItem>
        <SidebarItem badge="bientôt">
          <PuzzlePieceIcon />
          Intégrations
        </SidebarItem>
        <SidebarItem badge="bientôt">
          <ArchiveBoxIcon />
          Archiver
        </SidebarItem>
        <SidebarItem badge="bientôt">
          <TrashIcon />
          Supprimer
        </SidebarItem>
      </SidebarMenu>
      <AsideContent>{children}</AsideContent>
    </PageWithSidebar>
  );
}
