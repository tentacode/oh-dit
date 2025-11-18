<?php

declare(strict_types=1);

namespace App\Features\Compliance\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Compliance\Entity\Compliance;
use App\Features\Compliance\Entity\ComplianceStatus;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Features\RuleSet\Entity\Rule;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class CreateComplianceCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(User $user, CreateComplianceRequest $createComplianceRequest): Compliance
    {
        $project = $this->entityManager->getRepository(Project::class)
            ->findOneByUuid($createComplianceRequest->projectUuid);

        if (! $project) {
            throw new NotFoundHttpException('Project not found.');
        }

        $rule = $this->entityManager->getRepository(Rule::class)
            ->findOneByUuid($createComplianceRequest->ruleUuid);

        if (! $rule) {
            throw new NotFoundHttpException('Rule not found.');
        }

        if ($rule->getRuleCategory()->getRuleSet()->getUuid() !== $project->getRuleSet()->getUuid()) {
            throw new SuspiciousOperationException("The rule does not belong to the project's rule set.");
        }

        $screen = $this->entityManager->getRepository(Screen::class)
            ->findOneByUuid($createComplianceRequest->screenUuid);

        if (! $screen) {
            throw new NotFoundHttpException('Screen not found.');
        }

        if ($screen->getProject()->getUuid() !== $project->getUuid()) {
            throw new SuspiciousOperationException('The screen does not belong to the specified project.');
        }

        if (! $user->isInTeam($project->getTeam())) {
            throw new SuspiciousOperationException('User is trying to create a compliance in a project they do not own.');
        }

        $compliance = new Compliance(
            user: $user,
            rule: $rule,
            project: $project,
            status: ComplianceStatus::from($createComplianceRequest->status),
            screen: $screen,
        );
        ($this->validateOrThrow)($compliance);

        $this->entityManager->persist($compliance);
        $this->entityManager->flush();

        return $compliance;
    }
}
