import { useAuditStore } from "../../audit/store/auditStore";

export default function ProjectDetailHeader() { 
    const project = useAuditStore((state) => state.project);
    if (!project) {
        return null;
    }

    return (
        <h1 className={"h1 horizontalGutter"}>Audit — {project.name}</h1>
    );
}