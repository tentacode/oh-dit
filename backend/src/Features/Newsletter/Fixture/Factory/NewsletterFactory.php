<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Fixture\Factory;

use App\Features\Newsletter\Entity\Newsletter;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Newsletter>
 */
final class NewsletterFactory extends PersistentObjectFactory
{
    public function __construct(
    ) {
    }

    public static function class(): string
    {
        return Newsletter::class;
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
