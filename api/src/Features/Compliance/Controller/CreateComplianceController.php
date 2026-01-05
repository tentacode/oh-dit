<?php

declare(strict_types=1);

namespace App\Features\Compliance\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Compliance\Command\CreateComplianceCommand;
use App\Features\Compliance\Command\CreateComplianceRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class CreateComplianceController extends ApiController
{
    public function __construct(
        private CreateComplianceCommand $createComplianceCommand
    ) {
    }

    #[Route('/api/compliances', name: 'create_project_compliance', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        CreateComplianceRequest $createComplianceRequest,
        #[CurrentUser]
        User $user
    ): JsonResponse {
        try {
            $compliance = ($this->createComplianceCommand)(user: $user, createComplianceRequest: $createComplianceRequest);

            return $this->getSerializedJsonResponse($compliance, JsonResponse::HTTP_CREATED);
        } catch (SuspiciousOperationException $e) {
            captureException($e);

            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
