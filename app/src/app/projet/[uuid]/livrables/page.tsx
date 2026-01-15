"use client";

import DeliverableIllustration from "@/src/features/deliverable/components/DeliverableIllustration";
import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import styles from "@/src/features/deliverable/styles/deliverables.module.css";
import Link from "next/link";
import {
  CommandLineIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  LinkIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { getProjectUrl } from "../../routing";
import { useAuditStore } from "@/src/features/audit/store/auditStore";

export default function ProjectDeliverablesPage() {
  const project = useAuditStore((state) => state.project);
  if (!project) {
    return null;
  }

  return (
    <WorkInProgress illustration={<DeliverableIllustration />}>
      <title>Livrables - Ohdit</title>
      <div className={`horizontalGutter mt-8`}>
        <h2 className="h2">Livrables</h2>
        <ul className={styles.deliverablesList}>
          <li>
            <Link prefetch={false} href={getProjectUrl.deliverablesSecuredLink(project.uuid)}>
              <div className={styles.linkIcon}>
                <LinkIcon />
              </div>
              <div className={styles.linkContent}>
                <h3>Lien sécurisé vers le rapport</h3>
                <p>
                  Générez un lien unique et protégé par mot de passe pour votre
                  client. Il contient toutes les données de l'audit en lecture
                  seule.
                </p>
              </div>
            </Link>
          </li>
          <li>
            <button aria-disabled="true" className={styles.disabledLink}>
              <div className={styles.linkIcon}>
                <DocumentCheckIcon />
              </div>
              <div className={styles.linkContent}>
                <h3>Modèle de déclaration d'accessibilité</h3>
                <span className={styles.comingSoon}>Bientôt disponible.</span>
                <p>Générez une déclaration d'accessibilité préremplie et personnalisable, au format HTML ou Markdown.</p>
              </div>
            </button>
          </li>
          <li>
            <button aria-disabled="true" className={styles.disabledLink}>
              <div className={styles.linkIcon}>
                <TableCellsIcon />
              </div>
              <div className={styles.linkContent}>
                <h3>Export Excel</h3>
                <span className={styles.comingSoon}>Bientôt disponible.</span>
                <p>Exportez l'audit au format ODS, comme les grilles fournies par l'état et compatible avec Excel, OpenOffice et Google Sheets.</p>
              </div>
            </button>
          </li>
          <li>
            <button aria-disabled="true" className={styles.disabledLink}>
              <div className={styles.linkIcon}>
                <DocumentTextIcon />
              </div>
              <div className={styles.linkContent}>
                <h3>Export PDF</h3>
                <span className={styles.comingSoon}>Bientôt disponible.</span>
                <p>
                  Générez un rapport d'audit complet au format PDF, personnalisable et prêt à être partagé avec vos clients.
                </p>
              </div>
            </button>
          </li>
          <li>
            <button aria-disabled="true" className={styles.disabledLink}>
              <div className={styles.linkIcon}>
                <CommandLineIcon />
              </div>
              <div className={styles.linkContent}>
                <h3>API REST</h3>
                <span className={styles.comingSoon}>Bientôt disponible.</span>
                <p>Accédez aux données de l'audit via une API REST sécurisée pour une intégration facile avec vos propres outils.</p>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </WorkInProgress>
  );
}
