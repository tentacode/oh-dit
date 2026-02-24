import { useCallback } from "react";
import {
  ActiveElement,
  RuleSet,
  useAuditStore,
} from "../../audit/store/auditStore";
import { CollapsedRuleCategory, useAuditSettingsStore } from "../../audit/store/auditSettingsStore";
import { getRuleHelpButtonId } from "../components/grid/buttons/RuleHelpButton";
import { getCommentsButtonId } from "../components/grid/buttons/CommentsButton";
import { getIssuesButtonId } from "../components/grid/buttons/IssuesButton";
import { getComplianceButtonStatusId } from "../components/grid/buttons/ComplianceStatus";
import { useShallow } from "zustand/shallow";

type Direction = "up" | "down" | "left" | "right";

export function getDirectionFromKey(key: string): Direction {
  switch (key) {
    case "ArrowUp":
      return "up";
    case "ArrowDown":
      return "down";
    case "ArrowLeft":
      return "left";
    case "ArrowRight":
      return "right";
    default:
      throw new Error(`Invalid key for direction: ${key}`);
  }
}

export function useKeyboardGridNavigation({projectUuid, screenUuid}: {projectUuid: string, screenUuid: string}) {
  const activeElement = useAuditStore((state) => state.activeElement);
  const ruleSet = useAuditStore((state) => state.ruleSet);

  const collapsedRuleCategorieUuids = useAuditSettingsStore(
    useShallow((state) =>
      state.collapsedRuleCategories.filter(
        (c) => c.projectUuid === projectUuid && c.screenUuid === screenUuid
      )
    )
  );

  const navigateToRuleOrCategory = useCallback<
    (direction: Direction) => boolean
  >(
    (direction) => {
      if (!activeElement) {
        return false;
      }

      let elementIdToFocus;
      switch (direction) {
        case "up":
          elementIdToFocus = getAboveFocusedElementId(
            activeElement,
            ruleSet,
            collapsedRuleCategorieUuids
          );
          break;
        case "down":
          elementIdToFocus = getBelowFocusedElementId(
            activeElement,
            ruleSet,
            collapsedRuleCategorieUuids
          );
          break;
        case "left":
          elementIdToFocus = getLeftFocusedElementId(
            activeElement
          );
          break;
        case "right":
          elementIdToFocus = getRightFocusedElementId(
            activeElement
          );
          break;
      }

      if (elementIdToFocus) {
        const element = document.getElementById(elementIdToFocus);
        if (element) {
          element.focus();
          return true;
        }
      }

      return false;
    },
    [activeElement, ruleSet, collapsedRuleCategorieUuids]
  );

  return { navigateToRuleOrCategory };
}

function getAboveFocusedElementId(
  activeElement: ActiveElement,
  ruleSet: RuleSet | null,
  collapsedRuleCategorieUuids: CollapsedRuleCategory[]
): string | null {
  if (!ruleSet) {
    throw new Error("RuleSet cannot be null");
  }
  
  if (!activeElement.ruleUuid) {
    return null;
  }

  const aboveRuleUuid = getAboveRuleUuid(
    activeElement.ruleUuid,
    ruleSet,
    collapsedRuleCategorieUuids
  );

  if (aboveRuleUuid) {
    switch (activeElement.buttonFocused) {
      case "compliant":
        return getComplianceButtonStatusId(
          "compliant",
          aboveRuleUuid,
          activeElement.screenUuid
        );
      case "non_compliant":
        return getComplianceButtonStatusId(
          "non_compliant",
          aboveRuleUuid,
          activeElement.screenUuid
        );
      case "not_applicable":
        return getComplianceButtonStatusId(
          "not_applicable",
          aboveRuleUuid,
          activeElement.screenUuid
        );
      case "issues":
        return getIssuesButtonId(
          aboveRuleUuid,
          activeElement.screenUuid
        );
      case "comments":
        return getCommentsButtonId(
          aboveRuleUuid,
          activeElement.screenUuid
        );
      case "help":
        return getRuleHelpButtonId(
          aboveRuleUuid,
          activeElement.screenUuid
        );
    }
  }

  return null;
}

function getAboveRuleUuid(
  currentRuleUuid: string,
  ruleSet: RuleSet,
  collapsedRuleCategorieUuids: CollapsedRuleCategory[]
): string | null {
  const ruleCategories = ruleSet.ruleCategories.filter(
    (category) => !collapsedRuleCategorieUuids.some(
      (c) => c.categoryUuid === category.uuid
    )
  );
  let previousRuleUuid: string | null = null;

  for (const category of ruleCategories) {
    for (const rule of category.rules) {
      if (rule.uuid === currentRuleUuid) {
        return previousRuleUuid;
      }

      previousRuleUuid = rule.uuid;
    }
  }

  return null;
}

function getBelowFocusedElementId(
  activeElement: ActiveElement,
  ruleSet: RuleSet | null,
  collapsedRuleCategorieUuids: CollapsedRuleCategory[]
): string | null {
  if (!ruleSet) {
    throw new Error("RuleSet cannot be null");
  }

  if (!activeElement.ruleUuid) {
    return null;
  }

  const belowRuleUuid = getBelowRuleUuid(
    activeElement.ruleUuid,
    ruleSet,
    collapsedRuleCategorieUuids
  );

  if (belowRuleUuid) {
    switch (activeElement.buttonFocused) {
      case "compliant":
        return getComplianceButtonStatusId(
          "compliant",
          belowRuleUuid,
          activeElement.screenUuid
        );
      case "non_compliant":
        return getComplianceButtonStatusId(
          "non_compliant",
          belowRuleUuid,
          activeElement.screenUuid
        );
      case "not_applicable":
        return getComplianceButtonStatusId(
          "not_applicable",
          belowRuleUuid,
          activeElement.screenUuid
        );
      case "issues":
        return getIssuesButtonId(
          belowRuleUuid,
          activeElement.screenUuid
        );
      case "comments":
        return getCommentsButtonId(
          belowRuleUuid,
          activeElement.screenUuid
        );
      case "help":
        return getRuleHelpButtonId(
          belowRuleUuid,
          activeElement.screenUuid
        );
    }
  }

  return null;
}

function getBelowRuleUuid(
  currentRuleUuid: string,
  ruleSet: RuleSet,
  collapsedRuleCategorieUuids: CollapsedRuleCategory[]
): string | null {
  const ruleCategories = ruleSet.ruleCategories.filter(
    (category) => !collapsedRuleCategorieUuids.some(
      (c) => c.categoryUuid === category.uuid
    )
  );

  let previousRuleUuid: string | null = null;

  const reverseCategories = [...ruleCategories].reverse();

  for (const category of reverseCategories) {
    const reverseRules = [...category.rules].reverse();
    for (const rule of reverseRules) {
      if (rule.uuid === currentRuleUuid) {
        return previousRuleUuid;
      }
      
      previousRuleUuid = rule.uuid;
    }
  }

  return null;
}

function getLeftFocusedElementId(
  activeElement: ActiveElement,
): string | null {
  if (!activeElement.ruleUuid) {
    return null;
  }

  switch (activeElement.buttonFocused) {
    case "compliant":
      return null;
    case "non_compliant":
      return getComplianceButtonStatusId(
        "compliant",
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "not_applicable":
      return getComplianceButtonStatusId(
        "non_compliant",
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "issues":
      return getComplianceButtonStatusId(
        "not_applicable",
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "comments":
      return getIssuesButtonId(
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "help":
      return getCommentsButtonId(
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
  }

  return null;
}

function getRightFocusedElementId(
  activeElement: ActiveElement
): string | null {
  if (!activeElement.ruleUuid) {
    return null;
  }

  switch (activeElement.buttonFocused) {
    case "compliant":
      return getComplianceButtonStatusId(
        "non_compliant",
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "non_compliant":
      return getComplianceButtonStatusId(
        "not_applicable",
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "not_applicable":
      return getIssuesButtonId(
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "issues":
      return getCommentsButtonId(
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "comments":
      return getRuleHelpButtonId(
        activeElement.ruleUuid,
        activeElement.screenUuid
      );
    case "help":
      return null;
  }

  return null;
}
