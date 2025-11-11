import CardSkeleton from "@/src/components/skeleton/CardSkeleton";
import ErrorBox from "../../error_handling/components/ErrorBox";
import { useFetchProject } from "../queries/useFetchProject";
import { notFound } from "next/navigation";
import RuleSetGrid from "../../rule_set/components/grid/RuleSetGrid";

export default function ProjectDetail({projectUuid}: {projectUuid: string}) {
  const { data: project, isLoading, isError } = useFetchProject(projectUuid);

  if (isLoading) return (<CardSkeleton />);

  if (isError) return (<ErrorBox message="Une erreur est survenue lors du chargement du projet." />);

  if (!project) {
      notFound();
  }

  return (<>
      <h1>Audit — {project.name}</h1>
      <RuleSetGrid />
  </>);
}
