import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";
import clsx from "clsx";
import { useAuditStore } from "@/src/features/audit/store/auditStore";

export function getRuleHelpButtonId(ruleUuid: string, screenUuid: string) {
  return `help-button-${ruleUuid}-${screenUuid}`;
}

export default function RuleHelpButton({
  ruleUuid,
  screenUuid,
  isActive,
  onClick,
  onFocus,
}: {
  ruleUuid: string;
  screenUuid: string;
  isActive: boolean;
  onClick: () => void;
  onFocus: () => void;
}) {
  const ruleSet = useAuditStore((state) => state.ruleSet);
  const rule = ruleSet?.ruleCategories
    .flatMap((category) => category.rules)
    .find((r) => r.uuid === ruleUuid);

  if (!rule) {
    return null;
  }

  return (
    <button
      aria-label={`Aide, Critère ${rule.prefix }`}
      id={getRuleHelpButtonId(ruleUuid, screenUuid)}
      className={clsx(
        styles.squareButton,
        styles.ruleButton,
        isActive && styles.activeTab
      )}
      onClick={onClick}
      onFocus={(e) => {
        e.stopPropagation();
        onFocus()}
      }
    >
      <QuestionMarkCircleIcon className={styles.buttonIcon} />
    </button>
  );
}
