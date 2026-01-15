"use client";

import SecuredLinkIllustration from "@/src/features/deliverable/components/SecuredLinkIllustration";
import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";

export default function ProjectDeliverablesSecuredLinkPage() {
  return (
    <WorkInProgress illustration={<SecuredLinkIllustration />}>
      <title>Lien sécurisé vers le rapport - Ohdit</title>
      <div className={`horizontalGutter mt-8`}>
        <h2 className="h2">Lien sécurisé vers le rapport</h2>
      </div>
    </WorkInProgress>
  );
}
