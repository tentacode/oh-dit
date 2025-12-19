<?php

declare(strict_types=1);

namespace App\Features\Project\Query;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

class GetProjectsQuery
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @return array<Project>
     */
    public function __invoke(User $user, string $teamUuid): array
    {
        if (! $user->isInTeamUuid($teamUuid)) {
            throw new SuspiciousOperationException('User try to access projects of a team he is not part of.');
        }

        /** @var array<Project> */
        $projects = $this->entityManager
            ->getRepository(Project::class)
            ->createQueryBuilder('project')
            ->where('project.team = :team')
            ->setParameter('team', $teamUuid)
            ->orderBy('project.updatedAt', 'DESC')
            ->getQuery()
            ->getResult();

        return $projects;
    }
}
