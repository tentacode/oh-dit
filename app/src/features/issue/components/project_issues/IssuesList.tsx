"use client";

import { Issue, useAuditStore } from "../../../audit/store/auditStore";
import IssueListItem from "./IssueListItem";
import styles from "../../styles/issue_list.module.css";
import { useQueryStates } from "nuqs";
import { issuesFiltersParsers } from "../../types/IssuesFilters";

export default function IssuesList() {
  const allIssues = useAuditStore((state) => state.issues);
  const project = useAuditStore((state) => state.project);
  const ruleSet = useAuditStore((state) => state.ruleSet);

  const [filters] = useQueryStates(issuesFiltersParsers);

  if (project === null || ruleSet === null) {
    return null;
  }

  let filteredIssues = allIssues;
  if (filters.status === 'pending') {
    filteredIssues = filteredIssues.filter(issue => issue.status === 'pending');
  } else if (filters.status === 'fixed') {
    filteredIssues = filteredIssues.filter(issue => issue.status === 'fixed');
  }

  const groupedIssues = Object.groupBy(filteredIssues, issue => {
    if (filters.group === 'screen') {
      return issue.screenUuid;
    } else if (filters.group === 'rule') {
      return issue.ruleUuid;
    } else if (filters.group === 'severity') {
      return issue.severity;
    }
    return 'unknown';
  });

  function sortIssueGroups(a: Issue, b: Issue): number {
    if (filters.sort === 'severity') {
      const severityOrder = { 'blocking': 0, 'moderate': 1, 'low': 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    
    return b.issueId - a.issueId;
  }

  function getGroupName(groupKey: string): string {
    // ajouter le numéro de la page
    if (filters.group === 'screen') {
      const screen = project?.screens.find(s => s.uuid === groupKey);
      return screen ? screen.name : 'Inconnu';
    } else if (filters.group === 'rule') {
      const rule = ruleSet?.ruleCategories.find(c => c.rules.find(r => r.uuid === groupKey))?.rules.find(r => r.uuid === groupKey);
      return rule ? rule.shortDescription : 'Inconnu';
    } else if (filters.group === 'severity') {
      return groupKey.charAt(0).toUpperCase() + groupKey.slice(1);
    }
    return 'Inconnu';
  }

  if (Object.keys(groupedIssues).length === 0) {
    return <p style={{
      marginBottom: '0 !important',
    }}>Aucune recommandation trouvée avec les filtres appliqués.</p>;
  }

  return (
    <ul className={styles.groupedCartList}>
      {Object.entries(groupedIssues).map(([group, issuesInGroup]) => (
        <li key={group}>
          <h3 className="h4 mb-4">{getGroupName(group)}</h3>
          <ul className={styles.cardsList}>
            {issuesInGroup?.sort(sortIssueGroups).map((issue) => (
              <IssueListItem key={issue.uuid} issue={issue} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
