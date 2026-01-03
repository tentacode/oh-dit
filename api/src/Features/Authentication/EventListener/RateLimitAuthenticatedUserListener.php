<?php

declare(strict_types=1);

namespace App\Features\Authentication\EventListener;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Security\Core\User\UserInterface;

#[AsEventListener(event: 'kernel.request', priority: -100)]
final class RateLimitAuthenticatedUserListener
{
    public function __construct(
        private RateLimiterFactory $authenticatedUserLimiter,
        private Security $security
    ) {
    }

    public function __invoke(RequestEvent $event): void
    {
        if (! $event->isMainRequest()) {
            return;
        }

        $user = $this->security->getUser();
        if (! $user instanceof UserInterface) {
            return;
        }

        $ip = $event->getRequest()->getClientIp();
        $limiter = $this->authenticatedUserLimiter->create($ip ?? 'unknown');
        $limit = $limiter->consume();

        if (! $limit->isAccepted()) {
            $event->setResponse(new JsonResponse(
                [
                    'error' => 'Trop de tentatives sur l\'API. Veuillez réessayer dans 15 minutes.',
                ],
                Response::HTTP_TOO_MANY_REQUESTS
            ));
        }
    }
}
