import ComplianceStatus, {
  getComplianceButtonStatusId,
} from "./buttons/ComplianceStatus";

import styles from "../../styles/audit_grid.module.css";
import IssuesButton, { getIssuesButtonId } from "./buttons/IssuesButton";
import CommentsButton, { getCommentsButtonId } from "./buttons/CommentsButton";
import {
  ActiveButton,
  Rule as RuleStoreType,
  useAuditStore,
} from "@/src/features/audit/store/auditStore";
import { clsx } from "clsx";
import RuleHelpButton, { getRuleHelpButtonId } from "./buttons/RuleHelpButton";
import { useState } from "react";
import RuleHelp from "../rule/RuleHelp";
import IssuesDetail from "@/src/features/issue/components/IssuesDetail";
import CommentsDetail from "@/src/features/comments/components/CommentsDetail";
import {
  getDirectionFromKey,
  useKeyboardGridNavigation,
} from "../../hooks/useKeyboardGridNavigation";

enum ActiveTab {
  HELP = "help",
  ISSUES = "issues",
  ISSUES_NC = "issues_nc",
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

  const { navigateToRuleOrCategory } = useKeyboardGridNavigation();

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

  const onFocusTab = (tab: ActiveTab) => () => {
    switch (tab) {
      case ActiveTab.HELP:
        setActiveElement({ ruleUuid: rule.uuid, screenUuid: screenUuid, buttonFocused: ActiveButton.HELP });
        break;
      case ActiveTab.ISSUES:
        setActiveElement({ ruleUuid: rule.uuid, screenUuid: screenUuid, buttonFocused: ActiveButton.ISSUES });
        break;
      case ActiveTab.COMMENTS:
        setActiveElement({ ruleUuid: rule.uuid, screenUuid: screenUuid, buttonFocused: ActiveButton.COMMENTS });
        break;
    }
  }

  const onNonCompliantClick = () => {
    setActiveTab(ActiveTab.ISSUES_NC);

    setTimeout(() => {
      const element = document.getElementById(
        `text-${rule.uuid}-${screenUuid}`
      );
      if (element) {
        element.focus();
      }
    }, 100);
  };

  const closeOnEscape = () => {
    const lastActiveTab = activeTab;

    setActiveTab(null);

    /**
     * Setting the focus back to the button corresponding to the closed tab
     * only if the focus is not already within the rule header.
     */

    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.closest(`.${styles.ruleRowHeader}`)) {
      return;
    }

    switch (lastActiveTab) {
      case ActiveTab.HELP:
        document
          .getElementById(getRuleHelpButtonId(rule.uuid, screenUuid))
          ?.focus();
        break;
      case ActiveTab.ISSUES:
        document
          .getElementById(getIssuesButtonId(rule.uuid, screenUuid))
          ?.focus();
        break;
      case ActiveTab.ISSUES_NC:
        document
          .getElementById(
            getComplianceButtonStatusId("non_compliant", rule.uuid, screenUuid)
          )
          ?.focus();
        break;
      case ActiveTab.COMMENTS:
        document
          .getElementById(getCommentsButtonId(rule.uuid, screenUuid))
          ?.focus();
        break;
    }
  };

  return (
    <div
      role="row"
      className={clsx(styles.ruleRow, isActiveElement && styles.activeRow)}
      onFocus={onFocusRow}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Escape") {
          closeOnEscape();
        }

        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight"
        ) {
          const direction = getDirectionFromKey(event.key);

          const success = navigateToRuleOrCategory(direction);
          if (!success) {
            event.preventDefault();
          }
        }
      }}
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
          isActive={
            activeTab === ActiveTab.ISSUES || activeTab === ActiveTab.ISSUES_NC
          }
          ruleUuid={rule.uuid}
          screenUuid={screenUuid}
          onClick={toggleTab(ActiveTab.ISSUES)}
          onFocus={onFocusTab(ActiveTab.ISSUES)}
        />
        <CommentsButton
          ruleUuid={rule.uuid}
          screenUuid={screenUuid}
          isActive={activeTab === ActiveTab.COMMENTS}
          onClick={toggleTab(ActiveTab.COMMENTS)}
          onFocus={onFocusTab(ActiveTab.COMMENTS)}
        />
        <RuleHelpButton
          ruleUuid={rule.uuid}
          screenUuid={screenUuid}
          isActive={activeTab === ActiveTab.HELP}
          onClick={toggleTab(ActiveTab.HELP)}
          onFocus={onFocusTab(ActiveTab.HELP)}
        />
      </div>
      {activeTab === ActiveTab.HELP && <RuleHelp ruleUuid={rule.uuid} />}
      {(activeTab === ActiveTab.ISSUES ||
        activeTab === ActiveTab.ISSUES_NC) && (
        <IssuesDetail ruleUuid={rule.uuid} screenUuid={screenUuid} />
      )}
      {activeTab === ActiveTab.COMMENTS && <CommentsDetail />}
    </div>
  );
}
