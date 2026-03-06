import typographyStyle from "@/src/design-system/styles/typography.module.css";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function PageSampleInstructions({
  ruleSetName,
}: {
  ruleSetName: string;
}) {
  if (ruleSetName === "RGAA" || ruleSetName === "RGAA 25") {
    return (
      <>
        Au moins une page est requise. Vous pouvez vous inspirer de{" "}
        <a
          aria-label="l'échantillon de pages par défaut nécessaires à un audit RGAA, nouvelle fenêtre"
          className={typographyStyle.externalLink}
          href="https://accessibilite.numerique.gouv.fr/obligations/evaluation-conformite/"
        >
          l'échantillon de pages par défaut nécessaires à un audit RGAA
          <ArrowTopRightOnSquareIcon />
        </a>.
      </>
    );
  }

  if (ruleSetName === "RAAM") {
    return (
      <>
        Au moins un écran est requis. Vous pouvez vous inspirer de{" "}
        <a
          aria-label="l'échantillon d'écrans par défaut nécessaires à un audit RAAM, nouvelle fenêtre"
          className={typographyStyle.externalLink}
          href="https://accessibilite.public.lu/fr/raam1.1/methodologie.html#echantillon"
        >
          l'échantillon d'écrans par défaut nécessaires à un audit RAAM
          <ArrowTopRightOnSquareIcon />
        </a>.
      </>
    );
  }

  if (ruleSetName === "RAPDF") {
    return (
      <>
        Au moins une page ou un document sont requis. Il n'y a pas de
        recommandations spécifiques pour l'échantillon du RAPDF. Vous pouvez choisir
        d'auditer plusieurs documents d'un coup, ou d'échantillonner les pages
        dans un seul document complexe si vous préférez. Vous pourrez modifier
        les pages plus tard.
      </>
    );
  }

  return (
    <>
      Au moins une page est requise, vous pourrez aussi les modifier plus tard.
    </>
  );
}
