<?php

declare(strict_types=1);

namespace App\Features\Screen\Controller;

use App\Features\Project\Entity\Screen;
use App\Features\Screen\Command\DeleteScreenCommand;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class DeleteScreenController extends ApiController
{
    public function __construct(
        private DeleteScreenCommand $deleteScreenCommand
    ) {
    }

    #[Route('/api/screens/{screenUuid}', name: 'delete_screen', methods: ['DELETE'], format: 'json')]
    public function __invoke(
        #[MapEntity(mapping: [
            'screenUuid' => 'uuid',
        ])]
        Screen $screen
    ): JsonResponse {
        ($this->deleteScreenCommand)($screen);

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
