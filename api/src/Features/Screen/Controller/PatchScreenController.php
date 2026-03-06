<?php

declare(strict_types=1);

namespace App\Features\Screen\Controller;

use function Safe\json_decode;
use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Screen;
use App\Features\Screen\Command\PatchScreenCommand;
use App\Features\Screen\Command\PatchScreenRequest;
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

final class PatchScreenController extends ApiController
{
    public function __construct(
        private PatchScreenCommand $patchScreenCommand,
    ) {
    }

    #[Route('/api/screens/{screenUuid}', name: 'patch_screen', methods: ['PATCH'], format: 'json')]
    public function __invoke(
        Request $rawRequest,
        #[MapRequestPayload]
        PatchScreenRequest $patchScreenRequest,
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'screenUuid' => 'uuid',
        ])]
        Screen $screen,
    ): JsonResponse {
        $body = json_decode($rawRequest->getContent(), true) ?? [];
        Assert::isArray($body, 'Invalid JSON payload.');
        $extraFields = array_diff(array_keys($body), ['name', 'url', 'rank']);

        if ($extraFields !== []) {
            throw new BadRequestHttpException(
                sprintf('Unexpected field(s): %s.', implode(', ', $extraFields))
            );
        }

        try {
            $screen = ($this->patchScreenCommand)($screen, $user, $patchScreenRequest);

            return $this->getSerializedJsonResponse($screen, JsonResponse::HTTP_OK);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
