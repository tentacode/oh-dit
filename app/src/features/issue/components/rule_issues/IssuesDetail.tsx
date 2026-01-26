'use client';

import RuleIssues from "./RuleIssues";
import tabStyles from "../../../rule_set/styles/rule_tab.module.css";
import listStyles from "../../styles/issue_list.module.css";
import IssueForm from "./IssueForm";
import { useIssuesFormStateStore } from "../../store/issuesFormStateStore";

export default function IssuesDetail({
  ruleUuid,
  screenUuid,
}: {
  ruleUuid: string;
  screenUuid: string;
}) {
  const issueFormState = useIssuesFormStateStore((state) =>
    state.issuesFormState.find(
      (ifs) => ifs.ruleUuid === ruleUuid && ifs.screenUuid === screenUuid && ifs.context === "rule_issues"
    )
  );
  
  const isAdding = issueFormState && (issueFormState.mode === "create" || issueFormState.mode === "duplicate");

  return (
    <div className={tabStyles.tabContainer}>
      <div className={tabStyles.listAndForm}>
        <div className={listStyles.listContainer}>
          {isAdding && <IssueForm ruleUuid={ruleUuid} screenUuid={screenUuid} formContext={'rule_issues'} />}
          <RuleIssues ruleUuid={ruleUuid} screenUuid={screenUuid} />
        </div>
      </div>
    </div>
  );
}
