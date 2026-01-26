"use client";

import CallToActionButton from "@/src/components/form/CallToActionButon";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useIssuesFormStateStore } from "../../store/issuesFormStateStore";

export default function RuleIssuesEmpty({
  ruleUuid,
  screenUuid,
}: {
  ruleUuid: string;
  screenUuid: string;
}) {
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
      context: "rule_issues",
    });

    setTimeout(() => {
      document.getElementById(`text-${ruleUuid}-${screenUuid}`)?.focus();
    }, 100);
  };

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
