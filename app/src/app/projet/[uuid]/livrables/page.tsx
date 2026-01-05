"use client";

import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import Link from "next/link";

export default function ProjectDeliverablesPage() {
  return (
    <WorkInProgress>
      <title>Livrables - Ohdit</title>
      <div className="horizontalGutter mt-8">
        <h2 className="h2">Livrables</h2>
        <p>
          Cette page est <strong>en cours de développement</strong>.
        </p>
        <p>
          Vous trouverez bientôt ici les livrables de votre audit :
        </p>
        <ul>
          <li>Un lien sécurisé vers le rapport sous la forme d'une interface web interactive que vous pourrez envoyer à vos clients.</li>
          <li>La possibilité de télécharger le rapport au format PDF.</li>
          <li>La possibilité de télécharger l'audit au format Excel.</li>
        </ul>
        <p>
          Pour savoir quelles sont les prochaines évolutions du projet, vous pouvez consulter la{' '}
          <Link prefetch={false} href="/feuille-de-route">
            feuille de route
          </Link>
          .
        </p>
      </div>
    </WorkInProgress>
  );
}
