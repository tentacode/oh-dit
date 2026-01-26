import Button from "@/src/design-system/components/button/Button";
import { useAuditStore } from "../../audit/store/auditStore";

import typographyStyles from "@/src/design-system/styles/typography.module.css";
import buttonStyles from "@/src/design-system/styles/button/button.module.css";

import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDeleteSecuredLink } from "../mutations/useDeleteSecuredLink";

export default function ExistingSecuredLink({
  onDelete,
}: {
  onDelete: () => void;
}) {
  const [copyButtonPressed, setCopyButtonPressed] = useState<boolean>(false);
  const [deleteButtonLoading, setDeleteButtonLoading] =
    useState<boolean>(false);

  const project = useAuditStore((state) => state.project);

  const deleteSecuredLink = useDeleteSecuredLink(project?.uuid);

  if (!project) {
    return null;
  }

  const securedLinkHref = `${window.location.protocol}//${window.location.host}/rapport-securise/${project.securedLinkToken}`;

  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(securedLinkHref);
    setCopyButtonPressed(true);
    setTimeout(() => {
      setCopyButtonPressed(false);
    }, 5000);
  };

  const onDeleteButtonClick = async () => {
    setDeleteButtonLoading(true);

    await deleteSecuredLink.mutateAsync({
      projectUuid: project.uuid,
    });

    onDelete();

    setTimeout(() => {
      setDeleteButtonLoading(false);
    }, 2000);
  };

  return (
    <div className={typographyStyles.textContainer}>
      <h2 className="h2">Votre lien sécurisé</h2>
      <p>
        Pour accéder au lien sécurisé vers le rapport du project{" "}
        <strong>{project.name}</strong>, il vous suffit de partager ce
        lien&nbsp;:
      </p>
      <p>
        <a
          className={typographyStyles.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          href={securedLinkHref}
          aria-label={`${securedLinkHref}, nouvelle fenêtre`}
        >
          {securedLinkHref}
          <ArrowTopRightOnSquareIcon />
        </a>
      </p>
      <Button
        ariaPressed={copyButtonPressed}
        onClick={onCopyButtonClick}
        className={copyButtonPressed ? buttonStyles.success : undefined}
      >
        {copyButtonPressed ? <CheckIcon /> : <DocumentDuplicateIcon />}
        {copyButtonPressed
          ? "Lien copié dans votre presse papier !"
          : "Copier le lien sécurisé"}
      </Button>
      <p style={{ marginTop: "15px" }}>
        Ce lien est unique et protégé par le mot de passe que vous avez défini
        précédemment. Vous pouvez tester le lien dans une fenêtre de navigation
        privée pour vérifier son bon fonctionnement.
      </p>
      <hr />
      <p>
        Si vous ne vous souvenez plus du mot de passe ou que vous voulez
        supprimer ce lien définitivement, vous pouvez le supprimer puis en créer
        un nouveau.
      </p>
      <Button
        onClick={onDeleteButtonClick}
        ariaPressed={deleteButtonLoading}
        disabled={deleteButtonLoading}
      >
        <TrashIcon />
        Supprimer le lien sécurisé
      </Button>
    </div>
  );
}
