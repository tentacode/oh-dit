<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Query\GetProjectsQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class GetProjectsController extends ApiController
{
    public function __construct(
        private GetProjectsQuery $getProjectsQuery,
    ) {
    }

    #[Route('/api/teams/{teamUuid}/projects', name: 'get_projects', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user, string $teamUuid): JsonResponse
    {
        $projects = ($this->getProjectsQuery)($user, $teamUuid);

        return $this->getSerializedJsonResponse($projects);
    }
}
