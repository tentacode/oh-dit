<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Command\CreateProjectCommand;
use App\Features\Project\Command\CreateProjectRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class CreateProjectController extends ApiController
{
    public function __construct(
        private CreateProjectCommand $createProjectCommand,
    ) {
    }

    #[Route('/api/projects', name: 'create_project', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload]
        CreateProjectRequest $createProjectRequest,
        #[CurrentUser]
        User $user,
    ): JsonResponse {
        try {
            $project = ($this->createProjectCommand)($user, $createProjectRequest);

            return $this->getSerializedJsonResponse($project, JsonResponse::HTTP_CREATED);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Team not found.');
        }
    }
}
