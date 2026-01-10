import {
  CheckBadgeIcon,
  CheckIcon,
  ClockIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { useAuditStore } from "../../audit/store/auditStore";
import styles from "../styles/project_header.module.css";

export default function ProjectDetailHeader() {
  const project = useAuditStore((state) => state.project);
  const ruleSet = useAuditStore((state) => state.ruleSet);

  if (!project || !ruleSet) {
    return null;
  }

  const progressPercent = `${project.progress || 0}%`;
  const complianceRatePercent = `${project.complianceRate || 0}%`;

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
        <div>
          <strong>Référentiel</strong>
          <span>
            {ruleSet.name} {ruleSet.version}
          </span>
        </div>
        <div>
          <strong>Progrès</strong>
          <span>
            {project.progress === 100 ? <CheckIcon /> : <ClockIcon />}
            <strong>{progressPercent}</strong> -{" "}
            {project.progress === 100 ? "Terminé" : "En cours"}
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: progressPercent }}
            ></div>
          </div>
        </div>
        <div>
          <strong>Taux de conformité</strong>
          {project.complianceRate < 50 && (
            <span>
              <HandThumbDownIcon />
              <strong>{complianceRatePercent}</strong> - Non conforme
            </span>
          )}
          {project.complianceRate !== 100 && project.complianceRate >= 50 && (
            <span>
              <HandThumbUpIcon />
              <strong>{complianceRatePercent}</strong> - Partiellement conforme
            </span>
          )}
          {project.complianceRate === 100 && (
            <span>
              <CheckBadgeIcon />
              <strong>{complianceRatePercent}</strong> - Totalement conforme
            </span>
          )}
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: complianceRatePercent }}
            ></div>
          </div>
        </div>
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
