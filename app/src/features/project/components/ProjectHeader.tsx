import { useAuditStore } from "../../audit/store/auditStore";

export default function ProjectDetailHeader() {
  const project = useAuditStore((state) => state.project);
  if (!project) {
    return null;
  }

  return (
    <h1 className={"h1 horizontalGutter"} style={{ display: "flex", alignItems: "center" }}>
      Audit — {project.name}
      <span style={{ fontSize: "0.6em", marginLeft: "20px", paddingTop: "10px", color: "#555" }}>
        IWSQA 1.3.3.7
      </span>
    </h1>
  );
}
