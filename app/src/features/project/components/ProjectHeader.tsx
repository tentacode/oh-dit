import {
  InformationCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useAuditStore } from "../../audit/store/auditStore";
import styles from "../styles/project_header.module.css";
import RuleSetBadgeCard from "./BadgeCards/RuleSetBadgeCard";
import ProgressBadgeCard from "./BadgeCards/ProgressBadgeCard";
import ComplianceRateBadgeCard from "./BadgeCards/ComplianceRateBadgeCard";

export default function ProjectDetailHeader() {
  const project = useAuditStore((state) => state.project);
  const ruleSet = useAuditStore((state) => state.ruleSet);

  if (!project || !ruleSet) {
    return null;
  }

  return (
    <div className="horizontalGutter">
      <h1
        className={`h1 ${styles.projectTitle}`}
        style={{ display: "flex", alignItems: "center" }}
      >
        Audit — {project.name}
      </h1>

      {project.url && (
        <p className={styles.siteUrl}>
          <LinkIcon />
          Adresse du projet : <a href={project.url}>{project.url}</a>
        </p>
      )}

      <div className={`${styles.statsContainer}`}>
        <RuleSetBadgeCard name={ruleSet.name} version={ruleSet.version} />
        <ProgressBadgeCard progress={project.progress} />
        <ComplianceRateBadgeCard complianceRate={project.complianceRate} />
      </div>

      {project.progress !== 100 && (
        <p className={styles.helpText}>
          <InformationCircleIcon />
          Le taux de conformité est donné à titre indicatif. Il n'est pas
          valable tant que l'audit n'est pas terminé.
        </p>
      )}
    </div>
  );
}
