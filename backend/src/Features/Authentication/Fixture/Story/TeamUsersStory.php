<?php

declare(strict_types=1);

namespace App\Features\Authentication\Fixture\Story;

use function Zenstruck\Foundry\Persistence\save;
use App\Features\Authentication\Fixture\Factory\TeamFactory;
use App\Features\Authentication\Fixture\Factory\UserFactory;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'team_users', groups: ['all'])]
final class TeamUsersStory extends Story
{
    public const USER_DARTH_VADER_UUID = '00000000-0000-0000-0000-000000000001';

    public const USER_LUKE_SKYWALKER_UUID = '00000000-0000-0000-0000-000000000002';

    public const TEAM_THE_EMPIRE_UUID = '11111111-0000-0000-0000-000000000001';

    public const TEAM_THE_REBELLION_UUID = '11111111-0000-0000-0000-000000000002';

    public function build(): void
    {
        $darthVader = UserFactory::createOne([
            'uuid' => self::USER_DARTH_VADER_UUID,
            'email' => 'darth_vader@empire.com',
            'plainPassword' => 'vader_64',
            'username' => 'Darth Vader',
        ]);

        $lukeSkywalker = UserFactory::createOne([
            'uuid' => self::USER_LUKE_SKYWALKER_UUID,
            'email' => 'luke@rebels.com',
            'plainPassword' => 'luke69420',
            'username' => 'Luke Skywalker',
        ]);

        $theEmpire = TeamFactory::new()->withoutPersisting()->create([
            'uuid' => self::TEAM_THE_EMPIRE_UUID,
            'name' => 'The Empire',
        ]);

        $this->addToPool('teams', $theEmpire);
        $this->addState(self::TEAM_THE_EMPIRE_UUID, $theEmpire, 'teams');

        $theEmpire->addUser($darthVader);
        save($theEmpire);

        $theRebellion = TeamFactory::new()->withoutPersisting()->create([
            'uuid' => self::TEAM_THE_REBELLION_UUID,
            'name' => 'The Rebellion',
        ]);

        $theRebellion->addUser($lukeSkywalker);
        save($theRebellion);
    }
}
