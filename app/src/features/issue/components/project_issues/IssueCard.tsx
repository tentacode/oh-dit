import markdownStyles from "@/src/features/markdown/styles/markdown.module.css";

import { useIssuesFormStateStore } from "../../store/issuesFormStateStore";
import Markdown from "@/src/features/markdown/components/Mardown";
import IssueCardHeader from "./IssueCard/IssueCardHeader";
import CardTitle from "@/src/components/cards/CardTitle";
import Card from "@/src/components/cards/Card";
import IssueForm from "../rule_issues/IssueForm";

export interface IssueCardIssue {
  uuid: string;
  issueId: number;
  severity: 'blocking' | 'moderate' | 'low';
  status: 'pending' | 'fixed';
  text: string;
  createdAt: string;
  updatedAt: string;
  ruleUuid: string;
  screenUuid: string;
}

export default function IssueCard({
  issue,
  formContext,
  cardTitle,
}: {
  issue: IssueCardIssue;
  formContext: "project_issues" | "rule_issues" | "report";
  cardTitle?: string;
}) {
  const issueFormState = useIssuesFormStateStore((state) =>
    state.issuesFormState.find(
      (ifs) =>
        ifs.ruleUuid === issue.ruleUuid &&
        ifs.screenUuid === issue.screenUuid &&
        ifs.context === formContext,
    ),
  );

  if (
    formContext !== "report" &&
    issueFormState &&
    issueFormState.issueId === issue.issueId &&
    (issueFormState.mode === "edit" || issueFormState.mode === "delete")
  ) {
    return (
      <IssueForm
        ruleUuid={issue.ruleUuid}
        screenUuid={issue.screenUuid}
        formContext={formContext}
      />
    );
  }

  return (
    <div aria-label={`Recommandation numéro ${issue.issueId}`}>
      <Card label={`Recommandation numéro ${issue.issueId}`}>
        <IssueCardHeader issue={issue as IssueCardIssue} formContext={formContext} />

        {cardTitle && <CardTitle headingLevel={4}>{cardTitle}</CardTitle>}

        <Markdown
          className={markdownStyles.issueMarkdown}
          minimalHeadingLevel={5}
        >
          {issue.text}
        </Markdown>
      </Card>
    </div>
  );
}
