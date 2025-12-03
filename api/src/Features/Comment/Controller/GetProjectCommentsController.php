<?php

declare(strict_types=1);

namespace App\Features\Comment\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Comment\Query\GetProjectCommentsQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetProjectCommentsController extends ApiController
{
    public function __construct(
        private GetProjectCommentsQuery $getProjectCommentsQuery
    ) {
    }

    #[Route('/api/projects/{projectUuid}/comments', name: 'get_project_comments', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user, string $projectUuid): JsonResponse
    {
        $comments = ($this->getProjectCommentsQuery)($user, $projectUuid);

        return $this->json($comments);
    }
}
