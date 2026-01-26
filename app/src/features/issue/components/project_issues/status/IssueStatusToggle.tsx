import { useState, useEffect } from "react";
import { Issue, useAuditStore } from "@/src/features/audit/store/auditStore";
import { useUpdateIssue } from "../../../mutations/useUpdateIssue";
import Switch from "@/src/design-system/components/button/Switch";
import { IssueCardIssue } from "../IssueCard";

export default function IssueStatusToggle({ issue }: { issue: IssueCardIssue }) {
  const updateIssue = useUpdateIssue();
  const overrideIssueInStore = useAuditStore((state) => state.overrideIssue);

  // Local state to optimistically update the UI
  const [isFixed, setIsFixed] = useState(issue.status === "fixed");

  useEffect(() => {
    setIsFixed(issue.status === "fixed");
  }, [issue.status]);

  const onStatusToggle = async () => {
    const newIsFixed = !isFixed;
    setIsFixed(newIsFixed);

    try {
      const updatedIssue = await updateIssue.mutateAsync({
        issueUuid: issue.uuid,
        severity: issue.severity,
        text: issue.text,
        status: newIsFixed ? "fixed" : "pending",
      });
      overrideIssueInStore(updatedIssue as Issue);
    } catch {
      setIsFixed(!newIsFixed);
    }
  };

  return (
    <Switch checked={isFixed} label="corrigée" onToggle={onStatusToggle} />
  );
}