<?php

declare(strict_types=1);

namespace App\Features\Issue\Query;

use function Safe\json_decode;
use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;

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
        Project $project,
    ): array {
        if (! $user->isInTeam($project->getTeam())) {
            throw new SuspiciousOperationException('User try to access issues from a project that is not in their team.');
        }

        $sql = <<<SQL
            SELECT
                issue.uuid,
                issue.issue_id as "issueId",
                issue.project_uuid as "projectUuid",
                issue.screen_uuid as "screenUuid",
                issue.rule_uuid as "ruleUuid",
                issue.severity,
                issue.status,
                issue.status_updated_at as "statusUpdatedAt",
                issue.status_updated_by_user_uuid as "statusUpdatedBy",
                issue.status_change_history as "statusChangeHistory",
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
        $stmt->bindValue('projectUuid', (string) $project->getUuid());
        $stmt->bindValue('userUuid', (string) $user->getUuid());

        $result = $stmt->executeQuery();

        // Need to decode JSONB field
        $data = array_map(function (array $item): array {
            /** @var string $statusChangeHistory */
            $statusChangeHistory = $item['statusChangeHistory'];
            $item['statusChangeHistory'] = json_decode($statusChangeHistory, true);

            return $item;
        }, $result->fetchAllAssociative());

        return $data;
    }
}
