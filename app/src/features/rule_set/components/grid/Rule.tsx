import { Rule as RuleInterface } from "../../types/RuleSetTypes";
import ComplianceStatus from "./ComplianceStatus";

import styles from "./rule_set_grid.module.css";

export default function Rule({
  rule,
  isOdd,
  isLast,
}: {
  rule: RuleInterface;
  isOdd: boolean;
  isLast: boolean;
}) {
  return (
    <tr className={`${isOdd ? styles.odd : ''} ${isLast ? styles.last : ''}`}>
      <th>
        {rule.prefix} {rule.shortDescription}
      </th>
      <ComplianceStatus />
    </tr>
  );
}
