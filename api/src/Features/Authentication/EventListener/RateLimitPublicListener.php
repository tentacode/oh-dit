<?php

declare(strict_types=1);

namespace App\Features\Authentication\EventListener;

// use function Safe\json_decode;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
// use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
// use Symfony\Component\RateLimiter\RateLimiterFactory;
// use Symfony\Component\Security\Http\AccessMapInterface;

#[AsEventListener(event: 'kernel.request', priority: -100)]
final class RateLimitPublicListener
{
    // public function __construct(
    //     private RateLimiterFactory $publicLimiter,
    //     private AccessMapInterface $accessMap
    // ) {
    // }

    public function __invoke(RequestEvent $event): void
    {
        if (! $event->isMainRequest()) {
            return;
        }

        // $request = $event->getRequest();
        // [$attributes] = $this->accessMap->getPatterns($request);

        // $isPublic = $attributes === null || in_array('PUBLIC_ACCESS', $attributes, true);

        // if (! $isPublic) {
        //     return;
        // }

        // $content = $request->getContent();
        // $data = $content !== '' ? json_decode($content, true) : [];

        // if (! is_array($data)) {
        //     $data = [];
        // }

        // $email = isset($data['email']) && is_string($data['email']) ? $data['email'] : '';
        // $username = isset($data['username']) && is_string($data['username']) ? $data['username'] : '';

        // $key = $request->getClientIp() . '_' . ($email !== '' ? $email : $username);

        // $limiter = $this->publicLimiter->create($key);
        // $limit = $limiter->consume();

        // if (! $limit->isAccepted()) {
        //     $event->setResponse(new JsonResponse(
        //         [
        //             'error' => 'Trop de tentatives sur l\'API. Veuillez réessayer plus tard.',
        //         ],
        //         Response::HTTP_TOO_MANY_REQUESTS
        //     ));
        // }
    }
}
