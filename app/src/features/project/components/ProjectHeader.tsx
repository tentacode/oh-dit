import {
  ArrowTopRightOnSquareIcon,
  InformationCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useAuditStore } from "../../audit/store/auditStore";
import styles from "../styles/project_header.module.css";
import typographyStyle from "@/src/design-system/styles/typography.module.css";
import RuleSetBadgeCard from "./BadgeCards/RuleSetBadgeCard";
import ProgressBadgeCard from "./BadgeCards/ProgressBadgeCard";
import ComplianceRateBadgeCard from "./BadgeCards/ComplianceRateBadgeCard";

export default function ProjectDetailHeader() {
  const project = useAuditStore((state) => state.project);
  const ruleSet = useAuditStore((state) => state.ruleSet);

  if (!project || !ruleSet) {
    return null;
  }

  let projectUrl = project.url;
  if (projectUrl && !/^https?:\/\//i.test(projectUrl)) {
    projectUrl = `https://${projectUrl}`;
  }

  return (
    <div className="horizontalGutter">
      <h1
        className={`h1 ${styles.projectTitle}`}
        style={{ display: "flex", alignItems: "center" }}
      >
        Audit — {project.name}
      </h1>

      {projectUrl && (
        <p className={styles.siteUrl}>
          <LinkIcon />
          Adresse du projet :{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${projectUrl}, nouvelle fenêtre`}
            className={typographyStyle.externalLink}
            href={projectUrl}
          >
            {projectUrl}
            <ArrowTopRightOnSquareIcon />
          </a>
        </p>
      )}

      <div className={`${styles.statsContainer}`}>
        <RuleSetBadgeCard name={ruleSet.name} version={ruleSet.version} />
        <ProgressBadgeCard progress={project.progress} />
        <ComplianceRateBadgeCard complianceRate={project.complianceRate} />
      </div>

      {ruleSet.name === "RGAA" && project.progress !== 100 && (
        <p className={styles.helpText}>
          <InformationCircleIcon />
          Le taux de conformité est donné à titre indicatif. Il n'est pas
          valable tant que l'audit n'est pas terminé.
        </p>
      )}

      {ruleSet.name === "RGAA 25" && (
        <p className={styles.helpText}>
          <InformationCircleIcon />
          Le taux de conformité du RGAA 25 critères est donné à titre indicatif.
          Il n'a pas de valeur légale.
        </p>
      )}

      {["RAAM", "RAPDF"].includes(ruleSet.name) && (
        <p className={styles.helpText}>
          <InformationCircleIcon />
          Le taux de conformité du {ruleSet.name} est donné à titre indicatif.
          Il n'a pas de valeur légale.
        </p>
      )}
    </div>
  );
}
