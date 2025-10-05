<?php

declare(strict_types=1);

namespace App\Features\Project\Fixture\Factory;

use App\Features\Project\Entity\Project;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Project>
 */
final class ProjectFactory extends PersistentObjectFactory
{
    public function __construct(
    ) {
    }

    public static function class(): string
    {
        return Project::class;
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
