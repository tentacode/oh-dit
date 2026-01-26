import { useState } from "react";
import { useAuditStore } from "../../audit/store/auditStore";
import ExistingSecuredLink from "./ExistingSecuredLink";
import SecuredLinkForm from "./SecuredLinkForm";

export default function SecuredLinkController()
{
    const [successfullyDeleted, setSuccessfullyDeleted] = useState(false);

    const project = useAuditStore((state) => state.project);
    if (!project) {
        return null;
    }

    if (project.securedLinkToken) {
        return (
            <ExistingSecuredLink onDelete={() => setSuccessfullyDeleted(true)} />
        )
    }

    return (
        <SecuredLinkForm successfullyDeleted={successfullyDeleted} setSuccessfullyDeleted={setSuccessfullyDeleted} />
    )
}