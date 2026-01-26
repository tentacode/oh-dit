"use client";

import { useAuditStore } from "../../../audit/store/auditStore";
import CallToActionButton from "@/src/components/form/CallToActionButon";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useIssuesFormStateStore } from "../../store/issuesFormStateStore";
import RuleIssuesEmpty from "./RuleIssuesEmpty";
import CardsList from "@/src/components/cards/CardsList";
import IssueCard from "../project_issues/IssueCard";

export default function RuleIssues({
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
      (ifs) => ifs.ruleUuid === ruleUuid && ifs.screenUuid === screenUuid && ifs.context === "rule_issues"
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
      context: "rule_issues",
    });

    setTimeout(() => {
      document.getElementById(`text-${ruleUuid}-${screenUuid}`)?.focus();
    }, 100);
  };

  if (issues.length === 0 && !issueFormState) {
    return (
      <RuleIssuesEmpty ruleUuid={ruleUuid} screenUuid={screenUuid} />
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
        <CardsList>
          {issues.map((issue) => (
            <IssueCard key={issue.uuid} issue={issue} formContext="rule_issues" />
          ))}
        </CardsList>
    </div>
  );
}
