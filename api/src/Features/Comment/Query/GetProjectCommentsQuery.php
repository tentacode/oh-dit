<?php

declare(strict_types=1);

namespace App\Features\Comment\Query;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

class GetProjectCommentsQuery
{
    private Connection $connection;

    public function __construct(
        EntityManagerInterface $entityManager,
    ) {
        $this->connection = $entityManager->getConnection();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function __invoke(
        User $user,
        Project $project,
    ): array {
        if (! $user->isInTeam($project->getTeam())) {
            throw new SuspiciousOperationException('User is trying to load comments in a project they are not a member of.');
        }

        $sql = <<<SQL
            SELECT comment.*
            FROM comment
            JOIN project ON comment.project_uuid = project.uuid
            JOIN team ON project.team_uuid = team.uuid
            JOIN team_user ON team.uuid = team_user.team_uuid AND team_user.user_uuid = :userUuid
            WHERE comment.project_uuid = :projectUuid
            ORDER BY comment.screen_uuid, comment.rule_uuid, comment.created_at DESC
        SQL;

        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue('projectUuid', $project->getUuid());
        $stmt->bindValue('userUuid', (string) $user->getUuid());

        $result = $stmt->executeQuery();

        return $result->fetchAllAssociative();
    }
}
