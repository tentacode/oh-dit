<?php

declare(strict_types=1);

namespace App\Features\Project\Command;

use App\Features\Authentication\Entity\User;
use App\Features\Project\Entity\Project;
use App\Features\RuleSet\Entity\RuleSet;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Webmozart\Assert\Assert;

final class Metrics
{
    public function __construct(
        public int $progress,
        public int $complianceRate,
    ) {
    }
}

final class ProjectMetrics
{
    public function __construct(
        public Metrics $metrics,

        /**
         * @var array<string, Metrics>
         */
        public array $screensMetrics,
    ) {
    }
}

final class UpdateProjectMetricsCommand
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidateOrThrowApiErrorCommand $validateOrThrow,
    ) {
    }

    public function __invoke(Project $project, User $user): Project
    {
        $totalRules = $this->getTotalRules($project->getRuleSet());

        $projectMetrics = $this->getProjectMetrics($project, $user, $totalRules);
        $project->updateMetrics(
            progress: $projectMetrics->metrics->progress,
            complianceRate: $projectMetrics->metrics->complianceRate,
        );

        if ($project->getProgress() === 100) {
            $project->markAsCompleted();
        }

        foreach ($project->getScreens() as $screen) {
            $screen->updateMetrics(
                progress: $projectMetrics->screensMetrics[$screen->getUuid()->toString()]->progress,
                complianceRate: $projectMetrics->screensMetrics[$screen->getUuid()->toString()]->complianceRate,
            );
            ($this->validateOrThrow)($screen);

            $this->entityManager->persist($screen);
        }

        ($this->validateOrThrow)($project);

        $this->entityManager->persist($project);
        $this->entityManager->flush();

        return $project;
    }

    private function getProjectMetrics(Project $project, User $user, int $totalRules): ProjectMetrics
    {
        $sql = <<<SQL
            WITH distinct_compliance AS (
                SELECT DISTINCT ON (compliance.rule_uuid, compliance.screen_uuid)
                    compliance.uuid,
                    compliance.status,
                    compliance.screen_uuid
                FROM compliance
                JOIN project ON compliance.project_uuid = project.uuid
                JOIN team ON project.team_uuid = team.uuid
                JOIN team_user ON team.uuid = team_user.team_uuid AND team_user.user_uuid = :userUuid
                WHERE compliance.project_uuid = :projectUuid
                ORDER BY compliance.screen_uuid, compliance.rule_uuid, compliance.created_at DESC
            )
            SELECT
                s.uuid,
                s.name,
                COALESCE(SUM(1) FILTER (WHERE status = 'compliant'), 0) AS total_compliant,
                COALESCE(SUM(1) FILTER (WHERE status = 'non_compliant'), 0) AS total_non_compliant,
                COUNT(DISTINCT c.uuid) AS total_set,
                100 * COUNT(DISTINCT c.uuid) / :totalRules AS progress,
                100 * (SUM(1) FILTER (WHERE status = 'compliant')) / (SUM(1) FILTER (WHERE status = 'non_compliant') + SUM(1) FILTER (WHERE status = 'compliant')) AS compliance_rate
            FROM project_screen s
            LEFT JOIN distinct_compliance c ON c.screen_uuid = s.uuid
            WHERE s.project_uuid = :projectUuid
            GROUP BY s.uuid;
            SQL;

        $stmt = $this->entityManager->getConnection()->prepare($sql);
        $stmt->bindValue('projectUuid', $project->getUuid()->toString());
        $stmt->bindValue('userUuid', $user->getUuid()->toString());
        $stmt->bindValue('totalRules', $totalRules);

        $result = $stmt->executeQuery();
        $data = $result->fetchAllAssociative();

        $screenMetrics = [];
        $totalRulesSet = 0;
        $totalCompliant = 0;
        $totalNonCompliant = 0;
        foreach ($data as $screenData) {
            $screenUuid = $screenData['uuid'];
            Assert::stringNotEmpty($screenUuid);

            $screenProgress = $screenData['progress'];
            $screenComplianceRate = $screenData['compliance_rate'];

            Assert::numeric($screenProgress);
            if ($screenComplianceRate === null) {
                $screenComplianceRate = 0;
            }

            Assert::numeric($screenComplianceRate);

            $screenMetrics[$screenUuid] = new Metrics(
                progress: (int) $screenProgress,
                complianceRate: (int) $screenComplianceRate,
            );

            $screenTotalRulesSet = $screenData['total_set'];
            $screenTotalCompliant = $screenData['total_compliant'];
            $screenTotalNonCompliant = $screenData['total_non_compliant'];

            Assert::numeric($screenTotalRulesSet);
            Assert::numeric($screenTotalCompliant);
            Assert::numeric($screenTotalNonCompliant);

            $totalRulesSet += (int) $screenTotalRulesSet;
            $totalCompliant += (int) $screenTotalCompliant;
            $totalNonCompliant += (int) $screenTotalNonCompliant;
        }

        $projectProgress = (int) (100 * $totalRulesSet / ($totalRules * count($project->getScreens())));
        $projectComplianceRate = $totalCompliant + $totalNonCompliant > 0
            ? (int) (100 * $totalCompliant / ($totalCompliant + $totalNonCompliant))
            : 0;

        return new ProjectMetrics(
            new Metrics(
                progress: $projectProgress,
                complianceRate: $projectComplianceRate,
            ),
            screensMetrics: $screenMetrics
        );
    }

    private function getTotalRules(RuleSet $ruleSet): int
    {
        $sql = <<<SQL
            SELECT COUNT(DISTINCT rule.uuid) AS total_rules FROM rule
            JOIN rule_category rc
                ON rc.uuid = rule.rule_category_uuid
                AND rc.rule_set_uuid = :ruleSetUuid;
        SQL;

        $stmt = $this->entityManager->getConnection()->prepare($sql);
        $stmt->bindValue('ruleSetUuid', $ruleSet->getUuid()->toString());

        $result = $stmt->executeQuery();
        $data = $result->fetchAssociative();

        if (! $data) {
            throw new RuntimeException('Failed to fetch total rules.');
        }

        $totalRules = $data['total_rules'];
        Assert::numeric($totalRules);

        return (int) ($totalRules);
    }
}
