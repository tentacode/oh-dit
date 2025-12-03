<?php

declare(strict_types=1);

namespace App\Features\Recommandation\Query;

use App\Features\Authentication\Entity\User;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;

class GetProjectRecommandationsQuery
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
            SELECT *
            FROM recommandation
            JOIN project ON recommandation.project_uuid = project.uuid
            JOIN team ON project.team_uuid = team.uuid
            JOIN team_user ON team.uuid = team_user.team_uuid AND team_user.user_uuid = :userUuid
            WHERE recommandation.project_uuid = :projectUuid
            ORDER BY recommandation.screen_uuid, recommandation.rule_uuid, recommandation.created_at DESC
        SQL;

        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue('projectUuid', $projectUuid);
        $stmt->bindValue('userUuid', (string) $user->getUuid());

        $result = $stmt->executeQuery();

        return $result->fetchAllAssociative();
    }
}
