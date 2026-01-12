"use client";

import CallToActionButton from "@/src/components/form/CallToActionButon";
import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import formStyles from "@/src/components/form/styles/form.module.css";
import listStyles from "../../styles/issue_list.module.css";
import SeverityInput from "../SeverityInput";
import { useEffect, useRef, useState } from "react";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useCreateIssue } from "../../mutations/useCreateIssue";
import { Issue, useAuditStore } from "../../../audit/store/auditStore";
import clsx from "clsx";
import { useIssuesFormStateStore } from "../../store/issuesFormStateStore";
import { Severity } from "../../types/IssueInterface";
import { useUpdateIssue } from "../../mutations/useUpdateIssue";
import { useDeleteIssue } from "../../mutations/useDeleteIssue";
import typographyStyle from "@/src/components/typography/styles/typography.module.css";

function getErrorsForField(
  fieldName: string,
  errors: ApiValidationError[]
): ApiValidationError[] {
  return errors.filter((error) => error.propertyPath === fieldName);
}

function hasFieldError(
  fieldName: string,
  errors: ApiValidationError[]
): boolean {
  return getErrorsForField(fieldName, errors).length > 0;
}

export default function IssueForm({
  ruleUuid,
  screenUuid,
}: {
  ruleUuid: string;
  screenUuid: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errors, setErrors] = useState<ApiValidationError[]>([]);

  const createIssue = useCreateIssue();
  const updateIssue = useUpdateIssue();
  const deleteIssue = useDeleteIssue();

  const project = useAuditStore((state) => state.project);

  const addIssueInStore = useAuditStore((state) => state.addIssue);
  const overrideIssueInStore = useAuditStore((state) => state.overrideIssue);
  const removeIssueInStore = useAuditStore((state) => state.removeIssue);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const removeIssueFormState = useIssuesFormStateStore(
    (state) => state.removeIssueFormState
  );
  
  const issueFormState = useIssuesFormStateStore((state) =>
    state.issuesFormState.find(
      (ifs) => ifs.ruleUuid === ruleUuid && ifs.screenUuid === screenUuid
    )
  );

  const [severityValue, setSeverityValue] = useState<
    "low" | "moderate" | "blocking"
  >("moderate");
  const [textValue, setTextValue] = useState<string>("");

  useEffect(() => {
    if (issueFormState) {
      setTextValue(issueFormState.text);
      setSeverityValue(issueFormState.severity);
    } else {
      setTextValue("");
      setSeverityValue("moderate");
    }
  }, [issueFormState]);

  if (!issueFormState || !project) {
    return null;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (issueFormState.mode === "create" || issueFormState.mode === "duplicate") {
        const issue = await createIssue.mutateAsync({
          severity: formData.get("severity") as Severity,
          text: formData.get("text") as string,
          ruleUuid: ruleUuid,
          projectUuid: project.uuid,
          screenUuid: screenUuid,
          status: 'pending',
        });

        addIssueInStore(issue as Issue);

        setTimeout(() => {
          document.getElementById(`add-issue-button-${ruleUuid}-${screenUuid}`)?.focus();
        }, 100);
      }

      if (issueFormState.mode === "edit" && issueFormState) {
        if (issueFormState.issueUuid === null) {
          throw new Error("Issue UUID is null for edit mode");
        }

        const issue = await updateIssue.mutateAsync({
          issueUuid: issueFormState.issueUuid,
          severity: formData.get("severity") as Severity,
          text: formData.get("text") as string,
          status: issueFormState.status,
        });

        overrideIssueInStore(issue as Issue);

        setTimeout(() => {
          document.getElementById(`issue-action-menu-button-${issue.issueId}`)?.focus();
        }, 100);
      }

      if (issueFormState.mode === "delete" && issueFormState) {
        if (issueFormState.issueUuid === null) {
          throw new Error("Issue UUID is null for delete mode");
        }

        await deleteIssue.mutateAsync({
          issueUuid: issueFormState.issueUuid,
        });

        removeIssueInStore(issueFormState.issueUuid);

        setTimeout(() => {
          document.getElementById(`add-issue-button-${ruleUuid}-${screenUuid}`)?.focus();
        }, 100);
      }

      removeIssueFormState(ruleUuid, screenUuid);
      setTextValue("");
    } catch (apiError) {
      if (apiError instanceof ApiError) {
        setErrors(apiError.errors || []);

        if (apiError.errors) {
          const firstErrorField = apiError.errors[0].propertyPath;
          if (firstErrorField === "text") {
            textAreaRef?.current?.focus();
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cleanErrors = (fieldName: string) => {
    setErrors(errors.filter((error) => error.propertyPath !== fieldName));
  };

  const resetForm = () => {
    setTextValue("");
    setSeverityValue("moderate");
    removeIssueFormState(ruleUuid, screenUuid);

    if (issueFormState?.mode === "edit"|| issueFormState?.mode === "duplicate"  || issueFormState?.mode === "delete") {
      setTimeout(() => {
        document.getElementById(`issue-action-menu-button-${issueFormState.issueId}`)?.focus();
      }, 100);
    }

    if (issueFormState?.mode === "create" ) {
      setTimeout(() => {
        document.getElementById(`add-issue-button-${ruleUuid}-${screenUuid}`)?.focus();
      }, 100);
    }
  };

  if (!project) {
    return null;
  }

  if (issueFormState.mode === "delete") {
    return (
      <form
        noValidate={true}
        className={clsx(formStyles.formContainer, formStyles.form, listStyles.issueListForm)}
        onSubmit={onSubmit}
      >
        <h4 className="h5">
          Supprimer la recommandation {issueFormState?.issueId}
        </h4>
        <p id={`warning-text-${issueFormState?.issueId}`} className={formStyles.warningText}>
          <ExclamationTriangleIcon />
          Êtes-vous bien sûr·e de vouloir supprimer cette recommandation ? Cette
          opération est irréversible.
        </p>

        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-start" }}
        >
          <CallToActionButton 
            ariaLabel={`Supprimer la recommandation ${issueFormState?.issueId}`}
            ariaLabelledBy={`warning-text-${issueFormState?.issueId}`} id={`confirm-delete-issue-button-${issueFormState?.issueId}`} disabled={isLoading} type="submit">
            <TrashIcon />
            Supprimer
          </CallToActionButton>

          <CallToActionButton
            ariaLabel={`Annuler la suppression de la recommandation ${issueFormState?.issueId}`}
            type="button"
            onClick={resetForm}
          >
            <XMarkIcon />
            Annuler
          </CallToActionButton>
        </div>
      </form>
    );
  }

  return (
    <form
      noValidate={true}
      className={clsx(formStyles.formContainer, formStyles.form, listStyles.issueListForm)}
      onSubmit={onSubmit}
    >
      <h4 className="h5">
        {issueFormState.mode === "create" && "Ajouter une recommandation"}
        {issueFormState.mode === "edit" &&
          "Modifier la recommandation " + issueFormState?.issueId}
        {issueFormState.mode === "duplicate" &&
          "Dupliquer la recommandation " + issueFormState?.issueId}
      </h4>

      <SeverityInput value={severityValue} onChange={setSeverityValue} />

      <label htmlFor={`text-${ruleUuid}-${screenUuid}`}>Recommandation</label>
      <p id={`help-text-${ruleUuid}-${screenUuid}`} className={formStyles.helpText}>
        <LightBulbIcon /> Vous pouvez utiliser le {" "}
        <a
          href="https://docs.framasoft.org/fr/grav/markdown.html"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="format Markdown, nouvelle fenêtre"
          className={`${typographyStyle.externalLink} ${typographyStyle.italic}`}
        >
          format Markdown 
          <ArrowTopRightOnSquareIcon />
        </a>
        .
      </p>
      <textarea
        value={textValue}
        ref={textAreaRef}
        id={`text-${ruleUuid}-${screenUuid}`}
        name="text"
        aria-invalid={hasFieldError("text", errors)}
        aria-describedby={
          hasFieldError("text", errors) ? `text-error-${ruleUuid}-${screenUuid}` : `help-text-${ruleUuid}-${screenUuid}`
        }
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          cleanErrors("text");
          setTextValue(event.target.value);
        }}
        className={hasFieldError("text", errors) ? formStyles.inputError : ""}
        rows={8}
      />
      {hasFieldError("text", errors) && (
        <p id={`text-error-${ruleUuid}-${screenUuid}`} className={formStyles.fieldError}>
          {getErrorsForField("text", errors).map((error) => error.message)}
        </p>
      )}

      <div
        style={{ display: "flex", gap: "10px", justifyContent: "flex-start" }}
      >
        {issueFormState.mode === "create" && (
          <CallToActionButton disabled={isLoading}>
            <PlusIcon />
            Ajouter la recommandation
          </CallToActionButton>
        )}

        {issueFormState.mode === "edit" && (
          <CallToActionButton disabled={isLoading} ariaLabel="Modifier la recommandation">
            <PencilSquareIcon />
            Modifier
          </CallToActionButton>
        )}

        {issueFormState.mode === "duplicate" && (
          <CallToActionButton disabled={isLoading} ariaLabel="Dupliquer la recommandation">
            <DocumentDuplicateIcon />
            Dupliquer
          </CallToActionButton>
        )}

        <CallToActionButton
          disabled={isLoading}
          type="button"
          onClick={resetForm}
          ariaLabel={`Annuler la ${issueFormState.mode === "edit" ? "modification" : issueFormState.mode === "create" ? "création" : "duplication"} de la recommandation`}
        >
          <XMarkIcon />
          Annuler
        </CallToActionButton>
      </div>
    </form>
  );
}
