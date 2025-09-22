<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use App\Features\Project\Command\CreateProjectCommand;
use App\Features\Project\Command\CreateProjectRequest;
// use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class CreateProjectController extends AbstractController
{
    public function __construct(
        // private ValidateOrThrowApiErrorCommand $validateOrThrow,
        private CreateProjectCommand $createProjectCommand,
    ) {
    }

    #[Route('/api/projects', name: 'create_project', methods: ['POST'], format: 'json')]
    public function __invoke(#[MapRequestPayload] CreateProjectRequest $createProjectRequest): JsonResponse
    {
        $project = ($this->createProjectCommand)($createProjectRequest);

        return $this->json($project, JsonResponse::HTTP_CREATED);
    }
}
