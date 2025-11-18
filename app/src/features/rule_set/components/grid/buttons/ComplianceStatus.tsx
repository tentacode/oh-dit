import { useAuditStore } from "@/src/features/audit/store/auditStore";
import styles from "../../../styles/audit_grid.module.css";
import { clsx } from 'clsx';
import { ComplianceStatus as ComplianceStatusType } from "../../../types/RuleSetTypes";
import { useCreateCompliance } from "@/src/features/compliance/mutations/useCreateCompliance";

export default function ComplianceStatus({
  ruleUuid,
  projectUuid,
  screenUuid,
}: {
  ruleUuid: string;
  projectUuid: string;
  screenUuid: string;
}) {
  const getCompliance = useAuditStore((state) => state.getCompliance);
  const overrideCompliance = useAuditStore((state) => state.overrideCompliance);
  const setActiveElement = useAuditStore((state) => state.setActiveElement);

  const compliance = getCompliance(ruleUuid, projectUuid, screenUuid);

  const createCompliance = useCreateCompliance();

  const compliantClasses = [styles.complianceStatus];
  const nonCompliantClasses = [styles.complianceStatus];
  const notApplicableClasses = [styles.complianceStatus];

  if (compliance) {
    switch(compliance.status) {
      case 'compliant':
        compliantClasses.push(styles.compliant);
        break;
      case 'non_compliant':
        nonCompliantClasses.push(styles.nonCompliant);
        break;
      case 'not_applicable':
        notApplicableClasses.push(styles.notApplicable);
        break;
    }
  }

  const changeComplianceStatus = async (newStatus: ComplianceStatusType) => {
    if (!projectUuid) return;

    setActiveElement({ "ruleUuid": ruleUuid, "screenUuid": screenUuid });

    const updatedCompliance = {
      // uuid: compliance?.uuid ?? uuidv4(), // Générer un uuid si nouvelle compliance
      ruleUuid,
      projectUuid,
      screenUuid,
      status: newStatus,
    };
    
    // Store is updated before API call to provide instant feedback
    overrideCompliance(updatedCompliance);
    
    try {
      await createCompliance.mutateAsync(updatedCompliance);
    } catch (error) {
      // @TODO maybe a toast ?
      console.error("Error creating compliance:", error);
    }
  };

  return (
    <div className={styles.complianceStatus}>
        <button role="gridcell" className={clsx([styles.squareButton, compliantClasses])} onClick={() => changeComplianceStatus('compliant')}>C</button>
        <button role="gridcell" className={clsx([styles.squareButton, nonCompliantClasses])} onClick={() => changeComplianceStatus('non_compliant')}>NC</button>
        <button role="gridcell" className={clsx([styles.squareButton, notApplicableClasses])} onClick={() => changeComplianceStatus('not_applicable')}>NA</button>
    </div>
  );
}
