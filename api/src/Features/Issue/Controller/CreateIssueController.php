<?php

declare(strict_types=1);

namespace App\Features\Issue\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Issue\Command\CreateIssueCommand;
use App\Features\Issue\Command\CreateIssueRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class CreateIssueController extends ApiController
{
    public function __construct(
        private CreateIssueCommand $createIssueCommand
    ) {
    }

    #[Route('/api/issues', name: 'create_project_issue', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        CreateIssueRequest $createIssueRequest,
        #[CurrentUser]
        User $user
    ): JsonResponse {
        try {
            $issue = ($this->createIssueCommand)(user: $user, createIssueRequest: $createIssueRequest);

            return $this->getSerializedJsonResponse($issue, JsonResponse::HTTP_CREATED);
        } catch (SuspiciousOperationException $e) {
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
