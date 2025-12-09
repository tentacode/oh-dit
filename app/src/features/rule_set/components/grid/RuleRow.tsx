import ComplianceStatus from "./buttons/ComplianceStatus";

import styles from "../../styles/audit_grid.module.css";
import IssuesButton from "./buttons/IssuesButton";
import CommentsButton from "./buttons/CommentsButton";
import {
  Rule as RuleStoreType,
  useAuditStore,
} from "@/src/features/audit/store/auditStore";
import { clsx } from "clsx";
import RuleHelpButton from "./buttons/RuleHelpButton";
import { useState } from "react";
import RuleHelp from "../rule/RuleHelp";
import IssuesDetail from "@/src/features/issue/components/IssuesDetail";
import CommentsDetail from "@/src/features/comments/components/CommentsDetail";

enum ActiveTab {
  HELP = "help",
  ISSUES = "issues",
  COMMENTS = "comments",
}

export default function RuleRow({
  rule,
  screenUuid,
}: {
  rule: RuleStoreType;
  screenUuid: string;
}) {
  const project = useAuditStore((state) => state.project);

  const activeElement = useAuditStore((state) => state.activeElement);
  const isActiveElement = activeElement?.ruleUuid === rule.uuid;
  const setActiveElement = useAuditStore((state) => state.setActiveElement);

  const [activeTab, setActiveTab] = useState<ActiveTab | null>(null);

  if (!project || !screenUuid) {
    return null;
  }

  const toggleTab = (tab: ActiveTab) => () => {
    if (activeTab === tab) {
      setActiveTab(null);
      return;
    }

    setActiveTab(tab);
  };

  const onFocusRow = () => {
    setActiveElement({ ruleUuid: rule.uuid, screenUuid: screenUuid });
  };

  const onNonCompliantClick = () => {
    setActiveTab(ActiveTab.ISSUES);

    setTimeout(() => {
      const element = document.getElementById("text");
      if (element) {
        element.focus();
      }
    }, 100);
  };

  const closeOnEscape = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setActiveTab(null);
    }
  };

  return (
    <div
      role="row"
      className={clsx(styles.ruleRow, isActiveElement && styles.activeRow)}
      onFocus={onFocusRow}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) =>
        closeOnEscape(event)
      }
      tabIndex={-1}
    >
      <div className={styles.ruleRowHeader}>
        <h3 role="gridcell" tabIndex={-1}>
          {rule.prefix} {rule.shortDescription}
        </h3>
        <ComplianceStatus
          onNonCompliantClick={onNonCompliantClick}
          projectUuid={project.uuid}
          ruleUuid={rule.uuid}
          screenUuid={screenUuid}
        />
        <IssuesButton
          isActive={activeTab === ActiveTab.ISSUES}
          ruleUuid={rule.uuid}
          screenUuid={screenUuid}
          onClick={toggleTab(ActiveTab.ISSUES)}
        />
        <CommentsButton
          isActive={activeTab === ActiveTab.COMMENTS}
          onClick={toggleTab(ActiveTab.COMMENTS)}
        />
        <RuleHelpButton
          isActive={activeTab === ActiveTab.HELP}
          onClick={toggleTab(ActiveTab.HELP)}
        />
      </div>
      {activeTab === ActiveTab.HELP && <RuleHelp />}
      {activeTab === ActiveTab.ISSUES && (
        <IssuesDetail ruleUuid={rule.uuid} screenUuid={screenUuid} />
      )}
      {activeTab === ActiveTab.COMMENTS && <CommentsDetail />}
    </div>
  );
}
