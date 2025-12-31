<?php

declare(strict_types=1);

namespace App\Features\Compliance\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Compliance\Query\GetProjectCompliancesQuery;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetProjectCompliancesController extends ApiController
{
    public function __construct(
        private GetProjectCompliancesQuery $getProjectCompliancesQuery
    ) {
    }

    #[Route('/api/projects/{projectUuid}/compliances', name: 'get_project_compliances', methods: ['GET'], format: 'json')]
    public function __invoke(
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'projectUuid' => 'uuid',
        ])]
        Project $project,
    ): JsonResponse {
        try {
            $compliances = ($this->getProjectCompliancesQuery)($user, $project);

            return $this->json($compliances);
        } catch (SuspiciousOperationException $e) {
            captureException($e);

            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
