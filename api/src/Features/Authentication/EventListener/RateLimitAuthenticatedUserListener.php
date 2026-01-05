<?php

declare(strict_types=1);

namespace App\Features\Authentication\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: 'kernel.request', priority: -100)]
final class RateLimitAuthenticatedUserListener
{
    public function __invoke(): void
    {
    }
}
