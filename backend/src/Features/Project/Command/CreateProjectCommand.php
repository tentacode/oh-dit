<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use App\Features\Project\Entity\Project;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;

final class CreateProjectCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow
    ) {
    }

    public function __invoke(CreateProjectRequest $createProjectRequest): Project
    {
        $project = new Project($createProjectRequest->name);

        ($this->validateOrThrow)($project);

        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $project;
    }
}
