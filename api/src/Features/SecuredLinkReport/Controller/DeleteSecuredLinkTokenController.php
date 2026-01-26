<?php

declare(strict_types=1);

namespace App\Features\SecuredLinkReport\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\Controller\ApiController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

final class DeleteSecuredLinkTokenController extends ApiController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/api/projects/{projectUuid}/secured-link', name: 'delete_secured_link_report', methods: ['DELETE'], format: 'json')]
    public function __invoke(
        #[CurrentUser]
        User $user,
        #[MapEntity(mapping: [
            'projectUuid' => 'uuid',
        ])]
        Project $project,
    ): JsonResponse {
        if ($user->isInTeam($project->getTeam()) === false) {
            captureException(new SuspiciousOperationException("User is trying to delete a secured link to a project they don't own."));
            throw new NotFoundHttpException('Resource not found.');
        }

        $project->removeSecuredLink();
        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
