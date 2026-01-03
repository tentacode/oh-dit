<?php

declare(strict_types=1);

namespace App\Features\Authentication\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTInvalidEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTNotFoundEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\RateLimiter\RateLimiterFactory;

#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_not_found')]
#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_invalid')]
final class RateLimitJwtInvalidListener
{
    public function __construct(
        private RateLimiterFactory $authFailedLimiter
    ) {
    }

    public function __invoke(JWTNotFoundEvent|JWTInvalidEvent $event): void
    {
        $ip = 'unknown';
        if ($event->getRequest() instanceof Request) {
            $ip = $event->getRequest()->getClientIp() ?? 'unknown';
        }

        $limiter = $this->authFailedLimiter->create($ip);
        $limit = $limiter->consume();

        if (! $limit->isAccepted()) {
            $event->setResponse(new JsonResponse(
                [
                    'error' => 'Trop de tentatives sur l\'API. Veuillez réessayer plus tard.',
                ],
                Response::HTTP_TOO_MANY_REQUESTS
            ));
        }
    }
}
