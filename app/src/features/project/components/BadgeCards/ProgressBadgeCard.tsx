import styles from "../../styles/project_header.module.css";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function ProgressBadgeCard({progress}: {progress: number}) {
  const progressPercent = `${progress || 0}%`;
  
  return (
        <div>
          <strong>Progrès</strong>
          <span>
            {progress === 100 ? <CheckIcon /> : <ClockIcon />}
            <strong>{progressPercent}</strong> -{" "}
            {progress === 100 ? "Terminé" : "En cours"}
          </span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: progressPercent }}
            ></div>
          </div>
        </div>
    )
}