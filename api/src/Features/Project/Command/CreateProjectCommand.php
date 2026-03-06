<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Features\RuleSet\Entity\RuleSet;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Webmozart\Assert\Assert;

final class CreateProjectCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(User $user, CreateProjectRequest $createProjectRequest): Project
    {
        $team = $this->entityManager->getRepository(Team::class)->find($createProjectRequest->teamUuid);
        if (! $team instanceof Team) {
            throw new SuspiciousOperationException('User is trying to create a project in a team that does not exist.');
        }

        if (! $user->isInTeam($team)) {
            throw new SuspiciousOperationException('User is trying to create a project in a team they do not belong to.');
        }

        $ruleSet = $this->entityManager->getRepository(RuleSet::class)
            ->find($createProjectRequest->ruleSetUuid);

        Assert::isInstanceOf($ruleSet, RuleSet::class, 'Default RuleSet "RGAA" not found in the database.');

        $project = new Project(
            team: $team,
            ruleSet: $ruleSet,
            name: $createProjectRequest->name ?? '',
            url: $createProjectRequest->url ?? '',
        );

        ($this->validateOrThrow)($project);

        $this->entityManager->persist($project);

        foreach ($createProjectRequest->screens as $screenData) {
            $screen = new Screen(
                project: $project,
                name: $screenData['name'],
                url: $screenData['url'] ?? '',
                rank: $screenData['rank'],
                isRoot: false
            );
            ($this->validateOrThrow)($screen);

            $this->entityManager->persist($screen);

            $project->addScreen($screen);
        }

        $this->entityManager->flush();

        return $project;
    }
}
