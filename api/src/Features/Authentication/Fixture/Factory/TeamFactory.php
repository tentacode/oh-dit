<?php

declare(strict_types=1);

namespace App\Features\Authentication\Fixture\Factory;

use App\Features\Authentication\Entity\Team;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Team>
 */
final class TeamFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    public static function class(): string
    {
        return Team::class;
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
