<?php

declare(strict_types=1);

namespace App\Features\Screen\Command;

use App\Features\Project\Entity\Screen;
use Doctrine\ORM\EntityManagerInterface;
use Throwable;

final class DeleteScreenCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    public function __invoke(
        Screen $screen
    ): void {
        $this->entityManager->getConnection()->beginTransaction();

        try {
            $this->deleteCompliances($screen);
            $this->deleteIssues($screen);
            $this->deleteComments($screen);

            if ($screen->getRank() !== 0) {
                $this->decreaseScreensRank($screen->getRank());
            }

            $this->entityManager->remove($screen);
            $this->entityManager->flush();

            $this->entityManager->getConnection()->commit();
        } catch (Throwable $e) {
            $this->entityManager->getConnection()->rollBack();
            throw $e;
        }
    }

    private function deleteCompliances(Screen $screen): void
    {
        $deleteComplianceSql = <<<SQL
            DELETE FROM compliance
            WHERE screen_uuid = :screenUuid
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($deleteComplianceSql);
        $statement->bindValue('screenUuid', $screen->getUuid());
        $statement->executeStatement();
    }

    private function deleteIssues(Screen $screen): void
    {
        $deleteIssuesSql = <<<SQL
            DELETE FROM issue
            WHERE screen_uuid = :screenUuid
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($deleteIssuesSql);
        $statement->bindValue('screenUuid', $screen->getUuid());
        $statement->executeStatement();
    }

    private function deleteComments(Screen $screen): void
    {
        $deleteCommentSql = <<<SQL
            DELETE FROM comment
            WHERE screen_uuid = :screenUuid
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($deleteCommentSql);
        $statement->bindValue('screenUuid', $screen->getUuid());
        $statement->executeStatement();
    }

    private function decreaseScreensRank(int $rank): void
    {
        $decreaseScreensRankSql = <<<SQL
            UPDATE project_screen
            SET rank = rank - 1
            WHERE rank > :rank
        SQL;

        $statement = $this->entityManager->getConnection()->prepare($decreaseScreensRankSql);
        $statement->bindValue('rank', $rank);
        $statement->executeStatement();
    }
}
