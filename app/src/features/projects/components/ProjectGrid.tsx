import styles from "../styles/project_grid.module.css";
import { ProjectStatus } from "../types/ProjectInterface";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  const projects = [
    {
      uuid: "1",
      name: "Ohdit",
      updatedAt: new Date("2025-11-01").toISOString(),
      progress: 15,
      status: ProjectStatus.InProgress,
    },
    {
      uuid: "2",
      name: "DisneyLand",
      updatedAt: new Date("2024-01-02").toISOString(),
      progress: 70,
      status: ProjectStatus.OnHold,
    },
    {
      uuid: "3",
      name: "SNCF",
      updatedAt: new Date("2024-01-03").toISOString(),
      progress: 100,
      status: ProjectStatus.Completed,
    },
    {
      uuid: "4",
      name: "tentacode.dev",
      updatedAt: new Date("2023-01-04").toISOString(),
      progress: 100,
      status: ProjectStatus.Completed,
    },
  ];

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard key={project.uuid} project={project} />
      ))}
    </div>
  );
}
