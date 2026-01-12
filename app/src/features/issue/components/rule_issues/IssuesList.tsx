"use client";

import { useAuditStore } from "../../../audit/store/auditStore";
import IssueListItem from "./IssueListItem";
import styles from "../../styles/issue_list.module.css";
import CallToActionButton from "@/src/components/form/CallToActionButon";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useIssuesFormStateStore } from "../../store/issuesFormStateStore";

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

  const issueFormState = useIssuesFormStateStore((state) =>
    state.issuesFormState.find(
      (ifs) => ifs.ruleUuid === ruleUuid && ifs.screenUuid === screenUuid
    )
  );

  const overrideIssueFormState = useIssuesFormStateStore(
    (state) => state.overrideIssueFormState
  );

  const addIssue = () => {
    overrideIssueFormState({
      issueUuid: null,
      issueId: null,
      ruleUuid,
      screenUuid,
      mode: "create",
      severity: "moderate",
      text: "",
      status: "pending",
    });

    setTimeout(() => {
      document.getElementById(`text-${ruleUuid}-${screenUuid}`)?.focus();
    }, 100);
  };

  if (issues.length === 0 && !issueFormState) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <p style={{ margin: 0, fontStyle: "italic", fontSize: "1em" }}>
          Il n'y a aucune recommandation pour cette règle.
        </p>
        <CallToActionButton id={`add-issue-button-${ruleUuid}-${screenUuid}`} onClick={addIssue} variant="small">
          <PlusIcon />
          Ajouter une recommandation
        </CallToActionButton>
      </div>
    );
  }

  if (issues.length === 0 && issueFormState) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      {issueFormState?.mode !== "create" &&  issueFormState?.mode !== "duplicate" && (
      <CallToActionButton id={`add-issue-button-${ruleUuid}-${screenUuid}`} onClick={addIssue} variant="small">
        <PlusIcon />
        Ajouter une recommandation
      </CallToActionButton>
    )}
      <ul className={styles.cardsList}>
        {issues.map((issue) => (
          <IssueListItem key={issue.uuid} issue={issue} />
        ))}

        {issues.length === 0 && (
          <li className={styles.noIssuesMessage}>
            Il n'y a aucune recommandation pour cette règle.
          </li>
        )}
      </ul>
    </div>
  );
}
