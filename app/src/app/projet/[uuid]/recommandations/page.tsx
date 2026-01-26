"use client";

import { useAuditStore } from "@/src/features/audit/store/auditStore";
import IssuesListEmpty from "@/src/features/issue/components/project_issues/IssuesListEmpty";
import tabStyles from "@/src/features/rule_set/styles/rule_tab.module.css";
import ProjectIssues from "@/src/features/issue/components/project_issues/ProjectIssues";
import Filters from "@/src/components/filter/Filters";
import FilterLinks from "@/src/components/filter/FilterLinks";
import FilterLink from "@/src/components/filter/FilterLink";
import FilterActions from "@/src/components/filter/FilterActions";
import FilterAction from "@/src/components/filter/FilterAction";
import {
  CheckIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  FireIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { issuesFiltersParsers } from "@/src/features/issue/types/IssuesFilters";
import { useQueryStates } from "nuqs";
import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import Link from "next/link";

export default function ProjectIssuesPage() {
  const issues = useAuditStore((state) => state.issues);

  const allIssuesCount = issues.length;
  const openIssuesCount = issues.filter(
    (issue) => issue.status === "pending"
  ).length;
  const fixedIssuesCount = issues.filter(
    (issue) => issue.status === "fixed"
  ).length;

  const [filters] = useQueryStates(issuesFiltersParsers);

  if (issues.length === 0) {
    return <IssuesListEmpty />;
  }

  return (
    <>
      <div className="horizontalGutter mt-8">
        <title>Recommandations - Ohdit</title>
        <h2 className="h2">Recommandations</h2>
        <Filters>
          <FilterLinks>
            <FilterLink
              isActive={filters.status === "all"}
              filters={{ status: "all" }}
            >
              <ListBulletIcon />
              Toutes ({allIssuesCount})
            </FilterLink>
            <FilterLink
              isActive={filters.status === "pending"}
              filters={{ status: "pending" }}
            >
              <ExclamationTriangleIcon />
              Ouvertes ({openIssuesCount})
            </FilterLink>
            <FilterLink
              isActive={filters.status === "fixed"}
              filters={{ status: "fixed" }}
            >
              <CheckIcon />
              Corrigées ({fixedIssuesCount})
            </FilterLink>
          </FilterLinks>
          <FilterActions>
            {/* <FilterAction>Page</FilterAction>
          <FilterAction>Critère</FilterAction>
          <FilterAction>Impact</FilterAction> */}
            <FilterAction>
              <DocumentIcon />
              Groupé par : Page
            </FilterAction>
            <FilterAction>
              <FireIcon />
              Trié par : Impact
            </FilterAction>
          </FilterActions>
        </Filters>
        <div className={tabStyles.tabContainer}>
          <ProjectIssues />  
        </div>
      </div>

      <WorkInProgress>
        <div className="horizontalGutter mt-8 px-20">
          <p>
            Cette page est <strong>en cours de développement</strong>.
          </p>
          <p>
            Vous trouverez bientôt d'autres fonctionalités sur les
            recomandations, par exemple :
          </p>
          <ul>
            <li>Modifier la recommandation depuis cette page.</li>
            <li>Changer le groupe et le tri.</li>
            <li>Pouvoir discuter sur les recommandations.</li>
          </ul>
          <p>
            Pour savoir quelles sont les prochaines évolutions du projet, vous
            pouvez consulter la{" "}
            <Link prefetch={false} href="/feuille-de-route">
              feuille de route
            </Link>
            .
          </p>
        </div>
      </WorkInProgress>
    </>
  );
}
