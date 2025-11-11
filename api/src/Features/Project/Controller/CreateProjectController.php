<?php

declare(strict_types=1);

namespace App\Features\Project\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Command\CreateProjectCommand;
use App\Features\Project\Command\CreateProjectRequest;
use App\Infrastructure\Doctrine\Entity\HasUuidInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Serializer\Exception\CircularReferenceException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

final class CreateProjectController extends AbstractController
{
    public function __construct(
        private CreateProjectCommand $createProjectCommand,
        private SerializerInterface $serializer,
    ) {
    }

    #[Route('/api/projects', name: 'create_project', methods: ['POST'], format: 'json')]
    public function __invoke(
        #[MapRequestPayload]
        CreateProjectRequest $createProjectRequest,
        #[CurrentUser]
        User $user,
    ): JsonResponse {
        $team = $user->getCurrentTeam();

        try {
            $project = ($this->createProjectCommand)($user, $team, $createProjectRequest);

            $context = [
                AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function (object $object, ?string $_format, array $_context): string {
                    if ($object instanceof HasUuidInterface) {
                        return '@' . $object->getUuid();
                    }

                    throw new CircularReferenceException('Cannot serialize object without UUID');
                },
            ];

            $json = $this->serializer->serialize($project, 'json', $context);

            return new JsonResponse($json, JsonResponse::HTTP_CREATED, [], true);
        } catch (SuspiciousOperationException $e) {
            // The issue should be handled by Sentry
            captureException($e);
            // Should return 404 to not leak information
            throw new NotFoundHttpException('Team not found.');
        }
    }
}
