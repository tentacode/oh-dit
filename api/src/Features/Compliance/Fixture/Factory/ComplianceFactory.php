<?php

declare(strict_types=1);

namespace App\Features\Compliance\Fixture\Factory;

use App\Features\Compliance\Entity\Compliance;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Compliance>
 */
final class ComplianceFactory extends PersistentObjectFactory
{
    public function __construct(
    ) {
    }

    public static function class(): string
    {
        return Compliance::class;
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
