import CategoryComplianceStatus from "./buttons/CategoryComplianceStatus";
import RuleRow from "./RuleRow";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import styles from "../../styles/audit_grid.module.css";
import {
  Rule as RuleStoreType,
} from "@/src/features/audit/store/auditStore";
import { useAuditSettingsStore } from "@/src/features/audit/store/auditSettingsStore";

interface RuleCategoryProps {
  ruleCategory: {
    uuid: string;
    name: string;
    prefix: string;
    rules: RuleStoreType[];
  };
  screenUuid: string;
}

export default function RuleCategoryRow({ ruleCategory, screenUuid }: RuleCategoryProps) {
  const isCollapsed = useAuditSettingsStore(
    (state) => state.isRuleCategoryCollapsed(ruleCategory.uuid)
  );

  const toggleCollapse = useAuditSettingsStore(
    (state) => state.toggleRuleCategoryCollapse
  );

  return (
    <div className={styles.ruleCategoryContainer}>
      <div className={styles.ruleCategoryRow}>
        <button
          id={`category-header-${ruleCategory.uuid}`}
          aria-expanded={isCollapsed ? "false" : "true"}
          aria-controls={`category-rules-${ruleCategory.uuid}`}
          className={styles.accordionButton}
          onClick={() => toggleCollapse(ruleCategory.uuid)}
        >
          {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
          <h2>
            {ruleCategory.prefix} {ruleCategory.name}
          </h2>
        </button>
        <CategoryComplianceStatus ruleCategoryUuid={ruleCategory.uuid} />
      </div>
      <div
        style={{ display: isCollapsed ? "none" : "block" }}
        id={`category-rules-${ruleCategory.uuid}`}
        role="region"
        aria-labelledby={`category-header-${ruleCategory.uuid}`}
      >
        {ruleCategory.rules.map((rule: RuleStoreType) => {
          return <RuleRow screenUuid={screenUuid} rule={rule} key={rule.uuid} />;
        })}
      </div>
    </div>
  );
}
