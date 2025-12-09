import { useAuditStore } from "@/src/features/audit/store/auditStore";
import RuleCategoryRow from "./RuleCategoryRow";

import styles from "../../styles/audit_grid.module.css";
import PageSelect from "@/src/features/project/components/PageSelect";

export default function AuditGrid({ screenUuid }: { screenUuid: string }) {
  const ruleSet = useAuditStore((state) => state.ruleSet);
  if (!ruleSet) {
    return null;
  }

  const sortedCategories = [...ruleSet.ruleCategories].sort((a, b) => {
    const prefixA =
      a.prefix !== null && a.prefix !== undefined
        ? a.prefix
        : Number.MAX_SAFE_INTEGER;
    const prefixB =
      b.prefix !== null && b.prefix !== undefined
        ? b.prefix
        : Number.MAX_SAFE_INTEGER;

    if (
      prefixA !== prefixB &&
      !isNaN(Number(prefixA)) &&
      !isNaN(Number(prefixB))
    ) {
      return Number(prefixA) - Number(prefixB);
    }

    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <div className={styles.auditContainer}>
        <div className={styles.gridContainer}>
          <div className={styles.gridSettingsContainer}>
            <PageSelect screenUuid={screenUuid} />
          </div>
          <div role="grid" data-grid-content>
            {sortedCategories.map((ruleCategory) => {
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
