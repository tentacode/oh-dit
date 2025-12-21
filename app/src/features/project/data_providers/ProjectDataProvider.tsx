import { ReactNode, useEffect } from "react";
import { useAuditStore } from "../../audit/store/auditStore";
import { useFetchProjectCompliances } from "../../compliance/queries/useFetchProjectCompliances";
import { useFetchRuleSet } from "../../rule_set/queries/useFetchRuleSet";
import { useFetchProject } from "../queries/useFetchProject";
import ErrorBox from "../../error_handling/components/ErrorBox";
import { notFound } from "next/navigation";
import { useFetchProjectIssues } from "../../issue/queries/useFetchProjectIssues";
import { useAuditSettingsStore } from "../../audit/store/auditSettingsStore";

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

  const {
    data: projectIssues,
    isLoading: isLoadingIssues,
    isError: isErrorIssues,
  } = useFetchProjectIssues(projectUuid);

  const { setProject, setCompliances, setRuleSet, setIssues } = useAuditStore();

  const getProjectSetting = useAuditSettingsStore(
    (state) => state.getProjectSetting
  );
  const projectSetting = getProjectSetting(projectUuid);
  const setProjectSetting = useAuditSettingsStore(
    (state) => state.setProjectSetting
  );

  useEffect(() => {
    if (project) {
      setProject(project);

      if (!projectSetting.currentScreenUuid) {
        const firstScreenUuid = project.screens[0]?.uuid || null;
        if (firstScreenUuid) {
          setProjectSetting({
            projectUuid,
            currentScreenUuid: firstScreenUuid,
          });
        }
      }
    }
  }, [
    project,
    setProject,
    projectSetting.currentScreenUuid,
    setProjectSetting,
    projectUuid,
  ]);

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

  useEffect(() => {
    if (projectIssues) {
      setIssues(projectIssues);
    }
  }, [projectIssues, setIssues]);

  if (
    isLoadingProject ||
    isLoadingCompliances ||
    isLoadingRuleSet ||
    isLoadingIssues
  )
    return (
      <div className="horizontalGutter mb-5">
        <h1 className={"h1 mb-4"}>Chargement du projet…</h1>
        <div className="animate-pulse">
        <div className="flex gap-3 mb-4" style={{width: '60%', height: '80px',}}>
          <div className="h-5" style={{background: '#ffece6', height: '80px', flex: 1, borderRadius: '10px'}}></div>
          <div className="h-5" style={{background: '#ffece6', height: '80px', flex: 1, borderRadius: '10px'}}></div>
          <div className="h-5" style={{background: '#ffece6', height: '80px', flex: 1, borderRadius: '10px'}}></div>
        </div>
        <div className="h-5 w-4/6 mb-4" style={{background: '#ffece6', borderRadius: '10px'}}></div>
        <div className="h-10 w-3/4" style={{background: '#ffece6', borderRadius: '10px', height: '200px'}}></div>
        </div>
      </div>
    );

  if (isErrorProject || isErrorCompliances || isErrorRuleSet || isErrorIssues)
    return (
      <ErrorBox message="Une erreur est survenue lors du chargement du projet." />
    );

  if (!project || !ruleSet) {
    notFound();
  }

  return <>{children}</>;
}
