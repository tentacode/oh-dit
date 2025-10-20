<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Command\CreateProjectCommand;
use App\Features\Project\Command\CreateProjectRequest;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class CreateProjectController extends AbstractController
{
    public function __construct(
        private CreateProjectCommand $createProjectCommand,
    ) {
    }

    #[Route('/api/projects/{uuid:team}', name: 'create_project', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload]
        CreateProjectRequest $createProjectRequest,
        #[CurrentUser]
        User $user,
        Team $team,
    ): JsonResponse {
        try {
            $project = ($this->createProjectCommand)($user, $team, $createProjectRequest);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Team not found.');
        }

        return $this->json($project, JsonResponse::HTTP_CREATED);
    }
}
