import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";
import clsx from "clsx";

export function getCommentsButtonId(ruleUuid: string, screenUuid: string) {
  return `comments-button-${ruleUuid}-${screenUuid}`;
}

export default function CommentsButton({
  ruleUuid,
  screenUuid,
  isActive,
  onClick,
  onFocus,
}: {
  ruleUuid: string;
  screenUuid: string;
  isActive: boolean;
  onClick: () => void;
  onFocus: () => void;
}) {
  const badgeNumber = 0; // Replace with actual logic to get number of comments

  return (
    <button
      aria-label="Commentaires"
      id={getCommentsButtonId(ruleUuid, screenUuid)}
      role="gridcell"
      className={clsx(
        styles.squareButton,
        styles.ruleButton,
        isActive && styles.activeTab
      )}
      onClick={onClick}
      onFocus={(e) => {
        e.stopPropagation();
        onFocus();
      }}
    >
      {badgeNumber > 0 && <span className={styles.badge}>{badgeNumber}</span>}
      <ChatBubbleLeftRightIcon className={styles.buttonIcon} />
    </button>
  );
}
