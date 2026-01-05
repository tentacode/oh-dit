<?php

declare(strict_types=1);

namespace App\Features\Comment\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Comment\Command\CreateCommentCommand;
use App\Features\Comment\Command\CreateCommentRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class CreateCommentController extends ApiController
{
    public function __construct(
        private CreateCommentCommand $createCommentCommand
    ) {
    }

    #[Route('/api/comments', name: 'create_project_comment', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        CreateCommentRequest $createCommentRequest,
        #[CurrentUser]
        User $user
    ): JsonResponse {
        try {
            $comment = ($this->createCommentCommand)(user: $user, createCommentRequest: $createCommentRequest);

            return $this->getSerializedJsonResponse($comment, JsonResponse::HTTP_CREATED);
        } catch (SuspiciousOperationException $e) {
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
