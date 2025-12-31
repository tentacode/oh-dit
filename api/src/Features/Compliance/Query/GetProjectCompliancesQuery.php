<?php

declare(strict_types=1);

namespace App\Features\Compliance\Query;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

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
        Project $project,
    ): array {
        if (! $user->isInTeam($project->getTeam())) {
            throw new SuspiciousOperationException('User try to access compliances from a project that is not in their team.');
        }

        $sql = <<<SQL
            SELECT DISTINCT ON (compliance.rule_uuid, compliance.screen_uuid)
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
            ORDER BY compliance.screen_uuid, compliance.rule_uuid, compliance.created_at DESC
        SQL;

        $stmt = $this->connection->prepare($sql);
        $stmt->bindValue('projectUuid', $project->getUuid());
        $stmt->bindValue('userUuid', (string) $user->getUuid());

        $result = $stmt->executeQuery();

        return $result->fetchAllAssociative();
    }
}
