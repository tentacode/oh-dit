<?php

declare(strict_types=1);

namespace App\Features\Screen\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Screen\Command\CreateScreenCommand;
use App\Features\Screen\Command\CreateScreenRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class CreateScreenController extends ApiController
{
    public function __construct(
        private CreateScreenCommand $createScreenCommand,
    ) {
    }

    #[Route('/api/screens', name: 'create_screen', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload]
        CreateScreenRequest $createScreenRequest,
        #[CurrentUser]
        User $user,
    ): JsonResponse {
        try {
            $screen = ($this->createScreenCommand)($user, $createScreenRequest);

            return $this->getSerializedJsonResponse($screen, JsonResponse::HTTP_CREATED);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
