"use client";

import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import Link from "next/link";

export default function ProjectDashboardPage() {
  return (
    <WorkInProgress>
      <div className="horizontalGutter mt-8">
        <h2 className="h2">Résumé de l'audit</h2>
        <p>
          Cette page est <strong>en cours de développement</strong>.
        </p>
        <p>
          Vous trouverez bientôt ici des statistiques sur l'audit, par exemple :
        </p>
        <ul>
          <li>Progrès de l'audit et taux de conformité page par page.</li>
          <li>Évolution de la conformité au fil du temps.</li>
          <li>Répartition des types de problèmes détectés.</li>
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
