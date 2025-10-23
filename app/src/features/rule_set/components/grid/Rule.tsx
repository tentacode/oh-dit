import { Rule as RuleInterface } from "../../types/RuleSetTypes";
import ComplianceStatus from "./ComplianceStatus";

export default function Rule({ rule }: { rule: RuleInterface }) {
  return (
    <tr>
      <th>
        {rule.prefix} {rule.shortDescription}
      </th>
      <ComplianceStatus />
    </tr>
  );
}
