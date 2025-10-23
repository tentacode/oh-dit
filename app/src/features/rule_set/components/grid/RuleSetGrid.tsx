import { useGetRuleSets } from "../../hooks/useGetRuleSets";
import { RuleSet as RuleSetInterface } from "../../types/RuleSetTypes";
import RuleCategory from "./RuleCategory";

import styles from './rule_set_grid.module.css';

export default function RuleSetGrid() {
  const { ruleSets, isLoading, error } = useGetRuleSets();

  if (isLoading) {
    return <div>Loading rule sets...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (ruleSets.length === 0) {
    return <div>No rule sets available.</div>;
  }

  const ruleSet = ruleSets[0] as RuleSetInterface; // @TODO: handle multiple rule sets

  return (
        <table className={styles.tableGrid}>
            <tbody>
                {ruleSet.ruleCategories.map((ruleCategory) => (
                <RuleCategory ruleCategory={ruleCategory} key={ruleCategory.uuid} />
                ))}
            </tbody>
        </table>
  );
}
