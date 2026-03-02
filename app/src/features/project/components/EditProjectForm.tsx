import Button from "@/src/design-system/components/button/Button";
import Form from "@/src/design-system/components/form/Form";
import FormRow from "@/src/design-system/components/form/FormRow";
import Input from "@/src/design-system/components/form/input/Input";
import Label from "@/src/design-system/components/form/Label";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { usePatchProject } from "../mutations/usePatchProject";
import { useTeamsStateStore } from "../../authentication/store/teamsStore";

export default function EditProjectForm() {
  const project = useAuditStore((state) => state.project);
  const teamUuid = useTeamsStateStore((state) => state.currentTeamUuid);

  const [isLoading, setIsLoading] = useState(false);
  const [projectNameValue, setProjectNameValue] = useState(project?.name || "");
  const [projectUrlValue, setProjectUrlValue] = useState(project?.url || "");
  
  const patchProject = usePatchProject(project?.uuid || "", teamUuid || "");

  if (!project || !teamUuid) {
    return null;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await patchProject.mutateAsync({
        projectUuid: project.uuid,
        name: projectNameValue,
        url: projectUrlValue,
      });
    } catch (error) {
      throw error; // @TODO handle error properly
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="h2 mb-5">Paramètres du projet</h2>
      <Form onSubmit={onSubmit}>
        <FormRow>
          <Label htmlFor="projectName" required={true}>
            Nom du projet
          </Label>
          <Input
            name="projectName"
            value={projectNameValue}
            onChange={setProjectNameValue}
            required={true}
            errors={[]}
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="projectUrl" required={false}>
            Url du site à auditer
          </Label>
          <Input
            name="projectUrl"
            value={projectUrlValue}
            onChange={setProjectUrlValue}
            required={false}
            errors={[]}
          />
        </FormRow>
        <Button type="submit" disabled={isLoading}>
          <PencilSquareIcon />
          Modifier le projet
        </Button>
      </Form>
    </>
  );
}
