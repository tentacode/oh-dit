<?php

declare(strict_types=1);

namespace App\Features\Issue\Command;

use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use App\Features\Issue\Entity\Issue;
use App\Features\Issue\Entity\Severity;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Features\RuleSet\Entity\Rule;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class CreateIssueCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(User $user, CreateIssueRequest $createIssueRequest): Issue
    {
        $project = $this->entityManager->getRepository(Project::class)
            ->findOneByUuid($createIssueRequest->projectUuid);

        if (! $project) {
            throw new NotFoundHttpException('Project not found.');
        }

        $rule = $this->entityManager->getRepository(Rule::class)
            ->findOneByUuid($createIssueRequest->ruleUuid);

        if (! $rule) {
            throw new NotFoundHttpException('Rule not found.');
        }

        if ($rule->getRuleCategory()->getRuleSet()->getUuid() !== $project->getRuleSet()->getUuid()) {
            throw new SuspiciousOperationException("The rule does not belong to the project's rule set.");
        }

        $screen = $this->entityManager->getRepository(Screen::class)
            ->findOneByUuid($createIssueRequest->screenUuid);

        if (! $screen) {
            throw new NotFoundHttpException('Screen not found.');
        }

        if ($screen->getProject()->getUuid() !== $project->getUuid()) {
            throw new SuspiciousOperationException('The screen does not belong to the specified project.');
        }

        if (! $user->isInTeam($project->getTeam())) {
            throw new SuspiciousOperationException('User is trying to create a issue in a project they do not own.');
        }

        $issue = new Issue(
            user: $user,
            rule: $rule,
            project: $project,
            screen: $screen,
            issueId: $this->getNextIssueId($project->getTeam()),
            text: $createIssueRequest->text,
            severity: Severity::from($createIssueRequest->severity),
        );
        ($this->validateOrThrow)($issue);

        $this->entityManager->persist($issue);
        $this->entityManager->flush();

        return $issue;
    }

    private function getNextIssueId(Team $team): int
    {
        $qb = $this->entityManager->createQueryBuilder();
        $qb->select('MAX(i.issueId) as maxIssueId')
            ->from(Issue::class, 'i')
            ->join('i.project', 'p')
            ->where('p.team = :teamUuid')
            ->setParameter('teamUuid', $team->getUuid());

        $result = $qb->getQuery()->getSingleScalarResult();
        if ($result === null) {
            return 1;
        }

        return ((int) $result) + 1;
    }
}
