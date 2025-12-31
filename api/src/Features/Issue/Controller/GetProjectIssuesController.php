<?php

declare(strict_types=1);

namespace App\Features\Issue\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Issue\Query\GetProjectIssuesQuery;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetProjectIssuesController extends ApiController
{
    public function __construct(
        private GetProjectIssuesQuery $getProjectIssuesQuery
    ) {
    }

    #[Route('/api/projects/{projectUuid}/issues', name: 'get_project_issues', methods: ['GET'], format: 'json')]
    public function __invoke(
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'projectUuid' => 'uuid',
        ])]
        Project $project,
    ): JsonResponse {
        try {
            $issues = ($this->getProjectIssuesQuery)($user, $project);

            return $this->json($issues);
        } catch (SuspiciousOperationException $e) {
            captureException($e);

            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
