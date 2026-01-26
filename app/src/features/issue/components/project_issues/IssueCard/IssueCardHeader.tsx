import cardStyles from "@/src/components/cards/styles/cards.module.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import SeverityBadge from "../../severity/SeverityBadge";
import { colors } from "@/src/config/colors";
import IssueStatusToggle from "../status/IssueStatusToggle";
import IssueCardMoreActions from "./IssueCardMoreActions";
import { IssueCardIssue } from "../IssueCard";

export default function IssueCardHeader({ issue, formContext }: { issue: IssueCardIssue, formContext: "project_issues" | "rule_issues" | "report" }) {
  dayjs.extend(relativeTime);
  dayjs.locale("fr");

  const relativeDate = dayjs(issue.updatedAt).fromNow();
  const isUpdated = issue.updatedAt !== issue.createdAt;

  return (
    <div className={cardStyles.cardHeader}>
      <div className={cardStyles.cardHeaderLeft}>
        <span style={{color: colors.darkPurple}} aria-hidden="true">#{issue.issueId}</span>
        <SeverityBadge severity={issue.severity} />
        {formContext !== 'report' && (
          <span>
            {isUpdated ? "mis à jour" : "créé"} {relativeDate}
          </span>
        )}
      </div>
      {formContext !== "report" && (
        <div className={cardStyles.cardHeaderRight}>
          <IssueStatusToggle issue={issue} />
          <IssueCardMoreActions issue={issue} formContext={formContext} />
        </div>
      )}
    </div>
  );
}
