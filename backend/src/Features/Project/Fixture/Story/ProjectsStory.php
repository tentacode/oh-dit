<?php

declare(strict_types=1);

namespace App\Features\Project\Fixture\Story;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Project\Fixture\Factory\ProjectFactory;
use App\Features\Project\Fixture\Factory\ScreenFactory;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'projects', groups: ['all'])]
final class ProjectsStory extends Story
{
    public const PROJECT_DEATH_STAR_UUID = '22222222-0000-0000-0000-000000000001';

    public const SCREEN_HOME_UUID = '33333333-0000-0000-0000-000000000001';

    public const SCREEN_CONTACT_UUID = '33333333-0000-0000-0000-000000000002';

    public function build(): void
    {
        TeamUsersStory::load();

        $theEmpireTeam = TeamUsersStory::get(TeamUsersStory::TEAM_THE_EMPIRE_UUID);

        $deathStar = ProjectFactory::new()->withoutPersisting()->create([
            'uuid' => self::PROJECT_DEATH_STAR_UUID,
            'name' => 'Death Star',
            'team' => $theEmpireTeam,
        ]);

        ScreenFactory::createOne([
            'name' => 'Home Screen',
            'uuid' => self::SCREEN_HOME_UUID,
            'project' => $deathStar,
        ]);

        ScreenFactory::createOne([
            'name' => 'Contact Screen',
            'uuid' => self::SCREEN_CONTACT_UUID,
            'project' => $deathStar,
        ]);
    }
}
