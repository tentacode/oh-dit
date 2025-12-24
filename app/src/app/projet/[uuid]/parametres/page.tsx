"use client";

import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import Link from "next/link";

export default function ProjectSettingsPage() {
  return (
    <WorkInProgress>
      <div className="horizontalGutter mt-8">
        <h2 className="h2">Paramètres</h2>
        <p>
          Cette page est <strong>en cours de développement</strong>.
        </p>
        <p>
          Vous trouverez bientôt ici la possibilité de modifier votre audit, par exemple :
        </p>
        <ul>
          <li>Modifier le nom de l'audit et les informations associées.</li>
          <li>Ajouter, modifier ou supprimer des pages en cours d'audit.</li>
        </ul>
        <p>
          Si vous avez besoin de modifier des paramètres importants de votre audit avant la disponibilité de cette fonctionnalité, n'hésitez pas à nous contacter à <a href="mailto:support@ohdit.com">support@ohdit.com</a>.
        </p>
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
