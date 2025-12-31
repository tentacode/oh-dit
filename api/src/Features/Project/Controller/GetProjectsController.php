<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Query\GetProjectsQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class GetProjectsController extends ApiController
{
    public function __construct(
        private GetProjectsQuery $getProjectsQuery,
    ) {
    }

    #[Route('/api/teams/{teamUuid}/projects', name: 'get_projects', methods: ['GET'], format: 'json')]
    public function __invoke(
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'teamUuid' => 'uuid',
        ])]
        Team $team,
    ): JsonResponse {
        try {
            $projects = ($this->getProjectsQuery)($user, $team);

            return $this->getSerializedJsonResponse($projects);

        } catch (SuspiciousOperationException $e) {
            captureException($e);

            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
