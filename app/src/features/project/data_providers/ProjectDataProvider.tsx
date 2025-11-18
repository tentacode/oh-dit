import { ReactNode, useEffect } from "react";
import { useAuditStore } from "../../audit/store/auditStore";
import { useFetchProjectCompliances } from "../../compliance/queries/useFetchProjectCompliances";
import { useFetchRuleSet } from "../../rule_set/queries/useFetchRuleSet";
import { useFetchProject } from "../queries/useFetchProject";
import CardSkeleton from "@/src/components/skeleton/CardSkeleton";
import ErrorBox from "../../error_handling/components/ErrorBox";
import { notFound } from "next/navigation";

export default function ProjectDataProvider({
  projectUuid,
  children,
}: {
  projectUuid: string;
  children: ReactNode;
}) {
  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
  } = useFetchProject(projectUuid);
  const {
    data: projectCompliances,
    isLoading: isLoadingCompliances,
    isError: isErrorCompliances,
  } = useFetchProjectCompliances(projectUuid);
  const {
    data: ruleSet,
    isLoading: isLoadingRuleSet,
    isError: isErrorRuleSet,
  } = useFetchRuleSet(project?.ruleSet.uuid ?? "", {
    enabled: project?.ruleSet.uuid !== undefined,
  });
  const { setProject, setCompliances, setCurrentScreenUuid, setRuleSet } =
    useAuditStore();

  useEffect(() => {
    if (project) {
      setCurrentScreenUuid(
        project.screens.length > 0 ? project.screens[0].uuid : undefined
      );
    } else {
      setCurrentScreenUuid(undefined);
    }
  }, [project, setCurrentScreenUuid ]);

  useEffect(() => {
    if (project) {
      setProject(project);
      setCurrentScreenUuid(
        project.screens.length > 0 ? project.screens[0].uuid : undefined
      );
    }
  }, [project, setProject, setCurrentScreenUuid]);

  useEffect(() => {
    if (ruleSet) {
      setRuleSet(ruleSet);
    }
  }, [ruleSet, setRuleSet]);

  useEffect(() => {
    if (projectCompliances) {
      setCompliances(projectCompliances);
    }
  }, [projectCompliances, setCompliances]);

  if (isLoadingProject || isLoadingCompliances || isLoadingRuleSet)
    return <CardSkeleton />;

  if (isErrorProject || isErrorCompliances || isErrorRuleSet)
    return (
      <ErrorBox message="Une erreur est survenue lors du chargement du projet." />
    );

  if (!project || !ruleSet) {
    notFound();
  }

  return <>{children}</>;
}
