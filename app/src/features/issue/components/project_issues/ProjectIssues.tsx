"use client";

import { Issue, Rule, useAuditStore } from "../../../audit/store/auditStore";
import IssueCard from "./IssueCard";
import cardStyles from "@/src/components/cards/styles/cards.module.css";
import { useQueryStates } from "nuqs";
import { issuesFiltersParsers } from "../../types/IssuesFilters";
import CardsGroup from "@/src/components/cards/CardsGroup";
import CardsList from "@/src/components/cards/CardsList";
import CardsGroups from "@/src/components/cards/CardsGroups";

export default function ProjectIssues() {
  const allIssues = useAuditStore((state) => state.issues);
  const project = useAuditStore((state) => state.project);
  const ruleSet = useAuditStore((state) => state.ruleSet);

  const [filters] = useQueryStates(issuesFiltersParsers);

  if (project === null || ruleSet === null) {
    return null;
  }

  let filteredIssues = allIssues;
  if (filters.status === "pending") {
    filteredIssues = filteredIssues.filter(
      (issue) => issue.status === "pending",
    );
  } else if (filters.status === "fixed") {
    filteredIssues = filteredIssues.filter((issue) => issue.status === "fixed");
  }

  const getRule = (ruleUuid: string): Rule | undefined => {
    const rule = ruleSet?.ruleCategories
      .flatMap((category) => category.rules)
      .find((r) => r.uuid === ruleUuid);
    return rule;
  };

  const groupedIssues = Object.groupBy(filteredIssues, (issue) => {
    if (filters.group === "screen") {
      return issue.screenUuid;
    } else if (filters.group === "rule") {
      return issue.ruleUuid;
    } else if (filters.group === "severity") {
      return issue.severity;
    }
    return "unknown";
  });

  function sortIssueGroups(a: Issue, b: Issue): number {
    switch (filters.sort) {
      case "severity":
        const severityOrder = { blocking: 0, moderate: 1, low: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      case "date":
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      case "rule":
        const ruleA = getRule(a.ruleUuid);
        const ruleB = getRule(b.ruleUuid);
        if (ruleA && ruleB) {
          return ruleA.prefix.localeCompare(ruleB.prefix);
        }
        return 0;
      case "screen":
        const screenA = project?.screens.find((s) => s.uuid === a.screenUuid);
        const screenB = project?.screens.find((s) => s.uuid === b.screenUuid);
        if (screenA && screenB) {
          return screenA.rank - screenB.rank;
        }
        return 0;
      default:
        return b.issueId - a.issueId;
    }
  }

  function getGroupName(groupKey: string): string {
    // ajouter le numéro de la page
    if (filters.group === "screen") {
      const screen = project?.screens.find((s) => s.uuid === groupKey);
      return screen
        ? `P${screen.rank.toString().padStart(2, "0")} - ${screen.name}`
        : "Inconnu";
    } else if (filters.group === "rule") {
      const rule = ruleSet?.ruleCategories
        .find((c) => c.rules.find((r) => r.uuid === groupKey))
        ?.rules.find((r) => r.uuid === groupKey);
      return rule ? `${rule.prefix} - ${rule.shortDescription}` : "Inconnu";
    } else if (filters.group === "severity") {
      return groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
    }

    return "Inconnu";
  }

  function getCardTitle(issue: Issue): string {
    if (filters.group === "screen") {
      const rule = getRule(issue.ruleUuid);
      return rule ? `${rule.prefix} - ${rule.shortDescription}` : "Inconnu";
    } else if (filters.group === "rule") {
      const screen = project?.screens.find((s) => s.uuid === issue.screenUuid);
      return screen
        ? `P${screen.rank.toString().padStart(2, "0")} - ${screen.name}`
        : "Inconnu";
    }

    return "Inconnu";
  }

  if (Object.keys(groupedIssues).length === 0) {
    return (
      <p
        style={{
          marginBottom: "0 !important",
        }}
      >
        Aucune recommandation trouvée avec les filtres appliqués.
      </p>
    );
  }

  return (
    <CardsGroups>
      {Object.entries(groupedIssues).map(([group, issuesInGroup]) => (
        <CardsGroup key={group}>
          <h3 className={cardStyles.groupTitle}>{getGroupName(group)}</h3>

          <CardsList>
            {issuesInGroup?.sort(sortIssueGroups).map((issue) => {
              return (
                <IssueCard
                  key={issue.uuid}
                  issue={issue}
                  cardTitle={getCardTitle(issue)}
                  formContext="project_issues"
                />
              );
            })}
          </CardsList>
        </CardsGroup>
      ))}
    </CardsGroups>
  );
}
