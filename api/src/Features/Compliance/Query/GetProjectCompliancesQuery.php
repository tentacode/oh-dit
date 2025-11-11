<?php

declare(strict_types=1);

namespace App\Features\Compliance\Query;

use App\Features\Authentication\Entity\User;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;

class GetProjectCompliancesQuery
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
            SELECT DISTINCT ON (compliance.rule_uuid)
                compliance.uuid,
                compliance.status,
                compliance.rule_uuid AS "ruleUuid",
                compliance.project_uuid AS "projectUuid",
                compliance.screen_uuid AS "screenUuid",
                compliance.user_uuid AS "userUuid",
                compliance.created_at AS "createdAt"
            FROM compliance
            JOIN project ON compliance.project_uuid = project.uuid
            JOIN team ON project.team_uuid = team.uuid
            JOIN team_user ON team.uuid = team_user.team_uuid AND team_user.user_uuid = :userUuid
            WHERE compliance.project_uuid = :projectUuid
            ORDER BY compliance.rule_uuid, compliance.created_at DESC
        SQL;

        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue('projectUuid', $projectUuid);
        $stmt->bindValue('userUuid', (string) $user->getUuid());

        $result = $stmt->executeQuery();

        return $result->fetchAllAssociative();
    }
}
