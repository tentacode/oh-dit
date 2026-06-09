<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Command\DeleteProjectCommand;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

use function Sentry\captureException;

final class DeleteProjectController extends ApiController
{
    public function __construct(
        private DeleteProjectCommand $deleteProjectCommand,
    ) {}

    #[Route('/api/projects/{projectUuid}', name: 'delete_project', methods: ['DELETE'], format: 'json')]
    public function __invoke(
        #[CurrentUser] User $user,
        #[MapEntity(mapping: [
            'projectUuid' => 'uuid',
        ])]
        Project $project
    ): JsonResponse {
        try {
            ($this->deleteProjectCommand)($project, $user);

            return $this->json([], JsonResponse::HTTP_NO_CONTENT);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
