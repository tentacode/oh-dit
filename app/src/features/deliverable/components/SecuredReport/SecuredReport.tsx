import reportStyles from "@/src/features/deliverable/styles/report.module.css";
import typographyStyles from "@/src/design-system/styles/typography.module.css";
import projectHeaderStyles from "@/src/features/project/styles/project_header.module.css";

import { removeSecuredLinkJwt } from "../../lib/securedLinkAuth";
// import OhditLogo from "@/src/features/layout/components/OhditLogo";
import { useFetchSecuredReport } from "../../queries/useFetchSecuredReport";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import RuleSetBadgeCard from "@/src/features/project/components/BadgeCards/RuleSetBadgeCard";
import ProgressBadgeCard from "@/src/features/project/components/BadgeCards/ProgressBadgeCard";
import ComplianceRateBadgeCard from "@/src/features/project/components/BadgeCards/ComplianceRateBadgeCard";
import { AuditDataPerScreen } from "@/src/features/dashboard/components/AuditDataPerScreen";
import ErrorPage from "@/src/design-system/components/error/ErrorPage";
import SecuredReportIssues from "./SecuredReportIssues";

export default function SecuredReport({
  linkToken,
  jwtToken,
}: {
  linkToken: string;
  jwtToken: string;
}) {
  const {
    data: report,
    isLoading,
    isError,
  } = useFetchSecuredReport(linkToken, jwtToken);

  const disconnectSecuredLink = () => {
    removeSecuredLinkJwt(linkToken);

    // Reload the page to remove access to the secured report
    window.location.reload();
  };

  if (isLoading) {
    return null;
  }

  if (isError || !report) {
    return (
      <ErrorPage>
        <p>
          Une erreur est survenue lors du chargement du rapport sécurisé.
        </p>
        <p>
          Si le problème persiste, n'hésitez pas à contacter le support à l'adresse{" "}
          <a href="mailto:support@ohdit.com">support@ohdit.com</a>.
        </p>
      </ErrorPage>
    );
  }

  const reportDateString = `${new Date(report.project.updatedAt).toLocaleDateString("fr-FR")} à ${new Date(report.project.updatedAt).getHours()}h${new Date(report.project.updatedAt).getMinutes().toString().padStart(2, "0")}`;

  // @TODO bien vérifier l'intégrité du rapport, supprimer le token en cas de problème
  return (
    <div className={reportStyles.reportContainer}>
      <main className={reportStyles.reportLandmark}>
        {/* <div className={reportStyles.reportLogo}>
        <OhditLogo />
      </div> */}
        <h1 className="h1" style={{ fontSize: "3em" }}>
          Rapport d'audit — {report.project.name}
        </h1>

        <section className={reportStyles.section}>
          <h2 className="h2">Table des matières</h2>
          <ol className={typographyStyles.orderdedList}>
            <li>
              <a href="#resume">Résumé</a>
            </li>
            <li>
              <a href="#echantillon">Échantillon</a>
            </li>
            <li>
              <a href="#liste-des-recommandations">Liste des recommandations</a>
            </li>
          </ol>
        </section>

        <section id="resume" className={reportStyles.section}>
          <h2 className="h2">Résumé</h2>
          <div className={projectHeaderStyles.statsContainer}>
            <RuleSetBadgeCard
              name={report.project.ruleSet.name}
              version={report.project.ruleSet.version}
            />
            {report.project.progress < 100 && (
              <ProgressBadgeCard progress={report.project.progress} />
            )}
            <ComplianceRateBadgeCard
              complianceRate={report.project.complianceRate}
            />
          </div>

          {report.project.ruleSet.name === "RGAA" && report.project.status === "in_progress" && (
            <p className={reportStyles.warning}>
              <ExclamationTriangleIcon />
              <span>
                <strong>Important :</strong> Le projet est actuellement en cours
                d'audit. Les scores de conformité sont provisoires et donnés à
                titre indicatif.
                <br />
                <strong>
                  Seul le rapport final peut être utilisé pour le taux de
                  conformité officiel.
                </strong>
              </span>
            </p>
          )}

          {report.project.ruleSet.name !== "RGAA" && (
            <p className={reportStyles.warning}>
              <ExclamationTriangleIcon />
              <span>
                <strong>Important :</strong> Le projet utilise le "{report.project.ruleSet.name}". Les scores de conformité sont donnés à
                titre indicatif.
              </span>
            </p>
          )}

          <p className={typographyStyles.italic}>
            Le rapport a été modifié pour la dernière fois le {reportDateString}.
          </p>
        </section>

        <section id="echantillon" className={reportStyles.section}>
          <h2 className="h2">Échantillon</h2>

          <AuditDataPerScreen
            project={report.project}
            ruleSetName={report.project.ruleSet.name}
            issues={report.issues}
            withAuditLink={false}
          />
        </section>

        <section
          id="liste-des-recommandations"
          className={reportStyles.section}
        >
          <h2 className="h2">Liste des recommandations</h2>

          <SecuredReportIssues report={report} />
        </section>
      </main>
      <footer className={reportStyles.reportLandmark}>
        <p style={{ fontStyle: "italic" }}>
          Ce rapport à été produit avec{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://ohdit.com"
            aria-label="Ohdit, nouvelle fenêtre"
          >
            Ohdit
          </a>
          . Vous êtes actuellement connecté via un lien sécurisé (
          <a
            href="#"
            role="button"
            aria-label="se déconnecter du lien sécurisé"
            onClick={disconnectSecuredLink}
          >
            se déconnecter
          </a>
          ).
        </p>
      </footer>
    </div>
  );
}
