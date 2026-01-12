'use client';

import IssuesList from "./IssuesList";
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
      (ifs) => ifs.ruleUuid === ruleUuid && ifs.screenUuid === screenUuid
    )
  );
  
  const isAdding = issueFormState && (issueFormState.mode === "create" || issueFormState.mode === "duplicate");

  return (
    <div className={tabStyles.tabContainer}>
      <div className={tabStyles.listAndForm}>
        <div className={listStyles.listContainer}>
          {isAdding && <IssueForm ruleUuid={ruleUuid} screenUuid={screenUuid} />}
          <IssuesList ruleUuid={ruleUuid} screenUuid={screenUuid} />
        </div>
      </div>
    </div>
  );
}
