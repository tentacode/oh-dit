<?php

declare(strict_types=1);

namespace App\Features\Team\Fixture\Factory;

use App\Features\Team\Entity\Invite;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Invite>
 */
final class InviteFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    public static function class(): string
    {
        return Invite::class;
    }

    /**
     * @return array<string, mixed>
     */
    protected function defaults(): array
    {
        return [
            'uuid' => self::faker()->uuid(),
        ];
    }

    protected function initialize(): static
    {
        return $this;
    }
}
