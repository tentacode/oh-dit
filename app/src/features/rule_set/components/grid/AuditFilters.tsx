import { useAuditStore } from "@/src/features/audit/store/auditStore";

import filterStyles from "@/src/components/filter/styles/filters.module.css";
import typographyStyles from "@/src/design-system/styles/typography.module.css";

import FilterSelect from "@/src/components/filter/FilterSelect";
import Filters from "@/src/components/filter/Filters";
import { ArrowTopRightOnSquareIcon, CheckIcon, ClockIcon, DocumentIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useAuditSettingsStore } from "@/src/features/audit/store/auditSettingsStore";
import { useRouter } from "next/navigation";
import FiltersGroup from "@/src/components/filter/FiltersGroup";
import { getProjectUrl } from "@/src/app/projet/routing";

export default function AuditFilters() {
  const ruleSet = useAuditStore((state) => state.ruleSet);
  const project = useAuditStore((state) => state.project);
  const router = useRouter();

  const getProjectSetting = useAuditSettingsStore(
    (state) => state.getProjectSetting,
  );

  const setProjectSetting = useAuditSettingsStore(
    (state) => state.setProjectSetting
  );

  if (!ruleSet || !project) {
    return null;
  }

  const projectSetting = getProjectSetting(project.uuid);
  if (!projectSetting.currentScreenUuid) {
    return null;
  }

  const currentScreen = project.screens.find(
    (screen) => screen.uuid === projectSetting.currentScreenUuid,
  );
  if (!currentScreen) {
    return null;
  }

  let screenUrl = currentScreen.url;
  if (screenUrl && !screenUrl.startsWith("http") && project.url) {
    try {
      screenUrl = new URL(screenUrl, project.url).toString();
    } catch (e) {
      // if URL construction fails, we can just keep the original screenUrl which might be a relative path or an invalid URL.
      console.error("Failed to construct screen URL:", e);
    }
  }

  const displayPageLink = screenUrl && screenUrl.startsWith("http");
  
  const setScreenUuid = (newValue: string) => {
    setProjectSetting({
      projectUuid: project.uuid,
      currentScreenUuid: newValue,
    });

    router.replace(getProjectUrl.auditScreen(project.uuid, newValue));
  };

  const screenValues = project.screens.map((screen) => `P${screen.rank.toString().padStart(2, "0")} - ${screen.name}`);

  return (
    <>
      <Filters>
        <FiltersGroup>
          <FilterSelect
            id="audit-screen-filter"
            listHeader="Page :"
            values={screenValues}
            selectedValue={screenValues[0]}
            onChange={(newPage) => {
              const pageRank = parseInt(newPage.split(" - ")[0].substring(1), 10);
              const newScreen = project.screens.find((s) => s.rank === pageRank);
              if (newScreen) {
                setScreenUuid(newScreen.uuid);
              }
            }}
          >
            <DocumentIcon />
            P{currentScreen.rank.toString().padStart(2, "0")} - {currentScreen.name}
          </FilterSelect>
            
          {currentScreen.progress < 100 && (
            <span className={filterStyles.filterItem}>
              <ClockIcon />
              Progrès : {currentScreen.progress} %
            </span>
          )}
          {currentScreen.progress === 100 && (
            <span className={filterStyles.filterItem}>
              <CheckIcon />
              Progrès : terminé
            </span>
          )}

          {screenUrl && (
            <span className={filterStyles.filterItem}>
              <LinkIcon />
              {displayPageLink ? (
                <a
                  className={typographyStyles.externalLink}
                  href={screenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {screenUrl}
                  <ArrowTopRightOnSquareIcon />
                </a>
              ) : screenUrl}
            </span>
          )}
        </FiltersGroup>
      </Filters>
    </>
  );
}
