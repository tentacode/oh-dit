<?php

declare(strict_types=1);

namespace App\Features\Project\Query;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;

class GetProjectsQuery
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @return array<Project>
     */
    public function __invoke(User $user): array
    {
        /** @var array<Project> */
        $projects = $this->entityManager
            ->getRepository(Project::class)
            ->createQueryBuilder('project')
            ->where('project.team IN (:team)')
            ->setParameter('team', $user->getTeams())
            ->getQuery()
            ->getResult();

        return $projects;
    }
}
