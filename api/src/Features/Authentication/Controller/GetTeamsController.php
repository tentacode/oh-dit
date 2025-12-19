<?php

declare(strict_types=1);

namespace App\Features\Authentication\Controller;

use App\Features\Authentication\Entity\User;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class GetTeamsController extends ApiController
{
    #[Route('/api/teams', name: 'get_teams', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user): JsonResponse
    {
        return $this->getSerializedJsonResponse($user->getTeams()->toArray());
    }
}
