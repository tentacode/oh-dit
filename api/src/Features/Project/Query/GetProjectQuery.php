<?php

declare(strict_types=1);

namespace App\Features\Project\Query;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;

class GetProjectQuery
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(User $user, string $uuid): ?Project
    {
        /** @var Project|null $project */
        $project = $this->entityManager
            ->getRepository(Project::class)
            ->createQueryBuilder('project')
            ->where('project.team IN (:team)')
            ->andWhere('project.uuid = :uuid')
            ->setParameter('team', $user->getTeams())
            ->setParameter('uuid', $uuid)
            ->getQuery()
            ->getOneOrNullResult();

        return $project;
    }
}
