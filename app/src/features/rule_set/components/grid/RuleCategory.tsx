import { Rule as RuleInterface, RuleCategory as RuleCategoryInterface } from "../../types/RuleSetTypes";
import ComplianceStatus from "./ComplianceStatus";
import Rule from "./Rule";

import styles from './rule_set_grid.module.css';

export default function RuleCategory({ ruleCategory }: { ruleCategory: RuleCategoryInterface }) {
  return (
    <>
      <tr className={styles.ruleCategoryRow}>
        <th>
          {ruleCategory.prefix} {ruleCategory.name}
        </th>
        <ComplianceStatus />
      </tr>
      {ruleCategory.rules.map((rule: RuleInterface) => (
        <Rule rule={rule} key={rule.uuid} />
      ))}
    </>
  );
}
