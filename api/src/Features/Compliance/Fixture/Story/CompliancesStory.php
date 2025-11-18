<?php

declare(strict_types=1);

namespace App\Features\Compliance\Fixture\Story;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Compliance\Entity\ComplianceStatus;
use App\Features\Compliance\Fixture\Factory\ComplianceFactory;
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

        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::NON_COMPLIANT,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.1'),
            'createdAt' => new DateTimeImmutable('-3 hours'),
        ]);

        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::COMPLIANT,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_CONTACT_UUID),
            'rule' => RuleSetsStory::get('rule_1.1'),
            'createdAt' => new DateTimeImmutable('-3 hours'),
        ]);

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

        ComplianceFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'status' => ComplianceStatus::NOT_APPLICABLE,
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.4'),
            'createdAt' => new DateTimeImmutable('-1 hours'),
        ]);
    }
}
