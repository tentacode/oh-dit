"use client";

import IllustratedContainer from "@/src/design-system/components/layout/IllustratedContainer";
import SecuredLinkController from "@/src/features/deliverable/components/SecuredLinkController";
import SecuredLinkIllustration from "@/src/features/deliverable/components/SecuredLinkIllustration";

export default function ProjectDeliverablesSecuredLinkPage() {
  return (
    <IllustratedContainer illustration={<SecuredLinkIllustration />}>
      <title>Lien sécurisé vers le rapport - Ohdit</title>
      <div className={`horizontalGutter mt-8`}>
        <SecuredLinkController />
      </div>
    </IllustratedContainer>
  );
}
