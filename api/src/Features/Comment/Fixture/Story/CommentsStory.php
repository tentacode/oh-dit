<?php

declare(strict_types=1);

namespace App\Features\Comment\Fixture\Story;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Comment\Fixture\Factory\CommentFactory;
use App\Features\Project\Fixture\Story\ProjectsStory;
use App\Features\RuleSet\Fixture\Story\RuleSetsStory;
use Safe\DateTimeImmutable;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'comments', groups: ['all'])]
final class CommentsStory extends Story
{
    public function build(): void
    {
        TeamUsersStory::load();
        ProjectsStory::load();

        CommentFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID),
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_DEATH_STAR_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.1'),
            'createdAt' => new DateTimeImmutable('-3 hours'),
            'text' => "Ces stormtroopers sont une honte pour l'Empire !",
        ]);

        CommentFactory::new()->create([
            'user' => TeamUsersStory::get(TeamUsersStory::USER_LUKE_SKYWALKER_UUID),
            'project' => ProjectsStory::get(ProjectsStory::PROJECT_XWING_UUID),
            'screen' => ProjectsStory::get(ProjectsStory::SCREEN_HOME_UUID),
            'rule' => RuleSetsStory::get('rule_1.1'),
            'createdAt' => new DateTimeImmutable('-2 hours'),
            'text' => "Oui, c'est clair.",
        ]);
    }
}
