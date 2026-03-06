import styles from "../../../components/form/styles/form.module.css";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FormEvent, useRef, useState } from "react";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useRouter } from "next/navigation";
import { CreateScreenPayload, useCreateProject } from "../mutations/useCreateProject";
import { useTeamsStateStore } from "../../authentication/store/teamsStore";
import ErrorBox from "../../error_handling/components/ErrorBox";
import { getProjectUrl } from "@/src/app/projet/routing";
import RuleSetField from "./NewProjectForm/RuleSetField";
import EditScreens from "./NewProjectForm/EditScreens";
import Form from "@/src/design-system/components/form/Form";
import FormRow from "@/src/design-system/components/form/FormRow";
import Label from "@/src/design-system/components/form/Label";
import Input from "@/src/design-system/components/form/input/Input";
import Button from "@/src/design-system/components/button/Button";
import { getDefaultScreensByRuleSet } from "../config/default_screens_by_ruleset";
import { getErrorsForField } from "@/src/design-system/utils/form/formErrors";

export default function NewProjectForm() {
  const [ruleSetUuidValue, setRuleSetUuidValue] = useState<string>("");
  const [ruleSetNameValue, setRuleSetNameValue] = useState<string>("RGAA");
  const [nameValue, setNameValue] = useState<string>("");
  const [urlValue, setUrlValue] = useState<string>("");
  const [screenValues, setScreenValues] = useState<CreateScreenPayload[]>(getDefaultScreensByRuleSet("RGAA"));
  const [errors, setErrors] = useState<ApiValidationError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const teamUuid = useTeamsStateStore((state) => state.currentTeamUuid!);
  const createProject = useCreateProject(teamUuid);

  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  if (!teamUuid) {
    return <ErrorBox message="Aucune équipe sélectionnée." />;
  }

  const onSubmitProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      const newProject = await createProject.mutateAsync({
        teamUuid,
        name: nameValue,
        url: urlValue,
        ruleSetUuid: ruleSetUuidValue,
        screens: screenValues,
      });

      router.push(getProjectUrl.dashboard(newProject.uuid));
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);

        document
          .getElementById(apiError.errors?.[0]?.propertyPath || "")
          ?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cleanErrors = (fieldName: string) => {
    setErrors(errors.filter((error) => error.propertyPath !== fieldName));
  };

  const onChangeRuleSet = ({ newRuleSetUuid, newRuleSetName }: { newRuleSetUuid: string; newRuleSetName: string }) => {
    setRuleSetUuidValue(newRuleSetUuid);
    if (newRuleSetName !== ruleSetNameValue) {
      setScreenValues(getDefaultScreensByRuleSet(newRuleSetName));
      setRuleSetNameValue(newRuleSetName);
    }
  };

  return (
    <div className={styles.formContainer} style={{ maxWidth: "1000px" }}>
      <Form ref={formRef} onSubmit={onSubmitProject}>
        <p aria-hidden={true} className={styles.requiredFields}>
          Les champs suivis d'une <span className={styles.requiredStar}>*</span>{" "}
          sont obligatoires.
        </p>

        <RuleSetField 
          onChange={onChangeRuleSet}
        />

        <hr />

        <FormRow>
          <Label htmlFor="name" required={true}>
            Nom du projet
          </Label>
          <Input
            value={nameValue}
            required={true}
            onChange={(value) => {
              setNameValue(value);
              cleanErrors("name");
            }}
            name="name"
            errors={getErrorsForField("name", errors)}
          />
        </FormRow>

        <FormRow>
          <Label htmlFor="url">Url du site à auditer</Label>
          <Input
            value={urlValue}
            required={false}
            onChange={(value) => {
              setUrlValue(value);
              cleanErrors("url");
            }}
            name="url"
            errors={getErrorsForField("url", errors)}
          />
        </FormRow>

        <EditScreens 
          context="new_project"
          values={screenValues}
          onChange={setScreenValues}
          ruleSetName={ruleSetNameValue}
        />

        <Button type="submit" disabled={isLoading}>
          <PlusIcon />
          Ajouter l'audit
        </Button>
      </Form>
    </div>
  );
}
