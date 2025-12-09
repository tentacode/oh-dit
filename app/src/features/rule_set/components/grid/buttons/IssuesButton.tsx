import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import clsx from "clsx";

export default function IssuesButton({
  isActive,
  ruleUuid,
  screenUuid,
  onClick,
}: {
  isActive: boolean;
  ruleUuid: string;
  screenUuid: string;
  onClick: () => void;
}) {
  const allIssues = useAuditStore((state) => state.issues);
  const issues = allIssues.filter(
    (issue) => issue.ruleUuid === ruleUuid && issue.screenUuid === screenUuid
  );

  const badgeNumber = issues.length;

  return (
    <button role="gridcell" className={clsx(styles.squareButton, styles.ruleButton, isActive && styles.activeTab)} onClick={onClick}>
      {badgeNumber > 0 && (
      <span className={styles.badge}>{badgeNumber}</span>
      )}
      <ExclamationTriangleIcon className={styles.buttonIcon} />
    </button>
  );
}