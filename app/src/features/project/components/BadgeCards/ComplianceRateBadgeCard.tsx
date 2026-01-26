import styles from "../../styles/project_header.module.css";

import {
  CheckBadgeIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

export default function ComplianceRateBadgeCard({complianceRate}: {complianceRate: number}) {
    const complianceRatePercent = `${complianceRate || 0}%`;

    return (
        <div>
          <strong>Taux de conformité</strong>
          {complianceRate < 50 && (
            <span>
              <HandThumbDownIcon />
              <strong>{complianceRatePercent}</strong> - Non conforme
            </span>
          )}
          {complianceRate !== 100 && complianceRate >= 50 && (
            <span>
              <HandThumbUpIcon />
              <strong>{complianceRatePercent}</strong> - Partiellement conforme
            </span>
          )}
          {complianceRate === 100 && (
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
    )
}