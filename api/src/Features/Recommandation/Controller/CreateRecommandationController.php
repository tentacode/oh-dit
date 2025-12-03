<?php

declare(strict_types=1);

namespace App\Features\Recommandation\Controller;

use App\Features\Authentication\Entity\User;
use App\Features\Recommandation\Command\CreateRecommandationCommand;
use App\Features\Recommandation\Command\CreateRecommandationRequest;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class CreateRecommandationController extends ApiController
{
    public function __construct(
        private CreateRecommandationCommand $createRecommandationCommand
    ) {
    }

    #[Route('/api/recommandations', name: 'create_project_recommandation', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload()]
        CreateRecommandationRequest $createRecommandationRequest,
        #[CurrentUser]
        User $user
    ): JsonResponse {
        try {
            $recommandation = ($this->createRecommandationCommand)(user: $user, createRecommandationRequest: $createRecommandationRequest);

            return $this->getSerializedJsonResponse($recommandation, JsonResponse::HTTP_CREATED);
        } catch (SuspiciousOperationException $e) {
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
