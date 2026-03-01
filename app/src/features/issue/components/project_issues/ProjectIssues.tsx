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

  const sortedGroupEntries = Object.entries(groupedIssues).sort(([groupKeyA], [groupKeyB]) => {
  if (filters.group === "screen") {
    const screenA = project?.screens.find((s) => s.uuid === groupKeyA);
    const screenB = project?.screens.find((s) => s.uuid === groupKeyB);
    if (screenA && screenB) return screenA.rank - screenB.rank;
  } else if (filters.group === "rule") {
    const ruleA = getRule(groupKeyA);
    const ruleB = getRule(groupKeyB);
    if (ruleA && ruleB) return compareVersionPrefix(ruleA.prefix, ruleB.prefix);
  } else if (filters.group === "severity") {
    const severityOrder = { blocking: 0, moderate: 1, low: 2 };
    return severityOrder[groupKeyA as keyof typeof severityOrder] - severityOrder[groupKeyB as keyof typeof severityOrder];
  }
  return 0;
});

  function compareVersionPrefix(a: string, b: string): number {
    const partsA = a.split(".").map(Number);
    const partsB = b.split(".").map(Number);
    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
      const numA = partsA[i] ?? 0;
      const numB = partsB[i] ?? 0;
      if (numA !== numB) return numA - numB;
    }
    return 0;
  }

  function sortIssueGroups(
    a: Issue,
    b: Issue,
    secondarySort?: typeof filters.sort,
  ): number {
    const primaryResult = compareBySort(a, b, filters.sort);
    if (primaryResult !== 0) return primaryResult;
    if (secondarySort && secondarySort !== filters.sort) {
      return compareBySort(a, b, secondarySort);
    }
    return 0;
  }

  function compareBySort(
    a: Issue,
    b: Issue,
    sort: typeof filters.sort,
  ): number {
    switch (sort) {
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
          return compareVersionPrefix(ruleA.prefix, ruleB.prefix);
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
      {sortedGroupEntries.map(([group, issuesInGroup]) => (
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
