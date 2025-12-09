<?php

declare(strict_types=1);

namespace App\Features\Compliance\Fixture\Factory;

use App\Features\Issue\Entity\Issue;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Issue>
 */
final class IssueFactory extends PersistentObjectFactory
{
    public function __construct(
    ) {
    }

    public static function class(): string
    {
        return Issue::class;
    }

    /**
     * @return array<string, mixed>
     */
    protected function defaults(): array
    {
        return [
        ];
    }

    protected function initialize(): static
    {
        return $this;
    }
}
