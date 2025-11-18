import { useAuditStore } from "@/src/features/audit/store/auditStore";
import RuleCategory from "./RuleCategory";

import styles from "../../styles/audit_grid.module.css";
import PageSelect from "@/src/features/project/components/PageSelect";

export default function AuditGrid({ children }: { children: React.ReactNode }) {
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

    if (prefixA !== prefixB && !isNaN(Number(prefixA)) && !isNaN(Number(prefixB))) {
      return Number(prefixA) - Number(prefixB);
    }

    return a.name.localeCompare(b.name);
  });

  return (
    <div className={styles.auditContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.gridSettingsContainer}>
          <PageSelect />
        </div>
        <div role="grid">
          {sortedCategories.map((ruleCategory) => {
            return (
              <RuleCategory ruleCategory={ruleCategory} key={ruleCategory.uuid} />
            );
          })}   
        </div>
      </div>
      {children}
    </div>
  );
}
