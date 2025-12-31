<?php

declare(strict_types=1);

namespace App\Features\Issue\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Issue\Entity\Issue;
use App\Features\Issue\Entity\Severity;
use App\Features\Issue\Entity\Status;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class UpdateIssueCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(User $user, string $issueUuid, UpdateIssueRequest $updateIssueRequest): Issue
    {
        $issue = $this->entityManager->getRepository(Issue::class)
            ->findOneByUuid($issueUuid);

        if (! $issue) {
            throw new NotFoundHttpException('Issue not found.');
        }

        if (! $user->isInTeam($issue->getProject()->getTeam())) {
            throw new SuspiciousOperationException('User is trying to update an issue in a project they do not own.');
        }

        $issue->setText($updateIssueRequest->text);
        $issue->setSeverity(Severity::from($updateIssueRequest->severity));

        if ($issue->getStatus()->value !== $updateIssueRequest->status) {
            $issue->changeStatus($user, Status::from($updateIssueRequest->status));
        }

        ($this->validateOrThrow)($issue);

        $this->entityManager->persist($issue);
        $this->entityManager->flush();

        return $issue;
    }
}
