<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use function Safe\json_decode;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Webmozart\Assert\Assert;

final class CreateProjectController extends AbstractController
{
    #[Route('/projects', name: 'create_project', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        Assert::isArray($payload, 'Invalid JSON payload.');

        $projectName = $payload['name'] ?? null;
        Assert::stringNotEmpty($projectName, 'The project name is required.');

        $projectData = [
            'id' => '1234',
            'name' => $projectName,
            'created_at' => '2025-06-12 13:37:42',
            'updated_at' => '2025-06-12 13:37:42',
        ];

        return $this->json($projectData);
    }
}
