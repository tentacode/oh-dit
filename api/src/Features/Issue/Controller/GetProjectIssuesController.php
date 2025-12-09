<?php

declare(strict_types=1);

namespace App\Features\Issue\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Issue\Query\GetProjectIssuesQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetProjectIssuesController extends ApiController
{
    public function __construct(
        private GetProjectIssuesQuery $getProjectIssuesQuery
    ) {
    }

    #[Route('/api/projects/{projectUuid}/issues', name: 'get_project_issues', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user, string $projectUuid): JsonResponse
    {
        $issues = ($this->getProjectIssuesQuery)($user, $projectUuid);

        return $this->json($issues);
    }
}
