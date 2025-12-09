<?php

declare(strict_types=1);

namespace App\Features\Issue\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Issue\Command\UpdateIssueCommand;
use App\Features\Issue\Command\UpdateIssueRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class UpdateIssueController extends ApiController
{
    public function __construct(
        private UpdateIssueCommand $updateIssueCommand
    ) {
    }

    #[Route('/api/issues/{issueUuid}', name: 'edit_issue', methods: ['PUT'], format: 'json')]
    public function __invoke(
        string $issueUuid,
        #[MapRequestPayload()]
        UpdateIssueRequest $updateIssueRequest,
        #[CurrentUser]
        User $user
    ): JsonResponse {
        try {
            $issue = ($this->updateIssueCommand)(user: $user, issueUuid: $issueUuid, updateIssueRequest: $updateIssueRequest);

            return $this->getSerializedJsonResponse($issue, JsonResponse::HTTP_OK);
        } catch (SuspiciousOperationException $e) {
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
