import moreActionsStyles from "@/src/design-system/styles/button/more_actions.module.css";

import {
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useIssuesFormStateStore } from "../../../store/issuesFormStateStore";
import { createPortal } from "react-dom";
import { IssueCardIssue } from "../IssueCard";

export default function IssueCardMoreActions({
  issue,
  formContext,
}: {
  issue: IssueCardIssue;
  formContext: "project_issues" | "rule_issues";
}) {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = `actions-menu-${issue.uuid}`;

  const overrideIssueFormState = useIssuesFormStateStore(
    (state) => state.overrideIssueFormState,
  );

  const closeMenu = useCallback(() => {
    setIsActionMenuOpen(false);
    buttonRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    if (!isActionMenuOpen || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right - window.scrollX,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [isActionMenuOpen]);

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
      menuItemsRef.current[0].focus({ preventScroll: true });
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

  const menuButtonClick = (mode: "duplicate" | "edit" | "delete") => {
    closeMenu();

    overrideIssueFormState({
      issueUuid: issue.uuid,
      issueId: issue.issueId,
      ruleUuid: issue.ruleUuid,
      screenUuid: issue.screenUuid,
      text: issue.text,
      status: issue.status,
      severity: issue.severity,
      mode: mode,
      context: formContext,
    });

    if (mode === "duplicate" || mode === "edit") {
      setTimeout(() => {
        document
          .getElementById(`text-${issue.ruleUuid}-${issue.screenUuid}`)
          ?.focus();
      }, 100);
    }

    if (mode === "delete") {
      setTimeout(() => {
        document
          .getElementById(`confirm-delete-issue-button-${issue.issueId}`)
          ?.focus();
      }, 100);
    }
  };

  return (
    <>
      <button
        id={`issue-action-menu-button-${issue.issueId}`}
        ref={buttonRef}
        className={moreActionsStyles.actionsButton}
        type="button"
        aria-expanded={isActionMenuOpen}
        aria-haspopup="menu"
        aria-controls={isActionMenuOpen ? menuId : undefined}
        onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
        aria-label={`Actions sur la recommandation ${issue.issueId}`}
      >
        <EllipsisHorizontalIcon aria-hidden="true" />
      </button>

      {isActionMenuOpen &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className={moreActionsStyles.actionMenu}
            aria-label={`Actions pour la recommandation ${issue.issueId}`}
            style={{ top: menuPosition.top, right: menuPosition.right }}
          >
            <button
              type="button"
              aria-label="Modifier la recommandation"
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

            {formContext === "rule_issues" && (
              <button
                type="button"
                aria-label="Dupliquer la recommandation"
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
            )}

            <button
              type="button"
              aria-label="Supprimer la recommandation"
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
          </div>,
          document.body,
        )}
    </>
  );
}
