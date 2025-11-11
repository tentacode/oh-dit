<?php

declare(strict_types=1);

namespace App\Features\Compliance\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Compliance\Query\GetProjectCompliancesQuery;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetProjectCompliancesController extends ApiController
{
    public function __construct(
        private GetProjectCompliancesQuery $getProjectCompliancesQuery
    ) {
    }

    #[Route('/api/projects/{projectUuid}/compliances', name: 'get_project_compliances', methods: ['GET'], format: 'json')]
    public function __invoke(#[CurrentUser] User $user, string $projectUuid): JsonResponse
    {
        $compliances = ($this->getProjectCompliancesQuery)($user, $projectUuid);

        return $this->json($compliances);
    }
}
