import { getProjectUrl } from "@/src/app/projet/routing";
import { useAuditSettingsStore } from "@/src/features/audit/store/auditSettingsStore";
import { useAuditStore } from "@/src/features/audit/store/auditStore";
import WorkInProgress from "@/src/features/work_in_progress/components/WorkInProgress";
import Link from "next/link";
import IssueListEmptyIllustration from "./IssuesListEmptyIllustration";

export default function IssuesListEmpty() {
  const project = useAuditStore((state) => state.project);

  const getProjectSetting = useAuditSettingsStore(
    (state) => state.getProjectSetting
  );

  if (!project) {
    return null;
  }

  const currentScreenUuid = getProjectSetting(project.uuid).currentScreenUuid;
  if (!currentScreenUuid) {
    return null;
  }

  return (
    <WorkInProgress illustration={<IssueListEmptyIllustration />}>
      <div className="horizontalGutter mt-8">
        <h2 className="h2">Recommandations</h2>
        <p>
          C'est ici que vous trouverez le détail des recommandations saisies
          lors de {' '}
          <Link
            href={getProjectUrl.auditScreen(project.uuid, currentScreenUuid)}
          >
            l'audit du projet.
          </Link>
        </p>
        <p>
          Une recommandation permet de détailler le problème rencontré sur une
          non-conformité, son impact, et les actions à mettre en place pour y
          remédier.
        </p>
        <p>
          Une fois une recommandation corrigée par l'équipe technique, vous
          pourrez la marquer comme « corrigée » pour suivre l'avancement des corrections.
        </p>
      </div>
    </WorkInProgress>
  );
}
