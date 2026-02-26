import { useAuditStore } from "@/src/features/audit/store/auditStore";
import RuleCategoryRow from "./RuleCategoryRow";

import styles from "../../styles/audit_grid.module.css";
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

  return (
    <>
      <div className={styles.auditContainer}>
        <div className={styles.gridContainer}>
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
