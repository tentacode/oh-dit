import CardsGroup from "@/src/components/cards/CardsGroup";
import CardsGroups from "@/src/components/cards/CardsGroups";
import CardsList from "@/src/components/cards/CardsList";
import IssueCard, { IssueCardIssue } from "@/src/features/issue/components/project_issues/IssueCard";

import cardStyles from "@/src/components/cards/styles/cards.module.css";
import { FetchSecuredReportResponse } from "../../queries/useFetchSecuredReport";

export default function SecuredReportIssues({
  report,
}: {
  report: FetchSecuredReportResponse;
}) {
  const screens = report.project.screens;

  const getRule = (ruleUuid: string): {uuid: string, shortDescription: string, prefix: string} | undefined => {
    const rule = report.project.ruleSet?.ruleCategories
      .flatMap((category) => category.rules)
      .find((r) => r.uuid === ruleUuid);
    return rule;
  };

  return (
    <CardsGroups>
      {screens.map((screen) => {
        const screenIssues = report.issues.filter(
          (issue) => issue.screenUuid === screen.uuid,
        );

        if (screenIssues.length === 0) {
          return null;
        }

        function sortIssueGroups(
          a: FetchSecuredReportResponse["issues"][0],
          b: FetchSecuredReportResponse["issues"][0],
        ): number {
          const severityOrder = { blocking: 0, moderate: 1, low: 2 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        }

        return (
          <CardsGroup key={screen.uuid}>
            <h3 className={cardStyles.groupTitle}>{screen.name}</h3>

            <CardsList>
              {screenIssues.sort(sortIssueGroups).map((issue) => {
                const rule = getRule(issue.ruleUuid);
                const cardTitle = `${rule?.prefix} - ${rule?.shortDescription}`;

                return (
                  <IssueCard
                    key={issue.uuid}
                    issue={issue as IssueCardIssue}
                    cardTitle={cardTitle}
                    formContext="report"
                  />
                );
              })}
            </CardsList>
          </CardsGroup>
        );
      })}
    </CardsGroups>
  );
}
