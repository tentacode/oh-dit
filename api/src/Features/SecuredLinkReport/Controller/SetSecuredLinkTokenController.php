<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\SecuredLinkReport\Command\SetSecuredLinkTokenCommand;
use App\Features\SecuredLinkReport\Command\SetSecuredLinkTokenRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class SetSecuredLinkTokenController extends ApiController
{
    public function __construct(
        private SetSecuredLinkTokenCommand $setSecuredLinkTokenCommand,
    ) {
    }

    #[Route('/api/projects/{projectUuid}/secured-link', name: 'set_secured_link_report', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'projectUuid' => 'uuid',
        ])]
        Project $project,
        #[MapRequestPayload()]
        SetSecuredLinkTokenRequest $setSecuredLinkTokenRequest,
    ): JsonResponse {
        try {
            $securedToken = ($this->setSecuredLinkTokenCommand)(
                $user,
                $project,
                $setSecuredLinkTokenRequest
            );
        } catch (SuspiciousOperationException $e) {
            captureException($e);
            throw new NotFoundHttpException('Resource not found.');
        }

        return new JsonResponse([
            'securedLinkToken' => $securedToken,
        ], JsonResponse::HTTP_OK);
    }
}
