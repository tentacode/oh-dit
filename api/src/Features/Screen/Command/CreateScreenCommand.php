<?php

declare(strict_types=1);

namespace App\Features\Screen\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

final class CreateScreenCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(User $user, CreateScreenRequest $createScreenRequest): Screen
    {
        $project = $this->entityManager->getRepository(Project::class)->find($createScreenRequest->projectUuid);
        if (! $project instanceof Project) {
            throw new SuspiciousOperationException('User is trying to create a screen in a project that does not exist.');
        }

        if (! $user->isInTeam($project->getTeam())) {
            throw new SuspiciousOperationException('User is trying to create a screen in a team they do not belong to.');
        }

        $screen = new Screen(
            project: $project,
            name: $createScreenRequest->name ?? '',
            url: $createScreenRequest->url,
            rank: $createScreenRequest->rank ?? -1, // The rank is required, -1 will trigger a validation error if it's not provided.
            isRoot: false
        );

        ($this->validateOrThrow)($screen);

        $this->entityManager->persist($screen);
        $this->entityManager->flush();

        return $screen;
    }
}
