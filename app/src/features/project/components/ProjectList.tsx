import CardSkeleton from "@/src/components/skeleton/CardSkeleton";
import { useFetchProjects } from "../queries/useFetchProjects";
import styles from "../styles/project_grid.module.css";
import { ProjectInterface } from "../types/ProjectInterface";
import ProjectCard from "./ProjectCard";
import ErrorBox from "../../error_handling/components/ErrorBox";
import ProjectListEmpty from "./ProjectListEmpty";

export default function ProjectList({ teamUuid }: { teamUuid: string }) {
  const { data: projects, isLoading, isError } = useFetchProjects(teamUuid);

  if (isLoading) return (<CardSkeleton />);

  if (isError || !projects) return (<ErrorBox message="Une erreur est survenue lors du chargement des projets." />);

  if (projects.length === 0) {
    return <ProjectListEmpty />;
  }

  return (
    <div className={styles.grid}>
      {projects.map((project: ProjectInterface) => (
        <ProjectCard key={project.uuid} project={project} />
      ))}
    </div>
  );
}
