import {
  ActiveButton,
  useAuditStore,
} from "@/src/features/audit/store/auditStore";
import styles from "../../../styles/audit_grid.module.css";
import { clsx } from "clsx";
import { ComplianceStatus as ComplianceStatusType } from "../../../types/RuleSetTypes";
import { useCreateCompliance } from "@/src/features/compliance/mutations/useCreateCompliance";
import { useIssuesFormStateStore } from "@/src/features/issue/store/issuesFormStateStore";
import { useUpdateProjectMetrics } from "@/src/features/project/queries/useUpdateProjectMetrics";

export function getComplianceButtonStatusId(
  status: ComplianceStatusType,
  ruleUuid: string,
  screenUuid: string
) {
  return `compliance-status-${status}-${ruleUuid}-${screenUuid}`;
}

export default function ComplianceStatus({
  ruleUuid,
  projectUuid,
  screenUuid,
  onNonCompliantClick,
}: {
  ruleUuid: string;
  projectUuid: string;
  screenUuid: string;
  onNonCompliantClick: () => void;
}) {
  const compliances = useAuditStore((state) => state.compliances);
  const overrideCompliance = useAuditStore((state) => state.overrideCompliance);
  const setActiveElement = useAuditStore((state) => state.setActiveElement);

  const removeIssueFormState = useIssuesFormStateStore(
    (state) => state.removeIssueFormState
  );

  const compliance = compliances.find(
    (compliance) =>
      compliance.ruleUuid === ruleUuid &&
      compliance.projectUuid === projectUuid &&
      compliance.screenUuid === screenUuid
  );

  const createCompliance = useCreateCompliance();
  const updateProjectMetrics = useUpdateProjectMetrics();

  const compliantClasses = [styles.complianceStatus];
  const nonCompliantClasses = [styles.complianceStatus];
  const notApplicableClasses = [styles.complianceStatus];

  if (compliance) {
    switch (compliance.status) {
      case "compliant":
        compliantClasses.push(styles.compliant);
        break;
      case "non_compliant":
        nonCompliantClasses.push(styles.nonCompliant);
        break;
      case "not_applicable":
        notApplicableClasses.push(styles.notApplicable);
        break;
    }
  }

  const changeComplianceStatus = async (newStatus: ComplianceStatusType) => {
    if (!projectUuid) return;

    setActiveElement({ ruleUuid: ruleUuid, screenUuid: screenUuid });

    const updatedCompliance = {
      ruleUuid,
      projectUuid,
      screenUuid,
      status: newStatus,
    };

    // Store is updated before API call to provide instant feedback
    overrideCompliance(updatedCompliance);

    if (newStatus === "non_compliant") {
      onNonCompliantClick();
      removeIssueFormState(ruleUuid, screenUuid);
    }

    switch (newStatus) {
      case "compliant":
        setActiveElement({
          ruleUuid: ruleUuid,
          screenUuid: screenUuid,
          buttonFocused: ActiveButton.COMPLIANT,
        });
        break;
      case "non_compliant":
        setActiveElement({
          ruleUuid: ruleUuid,
          screenUuid: screenUuid,
          buttonFocused: ActiveButton.NON_COMPLIANT,
        });
        break;
      case "not_applicable":
        setActiveElement({
          ruleUuid: ruleUuid,
          screenUuid: screenUuid,
          buttonFocused: ActiveButton.NOT_APPLICABLE,
        });
        break;
    }

    try {
      await createCompliance.mutateAsync(updatedCompliance);
      await updateProjectMetrics.mutateAsync(projectUuid);
    } catch (error) {
      console.error("Error creating compliance:", error);
    }
  };

  const onFocusStatus = (status: ComplianceStatusType) => {
    switch (status) {
      case "compliant":
        setActiveElement({
          ruleUuid: ruleUuid,
          screenUuid: screenUuid,
          buttonFocused: ActiveButton.COMPLIANT,
        });
        break;
      case "non_compliant":
        setActiveElement({
          ruleUuid: ruleUuid,
          screenUuid: screenUuid,
          buttonFocused: ActiveButton.NON_COMPLIANT,
        });
        break;
      case "not_applicable":
        setActiveElement({
          ruleUuid: ruleUuid,
          screenUuid: screenUuid,
          buttonFocused: ActiveButton.NOT_APPLICABLE,
        });
        break;
    }
  };

  return (
    <div className={styles.complianceStatus}>
      <button
        aria-label="Conforme"
        id={getComplianceButtonStatusId("compliant", ruleUuid, screenUuid)}
        className={clsx([styles.squareButton, compliantClasses])}
        onClick={() => changeComplianceStatus("compliant")}
        onFocus={(e) => {
          e.stopPropagation();

          onFocusStatus("compliant");
        }}
      >
        C
      </button>
      <button
        aria-label="Non conforme"
        id={getComplianceButtonStatusId("non_compliant", ruleUuid, screenUuid)}
        className={clsx([styles.squareButton, nonCompliantClasses])}
        onClick={() => changeComplianceStatus("non_compliant")}
        onFocus={(e) => {
          e.stopPropagation();

          onFocusStatus("non_compliant");
        }}
      >
        NC
      </button>
      <button
        aria-label="Non applicable"
        id={getComplianceButtonStatusId("not_applicable", ruleUuid, screenUuid)}
        className={clsx([styles.squareButton, notApplicableClasses])}
        onClick={() => changeComplianceStatus("not_applicable")}
        onFocus={(e) => {
          e.stopPropagation();

          onFocusStatus("not_applicable");
        }}
      >
        NA
      </button>
    </div>
  );
}
