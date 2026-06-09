<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Throwable;

final class DeleteProjectCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(Project $project, User $user): void
    {
        $team = $project->getTeam();
        if (! $user->isInTeam($team)) {
            throw new SuspiciousOperationException('User is trying to delete a project in a team they do not belong to.');
        }

        $this->entityManager->getConnection()->beginTransaction();

        try {
            $this->deleteCompliances($project);
            $this->deleteComments($project);
            $this->deleteIssues($project);
            $this->deleteScreens($project);

            $this->entityManager->remove($project);
            $this->entityManager->flush();

            $this->entityManager->getConnection()->commit();
        } catch (Throwable $e) {
            $this->entityManager->getConnection()->rollBack();
            throw $e;
        }
    }

    private function deleteCompliances(Project $project): void
    {
        $sql = <<<SQL
            DELETE FROM compliance
            WHERE screen_uuid IN (
                SELECT uuid FROM project_screen WHERE project_uuid = :projectUuid
            )
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($sql);
        $statement->bindValue('projectUuid', $project->getUuid());
        $statement->executeStatement();
    }

    private function deleteComments(Project $project): void
    {
        $sql = <<<SQL
            DELETE FROM comment
            WHERE screen_uuid IN (
                SELECT uuid FROM project_screen WHERE project_uuid = :projectUuid
            )
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($sql);
        $statement->bindValue('projectUuid', $project->getUuid());
        $statement->executeStatement();
    }

    private function deleteIssues(Project $project): void
    {
        $sql = <<<SQL
            DELETE FROM issue
            WHERE screen_uuid IN (
                SELECT uuid FROM project_screen WHERE project_uuid = :projectUuid
            )
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($sql);
        $statement->bindValue('projectUuid', $project->getUuid());
        $statement->executeStatement();
    }

    private function deleteScreens(Project $project): void
    {
        $sql = <<<SQL
            DELETE FROM project_screen
            WHERE project_uuid = :projectUuid
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($sql);
        $statement->bindValue('projectUuid', $project->getUuid());
        $statement->executeStatement();
    }
}
