import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

import styles from "../../../styles/audit_grid.module.css";
import clsx from "clsx";

export default function CommentsButton({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) {
  const badgeNumber = 0; // Replace with actual logic to get number of comments

  return (
    <button role="gridcell" className={clsx(styles.squareButton, styles.ruleButton, isActive && styles.activeTab)} onClick={onClick}>
      {badgeNumber > 0 && (
        <span className={styles.badge}>{badgeNumber}</span>
      )}
      <ChatBubbleLeftRightIcon className={styles.buttonIcon} />
    </button>
  );
}