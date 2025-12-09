"use client";

import { useAuditStore } from "../../audit/store/auditStore";
import IssueListItem from "./IssueListItem";
import styles from "../styles/issue_list.module.css";

export default function IssuesList({
  ruleUuid,
  screenUuid,
}: {
  ruleUuid: string;
  screenUuid: string;
}) {
  const allIssues = useAuditStore((state) => state.issues);

  const issues = allIssues
    .filter(
      (issue) => issue.ruleUuid === ruleUuid && issue.screenUuid === screenUuid
    )
    .sort((a, b) => b.issueId - a.issueId);

  return (
    <ul className={styles.cardsList}>
      {issues.map((issue) => (
        <IssueListItem key={issue.uuid} issue={issue} />
      ))}
    </ul>
  );
}
