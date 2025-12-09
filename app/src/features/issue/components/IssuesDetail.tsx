'use client';

import IssuesList from "./IssuesList";
import IssueForm from "./IssueForm";
import tabStyles from "../../rule_set/styles/rule_tab.module.css";
import listStyles from "../styles/issue_list.module.css";

export default function IssuesDetail({
  ruleUuid,
  screenUuid,
}: {
  ruleUuid: string;
  screenUuid: string;
}) {
  return (
    <div className={tabStyles.tabContainer}>
      <div className={tabStyles.listAndForm}>
        <div className={listStyles.listContainer}>
          <IssuesList ruleUuid={ruleUuid} screenUuid={screenUuid} />
        </div>
        <IssueForm ruleUuid={ruleUuid} screenUuid={screenUuid} />
      </div>
    </div>
  );
}
