<?php

declare(strict_types=1);

namespace App\Features\Recommandation\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Features\Recommandation\Entity\Recommandation;
use App\Features\Recommandation\Entity\Severity;
use App\Features\RuleSet\Entity\Rule;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class CreateRecommandationCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(User $user, CreateRecommandationRequest $createRecommandationRequest): Recommandation
    {
        $project = $this->entityManager->getRepository(Project::class)
            ->findOneByUuid($createRecommandationRequest->projectUuid);

        if (! $project) {
            throw new NotFoundHttpException('Project not found.');
        }

        $rule = $this->entityManager->getRepository(Rule::class)
            ->findOneByUuid($createRecommandationRequest->ruleUuid);

        if (! $rule) {
            throw new NotFoundHttpException('Rule not found.');
        }

        if ($rule->getRuleCategory()->getRuleSet()->getUuid() !== $project->getRuleSet()->getUuid()) {
            throw new SuspiciousOperationException("The rule does not belong to the project's rule set.");
        }

        $screen = $this->entityManager->getRepository(Screen::class)
            ->findOneByUuid($createRecommandationRequest->screenUuid);

        if (! $screen) {
            throw new NotFoundHttpException('Screen not found.');
        }

        if ($screen->getProject()->getUuid() !== $project->getUuid()) {
            throw new SuspiciousOperationException('The screen does not belong to the specified project.');
        }

        if (! $user->isInTeam($project->getTeam())) {
            throw new SuspiciousOperationException('User is trying to create a recommandation in a project they do not own.');
        }

        $recommandation = new Recommandation(
            user: $user,
            rule: $rule,
            project: $project,
            screen: $screen,
            text: $createRecommandationRequest->text,
            severity: Severity::from($createRecommandationRequest->severity),
        );
        ($this->validateOrThrow)($recommandation);

        $this->entityManager->persist($recommandation);
        $this->entityManager->flush();

        return $recommandation;
    }
}
