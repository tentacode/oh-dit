import { useAuditStore } from "@/src/features/audit/store/auditStore";
import RuleCategoryRow from "./RuleCategoryRow";

import styles from "../../styles/audit_grid.module.css";
import PageSelect from "@/src/features/project/components/PageSelect";

export default function AuditGrid({ screenUuid }: { screenUuid: string }) {
  const ruleSet = useAuditStore((state) => state.ruleSet);
  if (!ruleSet) {
    return null;
  }

  return (
    <>
      <div className={styles.auditContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.gridSettingsContainer}>
            <PageSelect screenUuid={screenUuid} />
          </div>
          <div role="grid" data-grid-content>
            {ruleSet.ruleCategories.map((ruleCategory) => {
              return (
                <RuleCategoryRow
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
