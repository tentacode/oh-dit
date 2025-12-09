<?php

declare(strict_types=1);

namespace App\Features\Issue\Query;

use App\Features\Authentication\Entity\User;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;

class GetProjectIssuesQuery
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
        string $projectUuid,
    ): array {
        $sql = <<<SQL
            SELECT
                issue.uuid,
                issue.issue_id as "issueId",
                issue.project_uuid as "projectUuid",
                issue.screen_uuid as "screenUuid",
                issue.rule_uuid as "ruleUuid",
                issue.severity,
                issue.text,
                issue.created_at as "createdAt",
                issue.updated_at as "updatedAt",
                issue.user_uuid as "userUuid"
            FROM issue
            JOIN project ON issue.project_uuid = project.uuid
            JOIN team ON project.team_uuid = team.uuid
            JOIN team_user ON team.uuid = team_user.team_uuid AND team_user.user_uuid = :userUuid
            WHERE issue.project_uuid = :projectUuid
            ORDER BY issue.screen_uuid, issue.rule_uuid, issue.issue_id DESC
        SQL;

        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue('projectUuid', $projectUuid);
        $stmt->bindValue('userUuid', (string) $user->getUuid());

        $result = $stmt->executeQuery();

        return $result->fetchAllAssociative();
    }
}
