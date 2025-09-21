<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use App\Features\Project\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class CreateProjectCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {
    }

    public function __invoke(string $name): Project
    {
        $project = new Project($name);

        $this->validator->validate($project);

        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $project;
    }
}
