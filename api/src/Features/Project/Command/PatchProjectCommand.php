<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

final class PatchProjectCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(Project $project, User $user, PatchProjectRequest $patchProjectRequest): Project
    {
        $team = $project->getTeam();
        if (! $user->isInTeam($team)) {
            throw new SuspiciousOperationException('User is trying to patch a project in a team they do not belong to.');
        }

        if ($patchProjectRequest->name !== null) {
            $project->setName($patchProjectRequest->name);
        }

        if ($patchProjectRequest->url !== null) {
            $project->setUrl($patchProjectRequest->url);
        }

        ($this->validateOrThrow)($project);

        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $project;
    }
}
