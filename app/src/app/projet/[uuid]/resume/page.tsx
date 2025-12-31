"use client";

import { AuditDataPerScreen } from "@/src/features/dashboard/components/AuditDataPerScreen";
import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import Link from "next/link";

export default function ProjectDashboardPage() {
  return (
    <>
      <div className="horizontalGutter mt-8">
        <AuditDataPerScreen />
      </div>
      <WorkInProgress>
        <div className="horizontalGutter mt-8">
          <hr className="mb-10 mt-10" />
          <p>
            Cette page est <strong>en cours de développement</strong>.
          </p>
          <p>
            Vous trouverez bientôt des statistiques complémentaires de l'audit, par exemple
            :
          </p>
          <ul>
            <li>Évolution de la conformité au fil du temps.</li>
            <li>Répartition des types de problèmes détectés.</li>
          </ul>
          <p>
            Pour savoir quelles sont les prochaines évolutions du projet, vous
            pouvez consulter la{" "}
            <Link prefetch={false} href="/feuille-de-route">
              feuille de route
            </Link>
            .
          </p>
        </div>
      </WorkInProgress>
    </>
  );
}
