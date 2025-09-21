<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use function Safe\json_decode;
use App\Features\Project\Command\CreateProjectCommand;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Webmozart\Assert\Assert;

final class CreateProjectController extends AbstractController
{
    public function __construct(
        private CreateProjectCommand $createProjectCommand,
        // private NormalizerInterface $normalizer
    ) {
    }

    #[Route('/projects', name: 'create_project', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        Assert::isArray($payload, 'Invalid JSON payload.');

        $projectName = $payload['name'] ?? null;
        Assert::stringNotEmpty($projectName, 'The project name is required.');

        $project = ($this->createProjectCommand)($projectName);

        return $this->json($project, JsonResponse::HTTP_CREATED);
        // return $this->json($this->normalizer->normalize($project), JsonResponse::HTTP_CREATED);
    }
}
