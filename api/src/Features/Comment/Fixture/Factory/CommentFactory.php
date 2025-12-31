<?php

declare(strict_types=1);

namespace App\Features\Comment\Fixture\Factory;

use App\Features\Comment\Entity\Comment;
use Zenstruck\Foundry\Persistence\PersistentObjectFactory;

/**
 * @extends PersistentObjectFactory<Comment>
 */
final class CommentFactory extends PersistentObjectFactory
{
    public function __construct(
    ) {
    }

    public static function class(): string
    {
        return Comment::class;
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
