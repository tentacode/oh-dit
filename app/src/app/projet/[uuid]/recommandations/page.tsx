"use client";

import { useAuditStore } from "@/src/features/audit/store/auditStore";
import IssuesListEmpty from "@/src/features/issue/components/project_issues/IssuesListEmpty";
import tabStyles from "@/src/features/rule_set/styles/rule_tab.module.css";
import ProjectIssues from "@/src/features/issue/components/project_issues/ProjectIssues";
import Filters from "@/src/components/filter/Filters";
import FilterLink from "@/src/components/filter/FilterLink";
import FiltersGroup from "@/src/components/filter/FiltersGroup";
import FilterSelect from "@/src/components/filter/FilterSelect";
import {
  CalendarDaysIcon,
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
import FiltersList from "@/src/components/filter/FiltersList";

export default function ProjectIssuesPage() {
  const issues = useAuditStore((state) => state.issues);

  const allIssuesCount = issues.length;
  const openIssuesCount = issues.filter(
    (issue) => issue.status === "pending",
  ).length;
  const fixedIssuesCount = issues.filter(
    (issue) => issue.status === "fixed",
  ).length;

  const [filters, setFilters] = useQueryStates(issuesFiltersParsers);

  if (issues.length === 0) {
    return <IssuesListEmpty />;
  }

  return (
    <>
      <div className="horizontalGutter mt-8">
        <title>Recommandations - Ohdit</title>
        <h2 className="h2">Recommandations</h2>
        <Filters>
          <FiltersList>
            <li>
              <FilterLink
                isActive={filters.status === "all"}
                filters={{ status: "all" }}
              >
                <ListBulletIcon />
                Toutes ({allIssuesCount})
              </FilterLink>
            </li>
            <li>
              <FilterLink
                isActive={filters.status === "pending"}
                filters={{ status: "pending" }}
              >
                <ExclamationTriangleIcon />
                Ouvertes ({openIssuesCount})
              </FilterLink>
            </li>
            <li>
              <FilterLink
                isActive={filters.status === "fixed"}
                filters={{ status: "fixed" }}
              >
                <CheckIcon />
                Corrigées ({fixedIssuesCount})
              </FilterLink>
            </li>
          </FiltersList>
          <FiltersGroup>
            {/* <FilterSelect>Page</FilterSelect>
          <FilterSelect>Critère</FilterSelect>
          <FilterSelect>Impact</FilterSelect> */}
            <FilterSelect
              id="group-by"
              listHeader="Grouper par :"
              selectedValue="Page"
              onChange={(newValue) => {
                if (newValue === "Page") {
                  setFilters({ ...filters, group: "screen" });
                } else {
                  setFilters({ ...filters, group: "rule" });
                }
              }}
              values={["Page", "Critère"]}
            >
              {filters.group === "screen" && (
                <>
                  <DocumentIcon />
                  Groupé par : Page
                </>
              )}
              {filters.group === "rule" && (
                <>
                  <ListBulletIcon />
                  Groupé par : Critère
                </>
              )}
            </FilterSelect>
            <FilterSelect
              id="sort-by"
              listHeader="Trier par :"
              selectedValue="Impact"
              values={["Impact", "Date"]}
              onChange={(newValue) => {
                if (newValue === "Impact") {
                  setFilters({ ...filters, sort: "severity" });
                } else {
                  setFilters({ ...filters, sort: "date" });
                }
              }}
            >
              {filters.sort === "severity" && (
                <>
                  <FireIcon />
                  Trié par : Impact
                </>
              )}
              {filters.sort === "date" && (
                <>
                  <CalendarDaysIcon />
                  Trié par : Date
                </>
              )}
            </FilterSelect>
          </FiltersGroup>
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
