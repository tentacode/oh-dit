<?php

declare(strict_types=1);

namespace App\Infrastructure\Symfony\EventListener;

use Symfony\Component\HttpKernel\Profiler\Profile;
use Doctrine\Bundle\DoctrineBundle\DataCollector\DoctrineDataCollector;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Profiler\Profiler;

#[AsEventListener(event: KernelEvents::RESPONSE, priority: -1024)]
class AddDatabaseQueryCountHeader
{
    public function __construct(
        private ?Profiler $profiler = null,
        private string $environment = 'prod'
    ) {
    }

    public function __invoke(ResponseEvent $event): void
    {
        if (! in_array($this->environment, ['dev', 'test'], true)) {
            return;
        }

        if (! $event->isMainRequest() || ! $this->profiler instanceof Profiler) {
            return;
        }

        $profile = $this->profiler->collect($event->getRequest(), $event->getResponse());
        if (!$profile instanceof Profile) {
            return;
        }

        /** @var DoctrineDataCollector $dbCollector */
        $dbCollector = $profile->getCollector('db');

        $response = $event->getResponse();
        $response->headers->set('X-Database-Queries', (string) $dbCollector->getQueryCount());
    }
}
