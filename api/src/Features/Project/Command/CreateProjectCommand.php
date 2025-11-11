<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

final class CreateProjectCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(User $user, Team $team, CreateProjectRequest $createProjectRequest): Project
    {
        if (! $user->getTeams()->contains($team)) {
            throw new SuspiciousOperationException('User is tryinig to create a project in a team they do not belong to.');
        }

        $project = new Project($team, $createProjectRequest->name);

        ($this->validateOrThrow)($project);

        $this->entityManager->persist($project);

        foreach ($createProjectRequest->screens as $screenName) {
            $screen = new Screen($project, $screenName);
            ($this->validateOrThrow)($screen);

            $this->entityManager->persist($screen);

            $project->addScreen($screen);
        }

        $this->entityManager->flush();

        return $project;
    }
}
