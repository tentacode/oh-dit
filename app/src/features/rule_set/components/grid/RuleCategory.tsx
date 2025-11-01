import {
  Rule as RuleInterface,
  RuleCategory as RuleCategoryInterface,
} from "../../types/RuleSetTypes";
import ComplianceStatus from "./ComplianceStatus";
import Rule from "./Rule";

import styles from "./rule_set_grid.module.css";

export default function RuleCategory({
  ruleCategory,
  isOdd,
}: {
  ruleCategory: RuleCategoryInterface;
  isOdd: boolean;
}) {
  let isLast = false;

  return (
    <>
      <tr className={`${styles.ruleCategoryRow} ${isOdd ? styles.odd : ""} ${styles.first}`}>
        <th scope="rowgroup">
          {ruleCategory.prefix} {ruleCategory.name}
        </th>
        <ComplianceStatus />
      </tr>
      {ruleCategory.rules.map((rule: RuleInterface) => {
        isLast =
          ruleCategory.rules.indexOf(rule) === ruleCategory.rules.length - 1;

        return (
          <Rule isOdd={isOdd} isLast={isLast} rule={rule} key={rule.uuid} />
        );
      })}
    </>
  );
}
