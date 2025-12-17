import {
  CheckBadgeIcon,
  CheckIcon,
  ClockIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
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
      <h1 className={"h1"} style={{ display: "flex", alignItems: "center" }}>
        Audit — {project.name}
      </h1>
      <dl className={`${styles.statsContainer}`}>
        <div>
          <dt>Référentiel</dt>
          <dd>
            {ruleSet.name} {ruleSet.version}
          </dd>
        </div>
        <div>
          <dt>Progrès</dt>
          <dd>
            {project.progress === 100 ? <CheckIcon /> : <ClockIcon />}
            <strong>{progressPercent}</strong> - {project.progress === 100 ? "Terminé" : "En cours"}
          </dd>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: progressPercent }}
            ></div>
          </div>
        </div>
        <div>
          <dt>Taux de conformité</dt>
          {project.complianceRate < 50 && (
            <dd>
              <HandThumbDownIcon />
              <strong>{complianceRatePercent}</strong> - Non conforme
            </dd>
          )}
          {project.complianceRate !== 100 && project.complianceRate >= 50 && (
            <dd>
              <HandThumbUpIcon />
              <strong>{complianceRatePercent}</strong> - Partiellement conforme
            </dd>
          )}
          {project.complianceRate === 100 && (
            <dd>
              <CheckBadgeIcon />
              <strong>{complianceRatePercent}</strong> - Totalement conforme
            </dd>
          )}
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: complianceRatePercent }}
            ></div>
          </div>
        </div>
      </dl>
      {project.progress !== 100 && (
        <p className={styles.helpText}>
          <InformationCircleIcon />
          Le taux de conformité est donné à titre indicatif. Il n'est pas valable
          tant que l'audit n'est pas terminé.
        </p>
      )}
    </div>
  );
}
