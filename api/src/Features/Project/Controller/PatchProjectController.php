<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use function Safe\json_decode;
use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Command\PatchProjectCommand;
use App\Features\Project\Command\PatchProjectRequest;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\Controller\ApiController;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Webmozart\Assert\Assert;

final class PatchProjectController extends ApiController
{
    public function __construct(
        private PatchProjectCommand $patchProjectCommand,
    ) {
    }

    #[Route('/api/projects/{projectUuid}', name: 'patch_project', methods: ['PATCH'], format: 'json')]
    public function __invoke(
        Request $rawRequest,
        #[MapRequestPayload]
        PatchProjectRequest $patchProjectRequest,
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'projectUuid' => 'uuid',
        ])]
        Project $project,
    ): JsonResponse {
        $body = json_decode($rawRequest->getContent(), true) ?? [];
        Assert::isArray($body, 'Invalid JSON payload.');
        $extraFields = array_diff(array_keys($body), ['name', 'url']);

        if ($extraFields !== []) {
            throw new BadRequestHttpException(
                sprintf('Unexpected field(s): %s.', implode(', ', $extraFields))
            );
        }

        try {
            $project = ($this->patchProjectCommand)($project, $user, $patchProjectRequest);

            return $this->getSerializedJsonResponse($project, JsonResponse::HTTP_OK);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
