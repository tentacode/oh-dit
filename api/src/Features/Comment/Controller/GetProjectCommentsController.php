<?php

declare(strict_types=1);

namespace App\Features\Comment\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Comment\Query\GetProjectCommentsQuery;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetProjectCommentsController extends ApiController
{
    public function __construct(
        private GetProjectCommentsQuery $getProjectCommentsQuery
    ) {
    }

    #[Route('/api/projects/{projectUuid}/comments', name: 'get_project_comments', methods: ['GET'], format: 'json')]
    public function __invoke(
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'projectUuid' => 'uuid',
        ])]
        Project $project,
    ): JsonResponse {
        try {
            $comments = ($this->getProjectCommentsQuery)($user, $project);

            return $this->json($comments);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Team not found.');
        }
    }
}
