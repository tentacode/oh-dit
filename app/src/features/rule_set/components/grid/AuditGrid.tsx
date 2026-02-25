import { useAuditStore } from "@/src/features/audit/store/auditStore";
import RuleCategoryRow from "./RuleCategoryRow";

import styles from "../../styles/audit_grid.module.css";
import typographyStyle from "@/src/design-system/styles/typography.module.css";
import PageSelect from "@/src/features/project/components/PageSelect";
import { ArrowTopRightOnSquareIcon, CheckIcon, ClockIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useAuditSettingsStore } from "@/src/features/audit/store/auditSettingsStore";

export default function AuditGrid({ screenUuid }: { screenUuid: string }) {
  const ruleSet = useAuditStore((state) => state.ruleSet);
  const project = useAuditStore((state) => state.project);

  const getProjectSetting = useAuditSettingsStore(
    (state) => state.getProjectSetting
  );

  if (!ruleSet || !project) {
    return null;
  }

  const projectSetting = getProjectSetting(project.uuid);
  if (!projectSetting.currentScreenUuid) {
    return null;
  }

  const currentScreen = project.screens.find(
    (screen) => screen.uuid === projectSetting.currentScreenUuid
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
    }
  }

  const displayPageLink = screenUrl && screenUrl.startsWith("http");

  return (
    <>
      <title>Saisie de l'audit - Ohdit</title>
      <div className={styles.auditContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.gridSettingsContainer}>
            <PageSelect screenUuid={screenUuid} />
            {screenUrl && (
              <p className={styles.settingDetail}>
                <LinkIcon />
                <span>
                  Adresse de la page :{" "}
                  {displayPageLink ? (<a aria-label={`${screenUrl}, nouvelle fenêtre`} className={typographyStyle.externalLink} href={screenUrl}>
                    {screenUrl}
                    <ArrowTopRightOnSquareIcon />
                    </a>) : (screenUrl)}
                </span>
              </p>
            )}

            {currentScreen.progress < 100 && (
            <p className={styles.settingDetail}>
              <ClockIcon />
              <span>
                Progrès : <strong>{currentScreen.progress}%</strong>
              </span>
            </p>
            )}

            {currentScreen.progress === 100 && (
            <p className={styles.settingDetail}>
              <CheckIcon />
              <span>
                Progrès : terminé
              </span>
            </p>
            )}
          </div>
          <div data-grid-content>
            {ruleSet.ruleCategories.map((ruleCategory) => {
              return (
                <RuleCategoryRow
                  projectUuid={project.uuid}
                  screenUuid={screenUuid}
                  ruleCategory={ruleCategory}
                  key={ruleCategory.uuid}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
