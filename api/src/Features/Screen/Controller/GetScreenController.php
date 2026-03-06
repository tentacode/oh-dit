<?php

declare(strict_types=1);

namespace App\Features\Screen\Controller;

use function Sentry\captureMessage;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Screen;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class GetScreenController extends ApiController
{
    #[Route('/api/screens/{screenUuid}', name: 'get_screen', methods: ['GET'], format: 'json')]
    public function __invoke(
        #[MapEntity(mapping: [
            'screenUuid' => 'uuid',
        ])]
        Screen $screen,
        #[CurrentUser()]
        User $user,
    ): JsonResponse {
        if (! $user->isInTeam($screen->getProject()->getTeam())) {
            captureMessage(sprintf(
                'User with UUID %s is trying to access a screen with UUID %s that belongs to a team they do not belong to.',
                $user->getUuid(),
                $screen->getUuid()
            ));

            throw $this->createNotFoundException('Resource not found.');
        }

        return $this->getSerializedJsonResponse($screen);
    }
}
