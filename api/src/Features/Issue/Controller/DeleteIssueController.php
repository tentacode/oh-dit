<?php

declare(strict_types=1);

namespace App\Features\Issue\Controller;

use function Sentry\captureException;
use App\Features\Authentication\Entity\User;
use App\Features\Issue\Entity\Issue;
use App\Infrastructure\Symfony\Controller\ApiController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class DeleteIssueController extends ApiController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    #[Route('/api/issues/{issueUuid}', name: 'delete_issue', methods: ['DELETE'], format: 'json')]
    public function __invoke(
        string $issueUuid,
        #[CurrentUser]
        User $user
    ): JsonResponse {
        try {
            $issue = $this->entityManager->getRepository(Issue::class)
                ->findOneBy([
                    'uuid' => $issueUuid,
                ]);

            if (! $issue instanceof Issue) {
                throw new NotFoundHttpException('Resource not found.');
            }

            if (! $user->isInTeam($issue->getProject()->getTeam())) {
                throw new SuspiciousOperationException('User try to delete an issue from a project that is not in their team.');
            }

            $this->entityManager->remove($issue);
            $this->entityManager->flush();

            return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
        } catch (SuspiciousOperationException $e) {
            throw new NotFoundHttpException('Resource not found.');
        }
    }
}
