import styles from "../styles/project_grid.module.css";
import {ProjectInterface} from "../types/ProjectInterface";
import { clsx } from "clsx";
import {
    CalendarDaysIcon,
} from '@heroicons/react/24/outline'
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { getStatusName } from "../queries/getStatusName";
import { getProjectUrl } from "@/src/app/projet/routing";

export default function ProjectCard({
  project,
}: {
  project: ProjectInterface;
}) {
  dayjs.extend(relativeTime);
  dayjs.locale("fr");

  const relativeUpdatedAt = dayjs(project.updatedAt).fromNow();

  return (
    <Link prefetch={false} href={getProjectUrl.dashboard(project.uuid)} className={styles.card}>
      <div className={styles.cardContent}>
        <h2>
            <span className={styles.projectName}>{project.name}</span>
            <span className="mt-1 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                {project.ruleSet.name} {project.ruleSet.version}
            </span>
            <span className="mt-1 inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                {getStatusName(project.status)}
            </span>
        </h2>
        <p className={styles.dateContainer}>
            <CalendarDaysIcon />
            mis à jour {relativeUpdatedAt}
        </p>
      </div>

      <div className={styles.progressContainer}>
        <div
          className={clsx(styles.progressBar, {
            [styles.progressBarComplete]: project.progress === 100,
          })}
          style={{ width: `${project.progress}%` }}
        ></div>
      </div>
    </Link>
  );
}