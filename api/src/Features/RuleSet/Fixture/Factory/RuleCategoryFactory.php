<?php

declare(strict_types=1);

namespace App\Features\RuleSet\Fixture\Factory;

use App\Features\RuleSet\Entity\RuleCategory;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<RuleCategory>
 */
final class RuleCategoryFactory extends PersistentObjectFactory
{
    public function __construct()
    {
    }

    public static function class(): string
    {
        return RuleCategory::class;
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
