<?php

declare(strict_types=1);

namespace App\Features\Recommandation\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Recommandation\Query\GetProjectRecommandationsQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetProjectRecommandationsController extends ApiController
{
    public function __construct(
        private GetProjectRecommandationsQuery $getProjectRecommandationsQuery
    ) {
    }

    #[Route('/api/projects/{projectUuid}/recommandations', name: 'get_project_recommandations', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user, string $projectUuid): JsonResponse
    {
        $recommandations = ($this->getProjectRecommandationsQuery)($user, $projectUuid);

        return $this->json($recommandations);
    }
}
