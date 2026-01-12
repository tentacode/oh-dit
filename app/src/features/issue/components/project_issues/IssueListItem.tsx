import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { Issue, Rule, useAuditStore } from "../../../audit/store/auditStore";
import {
  CheckIcon,
  DocumentDuplicateIcon,
  // EllipsisHorizontalIcon,
  PencilSquareIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { useCallback, useEffect, useRef, useState } from "react";

import styles from "../../styles/issue_list.module.css";

import { useIssuesFormStateStore } from "../../store/issuesFormStateStore";
import { useUpdateIssue } from "../../mutations/useUpdateIssue";
import Markdown from "@/src/features/markdown/components/Mardown";

const translateSeverity = (severity: string) => {
  switch (severity) {
    case "low":
      return "Mineur";
    case "moderate":
      return "Moyen";
    case "blocking":
      return "Bloquant";
    default:
      return severity;
  }
};

export default function IssueListItem({ issue }: { issue: Issue }) {
  dayjs.extend(relativeTime);
  dayjs.locale("fr");

  const relativeDate = dayjs(issue.updatedAt).fromNow();
  const isUpdated = issue.updatedAt !== issue.createdAt;

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const ruleSet = useAuditStore((state) => state.ruleSet);

  const overrideIssueFormState = useIssuesFormStateStore(
    (state) => state.overrideIssueFormState
  );

  const closeMenu = useCallback(() => {
    setIsActionMenuOpen(false);
    buttonRef.current?.focus();
  }, []);

  const updateIssue = useUpdateIssue();
  const overrideIssueInStore = useAuditStore((state) => state.overrideIssue);

  const getRule = (ruleUuid: string): Rule | undefined => {
    const rule = ruleSet?.ruleCategories
      .flatMap((category) => category.rules)
      .find((r) => r.uuid === ruleUuid);
    return rule;
  };

  useEffect(() => {
    if (!isActionMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsActionMenuOpen(false);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        if (
          menuRef.current &&
          !menuRef.current.contains(document.activeElement) &&
          buttonRef.current !== document.activeElement
        ) {
          setIsActionMenuOpen(false);
        }
      }, 0);
    };

    menuRef.current?.addEventListener("keydown", handleKeyDown);
    menuRef.current?.addEventListener("mousedown", handleClickOutside);
    menuRef.current?.addEventListener("focusout", handleFocusOut);

    const menuElement = menuRef.current;
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      menuElement?.removeEventListener("focusout", handleFocusOut);
    };
  }, [isActionMenuOpen, closeMenu]);

  useEffect(() => {
    if (isActionMenuOpen && menuItemsRef.current[0]) {
      menuItemsRef.current[0].focus();
    }
  }, [isActionMenuOpen]);

  const handleMenuKeyDown = (e: React.KeyboardEvent, index: number) => {
    const items = menuItemsRef.current.filter(Boolean);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        e.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  };

  const menuId = `actions-menu-${issue.uuid}`;

  const menuButtonClick = (mode: "duplicate" | "edit" | "delete") => {
    closeMenu();
    overrideIssueFormState({
      issueUuid: issue.uuid,
      issueId: issue.issueId,
      ruleUuid: issue.ruleUuid,
      screenUuid: issue.screenUuid,
      text: issue.text,
      severity: issue.severity,
      status: issue.status,
      mode: mode,
    });
  };

  const onStatusToggle = async () => {
    const newStatus = issue.status === "pending" ? "fixed" : "pending";

    const updatedIssue = await updateIssue.mutateAsync({
      issueUuid: issue.uuid,
      severity: issue.severity,
      text: issue.text,
      status: newStatus,
    });

    overrideIssueInStore(updatedIssue as Issue);
  };

  return (
    <li className={styles.card} key={issue.uuid}>
      <div className={styles.cardHeader}>
        <span>
          #{issue.issueId} - Impact : {translateSeverity(issue.severity)}
        </span>
        <span>
          {isUpdated ? "Mis à jour" : "Créé"} {relativeDate}
        </span>
        <div className={styles.cardStatusContainer}>
          <span id={`status-label-${issue.uuid}`} aria-hidden="true">
            Recommandation corrigée
          </span>
          <button className={styles.cardStatus} onClick={onStatusToggle} aria-labelledby={`status-label-${issue.uuid}`}>
            {issue.status === "pending" ? null : <CheckIcon />}
          </button>
        </div>
        {/* <button
          ref={buttonRef}
          className={styles.actionsButton}
          type="button"
          aria-expanded={isActionMenuOpen}
          aria-haspopup="menu"
          aria-controls={isActionMenuOpen ? menuId : undefined}
          onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
          aria-label={`Actions sur la recommandation ${issue.issueId}`}
        >
          <EllipsisHorizontalIcon aria-hidden="true" />
        </button> */}
      </div>
      <span className={styles.cardRule}>
        <TagIcon />
        {getRule(issue.ruleUuid)?.prefix} —{" "}
        {getRule(issue.ruleUuid)?.shortDescription}
      </span>
      <Markdown minimalHeadingLevel={4}>{issue.text}</Markdown>
      {isActionMenuOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          className={styles.actionMenu}
          aria-label={`Menu des actions pour la recommandation ${issue.issueId}`}
        >
          <button
            ref={(el) => {
              menuItemsRef.current[0] = el;
            }}
            role="menuitem"
            onKeyDown={(e) => handleMenuKeyDown(e, 0)}
            onClick={() => {
              menuButtonClick("edit");
            }}
          >
            <PencilSquareIcon aria-hidden="true" />
            Modifier
          </button>
          <button
            ref={(el) => {
              menuItemsRef.current[1] = el;
            }}
            role="menuitem"
            onKeyDown={(e) => handleMenuKeyDown(e, 1)}
            onClick={() => {
              menuButtonClick("duplicate");
            }}
          >
            <DocumentDuplicateIcon aria-hidden="true" />
            Dupliquer
          </button>
          <button
            ref={(el) => {
              menuItemsRef.current[2] = el;
            }}
            role="menuitem"
            onKeyDown={(e) => handleMenuKeyDown(e, 2)}
            onClick={() => {
              menuButtonClick("delete");
            }}
          >
            <TrashIcon aria-hidden="true" />
            Supprimer
          </button>
        </div>
      )}
    </li>
  );
}
