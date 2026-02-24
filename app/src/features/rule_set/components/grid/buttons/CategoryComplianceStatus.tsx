import clsx from "clsx";
import styles from "../../../styles/audit_grid.module.css";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import { useAuditSettingsStore } from "@/src/features/audit/store/auditSettingsStore";
import { useCreateCompliance } from "@/src/features/compliance/mutations/useCreateCompliance";
import { useUpdateProjectMetrics } from "@/src/features/project/queries/useUpdateProjectMetrics";

const enum NotApplicableStatus {
  ENABLED = "ENABLED",
  SET = "SET",
  DISABLED = "DISABLED",
}

export default function CategoryComplianceStatus({
  ruleCategoryUuid,
}: {
  ruleCategoryUuid: string;
}) {
  let status = NotApplicableStatus.ENABLED;

  const project = useAuditStore((state) => state.project);
  const getProjectSetting = useAuditSettingsStore((state) => state.getProjectSetting);
  const ruleSet = useAuditStore((state) => state.ruleSet);
  const compliances = useAuditStore((state) => state.compliances);
  const overrideCompliance = useAuditStore((state) => state.overrideCompliance);
  const createCompliance = useCreateCompliance();
  const updateProjectMetrics = useUpdateProjectMetrics();

  const toggleCollapse = useAuditSettingsStore(
    (state) => state.toggleRuleCategoryCollapse
  );

  const categoryCollapsed = useAuditSettingsStore(
    (state) => state.collapsedRuleCategories.some(
      (c) =>
        c.projectUuid === project?.uuid &&
        c.screenUuid === getProjectSetting(project?.uuid || "").currentScreenUuid &&
        c.categoryUuid === ruleCategoryUuid
    )
  );

  if (!ruleSet || !compliances || !project) {
    return null;
  }

  const projectSetting = getProjectSetting(project.uuid);
  let screenUuid = projectSetting.currentScreenUuid;
  if (screenUuid === null) {
    screenUuid = project.screens[0]?.uuid || null;

    if (!screenUuid) {
      throw new Error("No screen available for this project.");
    }
  }

  const ruleCategory = ruleSet.ruleCategories
    .find((category) => category.uuid === ruleCategoryUuid)

  if (!ruleCategory) {
    throw new Error("Rule category not found in rule set.");
  }

  const rulesInCategory = ruleCategory.rules;

  const compliancesInCategory = compliances.filter((compliance) =>
    rulesInCategory.some((rule) => rule.uuid === compliance.ruleUuid && compliance.screenUuid === screenUuid)
  );

  const allCompliancesFilled = compliancesInCategory.length === rulesInCategory.length;

  const allCompliancesNotApplicable = compliancesInCategory.every((compliance) =>
    compliance.status === "not_applicable"
  );

  const someCompliancesOtherThanNotApplicable = compliancesInCategory.some((compliance) =>
    compliance.status !== "not_applicable"
  );
  
  // All rules are set and not applicable
  if (allCompliancesNotApplicable && allCompliancesFilled) {
    status = NotApplicableStatus.SET;
  } 
  // Some rules are set to not applicable
  else if (someCompliancesOtherThanNotApplicable) {
    status = NotApplicableStatus.DISABLED;
  }

  const setAllCompliancesToNotApplicable = () => {
    if (status !== NotApplicableStatus.ENABLED) {
      return;  
    }

    if (!categoryCollapsed) {
      toggleCollapse(project.uuid, screenUuid, ruleCategory.uuid);
    }

    rulesInCategory.forEach(async (rule) => {
      const updatedCompliance = {
        ruleUuid: rule.uuid,
        projectUuid: project.uuid,
        screenUuid: screenUuid,
        status: "not_applicable" as const,
      };

      overrideCompliance(updatedCompliance);

      await createCompliance.mutateAsync(updatedCompliance)
    });

    updateProjectMetrics.mutateAsync(project.uuid);
  }

  let ariaLabel = `Mettre "Non Applicable" sur tous les critères de la catégorie ${ruleCategory.prefix} ${ruleCategory.name}.`;
  if (status !== NotApplicableStatus.ENABLED) {
    ariaLabel = ` Possible uniquement si aucun critère n'est déjà marqué comme "Conforme" ou "Non Conforme".`;
  }

  return (
    <div className={styles.complianceStatus}>
      <button
        aria-label={ariaLabel}
        disabled={status !== NotApplicableStatus.ENABLED}
        className={clsx(
          styles.squareButton,
          styles.complianceStatus,
          status === NotApplicableStatus.SET && styles.notApplicable,
          status === NotApplicableStatus.DISABLED && styles.disabled
        )}
        onClick={setAllCompliancesToNotApplicable}
      >
        NA
      </button>
    </div>
  );
}
