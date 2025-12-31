import { getProjectUrl } from "@/src/app/projet/routing";
import { useAuditStore } from "../../audit/store/auditStore";
import tableStyles from "../../../components/table/styles/table.module.css";
import typographyStyles from "../../../components/typography/styles/typography.module.css";
import {
  CheckBadgeIcon,
  CheckIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import CallToActionLink from "@/src/components/form/CallToActionLink";

export function AuditDataPerScreen() {
  const project = useAuditStore((state) => state.project);
  if (!project) {
    return null;
  }

  return (
    <>
      <h2 className="h3 mb-5">Statistiques de l'audit par page</h2>
      <table className={`${tableStyles.table} mb-5`}>
        <caption className="sr-only">Statistiques de l'audit par page</caption>
        <thead>
          <tr>
            <td>&nbsp;</td>
            <th scope="col">Progrès</th>
            <th scope="col">Taux de conformité</th>
            <th scope="col">
              Recommandations
              <span className={tableStyles.subText}>corrigées / totales</span>
            </th>
            <th scope="col">Auditer la page</th>
          </tr>
        </thead>
        <tbody>
          {project.screens.map((screen) => (
            <tr key={screen.uuid}>
              <th scope="row">{screen.name}</th>
              <td style={{ textAlign: "right", width: "200px" }}>
                {screen.progress === 0 && "-"}
                {0 < screen.progress && screen.progress < 100 && (
                  <>
                    <ClockIcon /> {screen.progress}%
                  </>
                )}
                {screen.progress === 100 && (
                  <>
                    <CheckIcon /> 100%
                  </>
                )}
                {screen.progress > 0 && (
                <div className={tableStyles.progressBar}>
                  <div
                    className={tableStyles.progress}
                    style={{ width: `${screen.progress}%` }}
                  ></div>
                </div>
                )}
              </td>
              <td style={{ textAlign: "right", width: "200px" }}>
                {screen.progress === 0 && "-"}
                {screen.progress > 0 && screen.complianceRate < 50 && (
                  <>
                    <HandThumbDownIcon /> {screen.complianceRate}%
                  </>
                )}
                {screen.progress > 0 &&
                  screen.complianceRate >= 50 &&
                  screen.complianceRate < 100 && (
                    <>
                      <HandThumbUpIcon /> {screen.complianceRate}%
                    </>
                  )}
                {screen.progress > 0 && screen.complianceRate === 100 && (
                  <>
                    <CheckBadgeIcon /> 100%
                  </>
                )}
                {screen.progress > 0 && (
                  <div className={tableStyles.progressBar}>
                    <div
                      className={tableStyles.progress}
                      style={{ width: `${screen.complianceRate}%` }}
                    ></div>
                  </div>
                )}
              </td>
              <td style={{ textAlign: "right" }}>
                <strong>3</strong> / 7
              </td>
              <td style={{ textAlign: "right" }}>
                <CallToActionLink
                  variant="small"
                  href={getProjectUrl.auditScreen(project.uuid, screen.uuid)}
                >
                  <ClipboardDocumentCheckIcon />
                  Auditer
                </CallToActionLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={typographyStyles.info}>
        <InformationCircleIcon width={18} />
        <span>
          Les taux de conformités par page sont donnés à titre indicatif. Seul
          le taux de conformité global de l'audit a une valeur pour l'audit
          RGAA.
        </span>
      </p>
    </>
  );
}
