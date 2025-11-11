<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Query\GetProjectQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class GetProjectController extends ApiController
{
    public function __construct(
        private GetProjectQuery $getProjectQuery,
    ) {
    }

    #[Route('/api/projects/{uuid}', name: 'get_project', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user, string $uuid): JsonResponse
    {
        $project = ($this->getProjectQuery)($user, $uuid);
        if (! $project instanceof Project) {
            throw new NotFoundHttpException('Project not found.');
        }

        return $this->getSerializedJsonResponse($project);
    }
}
