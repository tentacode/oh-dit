"use client";

import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import Link from "next/link";

export default function ProjectIssuesPage() {
  return (
    <WorkInProgress>
      <title>Recommandations - Ohdit</title>
      <div className="horizontalGutter mt-8">
        <h2 className="h2">Recommandations</h2>
        <p>
          Cette page est <strong>en cours de développement</strong>.
        </p>
        <p>
          Vous trouverez bientôt le détail des recommandations saisies lors de
          l'audit :
        </p>
        <ul>
          <li>La possibilité de "marquer comme réalisée" une recommandation.</li>
          <li>
            Pouvoir filtrer et grouper les recommandations selon leur impact et
            les pages concernées.
          </li>
          <li>
            Discuter sur une recommandation pour poser une question aux
            auditeur·ices.
          </li>
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
  );
}
