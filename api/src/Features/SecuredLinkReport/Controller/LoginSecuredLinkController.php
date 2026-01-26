<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Controller;

use App\Features\SecuredLinkReport\Query\LoginSecuredLinkQuery;
use App\Features\SecuredLinkReport\Query\LoginSecuredLinkRequest as QueryLoginSecuredLinkRequest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Throwable;

#[AsController]
final class LoginSecuredLinkController
{
    public function __construct(
        private readonly LoginSecuredLinkQuery $loginQuery,
    ) {
    }

    #[Route('/api/secured-link/{token}/login', name: 'api_secured_link_login', methods: ['POST'])]
    public function __invoke(
        string $token,
        #[MapRequestPayload]
        QueryLoginSecuredLinkRequest $request,
    ): JsonResponse {
        try {
            $jwt = ($this->loginQuery)($token, $request);
        } catch (Throwable $e) {
            // Generic error to prevent token/password enumeration
            return new JsonResponse(
                [
                    'error' => 'Invalid credentials',
                ],
                Response::HTTP_UNAUTHORIZED
            );
        }

        return new JsonResponse([
            'token' => $jwt,
        ]);
    }
}
