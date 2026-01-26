<?php

declare(strict_types=1);

namespace App\Features\Compliance\Fixture\Story;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Compliance\Entity\ComplianceStatus;
use App\Features\Compliance\Fixture\Factory\ComplianceFactory;
use App\Features\Compliance\Fixture\Factory\IssueFactory;
use App\Features\Issue\Entity\Severity;
use App\Features\Issue\Entity\Status;
use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Features\RuleSet\Fixture\Story\RuleSetsStory;
use Safe\DateTimeImmutable;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'compliances', groups: ['all'])]
final class CompliancesStory extends Story
{
    public function build(): void
    {
        TeamUsersStory::load();
        ProjectsStory::load();
        RuleSetsStory::load();

        // NC sur 1.1 et la page home
        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::NON_COMPLIANT,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.1'),
            'createdAt' => new DateTimeImmutable('-3 hours'),
        ]);

        // Deux issues sur la règle 1.1 pour la page home
        $issueText = <<<MARKDOWN
            # Contexte

            Les stormtroopers manque la cible à moins de 10 mètres, 8 fois sur 10.

            C'est **extrèmement problématique** pour la crédibilité de l'Empire Galactique.

            | Élément     | Valeur      |
            | ----------- | ----------- |
            | Règle       | 1.1         |
            | Projet      | Death Star  |
            | Écran       | Home        |

            # Solutions

            ## Calibration des blasters

            Plusieurs stormtroopers m'ont confirmé :

            > Nos blasters étaient mal calibrés, chef.

            Il faudrait ajouter une correction au code du viseur dans le fichier `src/target/blaster.js` :

            ```js
            function calibrateBlaster(blaster) {
                if (blaster.accuracy < 90) {
                    blaster.adjustSight(5); // Ajuste le viseur de 5 unités
                }
            }
            ```

            ## Reporting

            Il faudrait également ajouter une alerte dans le tableau de bord des stormtroopers pour les prévenir lorsque leur blaster nécessite une recalibration, voici une suggestion d'implémentation :

            ```javascript
            import sentry from 'sentry-sdk';

            function checkBlasterStatus(blaster) {
                if (blaster.accuracy < 90) {
                    sentry.captureMessage(`Blaster \${blaster.id} needs recalibration.`);

                    console.error(`Alerte : Le blaster \${blaster.id} nécessite une recalibration !`);
                }
            }
            ```

            ## Résumé

            Actions à mener :

            1. Ajouter une correction de 5 unités au viseur pour les blasters avec une précision inférieure à 90.
            2. Implémenter une alerte dans le tableau de bord des stormtroopers

            Merci de votre attention, que la Force soit avec vous !

            ![](https://i.pinimg.com/736x/00/62/29/00622918e06e97ec42449f4439b75f26.jpg)

            Signé Dark, votre humble seigneur Sith.
            MARKDOWN;

        IssueFactory::new()->create([
            'uuid' => '00000000-0000-4000-8000-000000013337',
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'issueId' => 1337,
            'rule' => RuleSetsStory::get('rule_1.1'),
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'severity' => Severity::BLOCKING,
            'text' => $issueText,
        ]);

        IssueFactory::new()->create([
            'uuid' => '00000000-0000-4000-8000-000000013338',
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'issueId' => 1338,
            'rule' => RuleSetsStory::get('rule_1.1'),
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'severity' => Severity::MODERATE,
            'text' => 'Les stormtroopers ne portent pas correctement leur casque dans 30% des cas.',
            'status' => Status::FIXED,
        ]);

        // 1.1 compliant sur la page contact
        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::COMPLIANT,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_CONTACT_UUID),
            'rule' => RuleSetsStory::get('rule_1.1'),
            'createdAt' => new DateTimeImmutable('-3 hours'),
        ]);

        // 1.2 non compliant then compliant on the page home
        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::NON_COMPLIANT,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.2'),
            'createdAt' => new DateTimeImmutable('-1 day'),
        ]);

        // This on should override the previous one for the same rule
        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::COMPLIANT,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.2'),
            'createdAt' => new DateTimeImmutable('-2 hours'),
        ]);

        // 1.3 non applicable on the page home
        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::NOT_APPLICABLE,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.3'),
            'createdAt' => new DateTimeImmutable('-1 hours'),
        ]);
    }
}
