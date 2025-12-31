<?php

declare(strict_types=1);

namespace App\Features\Project\Fixture\Story;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Project\Entity\Screen;
use App\Features\Project\Fixture\Factory\ProjectFactory;
use App\Features\Project\Fixture\Factory\ScreenFactory;
use App\Features\RuleSet\Fixture\Story\RuleSetsStory;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'projects', groups: ['all'])]
final class ProjectsStory extends Story
{
    public const PROJECT_DEATH_STAR_UUID = '22222222-0000-4000-8000-000000000001';

    public const PROJECT_XWING_UUID = '22222222-0000-4000-8000-000000000002';

    public const SCREEN_ROOT_UUID = '33333333-0000-4000-8000-000000000000';

    public const SCREEN_HOME_UUID = '33333333-0000-4000-8000-000000000001';

    public const SCREEN_CONTACT_UUID = '33333333-0000-4000-8000-000000000002';

    public function build(): void
    {
        TeamUsersStory::load();

        $theEmpireTeam = TeamUsersStory::get(TeamUsersStory::TEAM_THE_EMPIRE_UUID);

        $empireRuleSet = RuleSetsStory::get(RuleSetsStory::RULE_SET_EMPIRE_UUID);

        $deathStarProject = ProjectFactory::new()->withoutPersisting()->create([
            'uuid' => self::PROJECT_DEATH_STAR_UUID,
            'name' => 'Death Star',
            'url' => 'https://www.deathstar.empire',
            'team' => $theEmpireTeam,
            'ruleSet' => $empireRuleSet,
        ]);

        $this->addToPool('projects', $deathStarProject);
        $this->addState(self::PROJECT_DEATH_STAR_UUID, $deathStarProject, 'projects');

        $rootScreen = ScreenFactory::createOne([
            'name' => Screen::ROOT_SCREEN_NAME,
            'rank' => 0,
            'url' => '',
            'uuid' => self::SCREEN_ROOT_UUID,
            'project' => $deathStarProject,
            'isRoot' => true,
        ]);

        $this->addToPool('screens', $rootScreen);
        $this->addState(self::SCREEN_ROOT_UUID, $rootScreen, 'screens');

        $homeScreen = ScreenFactory::createOne([
            'name' => 'Accueil',
            'url' => '/',
            'rank' => 1,
            'uuid' => self::SCREEN_HOME_UUID,
            'project' => $deathStarProject,
        ]);

        $this->addToPool('screens', $homeScreen);
        $this->addState(self::SCREEN_HOME_UUID, $homeScreen, 'screens');

        $contactScreen = ScreenFactory::createOne([
            'name' => 'Contact',
            'url' => '/contact',
            'rank' => 2,
            'uuid' => self::SCREEN_CONTACT_UUID,
            'project' => $deathStarProject,
        ]);

        $this->addToPool('screens', $contactScreen);
        $this->addState(self::SCREEN_CONTACT_UUID, $contactScreen, 'screens');

        $theRebellionTeam = TeamUsersStory::get(TeamUsersStory::TEAM_THE_REBELLION_UUID);

        $xWingProject = ProjectFactory::createOne([
            'name' => 'X-Wing Project',
            'url' => 'https://www.xwing.rebellion',
            'team' => $theRebellionTeam,
            'ruleSet' => $empireRuleSet,
            'uuid' => self::PROJECT_XWING_UUID,
        ]);

        $this->addToPool('projects', $xWingProject);
        $this->addState(self::PROJECT_XWING_UUID, $xWingProject, 'projects');

        ScreenFactory::createOne([
            'name' => Screen::ROOT_SCREEN_NAME,
            'project' => $xWingProject,
            'rank' => 0,
            'url' => '',
            'isRoot' => true,
        ]);

        ScreenFactory::createOne([
            'name' => 'Landing Screen',
            'url' => '/',
            'rank' => 1,
            'project' => $xWingProject,
        ]);
    }
}
