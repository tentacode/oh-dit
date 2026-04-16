<?php

declare(strict_types=1);

namespace App\Features\Team\Fixture\Story;

use App\Features\Authentication\Fixture\Story\TeamUsersStory;
use App\Features\Team\Fixture\Factory\InviteFactory;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'invites', groups: ['all'])]
final class InvitesStory extends Story
{
    public const INVITE_EMPEROR_UUID = '66600000-0000-4000-8000-000000000001';

    public function build(): void
    {
        TeamUsersStory::load();

        $theEmpireTeam = TeamUsersStory::get(TeamUsersStory::TEAM_THE_EMPIRE_UUID);
        $vadorUser = TeamUsersStory::get(TeamUsersStory::USER_DARTH_VADER_UUID);

        $emperorInvite = InviteFactory::createOne([
            'uuid' => self::INVITE_EMPEROR_UUID,
            'team' => $theEmpireTeam,
            'createdBy' => $vadorUser,
            'cryptedEmail' => 'emperor@empire.com', // here need to be crypted
        ]);

        $this->addToPool('invites', $emperorInvite);
        $this->addState(self::INVITE_EMPEROR_UUID, $emperorInvite, 'invites');
    }
}
