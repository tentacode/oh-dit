import { useFetchRuleSets } from "@/src/features/rule_set/queries/useFetchRuleSets";
import formStyles from "@/src/design-system/styles/form/form.module.css";
import labelStyles from "@/src/design-system/styles/form/label.module.css";
import ruleSetFieldStyles from "@/src/features/project/styles/ruleset_field.module.css";
import { RuleSet } from "@/src/features/rule_set/types/RuleSetTypes";
import RadioCard from "@/src/design-system/components/form/input/RadioCard";
import {
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DocumentIcon,
  GlobeEuropeAfricaIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useEffect } from "react";

interface RuleSetRadioDetails {
  uuid: string;
  name: string;
  displayName: string;
  version: string;
  description: string;
  icon: React.ReactNode;
  disabled: boolean;
}

const toRuleSetRadioDetails = (
  ruleSet: RuleSet,
  icon: React.ReactNode,
  description: string,
  name?: string,
): RuleSetRadioDetails => ({
  uuid: ruleSet.uuid,
  name: ruleSet.name,
  displayName: name || ruleSet.name,
  version: ruleSet.version,
  description: description,
  icon: icon,
  disabled: false,
});

const getRuleSetByName = (
  ruleSets: RuleSet[],
  name: string,
): RuleSet | undefined => {
  return ruleSets.find((ruleSet) => ruleSet.name === name);
};

export default function RuleSetField({
  ruleSetUuid = null,
  onChange,
}: {
  ruleSetUuid?: string | null;
  onChange: ({
    newRuleSetUuid,
    newRuleSetName,
  }: {
    newRuleSetUuid: string;
    newRuleSetName: string;
  }) => void;
}) {
  const {
    data: ruleSets,
    isLoading: isRuleSetsLoading,
    error: ruleSetsError,
  } = useFetchRuleSets();

  useEffect(() => {
    if (!ruleSets || ruleSets.length === 0 || ruleSetUuid) {
      return;
    }

    const defaultRuleSet = getRuleSetByName(ruleSets, "RGAA");
    
    if (defaultRuleSet) {
      onChange({
        newRuleSetUuid: defaultRuleSet.uuid,
        newRuleSetName: defaultRuleSet.name,
      });
    }
  }, [ruleSets, ruleSetUuid, onChange]);

  if (isRuleSetsLoading) {
    return <p>Chargement des référentiels...</p>;
  }

  if (ruleSetsError) {
    return (
      <p>
        Une erreur est survenue lors du chargement des référentiels. Veuillez
        réessayer plus tard.
      </p>
    );
  }

  if (!ruleSets || ruleSets.length === 0) {
    return <p>Aucun référentiel disponible.</p>;
  }

  const ruleSetsRadioDetails: RuleSetRadioDetails[] = [];

  ruleSetsRadioDetails.push(
    toRuleSetRadioDetails(
      getRuleSetByName(ruleSets, "RGAA")!,
      <ComputerDesktopIcon />,
      "Le RGAA (Référentiel Général d'Amélioration de l'Accessibilité) est le référentiel technique français pour l'accessibilité des services numériques web.",
    ),
  );

  ruleSetsRadioDetails.push(
    toRuleSetRadioDetails(
      getRuleSetByName(ruleSets, "RGAA 25")!,
      <ComputerDesktopIcon />,
      "Version 25 critères du RGAA pour des audits rapides. Il ne permet pas d'obtenir une conformité officielle, mais donne une première indication du niveau d'accessibilité du projet.",
      "RGAA, 25 critères",
    ),
  );

  ruleSetsRadioDetails.push(
    toRuleSetRadioDetails(
      getRuleSetByName(ruleSets, "RAAM")!,
      <DeviceTabletIcon />,
      "Le RAAM (Référentiel d'évaluation de l'Accessibilité des Applications Mobiles), édité par le Luxembourg et basé sur la norme EN 301 549.",
    ),
  );

  ruleSetsRadioDetails.push(
    toRuleSetRadioDetails(
      getRuleSetByName(ruleSets, "RAPDF")!,
      <DocumentIcon />,
      "Le RAPDF (Référentiel d'évaluation de l'accessibilité des documents PDF), édité par le Luxembourg et basé sur la norme EN 301 549.",
    ),
  );

  ruleSetsRadioDetails.push({
    uuid: "rgesn",
    name: "RGESN",
    displayName: "RGESN",
    version: "2",
    description:
      "Le RGESN (Référentiel Général d'Écoconception des Services Numériques) est un référentiel français pour l'écoconception des services numériques.",
    icon: <GlobeEuropeAfricaIcon />,
    disabled: true,
  });

  ruleSetsRadioDetails.push({
    uuid: "custom",
    name: "custom",
    displayName: "Personnalisé",
    version: "?",
    description:
      "Créer votre propre référentiel, en partant d'un référentiel existant ou avec vos propres critères.",
    icon: <RocketLaunchIcon />,
    disabled: true,
  });

  const iwsqaRuleSet = getRuleSetByName(ruleSets, "IWSQA");
  if (iwsqaRuleSet) {
    ruleSetsRadioDetails.push(
      toRuleSetRadioDetails(
        iwsqaRuleSet,
        <RocketLaunchIcon />,
        iwsqaRuleSet.description,
      ),
    );
  }

  return (
    <fieldset>
      <legend className={formStyles.fieldsetHeadingLegend}>
        Choix du référentiel de l'audit
        <span className={labelStyles.requiredStar} aria-hidden="true">
          *
        </span>
        :
      </legend>
      <ul className={ruleSetFieldStyles.ruleSetGrid}>
        {ruleSetsRadioDetails?.map((ruleSet: RuleSetRadioDetails) => (
          <li key={ruleSet.uuid}>
            <RadioCard
              name="ruleSet"
              value={ruleSet.uuid}
              defaultChecked={ruleSet.name === "RGAA"}
              onChange={(newRuleSetUuid) => onChange({ newRuleSetUuid, newRuleSetName: ruleSet.name })}
              disabled={ruleSet.disabled}
            >
              {ruleSet.disabled && (
                <span className={ruleSetFieldStyles.comingSoon}>bientôt</span>
              )}
              <span className={ruleSetFieldStyles.ruleSetHeader}>
                {ruleSet.icon}
                <span className={ruleSetFieldStyles.ruleSetHeaderRight}>
                  <span className={ruleSetFieldStyles.ruleSetName}>
                    {ruleSet.displayName}
                  </span>
                  <span className={ruleSetFieldStyles.ruleSetVersion}>
                    version {ruleSet.version}
                  </span>
                </span>
              </span>

              <span className={ruleSetFieldStyles.ruleSetDescription}>
                {ruleSet.description}
              </span>
            </RadioCard>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
