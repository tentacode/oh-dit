"use client";

import CallToActionButton from "@/src/components/form/CallToActionButon";
import {
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import formStyles from "@/src/components/form/styles/form.module.css";
import listStyles from "../styles/issue_list.module.css";
import SeverityInput from "./SeverityInput";
import { useEffect, useRef, useState } from "react";
import { ApiError, ApiValidationError } from "@/src/lib/react-query/apiClient";
import { useCreateIssue } from "../mutations/useCreateIssue";
import { Issue, useAuditStore } from "../../audit/store/auditStore";
import clsx from "clsx";
import { useIssuesFormStateStore } from "../store/issuesFormStateStore";
import { Severity } from "../types/IssueInterface";
import { useUpdateIssue } from "../mutations/useUpdateIssue";
import { useDeleteIssue } from "../mutations/useDeleteIssue";

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

  const getIssueFormStateById = useIssuesFormStateStore(
    (state) => state.getIssueFormStateById
  );

  const removeIssueFormState = useIssuesFormStateStore(
    (state) => state.removeIssueFormState
  );

  const issueFormState = getIssueFormStateById(ruleUuid, screenUuid);

  const formMode = issueFormState?.mode || "create";

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

  if (!project) {
    return null;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (formMode === "create" || formMode === "duplicate") {
        const issue = await createIssue.mutateAsync({
          severity: formData.get("severity") as Severity,
          text: formData.get("text") as string,
          ruleUuid: ruleUuid,
          projectUuid: project.uuid,
          screenUuid: screenUuid,
        });

        addIssueInStore(issue as Issue);
      }

      if (formMode === "edit" && issueFormState) {
        const issue = await updateIssue.mutateAsync({
          issueUuid: issueFormState.issueUuid,
          severity: formData.get("severity") as Severity,
          text: formData.get("text") as string,
        });

        overrideIssueInStore(issue as Issue);
      }

      if (formMode === "delete" && issueFormState) {
        await deleteIssue.mutateAsync({
          issueUuid: issueFormState.issueUuid,
        });

        console.log("Deleting issue", issueFormState.issueUuid);

        removeIssueInStore(issueFormState.issueUuid);
      }

      removeIssueFormState(ruleUuid, screenUuid);
      setTextValue("");
      textAreaRef?.current?.focus();
    } catch (apiError) {
      console.error("API Error:", apiError);
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
    textAreaRef?.current?.focus();
  };

  if (formMode === "delete") {
    return (
      <form
        noValidate={true}
        className={clsx(formStyles.formContainer, formStyles.form, listStyles.issueListForm)}
        onSubmit={onSubmit}
      >
        <span className="h5">
          Supprimer la recommandation #{issueFormState?.issueId}
        </span>
        <p className={formStyles.warningText}>
          <ExclamationTriangleIcon />
          Êtes-vous bien sûr·e de vouloir supprimer cette recommandation ? Cette
          opération est irréversible.
        </p>

        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-start" }}
        >
          <CallToActionButton disabled={isLoading} type="submit">
            <TrashIcon />
            Supprimer
          </CallToActionButton>

          <CallToActionButton
            disabled={isLoading}
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
      <span className="h5">
        {formMode === "create" && "Ajouter une recommandation"}
        {formMode === "edit" &&
          "Modifier la recommandation #" + issueFormState?.issueId}
        {formMode === "duplicate" &&
          "Dupliquer la recommandation #" + issueFormState?.issueId}
      </span>

      <SeverityInput value={severityValue} onChange={setSeverityValue} />
      <label htmlFor="text">Recommandation</label>
      <p className={formStyles.helpText}>
        <LightBulbIcon /> Vous pouvez utiliser le format{" "}
        <a
          href="https://docs.framasoft.org/fr/grav/markdown.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Markdown
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
          hasFieldError("text", errors) ? "text-error" : undefined
        }
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          cleanErrors("text");
          setTextValue(event.target.value);
        }}
        className={hasFieldError("text", errors) ? formStyles.inputError : ""}
        rows={8}
      />
      {hasFieldError("text", errors) && (
        <p id="text-error" className={formStyles.fieldError}>
          {getErrorsForField("text", errors).map((error) => error.message)}
        </p>
      )}

      {formMode === "create" && (
        <CallToActionButton disabled={isLoading}>
          <PlusIcon />
          Ajouter la recommandation
        </CallToActionButton>
      )}

      <div
        style={{ display: "flex", gap: "10px", justifyContent: "flex-start" }}
      >
        {formMode === "edit" && (
          <CallToActionButton disabled={isLoading}>
            <PencilSquareIcon />
            Modifier
          </CallToActionButton>
        )}

        {formMode === "duplicate" && (
          <CallToActionButton disabled={isLoading}>
            <DocumentDuplicateIcon />
            Dupliquer
          </CallToActionButton>
        )}

        {formMode !== "create" && (
          <CallToActionButton
            disabled={isLoading}
            type="button"
            onClick={resetForm}
          >
            <XMarkIcon />
            Annuler
          </CallToActionButton>
        )}
      </div>
    </form>
  );
}
