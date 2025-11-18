import ComplianceStatus from "./buttons/ComplianceStatus";

import styles from "../../styles/audit_grid.module.css";
import RecommandationsButton from "./buttons/RecommandationsButton";
import CommentsButton from "./buttons/CommentsButton";
import { useRouter } from "next/navigation";
import { getProjectUrl } from "@/src/app/projet/routing";
import { Rule as RuleStoreType, useAuditStore } from "@/src/features/audit/store/auditStore";
import { clsx } from 'clsx';
import RuleHelpButton from "./buttons/RuleHelpButton";

export default function Rule({
  rule,
}: {
  rule: RuleStoreType;
}) {

  const router = useRouter();

  const project = useAuditStore((state) => state.project);

  const currentScreenUuid = useAuditStore((state) => state.currentScreenUuid);

  const activeElement = useAuditStore((state) => state.activeElement);
  const isActiveElement = activeElement?.ruleUuid === rule.uuid;
  const setActiveElement = useAuditStore((state) => state.setActiveElement);

  if (!project || !currentScreenUuid) {
    return null;
  }

  const navigateToComments = () => {
    router.push(
      getProjectUrl.auditWithComments(
        project.uuid,
        rule.uuid,
        currentScreenUuid
      ), {
        scroll: false,
      }
    );
  }

  const navigateToRecommendations = () => {
    router.push(
      getProjectUrl.auditWithRecommendation(
        project.uuid,
        rule.uuid,
        currentScreenUuid
      ), {
        scroll: false,
      }
    );
  }

  const onFocusRow = () => {
    setActiveElement({ "ruleUuid": rule.uuid, "screenUuid": currentScreenUuid });
  };

  return (
    <div role="row" className={clsx(styles.ruleRow, isActiveElement && styles.activeRow)} onFocus={onFocusRow}>
      <h3 role="gridcell" tabIndex={-1}>{rule.prefix} {rule.shortDescription}</h3>
      <RuleHelpButton onClick={() => {}} />
      <ComplianceStatus projectUuid={project.uuid} ruleUuid={rule.uuid} screenUuid={currentScreenUuid} />
      <RecommandationsButton onClick={navigateToRecommendations} />
      <CommentsButton onClick={navigateToComments} />
    </div>
  );
}
