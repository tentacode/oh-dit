<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Controller;

use function Sentry\captureMessage;
use App\Features\SecuredLinkReport\Query\GetReportQuery;
use App\Features\SecuredLinkReport\Security\SecuredLinkUser;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

#[AsController]
final class GetSecuredLinkReportController extends ApiController
{
    public function __construct(
        private readonly GetReportQuery $getReportQuery,
    ) {
    }

    #[Route('/api/secured-link/{securedLinkToken}', name: 'api_secured_link_report', methods: ['GET'])]
    public function __invoke(
        string $securedLinkToken,
        #[CurrentUser]
        SecuredLinkUser $user,
    ): JsonResponse {
        // Verify that the token in URL matches the token in JWT
        if ($user->getSecuredLinkToken() !== $securedLinkToken) {
            captureMessage(sprintf(
                'Secured link report access denied due to token mismatch (suspicious activity). URL token: %s, JWT token: %s',
                $securedLinkToken,
                $user->getSecuredLinkToken()
            ));

            throw new NotFoundHttpException('Resource not found');
        }

        $reportAnswer = ($this->getReportQuery)($securedLinkToken);

        return $this->getSerializedJsonResponse($reportAnswer);
    }
}
